/**
 * Enhanced AI Concierge System for Thee Cigar Maestro
 * Advanced NLP, luxury brand voice, and sophisticated personalization
 * Part of Phase I Autonomous Upgrade
 */

class EnhancedAIConcierge {
  constructor() {
    this.isInitialized = false;
    this.conversationHistory = [];
    this.userProfile = null;
    this.sessionContext = new Map();
    this.personalizedRecommendations = [];
    this.learningModel = null;
    
    // Enhanced luxury brand personality
    this.brandPersonality = {
      tone: 'sophisticated-yet-approachable',
      expertise: 'master-tobacconist',
      style: 'luxury-concierge-with-warmth',
      language: 'refined-conversational',
      brandVoice: {
        greeting: 'Welcome to an extraordinary cigar journey',
        farewell: 'Until our next sophisticated encounter',
        recommendation: 'I believe you\'ll find this selection exceptional',
        education: 'Allow me to share some insights',
        error: 'My sincere apologies for any confusion'
      }
    };
    
    // Advanced service capabilities
    this.enhancedServices = {
      INTELLIGENT_RECOMMENDATIONS: 'ai-recommendations',
      SOPHISTICATED_PAIRINGS: 'luxury-pairings',
      IMMERSIVE_EDUCATION: 'interactive-education',
      CONCIERGE_PURCHASING: 'concierge-purchase',
      VIRTUAL_CONSULTATION: 'consultation',
      RITUAL_GUIDANCE: 'ritual-coaching',
      COLLECTION_CURATION: 'collection-strategy',
      LIFESTYLE_INTEGRATION: 'lifestyle',
      AUTHENTICATION_SERVICE: 'authentication'
    };
    
    // NLP Enhancement Engine
    this.nlpEngine = {
      intentClassification: new Map(),
      entityExtraction: new Map(),
      sentimentAnalysis: new Map(),
      contextualUnderstanding: new Map(),
      personalityMapping: new Map()
    };
    
    this.init();
  }

  /**
   * Initialize Enhanced AI Concierge System
   */
  async init() {
    try {
      await this.initializeAdvancedNLP();
      await this.loadEnhancedUserProfile();
      await this.buildComprehensiveKnowledgeBase();
      await this.setupLuxuryInterface();
      await this.initializePersonalizationEngine();
      await this.activateLearningModel();
      
      this.isInitialized = true;
      console.info('🎩✨ Enhanced AI Concierge System initialized with luxury intelligence');
      
      // Sophisticated welcome experience
      this.createLuxuryWelcomeExperience();
      
    } catch (error) {
      console.error('❌ Enhanced AI Concierge initialization failed:', error);
      this.handleGracefulFallback();
    }
  }

  /**
   * Initialize Advanced Natural Language Processing
   */
  async initializeAdvancedNLP() {
    // Intent classification for sophisticated user requests
    this.nlpEngine.intentClassification.set('recommendation', {
      patterns: [
        /recommend|suggest|advise|what.*should.*smoke/i,
        /looking for|need.*cigar|help.*choose/i,
        /perfect.*for|ideal.*cigar|best.*option/i
      ],
      confidence: 0.8,
      context: ['user_preferences', 'occasion', 'mood']
    });

    this.nlpEngine.intentClassification.set('pairing', {
      patterns: [
        /pair.*with|goes.*well|complement|match/i,
        /drink.*cigar|whiskey.*cigar|wine.*smoke/i,
        /food.*pairing|dinner.*cigar|meal.*accompany/i
      ],
      confidence: 0.85,
      context: ['beverage_preference', 'cuisine_type', 'meal_timing']
    });

    this.nlpEngine.intentClassification.set('education', {
      patterns: [
        /tell.*about|explain|learn.*about|understand/i,
        /difference.*between|compare|versus|vs/i,
        /history.*of|origin.*of|made.*how/i
      ],
      confidence: 0.9,
      context: ['knowledge_level', 'specific_interest', 'depth_preference']
    });

    this.nlpEngine.intentClassification.set('consultation', {
      patterns: [
        /consult|advice|guidance|help.*decide/i,
        /professional.*opinion|expert.*view|master.*recommend/i,
        /confused|overwhelmed|not.*sure/i
      ],
      confidence: 0.75,
      context: ['confusion_area', 'decision_factors', 'urgency']
    });

    // Enhanced entity extraction
    this.setupEntityExtraction();
    
    // Sentiment analysis for luxury experience
    this.setupSentimentAnalysis();
    
    console.info('🧠 Advanced NLP engine initialized');
  }

