/**
 * Enhanced AI Concierge for Thee Cigar Maestro
 * Luxury persona with sophisticated conversational abilities and NLP training
 */

export class AIConciergeEnhanced {
  constructor() {
    this.isInitialized = false;
    this.conversationHistory = [];
    this.userProfile = {};
    this.luxuryPersona = {
      name: 'Maestro Sebastian',
      title: 'Master Cigar Concierge',
      personality: 'sophisticated, knowledgeable, warm, exclusive',
      expertise: ['cigars', 'spirits', 'pairings', 'etiquette', 'luxury lifestyle'],
      tone: 'refined yet approachable',
      vocabulary: 'elevated but accessible',
    };

    this.nlpTraining = {
      intents: new Map(),
      entities: new Map(),
      responses: new Map(),
      contextPatterns: new Map(),
    };

    this.init();
  }

  async init() {
    if (this.isInitialized) return;

    console.log('🎩 Initializing Enhanced AI Concierge...');

    // Load conversation data
    await this.loadConversationHistory();

    // Initialize NLP training
    await this.initializeNLPTraining();

    // Setup luxury persona
    await this.configureLuxuryPersona();

    // Initialize voice interface
    await this.initializeVoiceInterface();

    // Setup personalization engine
    await this.initializePersonalization();

    this.isInitialized = true;
    console.log('✅ Enhanced AI Concierge initialized');
  }

  async initializeNLPTraining() {
    // Intent Recognition Training
    this.nlpTraining.intents.set('cigar_recommendation', {
      patterns: [
        'recommend a cigar',
        'what cigar should I try',
        'suggest something new',
        'help me choose',
        'cigar for tonight',
        'special occasion cigar',
      ],
      responses: [
        'I would be delighted to curate a selection for you. May I inquire about the occasion and your flavor preferences?',
        'Allow me to suggest something truly exceptional. What style of experience are you seeking this evening?',
        'I have several distinguished recommendations in mind. Tell me, do you prefer bold complexity or refined subtlety?',
      ],
    });

    this.nlpTraining.intents.set('pairing_advice', {
      patterns: [
        'what pairs with',
        'drink recommendation',
        'spirit pairing',
        'what to drink',
        'cocktail suggestion',
        'whiskey recommendation',
      ],
      responses: [
        'An excellent choice requires an equally distinguished companion. For that particular cigar, I recommend...',
        'The art of pairing is one of my greatest pleasures. This cigar would be sublime with...',
        'Allow me to suggest a pairing that will elevate your experience to new heights...',
      ],
    });

    this.nlpTraining.intents.set('luxury_experience', {
      patterns: [
        'special occasion',
        'celebration',
        'luxury experience',
        'premium selection',
        'exclusive',
        'finest cigars',
      ],
      responses: [
        'For such a distinguished occasion, only the finest will suffice. I recommend our Reserve Collection...',
        'A celebration calls for something truly extraordinary. Allow me to suggest...',
        'For the most discerning connoisseur, I present our exclusive selection...',
      ],
    });

    this.nlpTraining.intents.set('education', {
      patterns: [
        'tell me about',
        'how is it made',
        'what makes it special',
        'cigar knowledge',
        'learn about',
        'explain',
      ],
      responses: [
        'I am delighted to share the fascinating artistry behind this selection...',
        'The craftsmanship involved is truly remarkable. Allow me to illuminate...',
        'This is a wonderful opportunity to explore the rich heritage and technique...',
      ],
    });

    // Entity Recognition
    this.nlpTraining.entities.set('cigar_strength', [
      'mild',
      'medium',
      'full',
      'strong',
      'light',
      'bold',
      'robust',
      'delicate',
    ]);

    this.nlpTraining.entities.set('occasions', [
      'celebration',
      'evening',
      'special',
      'casual',
      'formal',
      'business',
      'relaxation',
    ]);

    this.nlpTraining.entities.set('flavor_profiles', [
      'earthy',
      'woody',
      'spicy',
      'sweet',
      'creamy',
      'nutty',
      'chocolate',
      'coffee',
      'leather',
    ]);

    this.nlpTraining.entities.set('spirits', [
      'whiskey',
      'rum',
      'cognac',
      'bourbon',
      'scotch',
      'brandy',
      'wine',
      'port',
    ]);
  }

