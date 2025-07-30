/**
 * AI Concierge System for Thee Cigar Maestro
 * Luxury AI-powered personal cigar concierge service
 */

class AIConciergeSystem {
  constructor() {
    this.isInitialized = false;
    this.conversationHistory = [];
    this.userProfile = null;
    this.currentContext = null;
    this.recommendations = [];
    
    // AI Personality and Knowledge Base
    this.personality = {
      tone: 'sophisticated',
      expertise: 'master-sommelier',
      style: 'luxury-concierge',
      language: 'refined-professional'
    };
    
    // Service Categories
    this.services = {
      RECOMMENDATIONS: 'recommendations',
      PAIRINGS: 'pairings',
      EDUCATION: 'education',
      PURCHASE_ADVICE: 'purchase',
      COLLECTION_MANAGEMENT: 'collection',
      EVENT_PLANNING: 'events',
      CUSTOMER_SUPPORT: 'support'
    };
    
    this.init();
  }

  /**
   * Initialize the AI Concierge System
   */
  async init() {
    try {
      await this.loadUserProfile();
      await this.initializeKnowledgeBase();
      await this.setupConversationInterface();
      
      this.isInitialized = true;
      console.info('🎩 AI Concierge System initialized');
      
      // Welcome message for new users
      if (!this.userProfile || this.userProfile.visits === 1) {
        this.showWelcomeExperience();
      }
      
    } catch (error) {
      console.error('❌ AI Concierge initialization failed:', error);
    }
  }

  /**
   * Load user profile and preferences
   */
  async loadUserProfile() {
    try {
      if (window.storageManager) {
        const userData = window.storageManager.getUserData();
        this.userProfile = {
          preferences: userData.preferences || {},
          tastingHistory: userData.tastingHistory || [],
          favoriteBlends: userData.favoriteBlends || [],
          smokingExperience: userData.smokingExperience || 'beginner',
          preferredStrength: userData.preferredStrength || 'medium',
          budgetRange: userData.budgetRange || 'moderate',
          occasionPreferences: userData.occasionPreferences || [],
          visits: userData.visits || 1
        };
      }
      
      console.info('✅ User profile loaded for AI Concierge');
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.userProfile = this.getDefaultProfile();
    }
  }

  /**
   * Initialize comprehensive knowledge base
   */
  async initializeKnowledgeBase() {
    try {
      // Load cigar data and pairing information
      this.knowledgeBase = {
        cigars: await this.loadCigarDatabase(),
        pairings: await this.loadPairingDatabase(),
        regions: await this.loadRegionDatabase(),
        occasions: await this.loadOccasionDatabase(),
        etiquette: await this.loadEtiquetteGuide(),
        terminology: await this.loadTerminologyGuide()
      };
      
      console.info('✅ Knowledge base initialized');
    } catch (error) {
      console.error('Error initializing knowledge base:', error);
    }
  }

  /**
   * Setup conversation interface
   */
  async setupConversationInterface() {
    this.createConciergeInterface();
    this.attachEventHandlers();
    this.loadConversationHistory();
  }

