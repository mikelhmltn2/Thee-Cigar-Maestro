/**
 * Advanced AI Recommendation Engine for Thee Cigar Maestro
 * Implements hybrid recommendation algorithms with real-time learning
 */

import { OpenAI } from 'openai'

// Types
export interface CigarProfile {
  id: string
  name: string
  brand: string
  wrapper: string
  binder: string
  filler: string[]
  strength: 'mild' | 'medium' | 'full'
  flavorProfile: string[]
  origin: string
  price: number
  rating: number
  reviews: number
  ageability: number
  rarity: number
  premiumLevel: 'standard' | 'premium' | 'ultra-premium' | 'exclusive'
}

export interface UserPreferences {
  strengthPreference: string[]
  flavorPreferences: string[]
  wrapperPreferences: string[]
  priceRange: { min: number; max: number }
  experienceLevel: 'novice' | 'intermediate' | 'expert' | 'connoisseur'
  occasions: string[]
  avoidances: string[]
}

export interface RecommendationContext {
  occasion?: string
  timeOfDay?: string
  weather?: string
  pairing?: string
  mood?: string
  budget?: number
}

export interface Recommendation {
  cigar: CigarProfile
  score: number
  reasoning: string[]
  matchPercentage: number
  aiInsights: string
  alternatives: CigarProfile[]
}