  async configureLuxuryPersona() {
    this.luxuryPersona.conversationStarters = [
      'Good evening, and welcome to our distinguished lounge. I am Maestro Sebastian, your personal cigar concierge.',
      'How may I assist you in curating the perfect cigar experience this evening?',
      "I'm here to guide you through our exceptional collection and create an unforgettable moment.",
    ];

    this.luxuryPersona.signatureExpressions = [
      'Allow me to suggest...',
      'I would be delighted to recommend...',
      'For the discerning connoisseur...',
      'An exceptional choice would be...',
      'May I present...',
      'I have the perfect selection in mind...',
    ];

    this.luxuryPersona.contextualResponses = {
      newUser:
        "Welcome to our exclusive circle. I'm honored to introduce you to the world of fine cigars.",
      returningUser: 'Welcome back! I trust your last selection exceeded expectations.',
      premiumMember:
        'Always a pleasure to serve our distinguished members. What exceptional experience shall we craft today?',
    };
  }

  async initializeVoiceInterface() {
    // Check for voice support
    if ('speechRecognition' in window || 'webkitSpeechRecognition' in window) {
      this.speechRecognition = new (window.speechRecognition || window.webkitSpeechRecognition)();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = 'en-US';

      this.speechRecognition.onresult = event => {
        const transcript = event.results[0][0].transcript;
        this.processVoiceInput(transcript);
      };
    }

    // Text-to-speech for responses
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  async initializePersonalization() {
    // Load user profile from storage
    try {
      const savedProfile = localStorage.getItem('cigar-maestro-profile');
      if (savedProfile) {
        this.userProfile = JSON.parse(savedProfile);
      }
    } catch (error) {
      console.warn('Could not load user profile:', error);
    }

    // Initialize default profile structure
    if (!this.userProfile.preferences) {
      this.userProfile.preferences = {
        strength: null,
        flavors: [],
        occasions: [],
        budget: null,
        experience_level: 'intermediate',
      };
    }

    if (!this.userProfile.history) {
      this.userProfile.history = {
        interactions: [],
        recommendations: [],
        purchases: [],
        favorites: [],
      };
    }
  }

  async processMessage(message, context = {}) {
    console.log('🎩 Processing message:', message);

    try {
      // Analyze intent and entities
      const analysis = await this.analyzeMessage(message);

      // Generate personalized response
      const response = await this.generateResponse(analysis, context);

      // Update conversation history
      this.updateConversationHistory(message, response, analysis);

      // Learn from interaction
      await this.learnFromInteraction(analysis, context);

      return {
        response: response.text,
        suggestions: response.suggestions,
        products: response.products,
        analysis: analysis,
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        response:
          "I apologize, but I'm experiencing a momentary difficulty. Please allow me a moment to assist you properly.",
        suggestions: [
          'Ask for a cigar recommendation',
          'Inquire about pairings',
          'Learn about cigar basics',
        ],
        products: [],
        analysis: null,
      };
    }
  }

  async analyzeMessage(message) {
    const analysis = {
      intent: null,
      entities: {},
      sentiment: 'neutral',
      confidence: 0,
      context: [],
    };

    const lowerMessage = message.toLowerCase();

    // Intent classification
    let highestConfidence = 0;
    for (const [intent, data] of this.nlpTraining.intents) {
      const matches = data.patterns.filter(pattern => lowerMessage.includes(pattern.toLowerCase()));

      const confidence = matches.length / data.patterns.length;
      if (confidence > highestConfidence) {
        highestConfidence = confidence;
        analysis.intent = intent;
        analysis.confidence = confidence;
      }
    }

    // Entity extraction
    for (const [entityType, entities] of this.nlpTraining.entities) {
      const foundEntities = entities.filter(entity => lowerMessage.includes(entity.toLowerCase()));

      if (foundEntities.length > 0) {
        analysis.entities[entityType] = foundEntities;
      }
    }

    // Sentiment analysis (basic)
    const positiveWords = ['love', 'like', 'enjoy', 'great', 'excellent', 'amazing', 'wonderful'];
    const negativeWords = ['hate', 'dislike', 'terrible', 'awful', 'bad', 'horrible'];

    const positiveScore = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeScore = negativeWords.filter(word => lowerMessage.includes(word)).length;

    if (positiveScore > negativeScore) analysis.sentiment = 'positive';
    else if (negativeScore > positiveScore) analysis.sentiment = 'negative';

    return analysis;
  }

  async generateResponse(analysis, context) {
    const response = {
      text: '',
      suggestions: [],
      products: [],
    };

    // Get base response based on intent
    if (analysis.intent && this.nlpTraining.intents.has(analysis.intent)) {
      const intentData = this.nlpTraining.intents.get(analysis.intent);
      const baseResponse =
        intentData.responses[Math.floor(Math.random() * intentData.responses.length)];
      response.text = this.personalizeResponse(baseResponse, analysis);
    } else {
      response.text = this.generateFallbackResponse(analysis);
    }

    // Add personalized suggestions based on intent
    response.suggestions = this.generateSuggestions(analysis);

    // Recommend products if applicable
    if (analysis.intent === 'cigar_recommendation' || analysis.intent === 'luxury_experience') {
      response.products = await this.getProductRecommendations(analysis);
    }

    return response;
  }

  personalizeResponse(baseResponse, analysis) {
    let personalizedResponse = baseResponse;

    // Add personal touches based on user profile
    if (this.userProfile.preferences.experience_level === 'beginner') {
      personalizedResponse +=
        " As you're exploring the world of cigars, I'll ensure my recommendations are perfectly suited to developing your palate.";
    } else if (this.userProfile.preferences.experience_level === 'expert') {
      personalizedResponse +=
        ' Given your refined palate and extensive experience, I have some exceptional selections in mind.';
    }

    // Add context from entities
    if (analysis.entities.occasions) {
      const occasion = analysis.entities.occasions[0];
      personalizedResponse += ` For ${occasion} occasions, `;
    }

    if (analysis.entities.cigar_strength) {
      const strength = analysis.entities.cigar_strength[0];
      personalizedResponse += ` I recommend exploring our ${strength} selection. `;
    }

    return personalizedResponse;
  }

  generateFallbackResponse(analysis) {
    const fallbacks = [
      "I appreciate your inquiry. Could you tell me more about what you're seeking today?",
      "That's an interesting question. May I ask what specifically interests you about cigars?",
      "I'd be delighted to assist you further. What aspect of the cigar experience would you like to explore?",
      "Allow me to help you find exactly what you're looking for. What brings you to our lounge today?",
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  generateSuggestions(analysis) {
    const suggestions = [];

    switch (analysis.intent) {
      case 'cigar_recommendation':
        suggestions.push(
          'Tell me about your flavor preferences',
          "What's the occasion?",
          "What's your experience level?",
          'Any budget considerations?'
        );
        break;
      case 'pairing_advice':
        suggestions.push(
          'What cigar are you enjoying?',
          'Prefer spirits or non-alcoholic?',
          'Casual or formal setting?',
          'Time of day preference?'
        );
        break;
      case 'education':
        suggestions.push(
          'Learn about cigar construction',
          'Understand wrapper varieties',
          'Explore aging processes',
          'Discover regional differences'
        );
        break;
      default:
        suggestions.push(
          'Recommend a cigar',
          'Suggest a pairing',
          'Learn about cigars',
          'Browse our collection'
        );
    }

    return suggestions;
  }

  async getProductRecommendations(analysis) {
    // This would integrate with the actual product database
    // For now, return mock recommendations based on analysis

    const recommendations = [];

    if (analysis.entities.cigar_strength?.includes('mild')) {
      recommendations.push({
        name: 'Arturo Fuente Hemingway Classic',
        description: 'A sophisticated mild cigar with creamy notes',
        price: '$12',
        rating: 4.8,
      });
    }

    if (analysis.entities.luxury_experience || analysis.entities.occasions?.includes('special')) {
      recommendations.push({
        name: 'Padron 1964 Anniversary Series',
        description: 'An exceptional full-bodied cigar for special occasions',
        price: '$28',
        rating: 4.9,
      });
    }

    return recommendations;
  }

  updateConversationHistory(message, response, analysis) {
    const interaction = {
      timestamp: new Date().toISOString(),
      userMessage: message,
      conciergeResponse: response.text,
      intent: analysis.intent,
      entities: analysis.entities,
      sentiment: analysis.sentiment,
    };

    this.conversationHistory.push(interaction);
    this.userProfile.history.interactions.push(interaction);

    // Keep only last 50 interactions in memory
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }

    this.saveUserProfile();
  }

  async learnFromInteraction(analysis, context) {
    // Update user preferences based on interaction
    if (analysis.entities.cigar_strength) {
      this.userProfile.preferences.strength = analysis.entities.cigar_strength[0];
    }

    if (analysis.entities.flavor_profiles) {
      const newFlavors = analysis.entities.flavor_profiles.filter(
        flavor => !this.userProfile.preferences.flavors.includes(flavor)
      );
      this.userProfile.preferences.flavors.push(...newFlavors);
    }

    if (analysis.entities.occasions) {
      const newOccasions = analysis.entities.occasions.filter(
        occasion => !this.userProfile.preferences.occasions.includes(occasion)
      );
      this.userProfile.preferences.occasions.push(...newOccasions);
    }

    // Learn new patterns (simplified machine learning)
    if (analysis.intent && analysis.confidence > 0.7) {
      // This would update the NLP model in a real implementation
      console.log('Learning from high-confidence interaction:', analysis.intent);
    }
  }

  async processVoiceInput(transcript) {
    console.log('🎤 Voice input received:', transcript);

    const response = await this.processMessage(transcript, { source: 'voice' });

    // Speak the response if supported
    if (this.speechSynthesis) {
      this.speakResponse(response.response);
    }

    return response;
  }

  speakResponse(text) {
    if (!this.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Try to use a more sophisticated voice if available
    const voices = this.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      voice =>
        voice.name.includes('British') || voice.name.includes('English') || voice.lang === 'en-GB'
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.speechSynthesis.speak(utterance);
  }

  startVoiceRecognition() {
    if (this.speechRecognition) {
      this.speechRecognition.start();
      return true;
    }
    return false;
  }

  stopVoiceRecognition() {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }

  async loadConversationHistory() {
    try {
      const history = localStorage.getItem('cigar-maestro-conversations');
      if (history) {
        this.conversationHistory = JSON.parse(history);
      }
    } catch (error) {
      console.warn('Could not load conversation history:', error);
    }
  }

  saveUserProfile() {
    try {
      localStorage.setItem('cigar-maestro-profile', JSON.stringify(this.userProfile));
      localStorage.setItem('cigar-maestro-conversations', JSON.stringify(this.conversationHistory));
    } catch (error) {
      console.warn('Could not save user data:', error);
    }
  }

  // Public API methods
  async askConcierge(message, context = {}) {
    return await this.processMessage(message, context);
  }

  getPersonalizedGreeting() {
    const { contextualResponses } = this.luxuryPersona;

    if (this.userProfile.history.interactions.length === 0) {
      return contextualResponses.newUser;
    } else if (this.userProfile.preferences.experience_level === 'expert') {
      return contextualResponses.premiumMember;
    } else {
      return contextualResponses.returningUser;
    }
  }

  getUserProfile() {
    return { ...this.userProfile };
  }

  resetUserProfile() {
    this.userProfile = {
      preferences: {
        strength: null,
        flavors: [],
        occasions: [],
        budget: null,
        experience_level: 'intermediate',
      },
      history: {
        interactions: [],
        recommendations: [],
        purchases: [],
        favorites: [],
      },
    };

    this.conversationHistory = [];
    this.saveUserProfile();
  }

  // Cleanup method
  destroy() {
    if (this.speechRecognition) {
      this.speechRecognition.abort();
    }

    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }

    this.saveUserProfile();
    this.isInitialized = false;
  }
}

// Initialize enhanced AI concierge
const aiConciergeEnhanced = new AIConciergeEnhanced();

// Global access for integration
window.AIConciergeEnhanced = aiConciergeEnhanced;

export default aiConciergeEnhanced;