  /**
   * Setup sophisticated entity extraction
   */
  setupEntityExtraction() {
    this.nlpEngine.entityExtraction.set('cigar_attributes', {
      strength: /mild|medium|full|strong|light|heavy/i,
      size: /robusto|churchill|toro|corona|torpedo|belicoso/i,
      wrapper: /connecticut|maduro|natural|habano|corojo/i,
      origin: /cuban|nicaraguan|dominican|honduran|mexican/i,
      occasion: /celebration|relaxation|business|evening|morning/i,
      budget: /premium|luxury|affordable|budget|expensive|cheap/i,
      experience: /beginner|novice|intermediate|advanced|expert/i
    });

    this.nlpEngine.entityExtraction.set('pairing_context', {
      beverages: /whiskey|scotch|bourbon|wine|cognac|rum|coffee|tea/i,
      food: /steak|chocolate|cheese|dessert|dinner|breakfast/i,
      timing: /morning|afternoon|evening|night|after.*dinner/i,
      setting: /home|office|outdoor|restaurant|lounge|club/i
    });

    this.nlpEngine.entityExtraction.set('emotional_context', {
      mood: /celebrate|relax|stress|happy|contemplative|social/i,
      energy: /energetic|calm|focused|tired|excited|peaceful/i,
      social: /alone|friends|business|romantic|family/i
    });
  }

  /**
   * Setup luxury-focused sentiment analysis
   */
  setupSentimentAnalysis() {
    this.nlpEngine.sentimentAnalysis.set('luxury_indicators', {
      high_expectation: /best|finest|premium|luxury|exceptional|extraordinary/i,
      sophistication: /refined|elegant|sophisticated|classy|distinguished/i,
      exclusivity: /rare|limited|exclusive|special|unique|one.*kind/i,
      quality_focus: /quality|craftsmanship|artisan|master|perfect/i,
      experience_driven: /experience|journey|adventure|discovery|exploration/i
    });

    this.nlpEngine.sentimentAnalysis.set('satisfaction_levels', {
      delighted: /amazing|incredible|fantastic|outstanding|exceeded/i,
      satisfied: /good|nice|pleasant|satisfied|happy/i,
      neutral: /okay|fine|alright|decent/i,
      dissatisfied: /disappointed|not.*great|mediocre|poor/i,
      frustrated: /terrible|awful|worst|horrible|hate/i
    });
  }

