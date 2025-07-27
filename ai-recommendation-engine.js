/**
 * AI-Powered Recommendation Engine for Thee Cigar Maestro
 * Advanced machine learning algorithms for personalized cigar recommendations
 */

class AIRecommendationEngine {
  constructor() {
    this.models = {
      collaborative: null,
      contentBased: null,
      hybrid: null,
      realtime: null
    };
    
    this.userProfiles = new Map();
    this.cigarEmbeddings = new Map();
    this.interactionMatrix = null;
    this.isTraining = false;
    this.isInitialized = false;
    
    // Recommendation algorithms
    this.algorithms = {
      COLLABORATIVE_FILTERING: 'collaborative',
      CONTENT_BASED: 'content',
      HYBRID: 'hybrid',
      DEEP_LEARNING: 'deep',
      MATRIX_FACTORIZATION: 'matrix',
      CLUSTERING: 'clustering'
    };
    
    // Feature weights for hybrid model
    this.featureWeights = {
      flavor: 0.3,
      wrapper: 0.25,
      strength: 0.2,
      origin: 0.15,
      price: 0.1
    };
    
    this.init();
  }

  /**
   * Initialize the recommendation engine
   */
  async init() {
    try {
      await this.loadData();
      await this.buildFeatureVectors();
      await this.initializeModels();
      await this.loadUserProfiles();
      
      this.isInitialized = true;
      console.log('🤖 AI Recommendation Engine initialized');
      
      // Start background training
      this.scheduleModelTraining();
      
    } catch (_error) {
      console.error('❌ Recommendation engine initialization failed:', error);
    }
  }

  /**
   * Load cigar data and user interactions
   */
  async loadData() {
    try {
      // Load cigar data
      this.cigarData = await this.fetchData('./flavorverse_nodes.json');
      this.manufacturerData = await this.fetchData('./cigar-specs.json');
      this.pairingData = await this.fetchData('./pairings.json');
      
      // Load user interaction data from storage
      if (window.storageManager) {
        const sessionData = window.storageManager.getSessionData();
        this.userInteractions = sessionData.userInteractions || [];
        this.userRatings = sessionData.userRatings || {};
        this.userFavorites = sessionData.favoritesCigars || [];
      }
      
      console.log('✅ Data loaded for recommendation engine');
    } catch (_error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  /**
   * Fetch data helper
   */
  async fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (_error) {
      console.error(`Error fetching ${url}:`, error);
      return [];
    }
  }

  /**
   * Build feature vectors for cigars
   */
  async buildFeatureVectors() {
    try {
      // Extract unique features
      const wrapperTypes = [...new Set(this.cigarData.map(c => c.wrapper))];
      const origins = [...new Set(this.cigarData.map(c => c.origin).filter(Boolean))];
      const strengths = [...new Set(this.cigarData.map(c => c.strength).filter(Boolean))];
      
      // Build flavor vocabulary
      const flavorVocabulary = this.buildFlavorVocabulary();
      
      // Create feature vectors for each cigar
      this.cigarData.forEach(cigar => {
        const features = this.extractCigarFeatures(cigar, {
          wrapperTypes,
          origins,
          strengths,
          flavorVocabulary
        });
        
        this.cigarEmbeddings.set(cigar.name, features);
      });
      
      console.log(`✅ Built feature vectors for ${this.cigarData.length} cigars`);
    } catch (_error) {
      console.error('Error building feature vectors:', error);
    }
  }

  /**
   * Build flavor vocabulary from descriptions
   */
  buildFlavorVocabulary() {
    const flavorTerms = new Set();
    
    // Common flavor descriptors
    const commonFlavors = [
      'chocolate', 'vanilla', 'coffee', 'cedar', 'leather', 'spice', 'pepper',
      'cream', 'honey', 'tobacco', 'earth', 'wood', 'nuts', 'caramel', 'cocoa',
      'fruit', 'citrus', 'berry', 'cherry', 'apple', 'floral', 'herb', 'mint',
      'sweet', 'bitter', 'salty', 'umami', 'smoky', 'ash', 'barnyard', 'hay'
    ];
    
    commonFlavors.forEach(flavor => flavorTerms.add(flavor));
    
    // Extract additional terms from flavor descriptions
    this.cigarData.forEach(cigar => {
      if (cigar.flavor) {
        const words = cigar.flavor.toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 3);
        
        words.forEach(word => flavorTerms.add(word));
      }
    });
    
    return Array.from(flavorTerms);
  }