  /**
   * Create the luxury concierge interface
   */
  createConciergeInterface() {
    const conciergeHTML = `
      <div id="aiConciergeModal" class="concierge-modal" style="display: none;">
        <div class="concierge-container">
          <div class="concierge-header">
            <div class="concierge-avatar">
              <div class="avatar-image">🎩</div>
              <div class="concierge-info">
                <h3>Your Personal Cigar Concierge</h3>
                <p class="concierge-status">Available to assist you</p>
              </div>
            </div>
            <button class="close-concierge" onclick="window.aiConcierge.hide()">×</button>
          </div>
          
          <div class="concierge-chat" id="conciergeChat">
            <div class="welcome-message">
              <div class="message concierge-message">
                <div class="message-content">
                  <p>Welcome to Thee Cigar Maestro. I'm your personal cigar concierge, here to guide you through the art, ritual, and mastery of premium cigars.</p>
                  <p>How may I elevate your cigar experience today?</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="quick-services">
            <button class="service-btn" onclick="window.aiConcierge.startService('recommendations')">
              🎯 Get Recommendations
            </button>
            <button class="service-btn" onclick="window.aiConcierge.startService('pairings')">
              🍷 Pairing Advice
            </button>
            <button class="service-btn" onclick="window.aiConcierge.startService('education')">
              📚 Learn & Discover
            </button>
            <button class="service-btn" onclick="window.aiConcierge.startService('collection')">
              🏛️ Manage Collection
            </button>
          </div>
          
          <div class="concierge-input">
            <div class="input-container">
              <textarea 
                id="conciergeInput" 
                placeholder="Ask me anything about cigars, pairings, or your collection..."
                rows="2"
              ></textarea>
              <button class="send-btn" onclick="window.aiConcierge.sendMessage()">
                <span class="send-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inject into DOM
    document.body.insertAdjacentHTML('beforeend', conciergeHTML);
    
    // Add luxury styling
    this.addConciergeStyles();
  }

  /**
   * Add luxury styling for the concierge
   */
  addConciergeStyles() {
    const styles = `
      <style>
        .concierge-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(26, 15, 10, 0.9);
          backdrop-filter: blur(20px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .concierge-modal.show {
          opacity: 1;
        }

        .concierge-container {
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          background: linear-gradient(135deg, var(--secondary-bg) 0%, var(--accent-bg) 100%);
          border: 3px solid var(--gold-primary);
          border-radius: var(--border-radius-large);
          box-shadow: var(--luxury-shadow);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .concierge-header {
          padding: 1.5rem 2rem;
          background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
          color: var(--deep-brown);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .concierge-avatar {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar-image {
          width: 60px;
          height: 60px;
          background: var(--deep-brown);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          border: 2px solid var(--cream-primary);
        }

        .concierge-info h3 {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 600;
        }

        .concierge-status {
          margin: 0.2rem 0 0 0;
          font-family: var(--font-accent);
          font-style: italic;
          opacity: 0.8;
        }

        .close-concierge {
          background: var(--deep-brown);
          color: var(--gold-primary);
          border: 2px solid var(--cream-primary);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 1.5rem;
          cursor: pointer;
          transition: var(--smooth-transition);
        }

        .close-concierge:hover {
          background: var(--cream-primary);
          color: var(--deep-brown);
        }

        .concierge-chat {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          max-height: 400px;
          min-height: 300px;
        }

        .message {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .concierge-message {
          align-items: flex-start;
        }

        .user-message {
          align-items: flex-end;
        }

        .message-content {
          max-width: 80%;
          padding: 1rem 1.5rem;
          border-radius: var(--border-radius);
          font-family: var(--font-body);
          line-height: 1.6;
        }

        .concierge-message .message-content {
          background: linear-gradient(135deg, var(--leather-bg), var(--accent-bg));
          color: var(--cream-primary);
          border: 1px solid var(--gold-primary);
        }

        .user-message .message-content {
          background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
          color: var(--deep-brown);
        }

        .quick-services {
          padding: 1rem 1.5rem;
          background: var(--accent-bg);
          border-top: 1px solid var(--gold-primary);
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .service-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          color: var(--gold-primary);
          border: 1px solid var(--gold-primary);
          border-radius: var(--border-radius);
          font-family: var(--font-body);
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--smooth-transition);
        }

        .service-btn:hover {
          background: var(--gold-primary);
          color: var(--deep-brown);
        }

        .concierge-input {
          padding: 1.5rem;
          background: var(--secondary-bg);
          border-top: 1px solid var(--gold-primary);
        }

        .input-container {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        #conciergeInput {
          flex: 1;
          background: var(--accent-bg);
          color: var(--cream-primary);
          border: 2px solid var(--gold-primary);
          border-radius: var(--border-radius);
          padding: 1rem;
          font-family: var(--font-body);
          font-size: 1rem;
          resize: vertical;
          min-height: 50px;
        }

        #conciergeInput:focus {
          outline: none;
          border-color: var(--gold-accent);
          box-shadow: var(--gold-shadow);
        }

        .send-btn {
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
          color: var(--deep-brown);
          border: none;
          border-radius: var(--border-radius);
          font-size: 1.2rem;
          cursor: pointer;
          transition: var(--smooth-transition);
          min-width: 60px;
        }

        .send-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--gold-shadow);
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          color: var(--muted-text);
          font-style: italic;
        }

        .typing-dots {
          display: flex;
          gap: 0.2rem;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: var(--gold-primary);
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% { opacity: 0.3; }
          30% { opacity: 1; }
        }

        @media (max-width: 768px) {
          .concierge-container {
            width: 95%;
            max-height: 95vh;
          }
          
          .concierge-header {
            padding: 1rem 1.5rem;
          }
          
          .avatar-image {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }
          
          .concierge-info h3 {
            font-size: 1.1rem;
          }
          
          .quick-services {
            padding: 0.8rem 1rem;
          }
          
          .service-btn {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  /**
   * Show the concierge interface
   */
  show() {
    const modal = document.getElementById('aiConciergeModal');
    if (modal) {
      modal.style.display = 'flex';
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
      
      // Focus on input
      setTimeout(() => {
        document.getElementById('conciergeInput')?.focus();
      }, 500);
    }
  }

  /**
   * Hide the concierge interface
   */
  hide() {
    const modal = document.getElementById('aiConciergeModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 400);
    }
  }

  /**
   * Start a specific service conversation
   */
  startService(serviceType) {
    this.currentContext = serviceType;
    
    const serviceMessages = {
      recommendations: "I'd be delighted to provide personalized cigar recommendations. Tell me about your preferences, the occasion, or let me suggest something based on your previous tastings.",
      pairings: "Excellent choice! Pairing cigars with spirits, coffee, or food can elevate your experience tremendously. What would you like to pair with your cigar today?",
      education: "Knowledge is the foundation of appreciation. What aspect of cigar culture would you like to explore? Origins, construction, tasting techniques, or perhaps the history of renowned makers?",
      collection: "Managing a cigar collection is an art in itself. Would you like guidance on storage, aging, inventory management, or building a well-rounded collection?"
    };

    this.addMessage(serviceMessages[serviceType] || "How may I assist you today?", 'concierge');
  }

  /**
   * Send user message
   */
  async sendMessage() {
    const input = document.getElementById('conciergeInput');
    const userMessage = input.value.trim();
    
    if (!userMessage) return;
    
    // Add user message
    this.addMessage(userMessage, 'user');
    input.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    try {
      // Process message and get AI response
      const response = await this.processMessage(userMessage);
      
      // Remove typing indicator and add response
      this.hideTypingIndicator();
      this.addMessage(response, 'concierge');
      
      // Save conversation
      this.saveConversation();
      
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage("I apologize, but I'm experiencing some difficulty at the moment. Please try again.", 'concierge');
      console.error('Error processing message:', error);
    }
  }

  /**
   * Process user message and generate AI response
   */
  async processMessage(userMessage) {
    // Store message in conversation history
    this.conversationHistory.push({
      type: 'user',
      message: userMessage,
      timestamp: new Date(),
      context: this.currentContext
    });

    // Analyze user intent
    const intent = await this.analyzeIntent(userMessage);
    
    // Generate contextual response
    const response = await this.generateResponse(userMessage, intent);
    
    return response;
  }

  /**
   * Analyze user intent from message
   */
  async analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Intent patterns
    const intents = {
      recommendation: ['recommend', 'suggest', 'what should', 'help me choose', 'looking for'],
      pairing: ['pair', 'match', 'goes with', 'drink with', 'complement'],
      education: ['learn', 'teach', 'explain', 'what is', 'how to', 'tell me about'],
      purchase: ['buy', 'purchase', 'price', 'cost', 'where can i get'],
      collection: ['humidor', 'store', 'age', 'collection', 'organize'],
      occasion: ['special occasion', 'celebration', 'anniversary', 'wedding', 'business']
    };

    for (const [intent, patterns] of Object.entries(intents)) {
      if (patterns.some(pattern => lowerMessage.includes(pattern))) {
        return intent;
      }
    }

    return 'general';
  }

  /**
   * Generate AI response based on message and intent
   */
  async generateResponse(message, intent) {
    // Use existing AI recommendation engine if available
    let aiResponse = '';

    switch (intent) {
      case 'recommendation':
        aiResponse = await this.generateRecommendationResponse(message);
        break;
      case 'pairing':
        aiResponse = await this.generatePairingResponse(message);
        break;
      case 'education':
        aiResponse = await this.generateEducationResponse(message);
        break;
      case 'purchase':
        aiResponse = await this.generatePurchaseResponse(message);
        break;
      case 'collection':
        aiResponse = await this.generateCollectionResponse(message);
        break;
      case 'occasion':
        aiResponse = await this.generateOccasionResponse(message);
        break;
      default:
        aiResponse = await this.generateGeneralResponse(message);
    }

    // Store AI response
    this.conversationHistory.push({
      type: 'concierge',
      message: aiResponse,
      timestamp: new Date(),
      context: this.currentContext,
      intent: intent
    });

    return aiResponse;
  }

  /**
   * Generate recommendation response
   */
  async generateRecommendationResponse(message) {
    // Use AI recommendation engine
    if (window.aiRecommendationEngine && window.aiRecommendationEngine.isInitialized) {
      try {
        const recommendations = await window.aiRecommendationEngine.getPersonalizedRecommendations(
          this.userProfile, 
          3
        );
        
        if (recommendations.length > 0) {
          let response = "Based on your preferences and profile, I recommend these exceptional cigars:\n\n";
          
          recommendations.forEach((rec, index) => {
            response += `${index + 1}. **${rec.name}** (${rec.wrapper} wrapper)\n`;
            response += `   Strength: ${rec.strength} | Flavor Profile: ${rec.flavorProfile}\n`;
            response += `   ${rec.description}\n\n`;
          });
          
          response += "Would you like more details about any of these, or shall I suggest pairings?";
          return response;
        }
      } catch (error) {
        console.error('Error getting recommendations:', error);
      }
    }
    
    // Fallback response
    return "I'd be delighted to provide personalized recommendations. To better serve you, could you tell me about your preferred strength (mild, medium, full), any favorite flavor notes, or the occasion for smoking?";
  }

  /**
   * Generate pairing response
   */
  async generatePairingResponse(message) {
    const pairingAdvice = [
      "For a classic pairing, try a medium-bodied Connecticut wrapper with aged rum or single malt scotch.",
      "Maduro wrappers pair beautifully with coffee, particularly espresso or dark roast blends.",
      "For evening relaxation, consider a full-bodied Habano with aged cognac or port wine.",
      "Lighter cigars complement champagne or white wine for celebratory occasions."
    ];
    
    const randomPairing = pairingAdvice[Math.floor(Math.random() * pairingAdvice.length)];
    
    return `Pairing cigars enhances both experiences tremendously. ${randomPairing}\n\nWhat specific cigar or beverage are you looking to pair? I can provide more targeted recommendations.`;
  }

  /**
   * Generate education response
   */
  async generateEducationResponse(message) {
    return "I'm here to share the rich knowledge of cigar craftsmanship. Would you like to learn about:\n\n• **Construction**: The anatomy of a premium cigar\n• **Regions**: Tobacco terroir and growing regions\n• **Aging**: How time develops flavor complexity\n• **Tasting**: Proper techniques for evaluation\n• **History**: The heritage of great cigar houses\n\nWhat interests you most?";
  }

  /**
   * Generate purchase response
   */
  async generatePurchaseResponse(message) {
    return "I can guide you toward exceptional cigars within your budget and preferences. Our curated selection includes both accessible premium options and rare collectibles.\n\nTo provide the best purchasing advice, please share:\n• Your budget range\n• Preferred strength and flavor profile\n• Intended occasion (daily enjoyment, special celebration, etc.)\n\nI'll then recommend specific cigars and trusted sources.";
  }

  /**
   * Generate collection response
   */
  async generateCollectionResponse(message) {
    return "Building and maintaining a cigar collection is both art and science. I can help with:\n\n• **Storage**: Optimal humidity and temperature control\n• **Organization**: Cataloging and rotation systems\n• **Aging**: Which cigars benefit from extended aging\n• **Variety**: Building a well-rounded collection\n• **Insurance**: Protecting valuable investments\n\nWhat aspect of collection management interests you most?";
  }

  /**
   * Generate occasion response
   */
  async generateOccasionResponse(message) {
    return "Special occasions deserve exceptional cigars. Whether celebrating achievements, hosting guests, or marking milestones, the right cigar enhances the moment.\n\nTell me about your occasion, and I'll suggest cigars that match the significance and setting. Consider factors like:\n• Duration of the event\n• Indoor or outdoor setting\n• Guest preferences\n• Level of formality";
  }

  /**
   * Generate general response
   */
  async generateGeneralResponse(message) {
    const generalResponses = [
      "I'm here to enhance your cigar journey in every way possible. Whether you seek recommendations, education, or collection guidance, I'm at your service.",
      "The world of premium cigars offers endless discovery. How may I assist you in exploring this refined pleasure?",
      "Every cigar tells a story of craftsmanship, tradition, and terroir. What story would you like to explore today?"
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }

  /**
   * Add message to chat
   */
  addMessage(content, sender) {
    const chat = document.getElementById('conciergeChat');
    if (!chat) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Format message content (support for markdown-like formatting)
    const formattedContent = this.formatMessageContent(content);
    contentDiv.innerHTML = formattedContent;
    
    messageDiv.appendChild(contentDiv);
    chat.appendChild(messageDiv);
    
    // Scroll to bottom
    chat.scrollTop = chat.scrollHeight;
  }

  /**
   * Format message content
   */
  formatMessageContent(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    const chat = document.getElementById('conciergeChat');
    if (!chat) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <span>Your concierge is thinking</span>
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;
  }

  /**
   * Hide typing indicator
   */
  hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }

  /**
   * Show welcome experience for new users
   */
  showWelcomeExperience() {
    setTimeout(() => {
      this.show();
      setTimeout(() => {
        this.addMessage("Welcome to the world's most sophisticated cigar platform. I'm delighted to be your personal concierge on this journey of discovery and refinement.", 'concierge');
        
        setTimeout(() => {
          this.addMessage("I'm here to provide personalized recommendations, expert pairing advice, and guide you through the rich traditions of cigar appreciation. Shall we begin with understanding your preferences?", 'concierge');
        }, 2000);
      }, 1000);
    }, 2000);
  }

  /**
   * Load conversation history
   */
  loadConversationHistory() {
    if (window.storageManager) {
      const history = window.storageManager.getSessionData().conciergeHistory || [];
      this.conversationHistory = history;
      
      // Restore recent messages
      const recentMessages = history.slice(-6); // Last 6 messages
      recentMessages.forEach(msg => {
        if (msg.message) {
          this.addMessage(msg.message, msg.type);
        }
      });
    }
  }

  /**
   * Save conversation
   */
  saveConversation() {
    if (window.storageManager) {
      window.storageManager.saveSessionData({
        conciergeHistory: this.conversationHistory
      });
    }
  }

  /**
   * Attach event handlers
   */
  attachEventHandlers() {
    // Enter key to send message
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.id === 'conciergeInput') {
        if (e.shiftKey) {
          // Allow line break with Shift+Enter
          return;
        }
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('aiConciergeModal').classList.contains('show')) {
        this.hide();
      }
    });
  }