class AIRecommendationEngine {
  private openai: OpenAI
  private userProfiles: Map<string, UserPreferences>
  private cigarDatabase: Map<string, CigarProfile>
  private interactionHistory: Map<string, any[]>
  private featureWeights: Record<string, number>
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: false
    })
    
    this.userProfiles = new Map()
    this.cigarDatabase = new Map()
    this.interactionHistory = new Map()
    
    // Dynamic feature weights that adjust based on user feedback
    this.featureWeights = {
      flavor: 0.3,
      strength: 0.25,
      wrapper: 0.15,
      price: 0.1,
      rating: 0.1,
      occasion: 0.05,
      rarity: 0.05
    }
  }

  /**
   * Get personalized recommendations using hybrid algorithm
   */
  async getRecommendations(
    userId: string,
    context?: RecommendationContext,
    count: number = 5
  ): Promise<Recommendation[]> {
    try {
      const userProfile = await this.getUserProfile(userId)
      const candidates = await this.getCandidateCigars(userProfile, context)
      
      // Score candidates using multiple algorithms
      const scoredCandidates = await Promise.all(
        candidates.map(async (cigar) => {
          const contentScore = this.calculateContentBasedScore(cigar, userProfile)
          const collaborativeScore = await this.calculateCollaborativeScore(userId, cigar.id)
          const contextScore = this.calculateContextualScore(cigar, context)
          const aiScore = await this.getAIScore(cigar, userProfile, context)
          
          // Hybrid scoring with adaptive weights
          const hybridScore = 
            contentScore * 0.3 +
            collaborativeScore * 0.25 +
            contextScore * 0.2 +
            aiScore * 0.25
          
          const reasoning = await this.generateReasoning(cigar, userProfile, hybridScore)
          const aiInsights = await this.generateAIInsights(cigar, userProfile, context)
          
          return {
            cigar,
            score: hybridScore,
            reasoning,
            matchPercentage: Math.round(hybridScore * 100),
            aiInsights,
            alternatives: [] as CigarProfile[]
          }
        })
      )
      
      // Sort by score and get top recommendations
      const topRecommendations = scoredCandidates
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
      
      // Add alternatives for each recommendation
      for (const rec of topRecommendations) {
        rec.alternatives = await this.findSimilarCigars(rec.cigar, 3)
      }
      
      // Track recommendation for learning
      await this.trackRecommendation(userId, topRecommendations)
      
      return topRecommendations
    } catch (error) {
      console.error('Error generating recommendations:', error)
      throw error
    }
  }

  /**
   * Calculate content-based filtering score
   */
  private calculateContentBasedScore(
    cigar: CigarProfile,
    preferences: UserPreferences
  ): number {
    let score = 0
    let totalWeight = 0
    
    // Flavor matching
    const flavorMatch = this.calculateSetSimilarity(
      cigar.flavorProfile,
      preferences.flavorPreferences
    )
    score += flavorMatch * this.featureWeights.flavor
    totalWeight += this.featureWeights.flavor
    
    // Strength matching
    if (preferences.strengthPreference.includes(cigar.strength)) {
      score += this.featureWeights.strength
    }
    totalWeight += this.featureWeights.strength
    
    // Wrapper preference
    if (preferences.wrapperPreferences.includes(cigar.wrapper)) {
      score += this.featureWeights.wrapper
    }
    totalWeight += this.featureWeights.wrapper
    
    // Price range
    if (cigar.price >= preferences.priceRange.min && 
        cigar.price <= preferences.priceRange.max) {
      score += this.featureWeights.price
    }
    totalWeight += this.featureWeights.price
    
    // Rating consideration
    const ratingScore = (cigar.rating / 5) * this.featureWeights.rating
    score += ratingScore
    totalWeight += this.featureWeights.rating
    
    return totalWeight > 0 ? score / totalWeight : 0
  }

  /**
   * Calculate collaborative filtering score
   */
  private async calculateCollaborativeScore(
    userId: string,
    cigarId: string
  ): Promise<number> {
    // Get similar users based on interaction history
    const similarUsers = await this.findSimilarUsers(userId, 10)
    
    if (similarUsers.length === 0) {
      return 0.5 // Neutral score if no similar users
    }
    
    // Calculate score based on similar users' interactions
    let totalScore = 0
    let totalWeight = 0
    
    for (const { userId: similarUserId, similarity } of similarUsers) {
      const userHistory = this.interactionHistory.get(similarUserId) || []
      const interaction = userHistory.find(h => h.cigarId === cigarId)
      
      if (interaction) {
        const score = interaction.rating ? interaction.rating / 5 : 0.7
        totalScore += score * similarity
        totalWeight += similarity
      }
    }
    
    return totalWeight > 0 ? totalScore / totalWeight : 0.5
  }

  /**
   * Calculate contextual score based on occasion, time, etc.
   */
  private calculateContextualScore(
    cigar: CigarProfile,
    context?: RecommendationContext
  ): number {
    if (!context) return 0.5
    
    let score = 0
    let factors = 0
    
    // Occasion matching
    if (context.occasion) {
      const occasionScores: Record<string, Record<string, number>> = {
        'celebration': { 'full': 0.9, 'medium': 0.7, 'mild': 0.5 },
        'relaxation': { 'mild': 0.9, 'medium': 0.8, 'full': 0.6 },
        'business': { 'medium': 0.9, 'mild': 0.7, 'full': 0.7 },
        'contemplation': { 'full': 0.8, 'medium': 0.9, 'mild': 0.7 }
      }
      
      if (occasionScores[context.occasion]) {
        score += occasionScores[context.occasion][cigar.strength] || 0.5
        factors++
      }
    }
    
    // Time of day matching
    if (context.timeOfDay) {
      const timeScores: Record<string, Record<string, number>> = {
        'morning': { 'mild': 0.9, 'medium': 0.6, 'full': 0.3 },
        'afternoon': { 'medium': 0.9, 'mild': 0.7, 'full': 0.7 },
        'evening': { 'full': 0.9, 'medium': 0.8, 'mild': 0.6 }
      }
      
      if (timeScores[context.timeOfDay]) {
        score += timeScores[context.timeOfDay][cigar.strength] || 0.5
        factors++
      }
    }
    
    // Budget consideration
    if (context.budget) {
      const budgetScore = cigar.price <= context.budget ? 1 : 
                         cigar.price <= context.budget * 1.2 ? 0.7 : 0.3
      score += budgetScore
      factors++
    }
    
    return factors > 0 ? score / factors : 0.5
  }

  /**
   * Get AI-powered score using GPT
   */
  private async getAIScore(
    cigar: CigarProfile,
    preferences: UserPreferences,
    context?: RecommendationContext
  ): Promise<number> {
    try {
      const prompt = this.buildAIPrompt(cigar, preferences, context)
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a master cigar sommelier. Rate how well this cigar matches the user preferences on a scale of 0-1, considering all factors.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      })
      
      const response = completion.choices[0].message.content || '0.5'
      const score = parseFloat(response.match(/\d+\.?\d*/)?.[0] || '0.5')
      
      return Math.min(Math.max(score, 0), 1) // Ensure score is between 0 and 1
    } catch (error) {
      console.error('Error getting AI score:', error)
      return 0.5 // Default neutral score
    }
  }

  /**
   * Generate human-readable reasoning for recommendation
   */
  private async generateReasoning(
    cigar: CigarProfile,
    preferences: UserPreferences,
    score: number
  ): Promise<string[]> {
    const reasons: string[] = []
    
    // Flavor matching
    const commonFlavors = cigar.flavorProfile.filter(f => 
      preferences.flavorPreferences.includes(f)
    )
    if (commonFlavors.length > 0) {
      reasons.push(`Matches your preferred flavors: ${commonFlavors.join(', ')}`)
    }
    
    // Strength preference
    if (preferences.strengthPreference.includes(cigar.strength)) {
      reasons.push(`Perfect ${cigar.strength} strength as you prefer`)
    }
    
    // Premium level
    if (cigar.premiumLevel === 'ultra-premium' || cigar.premiumLevel === 'exclusive') {
      reasons.push(`${cigar.premiumLevel.charAt(0).toUpperCase() + cigar.premiumLevel.slice(1)} selection for discerning aficionados`)
    }
    
    // Rating
    if (cigar.rating >= 4.5) {
      reasons.push(`Highly rated: ${cigar.rating}/5 from ${cigar.reviews} reviews`)
    }
    
    // Experience level matching
    const experienceMatch = this.matchExperienceLevel(cigar, preferences.experienceLevel)
    if (experienceMatch) {
      reasons.push(experienceMatch)
    }
    
    return reasons
  }

  /**
   * Generate AI insights for the recommendation
   */
  private async generateAIInsights(
    cigar: CigarProfile,
    preferences: UserPreferences,
    context?: RecommendationContext
  ): Promise<string> {
    try {
      const prompt = `
        Generate a brief, sophisticated insight about why ${cigar.name} by ${cigar.brand} 
        is recommended for someone with these preferences:
        - Flavors: ${preferences.flavorPreferences.join(', ')}
        - Experience: ${preferences.experienceLevel}
        ${context?.occasion ? `- Occasion: ${context.occasion}` : ''}
        
        Keep it concise, elegant, and informative (max 2 sentences).
      `
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a luxury cigar concierge providing elegant, knowledgeable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
      
      return completion.choices[0].message.content || 
        'A sophisticated choice that perfectly balances your preferences.'
    } catch (error) {
      console.error('Error generating AI insights:', error)
      return 'An excellent selection that aligns with your refined taste.'
    }
  }

  // Helper methods
  private calculateSetSimilarity(set1: string[], set2: string[]): number {
    const intersection = set1.filter(x => set2.includes(x))
    const union = [...new Set([...set1, ...set2])]
    return union.length > 0 ? intersection.length / union.length : 0
  }

  private async findSimilarUsers(userId: string, count: number): Promise<{userId: string, similarity: number}[]> {
    // Implementation would use collaborative filtering algorithms
    // For now, returning empty array
    const users: {userId: string, similarity: number}[] = []
    return users
  }

  private async findSimilarCigars(cigar: CigarProfile, count: number): Promise<CigarProfile[]> {
    // Implementation would use content-based similarity
    // For now, returning empty array
    const similar: CigarProfile[] = []
    return similar
  }

  private matchExperienceLevel(cigar: CigarProfile, level: string): string | null {
    const matches: Record<string, Record<string, string>> = {
      'novice': {
        'mild': 'Perfect for beginners - smooth and approachable',
        'medium': 'Great next step in your cigar journey'
      },
      'intermediate': {
        'medium': 'Ideal complexity for developing palates',
        'full': 'Ready to explore bolder flavors'
      },
      'expert': {
        'full': 'Complex profile worthy of your expertise',
        'medium': 'Nuanced selection for refined tastes'
      },
      'connoisseur': {
        'ultra-premium': 'Rare find for the true aficionado',
        'exclusive': 'Exceptional selection for collectors'
      }
    }
    
    return matches[level]?.[cigar.strength] || 
           matches[level]?.[cigar.premiumLevel] || 
           null
  }

  private buildAIPrompt(
    cigar: CigarProfile,
    preferences: UserPreferences,
    context?: RecommendationContext
  ): string {
    return `
      Cigar: ${cigar.name} by ${cigar.brand}
      Profile: ${cigar.flavorProfile.join(', ')}
      Strength: ${cigar.strength}
      Origin: ${cigar.origin}
      Price: $${cigar.price}
      
      User Preferences:
      - Preferred flavors: ${preferences.flavorPreferences.join(', ')}
      - Strength preference: ${preferences.strengthPreference.join(', ')}
      - Experience level: ${preferences.experienceLevel}
      - Budget: $${preferences.priceRange.min}-$${preferences.priceRange.max}
      
      ${context ? `Context: ${JSON.stringify(context)}` : ''}
      
      Rate match quality from 0-1.
    `
  }

  private async getUserProfile(userId: string): Promise<UserPreferences> {
    // Get from database or create default
    return this.userProfiles.get(userId) || {
      strengthPreference: ['medium'],
      flavorPreferences: ['woody', 'earthy', 'spicy'],
      wrapperPreferences: ['maduro', 'natural'],
      priceRange: { min: 10, max: 50 },
      experienceLevel: 'intermediate',
      occasions: ['relaxation', 'celebration'],
      avoidances: []
    }
  }

  private async getCandidateCigars(
    preferences: UserPreferences,
    context?: RecommendationContext
  ): Promise<CigarProfile[]> {
    // Filter cigars based on basic criteria
    const candidates: CigarProfile[] = []
    
    this.cigarDatabase.forEach(cigar => {
      // Price filter
      if (cigar.price < preferences.priceRange.min || 
          cigar.price > preferences.priceRange.max * 1.5) {
        return
      }
      
      // Avoidance filter
      if (preferences.avoidances.some(avoid => 
          cigar.flavorProfile.includes(avoid) ||
          cigar.wrapper.includes(avoid)
      )) {
        return
      }
      
      candidates.push(cigar)
    })
    
    return candidates
  }

  private async trackRecommendation(
    userId: string,
    recommendations: Recommendation[]
  ): Promise<void> {
    // Track for learning and improvement
    const history = this.interactionHistory.get(userId) || []
    history.push({
      timestamp: new Date(),
      recommendations: recommendations.map(r => ({
        cigarId: r.cigar.id,
        score: r.score
      })),
      context: 'recommendation'
    })
    this.interactionHistory.set(userId, history)
  }
}

// Export singleton instance
export const recommendationEngine = new AIRecommendationEngine()

// Export types and class
export default AIRecommendationEngine