  /**
   * Extract feature vector for a cigar
   */
  extractCigarFeatures(cigar, vocabularies) {
    const features = [];
    
    // Wrapper one-hot encoding
    vocabularies.wrapperTypes.forEach(wrapper => {
      features.push(cigar.wrapper === wrapper ? 1 : 0);
    });
    
    // Origin one-hot encoding
    vocabularies.origins.forEach(origin => {
      features.push(cigar.origin === origin ? 1 : 0);
    });
    
    // Strength one-hot encoding
    vocabularies.strengths.forEach(strength => {
      features.push(cigar.strength === strength ? 1 : 0);
    });
    
    // Flavor TF-IDF vector
    const flavorVector = this.computeFlavorTFIDF(cigar.flavor, vocabularies.flavorVocabulary);
    features.push(...flavorVector);
    
    // Numerical features (normalized)
    features.push(this.normalizePrice(cigar.price || 0));
    features.push(this.normalizeSize(cigar.size || 'Medium'));
    
    return features;
  }

  /**
   * Compute TF-IDF for flavor description
   */
  computeFlavorTFIDF(flavorText, vocabulary) {
    if (!flavorText) {return new Array(vocabulary.length).fill(0);}
    
    const text = flavorText.toLowerCase();
    const words = text.replace(/[^\w\s]/g, ' ').split(/\s+/);
    const wordCounts = {};
    
    // Count word frequencies
    words.forEach(word => {
      if (vocabulary.includes(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
    
    // Compute TF-IDF
    return vocabulary.map(term => {
      const tf = (wordCounts[term] || 0) / words.length;
      const idf = Math.log(this.cigarData.length / (1 + this.countDocumentsWithTerm(term)));
      return tf * idf;
    });
  }

  /**
   * Count documents containing a term
   */
  countDocumentsWithTerm(term) {
    return this.cigarData.filter(cigar => 
      cigar.flavor && cigar.flavor.toLowerCase().includes(term)
    ).length;
  }

  /**
   * Normalize price to 0-1 range
   */
  normalizePrice(price) {
    const maxPrice = Math.max(...this.cigarData.map(c => c.price || 0));
    const minPrice = Math.min(...this.cigarData.map(c => c.price || 0));
    return maxPrice > minPrice ? (price - minPrice) / (maxPrice - minPrice) : 0;
  }

  /**
   * Normalize size to numerical value
   */
  normalizeSize(size) {
    const sizeMap = {
      'Petit': 0.2,
      'Small': 0.4,
      'Medium': 0.6,
      'Large': 0.8,
      'Extra Large': 1.0
    };
    return sizeMap[size] || 0.6;
  }

  /**
   * Initialize machine learning models
   */
  async initializeModels() {
    try {
      // Initialize collaborative filtering model
      this.models.collaborative = new CollaborativeFilteringModel(this.cigarData.length);
      
      // Initialize content-based model
      this.models.contentBased = new ContentBasedModel(this.cigarEmbeddings);
      
      // Initialize hybrid model
      this.models.hybrid = new HybridModel(this.models.collaborative, this.models.contentBased);
      
      // Initialize real-time model
      this.models.realtime = new RealtimeModel();
      
      console.log('✅ ML models initialized');
    } catch (_error) {
      console.error('Error initializing models:', error);
    }
  }

  /**
   * Load user profiles
   */
  async loadUserProfiles() {
    try {
      if (window.authSystem && window.authSystem.isAuthenticated()) {
        const user = window.authSystem.getCurrentUser();
        const profile = await this.buildUserProfile(user.id);
        this.userProfiles.set(user.id, profile);
      }
      
      // Load anonymous user profile from storage
      if (window.storageManager) {
        const sessionData = window.storageManager.getSessionData();
        if (sessionData.anonymousProfile) {
          this.userProfiles.set('anonymous', sessionData.anonymousProfile);
        }
      }
      
      console.log('✅ User profiles loaded');
    } catch (_error) {
      console.error('Error loading user profiles:', error);
    }
  }

  /**
   * Build user profile from interactions
   */
  async buildUserProfile(userId) {
    const profile = {
      preferences: {
        wrappers: {},
        flavors: {},
        strengths: {},
        origins: {},
        priceRange: { min: 0, max: 1000 }
      },
      interactions: [],
      clusters: [],
      embedding: null
    };

    // Analyze user interactions
    const userInteractions = this.userInteractions.filter(i => i.userId === userId);
    
    userInteractions.forEach(interaction => {
      const cigar = this.cigarData.find(c => c.name === interaction.cigarName);
      if (cigar) {
        // Update preferences based on interaction weight
        const weight = this.getInteractionWeight(interaction.type);
        
        profile.preferences.wrappers[cigar.wrapper] = 
          (profile.preferences.wrappers[cigar.wrapper] || 0) + weight;
        
        if (cigar.strength) {
          profile.preferences.strengths[cigar.strength] = 
            (profile.preferences.strengths[cigar.strength] || 0) + weight;
        }
        
        if (cigar.origin) {
          profile.preferences.origins[cigar.origin] = 
            (profile.preferences.origins[cigar.origin] || 0) + weight;
        }
        
        // Extract flavor preferences
        if (cigar.flavor) {
          const flavors = this.extractFlavorKeywords(cigar.flavor);
          flavors.forEach(flavor => {
            profile.preferences.flavors[flavor] = 
              (profile.preferences.flavors[flavor] || 0) + weight;
          });
        }
      }
    });

    // Compute user embedding
    profile.embedding = this.computeUserEmbedding(profile.preferences);
    
    return profile;
  }

  /**
   * Get interaction weight based on type
   */
  getInteractionWeight(interactionType) {
    const weights = {
      'view': 1,
      'click': 2,
      'favorite': 5,
      'rate_positive': 4,
      'rate_negative': -2,
      'purchase': 8,
      'share': 3
    };
    return weights[interactionType] || 1;
  }

  /**
   * Extract flavor keywords from description
   */
  extractFlavorKeywords(flavorText) {
    const commonFlavors = [
      'chocolate', 'vanilla', 'coffee', 'cedar', 'leather', 'spice', 'pepper',
      'cream', 'honey', 'tobacco', 'earth', 'wood', 'nuts', 'caramel'
    ];
    
    const text = flavorText.toLowerCase();
    return commonFlavors.filter(flavor => text.includes(flavor));
  }

  /**
   * Compute user embedding from preferences
   */
  computeUserEmbedding(preferences) {
    const embedding = [];
    
    // Wrapper preferences
    const wrapperTypes = ['Maduro', 'Connecticut', 'Habano', 'Natural', 'Oscuro'];
    wrapperTypes.forEach(wrapper => {
      embedding.push(preferences.wrappers[wrapper] || 0);
    });
    
    // Strength preferences
    const strengths = ['Mild', 'Medium', 'Full'];
    strengths.forEach(strength => {
      embedding.push(preferences.strengths[strength] || 0);
    });
    
    // Top flavor preferences
    const flavorEntries = Object.entries(preferences.flavors || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    for (let i = 0; i < 10; i++) {
      embedding.push(flavorEntries[i] ? flavorEntries[i][1] : 0);
    }
    
    return this.normalizeVector(embedding);
  }

  /**
   * Normalize vector to unit length
   */
  normalizeVector(vector) {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
  }

  /**
   * Get personalized recommendations
   */
  async getRecommendations(userId = null, options = {}) {
    try {
      if (!this.isInitialized) {
        await this.init();
      }

      const {
        algorithm = this.algorithms.HYBRID,
        count: requestedCount = 10,
        filters = {},
        contextualFactors = {}
      } = options;
      
      const count = requestedCount;

      let recommendations = [];

      switch (algorithm) {
        case this.algorithms.COLLABORATIVE_FILTERING:
          recommendations = await this.getCollaborativeRecommendations(userId, count);
          break;
          
        case this.algorithms.CONTENT_BASED:
          recommendations = await this.getContentBasedRecommendations(userId, count);
          break;
          
        case this.algorithms.HYBRID:
          recommendations = await this.getHybridRecommendations(userId, count);
          break;
          
        case this.algorithms.MATRIX_FACTORIZATION:
          recommendations = await this.getMatrixFactorizationRecommendations(userId, count);
          break;
          
        default:
          recommendations = await this.getHybridRecommendations(userId, count);
      }

      // Apply filters
      recommendations = this.applyFilters(recommendations, filters);
      
      // Apply contextual factors
      recommendations = this.applyContextualFactors(recommendations, contextualFactors);
      
      // Add explanation and confidence scores
      recommendations = recommendations.map(rec => ({
        ...rec,
        explanation: this.generateExplanation(rec, userId),
        confidence: this.calculateConfidence(rec, userId)
      }));

      // Track recommendation event
      if (window.analyticsManager) {
        window.analyticsManager.trackEvent('recommendations_generated', {
          user_id: userId,
          algorithm,
          count: recommendations.length,
          filters: Object.keys(filters)
        });
      }

      return recommendations.slice(0, count);
      
    } catch (_error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(10);
    }
  }

  /**
   * Get collaborative filtering recommendations
   */
  async getCollaborativeRecommendations(_userId, count) {
    if (!_userId || !this.userProfiles.has(_userId)) {
      return this.getPopularRecommendations(count);
    }

    // Get user profile for potential future use
    // const userProfile = this.userProfiles.get(_userId);
    const similarUsers = await this.findSimilarUsers(_userId);
    
    const recommendations = new Map();
    
    similarUsers.forEach(({ userId: similarUserId, similarity }) => {
      const similarUserInteractions = this.userInteractions.filter(i => i.userId === similarUserId);
      
      similarUserInteractions.forEach(interaction => {
        const cigar = this.cigarData.find(c => c.name === interaction.cigarName);
        if (cigar && !this.hasUserInteracted(_userId, cigar.name)) {
          const score = similarity * this.getInteractionWeight(interaction.type);
          
          if (recommendations.has(cigar.name)) {
            recommendations.set(cigar.name, recommendations.get(cigar.name) + score);
          } else {
            recommendations.set(cigar.name, score);
          }
        }
      });
    });

    return Array.from(recommendations.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([cigarName, score]) => ({
        cigar: this.cigarData.find(c => c.name === cigarName),
        score,
        algorithm: 'collaborative'
      }));
  }

  /**
   * Get content-based recommendations
   */
  async getContentBasedRecommendations(userId, count) {
    if (!userId || !this.userProfiles.has(userId)) {
      return this.getDiverseRecommendations(count);
    }

    const userProfile = this.userProfiles.get(userId);
    const userEmbedding = userProfile.embedding;
    
    if (!userEmbedding) {
      return this.getDiverseRecommendations(count);
    }

    const recommendations = [];
    
    this.cigarData.forEach(cigar => {
      if (!this.hasUserInteracted(userId, cigar.name)) {
        const cigarEmbedding = this.cigarEmbeddings.get(cigar.name);
        if (cigarEmbedding) {
          const similarity = this.computeCosineSimilarity(userEmbedding, cigarEmbedding);
          recommendations.push({
            cigar,
            score: similarity,
            algorithm: 'content'
          });
        }
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  /**
   * Get hybrid recommendations
   */
  async getHybridRecommendations(userId, count) {
    const collaborativeRecs = await this.getCollaborativeRecommendations(userId, count * 2);
    const contentRecs = await this.getContentBasedRecommendations(userId, count * 2);
    
    // Combine and weight recommendations
    const combinedRecs = new Map();
    
    collaborativeRecs.forEach(rec => {
      const key = rec.cigar.name;
      combinedRecs.set(key, {
        cigar: rec.cigar,
        collaborativeScore: rec.score,
        contentScore: 0,
        algorithm: 'hybrid'
      });
    });
    
    contentRecs.forEach(rec => {
      const key = rec.cigar.name;
      if (combinedRecs.has(key)) {
        combinedRecs.get(key).contentScore = rec.score;
      } else {
        combinedRecs.set(key, {
          cigar: rec.cigar,
          collaborativeScore: 0,
          contentScore: rec.score,
          algorithm: 'hybrid'
        });
      }
    });
    
    // Calculate hybrid score
    return Array.from(combinedRecs.values())
      .map(rec => ({
        ...rec,
        score: (0.6 * rec.collaborativeScore) + (0.4 * rec.contentScore)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  /**
   * Find similar users using collaborative filtering
   */
  async findSimilarUsers(userId, maxUsers = 50) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) {return [];}

    const similarities = [];
    
    this.userProfiles.forEach((profile, otherUserId) => {
      if (otherUserId !== userId) {
        const similarity = this.computeUserSimilarity(userProfile, profile);
        if (similarity > 0.1) { // Minimum similarity threshold
          similarities.push({ userId: otherUserId, similarity });
        }
      }
    });

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxUsers);
  }

  /**
   * Compute similarity between two users
   */
  computeUserSimilarity(profile1, profile2) {
    if (!profile1.embedding || !profile2.embedding) {return 0;}
    return this.computeCosineSimilarity(profile1.embedding, profile2.embedding);
  }

  /**
   * Compute cosine similarity between two vectors
   */
  computeCosineSimilarity(vec1, vec2) {
    if (vec1.length !== vec2.length) {return 0;}
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }
    
    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    return magnitude > 0 ? dotProduct / magnitude : 0;
  }

  /**
   * Check if user has interacted with a cigar
   */
  hasUserInteracted(userId, cigarName) {
    return this.userInteractions.some(i => 
      i.userId === userId && i.cigarName === cigarName
    );
  }

  /**
   * Apply filters to recommendations
   */
  applyFilters(recommendations, filters) {
    return recommendations.filter(rec => {
      const {cigar} = rec;
      
      // Wrapper filter
      if (filters.wrappers && filters.wrappers.length > 0) {
        if (!filters.wrappers.includes(cigar.wrapper)) {return false;}
      }
      
      // Strength filter
      if (filters.strengths && filters.strengths.length > 0) {
        if (!filters.strengths.includes(cigar.strength)) {return false;}
      }
      
      // Price range filter
      if (filters.priceRange) {
        const price = cigar.price || 0;
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }
      
      // Origin filter
      if (filters.origins && filters.origins.length > 0) {
        if (!filters.origins.includes(cigar.origin)) {return false;}
      }
      
      return true;
    });
  }

  /**
   * Apply contextual factors
   */
  applyContextualFactors(recommendations, factors) {
    if (!factors || Object.keys(factors).length === 0) {
      return recommendations;
    }

    return recommendations.map(rec => {
      let adjustedScore = rec.score;
      
      // Time of day factor
      if (factors.timeOfDay) {
        const timeBonus = this.getTimeOfDayBonus(rec.cigar, factors.timeOfDay);
        adjustedScore *= (1 + timeBonus);
      }
      
      // Weather factor
      if (factors.weather) {
        const weatherBonus = this.getWeatherBonus(rec.cigar, factors.weather);
        adjustedScore *= (1 + weatherBonus);
      }
      
      // Mood factor
      if (factors.mood) {
        const moodBonus = this.getMoodBonus(rec.cigar, factors.mood);
        adjustedScore *= (1 + moodBonus);
      }
      
      return { ...rec, score: adjustedScore };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * Get time of day bonus
   */
  getTimeOfDayBonus(cigar, timeOfDay) {
    const bonuses = {
      morning: { Connecticut: 0.2, mild: 0.15 },
      afternoon: { Habano: 0.15, medium: 0.1 },
      evening: { Maduro: 0.25, full: 0.2 },
      night: { Oscuro: 0.3, full: 0.25 }
    };
    
    const timeBonuses = bonuses[timeOfDay] || {};
    let bonus = 0;
    
    if (timeBonuses[cigar.wrapper]) {bonus += timeBonuses[cigar.wrapper];}
    if (timeBonuses[cigar.strength?.toLowerCase()]) {
      bonus += timeBonuses[cigar.strength.toLowerCase()];
    }
    
    return bonus;
  }

  /**
   * Get weather bonus
   */
  getWeatherBonus(cigar, weather) {
    const bonuses = {
      sunny: { Connecticut: 0.15, mild: 0.1 },
      cloudy: { Habano: 0.1, medium: 0.1 },
      rainy: { Maduro: 0.2, full: 0.15 },
      cold: { Oscuro: 0.25, full: 0.2 }
    };
    
    const weatherBonuses = bonuses[weather] || {};
    let bonus = 0;
    
    if (weatherBonuses[cigar.wrapper]) {bonus += weatherBonuses[cigar.wrapper];}
    if (weatherBonuses[cigar.strength?.toLowerCase()]) {
      bonus += weatherBonuses[cigar.strength.toLowerCase()];
    }
    
    return bonus;
  }

  /**
   * Get mood bonus
   */
  getMoodBonus(cigar, mood) {
    const bonuses = {
      relaxed: { Connecticut: 0.2, cream: 0.15 },
      energetic: { Habano: 0.15, spice: 0.1 },
      contemplative: { Maduro: 0.25, chocolate: 0.2 },
      celebratory: { premium: 0.3, complex: 0.25 }
    };
    
    const moodBonuses = bonuses[mood] || {};
    let bonus = 0;
    
    if (moodBonuses[cigar.wrapper]) {bonus += moodBonuses[cigar.wrapper];}
    
    // Check flavor bonuses
    if (cigar.flavor) {
      const flavorText = cigar.flavor.toLowerCase();
      Object.entries(moodBonuses).forEach(([flavor, bonusValue]) => {
        if (flavorText.includes(flavor)) {bonus += bonusValue;}
      });
    }
    
    return bonus;
  }

  /**
   * Generate explanation for recommendation
   */
  generateExplanation(recommendation, _userId) {
    const {cigar} = recommendation;
    const {algorithm} = recommendation;
    
    let explanation = '';
    
    switch (algorithm) {
      case 'collaborative':
        explanation = `Recommended because users with similar tastes enjoyed ${cigar.wrapper} cigars`;
        break;
        
      case 'content':
        explanation = `Matches your preference for ${cigar.wrapper} wrapper`;
        if (cigar.flavor) {
          const flavors = this.extractFlavorKeywords(cigar.flavor);
          if (flavors.length > 0) {
            explanation += ` with ${flavors.slice(0, 2).join(' and ')} notes`;
          }
        }
        break;
        
      case 'hybrid':
        explanation = `Great match based on your taste profile and similar users' preferences`;
        break;
        
      default:
        explanation = `Popular choice among cigar enthusiasts`;
    }
    
    return explanation;
  }

  /**
   * Calculate confidence score for recommendation
   */
  calculateConfidence(recommendation, userId) {
    let confidence = Math.min(recommendation.score / 10, 1); // Normalize to 0-1
    
    // Adjust based on data availability
    if (userId && this.userProfiles.has(userId)) {
              // Get user profile for potential future use
        // const profile = this.userProfiles.get(userId);
      const interactionCount = this.userInteractions.filter(i => i.userId === userId).length;
      
      // More interactions = higher confidence
      const interactionBonus = Math.min(interactionCount / 20, 0.3);
      confidence += interactionBonus;
    } else {
      // Lower confidence for anonymous users
      confidence *= 0.7;
    }
    
    return Math.min(confidence, 1);
  }

  /**
   * Get popular recommendations (fallback)
   */
  getPopularRecommendations(count) {
    // Simple popularity based on interaction frequency
    const popularity = {};
    
    this.userInteractions.forEach(interaction => {
      const weight = this.getInteractionWeight(interaction.type);
      popularity[interaction.cigarName] = (popularity[interaction.cigarName] || 0) + weight;
    });
    
    return Object.entries(popularity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([cigarName, score]) => ({
        cigar: this.cigarData.find(c => c.name === cigarName),
        score,
        algorithm: 'popularity'
      }))
      .filter(rec => rec.cigar);
  }

  /**
   * Get diverse recommendations
   */
  getDiverseRecommendations(count) {
    const wrapperTypes = ['Maduro', 'Connecticut', 'Habano', 'Natural', 'Oscuro'];
    const recommendations = [];
    
    wrapperTypes.forEach(wrapper => {
      const cigarsOfType = this.cigarData.filter(c => c.wrapper === wrapper);
      if (cigarsOfType.length > 0) {
        const randomCigar = cigarsOfType[Math.floor(Math.random() * cigarsOfType.length)];
        recommendations.push({
          cigar: randomCigar,
          score: Math.random() * 0.5 + 0.5, // Random score between 0.5-1
          algorithm: 'diverse'
        });
      }
    });
    
    return recommendations.slice(0, count);
  }

  /**
   * Get fallback recommendations
   */
  getFallbackRecommendations(count) {
    return this.cigarData
      .slice(0, count)
      .map(cigar => ({
        cigar,
        score: 0.5,
        algorithm: 'fallback',
        explanation: 'Featured cigar selection',
        confidence: 0.3
      }));
  }

  /**
   * Track user interaction
   */
  trackInteraction(userId, cigarName, interactionType, metadata = {}) {
    const interaction = {
      userId: userId || 'anonymous',
      cigarName,
      type: interactionType,
      timestamp: new Date().toISOString(),
      metadata
    };
    
    this.userInteractions.push(interaction);
    
    // Update user profile
    if (userId) {
      this.updateUserProfile(userId, interaction);
    }
    
    // Save to storage
    if (window.storageManager) {
      const sessionData = window.storageManager.getSessionData();
      sessionData.userInteractions = this.userInteractions;
      window.storageManager.saveData();
    }
    
    // Track analytics
    if (window.analyticsManager) {
      window.analyticsManager.trackEvent('recommendation_interaction', {
        user_id: userId,
        cigar_name: cigarName,
        interaction_type: interactionType,
        ...metadata
      });
    }
  }

  /**
   * Update user profile based on interaction
   */
  async updateUserProfile(userId, interaction) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, await this.buildUserProfile(userId));
    }
    
    const profile = this.userProfiles.get(userId);
    const cigar = this.cigarData.find(c => c.name === interaction.cigarName);
    
    if (cigar) {
      const weight = this.getInteractionWeight(interaction.type);
      
      // Update wrapper preferences
      profile.preferences.wrappers[cigar.wrapper] = 
        (profile.preferences.wrappers[cigar.wrapper] || 0) + weight;
      
      // Update other preferences similarly
      if (cigar.strength) {
        profile.preferences.strengths[cigar.strength] = 
          (profile.preferences.strengths[cigar.strength] || 0) + weight;
      }
      
      // Recompute user embedding
      profile.embedding = this.computeUserEmbedding(profile.preferences);
    }
  }

  /**
   * Schedule model training
   */
  scheduleModelTraining() {
    // Train models every hour
    setInterval(() => {
      this.trainModels();
    }, 60 * 60 * 1000);
    
    // Initial training after 5 minutes
    setTimeout(() => {
      this.trainModels();
    }, 5 * 60 * 1000);
  }

  /**
   * Train machine learning models
   */
  async trainModels() {
    if (this.isTraining) {return;}
    
    try {
      this.isTraining = true;
      console.log('🔄 Training recommendation models...');
      
      // Update user profiles
      for (const userId of this.userProfiles.keys()) {
        this.userProfiles.set(userId, await this.buildUserProfile(userId));
      }
      
      // Train collaborative filtering model
      if (this.models.collaborative) {
        await this.models.collaborative.train(this.userInteractions);
      }
      
      // Train content-based model
      if (this.models.contentBased) {
        await this.models.contentBased.train(this.cigarEmbeddings);
      }
      
      console.log('✅ Model training completed');
      
    } catch (_error) {
      console.error('❌ Model training failed:', error);
    } finally {
      this.isTraining = false;
    }
  }

  /**
   * Get real-time recommendations during browsing
   */
  async getRealtimeRecommendations(userId, currentContext) {
    try {
      const baseRecommendations = await this.getRecommendations(userId, {
        count: 5,
        algorithm: this.algorithms.HYBRID,
        contextualFactors: currentContext
      });
      
      // Apply real-time adjustments
      return baseRecommendations.map(rec => ({
        ...rec,
        realtime: true,
        freshness: Date.now()
      }));
      
    } catch (_error) {
      console.error('Error getting real-time recommendations:', error);
      return [];
    }
  }

  /**
   * Export recommendation data for analysis
   */
  exportRecommendationData() {
    return {
      userProfiles: Array.from(this.userProfiles.entries()),
      userInteractions: this.userInteractions,
      modelPerformance: this.getModelPerformance(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Get model performance metrics
   */
  getModelPerformance() {
    return {
      totalUsers: this.userProfiles.size,
      totalInteractions: this.userInteractions.length,
      totalCigars: this.cigarData.length,
      averageInteractionsPerUser: this.userInteractions.length / Math.max(this.userProfiles.size, 1),
      modelTrainingStatus: this.isTraining ? 'training' : 'ready'
    };
  }
}

// Simple collaborative filtering model
class CollaborativeFilteringModel {
  constructor(itemCount) {
    this.itemCount = itemCount;
    this.userItemMatrix = new Map();
  }

  async train(interactions) {
    // Build user-item interaction matrix
    this.userItemMatrix.clear();
    
    interactions.forEach(interaction => {
      if (!this.userItemMatrix.has(interaction.userId)) {
        this.userItemMatrix.set(interaction.userId, new Map());
      }
      
      const userMatrix = this.userItemMatrix.get(interaction.userId);
      const weight = this.getWeight(interaction.type);
      
      userMatrix.set(interaction.cigarName, 
        (userMatrix.get(interaction.cigarName) || 0) + weight
      );
    });
  }

  getWeight(interactionType) {
    const weights = {
      'view': 1,
      'click': 2,
      'favorite': 5,
      'rate_positive': 4,
      'rate_negative': -2
    };
    return weights[interactionType] || 1;
  }
}

// Simple content-based model
class ContentBasedModel {
  constructor(embeddings) {
    this.embeddings = embeddings;
  }

  async train(embeddings) {
    this.embeddings = embeddings;
  }
}

// Hybrid model combining collaborative and content-based
class HybridModel {
  constructor(collaborativeModel, contentModel) {
    this.collaborativeModel = collaborativeModel;
    this.contentModel = contentModel;
  }
}

// Real-time recommendation model
class RealtimeModel {
  constructor() {
    this.sessionData = new Map();
  }
}

// Initialize recommendation engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.recommendationEngine = new AIRecommendationEngine();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIRecommendationEngine;
}