  /**
   * Get default user profile
   */
  getDefaultProfile() {
    return {
      preferences: {},
      tastingHistory: [],
      favoriteBlends: [],
      smokingExperience: 'beginner',
      preferredStrength: 'medium',
      budgetRange: 'moderate',
      occasionPreferences: [],
      visits: 1
    };
  }

  /**
   * Load database methods (stubs for now)
   */
  async loadCigarDatabase() {
    try {
      const response = await fetch('./cigar-specs.json');
      return response.ok ? await response.json() : {};
    } catch (error) {
      console.error('Error loading cigar database:', error);
      return {};
    }
  }

  async loadPairingDatabase() {
    try {
      const response = await fetch('./pairings.json');
      return response.ok ? await response.json() : {};
    } catch (error) {
      console.error('Error loading pairing database:', error);
      return {};
    }
  }

  async loadRegionDatabase() {
    return {
      cuba: { characteristics: 'Rich, earthy, complex' },
      dominican: { characteristics: 'Smooth, balanced, accessible' },
      nicaragua: { characteristics: 'Bold, spicy, full-bodied' },
      honduras: { characteristics: 'Medium to full, earthy undertones' }
    };
  }

  async loadOccasionDatabase() {
    return {
      morning: { recommendations: ['mild Connecticut wrappers', 'light breakfast blends'] },
      afternoon: { recommendations: ['medium-bodied cigars', 'natural wrappers'] },
      evening: { recommendations: ['full-bodied maduro', 'aged reserves'] },
      celebration: { recommendations: ['premium reserves', 'limited editions'] }
    };
  }

  async loadEtiquetteGuide() {
    return {
      cutting: 'Use sharp, clean cuts to preserve the cap structure',
      lighting: 'Toast the foot evenly before drawing',
      smoking: 'Allow natural ash buildup, smoke slowly and deliberately'
    };
  }

  async loadTerminologyGuide() {
    return {
      wrapper: 'The outermost leaf that defines appearance and initial flavor',
      binder: 'Holds the filler together and contributes to burn characteristics',
      filler: 'The heart of the cigar, providing core flavors and strength'
    };
  }
}

// Initialize AI Concierge System
window.aiConcierge = new AIConciergeSystem();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIConciergeSystem;
}