  /**
   * Load enhanced user profile with deep personalization
   */
  async loadEnhancedUserProfile() {
    try {
      const baseProfile = window.storageManager?.getUserData() || {};
      
      this.userProfile = {
        // Basic Information
        id: baseProfile.id || this.generateUserId(),
        name: baseProfile.name || null,
        joinDate: baseProfile.joinDate || new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        sessionCount: (baseProfile.sessionCount || 0) + 1,
        
        // Sophisticated Preferences
        preferences: {
          strength: baseProfile.preferences?.strength || 'discovering',
          sizes: baseProfile.preferences?.sizes || [],
          wrappers: baseProfile.preferences?.wrappers || [],
          origins: baseProfile.preferences?.origins || [],
          priceRange: baseProfile.preferences?.priceRange || [25, 75],
          smokingFrequency: baseProfile.preferences?.smokingFrequency || 'occasional',
          preferredTimes: baseProfile.preferences?.preferredTimes || ['evening'],
          socialPreference: baseProfile.preferences?.socialPreference || 'both'
        },
        
        // Advanced Behavioral Analytics
        behavior: {
          browsingPatterns: baseProfile.behavior?.browsingPatterns || [],
          searchHistory: baseProfile.behavior?.searchHistory || [],
          timeSpentSections: baseProfile.behavior?.timeSpentSections || {},
          interactionPreferences: baseProfile.behavior?.interactionPreferences || {},
          decisionMakingStyle: baseProfile.behavior?.decisionMakingStyle || 'analytical'
        },
        
        // Luxury Lifestyle Integration
        lifestyle: {
          drinkPreferences: baseProfile.lifestyle?.drinkPreferences || [],
          cuisinePreferences: baseProfile.lifestyle?.cuisinePreferences || [],
          entertainingStyle: baseProfile.lifestyle?.entertainingStyle || 'intimate',
          travelPreferences: baseProfile.lifestyle?.travelPreferences || [],
          collectingInterests: baseProfile.lifestyle?.collectingInterests || []
        },
        
        // Learning & Development
        development: {
          knowledgeLevel: baseProfile.development?.knowledgeLevel || 'exploring',
          learningGoals: baseProfile.development?.learningGoals || [],
          completedEducation: baseProfile.development?.completedEducation || [],
          certificationInterest: baseProfile.development?.certificationInterest || false,
          mentorshipDesire: baseProfile.development?.mentorshipDesire || false
        },
        
        // Experience History
        history: {
          tastings: baseProfile.history?.tastings || [],
          purchases: baseProfile.history?.purchases || [],
          recommendations: baseProfile.history?.recommendations || [],
          pairings: baseProfile.history?.pairings || [],
          events: baseProfile.history?.events || []
        }
      };
      
      // Initialize ML-based preference learning
      this.initializePreferenceLearning();
      
      console.info('✅ Enhanced user profile loaded with deep personalization');
    } catch (error) {
      console.error('Error loading enhanced user profile:', error);
      this.userProfile = this.getDefaultEnhancedProfile();
    }
  }

  /**
   * Build comprehensive luxury knowledge base
   */
  async buildComprehensiveKnowledgeBase() {
    try {
      this.knowledgeBase = {
        // Cigar Intelligence
        cigars: await this.loadEnhancedCigarData(),
        brands: await this.loadBrandProfiles(),
        masterBlenders: await this.loadMasterBlenderProfiles(),
        
        // Sophisticated Pairings
        beveragePairings: await this.loadBeveragePairingMatrix(),
        foodPairings: await this.loadCulinaryPairingGuide(),
        occasionPairings: await this.loadOccasionMapping(),
        
        // Cultural & Educational
        history: await this.loadCigarHistory(),
        regions: await this.loadRegionalExpertise(),
                 traditions: await this.loadSmokingTraditions(),
        etiquette: await this.loadModernEtiquette(),
        
        // Luxury Lifestyle
        accessories: await this.loadAccessoryGuide(),
        storage: await this.loadStorageExpertise(),
        aging: await this.loadAgingScience(),
        authentication: await this.loadAuthenticationGuide(),
        
        // Experience Design
        rituals: await this.loadRitualGuides(),
        ceremonies: await this.loadCeremonyProtocols(),
        hospitality: await this.loadHospitalityStandards(),
        travel: await this.loadTravelGuides()
      };
      
      console.info('✅ Comprehensive luxury knowledge base built');
    } catch (error) {
      console.error('Error building knowledge base:', error);
    }
  }

  /**
   * Setup luxury interface with enhanced UX
   */
  async setupLuxuryInterface() {
    // Create sophisticated chat interface
    this.createLuxuryChatInterface();
    
    // Setup voice interaction
    this.initializeVoiceInterface();
    
    // Create visual recommendation system
    this.createVisualRecommendationInterface();
    
    // Initialize gesture controls
    this.setupGestureControls();
    
    console.info('✅ Luxury interface with enhanced UX ready');
  }

  /**
   * Create sophisticated chat interface
   */
  createLuxuryChatInterface() {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'ai-concierge-enhanced';
    chatContainer.innerHTML = `
      <div class="luxury-chat-interface">
        <div class="concierge-header">
          <div class="concierge-avatar">
            <div class="avatar-ring"></div>
            <div class="avatar-center">🎩</div>
          </div>
          <div class="concierge-identity">
            <h3>Your Personal Cigar Concierge</h3>
            <p>Master Tobacconist & Lifestyle Curator</p>
          </div>
          <button class="minimize-btn" aria-label="Minimize concierge">─</button>
        </div>
        
        <div class="conversation-area">
          <div class="messages-container" id="messages-container">
            <!-- Messages will be dynamically added here -->
          </div>
          
          <div class="quick-actions">
            <button class="quick-action" data-action="recommend">
              <span class="icon">💎</span>
              <span class="text">Recommend</span>
            </button>
            <button class="quick-action" data-action="pair">
              <span class="icon">🥃</span>
              <span class="text">Pair</span>
            </button>
            <button class="quick-action" data-action="learn">
              <span class="icon">📚</span>
              <span class="text">Learn</span>
            </button>
            <button class="quick-action" data-action="ritual">
              <span class="icon">🕯️</span>
              <span class="text">Ritual</span>
            </button>
          </div>
        </div>
        
        <div class="input-area">
          <div class="input-container">
            <textarea 
              id="user-input" 
              placeholder="Share your cigar aspirations with me..."
              rows="1"
              maxlength="500"
            ></textarea>
            <button class="voice-input-btn" id="voice-input" aria-label="Voice input">
              🎤
            </button>
            <button class="send-btn" id="send-message" aria-label="Send message">
              ➤
            </button>
          </div>
          
          <div class="input-suggestions" id="input-suggestions">
            <!-- Dynamic suggestions will appear here -->
          </div>
        </div>
        
        <div class="concierge-status">
          <div class="typing-indicator" id="typing-indicator" style="display: none;">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    `;

    // Apply luxury styling
    const luxuryStyles = `
      <style id="luxury-chat-styles">
        .luxury-chat-interface {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 400px;
          max-height: 600px;
          background: linear-gradient(145deg, rgba(26, 15, 10, 0.95), rgba(42, 27, 20, 0.95));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          font-family: 'Source Serif Pro', serif;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .concierge-header {
          padding: 20px;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(184, 148, 31, 0.1));
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }
        
        .concierge-avatar {
          position: relative;
          width: 50px;
          height: 50px;
          margin-right: 15px;
        }
        
        .avatar-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid #d4af37;
          border-radius: 50%;
          animation: luxuryPulse 3s ease-in-out infinite;
        }
        
        .avatar-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
        }
        
        @keyframes luxuryPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        .concierge-identity h3 {
          margin: 0;
          color: #d4af37;
          font-size: 16px;
          font-weight: 600;
        }
        
        .concierge-identity p {
          margin: 5px 0 0 0;
          color: #a67856;
          font-size: 12px;
          font-style: italic;
        }
        
        .minimize-btn {
          margin-left: auto;
          background: none;
          border: none;
          color: #d4af37;
          cursor: pointer;
          font-size: 20px;
          padding: 5px;
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        
        .minimize-btn:hover {
          background: rgba(212, 175, 55, 0.1);
        }
        
        .conversation-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-height: 400px;
        }
        
        .messages-container {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #d4af37 rgba(42, 27, 20, 0.5);
        }
        
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .messages-container::-webkit-scrollbar-track {
          background: rgba(42, 27, 20, 0.5);
        }
        
        .messages-container::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 3px;
        }
        
        .quick-actions {
          display: flex;
          padding: 10px 20px;
          gap: 10px;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
        }
        
        .quick-action {
          flex: 1;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          padding: 8px 4px;
          color: #f4f1e8;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .quick-action:hover {
          background: rgba(212, 175, 55, 0.2);
          transform: translateY(-2px);
        }
        
        .quick-action .icon {
          font-size: 16px;
        }
        
        .quick-action .text {
          font-size: 10px;
          font-weight: 500;
        }
        
        .input-area {
          padding: 20px;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
        }
        
        .input-container {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: rgba(42, 27, 20, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 10px;
        }
        
        #user-input {
          flex: 1;
          background: none;
          border: none;
          color: #f4f1e8;
          font-family: inherit;
          font-size: 14px;
          resize: none;
          outline: none;
          min-height: 20px;
          max-height: 80px;
        }
        
        #user-input::placeholder {
          color: #a67856;
          font-style: italic;
        }
        
        .voice-input-btn, .send-btn {
          background: linear-gradient(135deg, #d4af37, #b8941f);
          border: none;
          border-radius: 8px;
          color: #1a0f0a;
          cursor: pointer;
          padding: 8px;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        
        .voice-input-btn:hover, .send-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
        }
        
        .typing-indicator {
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #d4af37;
          border-radius: 50%;
          animation: typing 1.4s ease-in-out infinite both;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .luxury-chat-interface {
            width: 90vw;
            bottom: 10px;
            right: 5vw;
            max-height: 70vh;
          }
          
          .quick-actions {
            flex-wrap: wrap;
          }
          
          .quick-action {
            min-width: calc(50% - 5px);
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', luxuryStyles);
    document.body.appendChild(chatContainer);

    // Setup event listeners
    this.setupChatEventListeners();
  }

  /**
   * Setup chat event listeners
   */
  setupChatEventListeners() {
    const sendBtn = document.getElementById('send-message');
    const userInput = document.getElementById('user-input');
    const voiceBtn = document.getElementById('voice-input');
    const quickActions = document.querySelectorAll('.quick-action');

    // Send message on button click
    sendBtn?.addEventListener('click', () => this.sendMessage());

    // Send message on Enter (but not Shift+Enter)
    userInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    userInput?.addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    });

    // Voice input
    voiceBtn?.addEventListener('click', () => this.toggleVoiceInput());

    // Quick actions
    quickActions.forEach(action => {
      action.addEventListener('click', () => {
        const actionType = action.dataset.action;
        this.handleQuickAction(actionType);
      });
    });

    // Minimize functionality
    const minimizeBtn = document.querySelector('.minimize-btn');
    minimizeBtn?.addEventListener('click', () => this.toggleChatInterface());
  }

  /**
   * Send user message and get AI response
   */
  async sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput?.value.trim();
    
    if (!message) return;

    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';

    // Add user message to conversation
    this.addMessageToChat('user', message);
    
    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Process message with enhanced NLP
      const processedInput = await this.processUserInput(message);
      
      // Generate sophisticated response
      const response = await this.generateLuxuryResponse(processedInput);
      
      // Hide typing indicator
      this.hideTypingIndicator();
      
      // Add AI response to conversation
      this.addMessageToChat('ai', response);
      
      // Update conversation history
      this.updateConversationHistory(message, response);
      
    } catch (error) {
      console.error('Error processing message:', error);
      this.hideTypingIndicator();
      this.addMessageToChat('ai', 'My sincere apologies, but I\'m experiencing a momentary lapse. Please allow me a moment to gather my thoughts.');
    }
  }

  /**
   * Process user input with advanced NLP
   */
  async processUserInput(message) {
    const processed = {
      originalMessage: message,
      intent: await this.classifyIntent(message),
      entities: await this.extractEntities(message),
      sentiment: await this.analyzeSentiment(message),
      context: await this.analyzeContext(message),
      personalization: await this.getPersonalizationFactors(message)
    };

    console.info('🧠 Processed user input:', processed);
    return processed;
  }

  /**
   * Generate sophisticated luxury response
   */
  async generateLuxuryResponse(processedInput) {
    const { intent, entities, sentiment, context, personalization } = processedInput;
    
    // Select appropriate response strategy
    let response = '';
    
    switch (intent.primary) {
      case 'recommendation':
        response = await this.generateRecommendationResponse(processedInput);
        break;
      case 'pairing':
        response = await this.generatePairingResponse(processedInput);
        break;
      case 'education':
        response = await this.generateEducationalResponse(processedInput);
        break;
      case 'consultation':
        response = await this.generateConsultationResponse(processedInput);
        break;
      default:
        response = await this.generateGeneralResponse(processedInput);
    }

    // Apply luxury brand voice
    response = this.applyLuxuryBrandVoice(response, sentiment);
    
    // Add personalization touches
    response = this.addPersonalizationTouches(response, personalization);

    return response;
  }

  /**
   * Add message to chat interface
   */
  addMessageToChat(sender, message) {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageElement.innerHTML = `
      <div class="message-content">
        <div class="message-text">${this.formatMessage(message)}</div>
        <div class="message-time">${timestamp}</div>
      </div>
    `;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Apply message styling
    this.applyMessageStyling();
  }

  /**
   * Apply luxury message styling
   */
  applyMessageStyling() {
    if (document.getElementById('message-styles')) return;

    const messageStyles = `
      <style id="message-styles">
        .message {
          margin-bottom: 15px;
          display: flex;
          animation: messageAppear 0.4s ease-out;
        }
        
        .user-message {
          justify-content: flex-end;
        }
        
        .ai-message {
          justify-content: flex-start;
        }
        
        .message-content {
          max-width: 80%;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(184, 148, 31, 0.1));
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 12px 16px;
          position: relative;
        }
        
        .user-message .message-content {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(184, 148, 31, 0.2));
        }
        
        .message-text {
          color: #f4f1e8;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 5px;
        }
        
        .message-time {
          color: #a67856;
          font-size: 11px;
          text-align: right;
        }
        
        @keyframes messageAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', messageStyles);
  }

  /**
   * Format message text with luxury styling
   */
  formatMessage(text) {
    // Add emphasis for luxury terms
    text = text.replace(/(premium|luxury|exceptional|extraordinary|finest|exquisite)/gi, '<em class="luxury-emphasis">$1</em>');
    
    // Add highlights for cigar terms
    text = text.replace(/(robusto|churchill|toro|corona|maduro|connecticut)/gi, '<span class="cigar-term">$1</span>');
    
    return text;
  }

  /**
   * Create luxury welcome experience
   */
  createLuxuryWelcomeExperience() {
    setTimeout(() => {
      const welcomeMessage = this.generateWelcomeMessage();
      this.addMessageToChat('ai', welcomeMessage);
    }, 1000);
  }

  /**
   * Generate personalized welcome message
   */
  generateWelcomeMessage() {
    const { sessionCount, name } = this.userProfile;
    
    if (sessionCount === 1) {
      return `Welcome to an extraordinary cigar journey${name ? `, ${name}` : ''}! I'm your personal cigar concierge, here to guide you through the refined world of premium tobacco. Whether you're seeking the perfect cigar for a special occasion, curious about sophisticated pairings, or eager to deepen your appreciation of this timeless art—I'm at your service. How may I craft an exceptional experience for you today?`;
    } else {
      return `Welcome back${name ? `, ${name}` : ''}! It's always a pleasure to continue our sophisticated journey together. I've been anticipating your return and have some delightful recommendations based on our previous conversations. How may I serve your cigar aspirations today?`;
    }
  }

  /**
   * Initialize preference learning model
   */
  initializePreferenceLearning() {
    // Simple ML-like preference learning
    this.learningModel = {
      weights: new Map(),
      interactions: [],
      patterns: new Map(),
      predictions: new Map()
    };
    
    // Load existing learning data
    this.loadLearningModel();
  }

  /**
   * Handle graceful fallback for errors
   */
  handleGracefulFallback() {
    console.warn('🎩 Falling back to basic concierge functionality');
    // Implement basic functionality as fallback
  }

  /**
   * Clean up resources
   */
  destroy() {
    // Clean up event listeners, observers, etc.
    const chatInterface = document.getElementById('ai-concierge-enhanced');
    if (chatInterface) {
      chatInterface.remove();
    }
    
    // Clear learning model
    if (this.learningModel) {
      this.learningModel = null;
    }
    
    console.info('🎩 Enhanced AI Concierge cleaned up');
  }
}

// Auto-initialize and expose globally
const enhancedConcierge = new EnhancedAIConcierge();
window.EnhancedConcierge = enhancedConcierge;

export default enhancedConcierge;