/* global MediaRecorder, FileReader */

/**
 * Enhanced Cigar Detail Modal for Thee Cigar Maestro
 * Provides comprehensive cigar information, pairings, reviews, and interactive features
 */

class EnhancedCigarModal {
  constructor(uiManager, dataManager) {
    this.uiManager = uiManager;
    this.dataManager = dataManager;
    this.currentCigar = null;
    this.userRating = 0;
    this.tastingNotes = '';
    this.isRecording = false;
    this.recordingData = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    console.info('🚬 Enhanced Cigar Modal initialized');
  }

  setupEventListeners() {
    // Listen for cigar selection events
    window.addEventListener('cigarSelected', event => {
      this.showCigarDetails(event.detail.cigar);
    });
  }

  showCigarDetails(cigar) {
    this.currentCigar = cigar;
    const cigarData = cigar.userData;

    // Get additional data
    const pairings = this.dataManager.getCigarPairings(cigarData.name);
    const emotionalContext = this.dataManager.getEmotionalContext(cigarData.wrapper);

    const modalContent = this.generateModalContent(cigarData, pairings, emotionalContext);

    this.uiManager.showModal(`🚬 ${cigarData.name}`, modalContent, 'large');
    this.addModalStyles();
    this.setupModalEventListeners();
  }

  generateModalContent(cigar, pairings, emotional) {
    return `
      <div class="enhanced-cigar-modal">
        <!-- Header Section -->
        <div class="cigar-header">
          <div class="cigar-visual">
            <div class="cigar-preview" style="background-color: ${this.getWrapperColor(cigar.wrapper)}">
              <div class="cigar-shape"></div>
            </div>
            <div class="cigar-rating">
              <div class="star-rating" data-rating="${this.getUserRating(cigar.name)}">
                ${this.generateStarRating(this.getUserRating(cigar.name))}
              </div>
              <span class="rating-text">Rate this cigar</span>
            </div>
          </div>
          
          <div class="cigar-basic-info">
            <h3>${cigar.name}</h3>
            <div class="cigar-badges">
              <span class="badge wrapper-badge">${cigar.wrapper || 'Unknown'}</span>
              <span class="badge strength-badge">${cigar.strength || 'Medium'}</span>
              <span class="badge origin-badge">${cigar.origin || 'Premium'}</span>
              ${cigar.price ? `<span class="badge price-badge">$${cigar.price}</span>` : ''}
            </div>
            
            <div class="quick-actions">
              <button class="action-btn" onclick="enhancedCigarModal.addToWishlist()">
                ❤️ Add to Wishlist
              </button>
              <button class="action-btn" onclick="enhancedCigarModal.shareCigar()">
                📤 Share
              </button>
              <button class="action-btn primary" onclick="enhancedCigarModal.startTastingSession()">
                🎭 Start Tasting
              </button>
            </div>
          </div>
        </div>

        <!-- Tabbed Content -->
        <div class="modal-tabs">
          <div class="tab-headers">
            <button class="tab-header active" data-tab="overview">📋 Overview</button>
            <button class="tab-header" data-tab="pairings">🍷 Pairings</button>
            <button class="tab-header" data-tab="reviews">⭐ Reviews</button>
            <button class="tab-header" data-tab="notes">📝 My Notes</button>
            <button class="tab-header" data-tab="details">🔍 Details</button>
          </div>

          <!-- Overview Tab -->
          <div class="tab-content active" id="overview-tab">
            <div class="flavor-profile">
              <h4>🌿 Flavor Profile</h4>
              <p class="flavor-description">${cigar.flavor || 'Rich and complex flavor profile with notes of wood, spice, and subtle sweetness.'}</p>
              
              <div class="flavor-wheel">
                ${this.generateFlavorWheel(cigar.flavor)}
              </div>
            </div>

            <div class="cigar-specs">
              <h4>📏 Specifications</h4>
              <div class="specs-grid">
                <div class="spec-item">
                  <span class="spec-label">Length:</span>
                  <span class="spec-value">${cigar.length || '6 inches'}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Ring Gauge:</span>
                  <span class="spec-value">${cigar.ringGauge || '52'}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Smoking Time:</span>
                  <span class="spec-value">${cigar.smokingTime || '45-60 min'}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Wrapper:</span>
                  <span class="spec-value">${cigar.wrapper || 'Premium'}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Binder:</span>
                  <span class="spec-value">${cigar.binder || 'Dominican'}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Filler:</span>
                  <span class="spec-value">${cigar.filler || 'Nicaraguan blend'}</span>
                </div>
              </div>
            </div>

            ${emotional ? this.generateEmotionalContext(emotional) : ''}
          </div>

          <!-- Pairings Tab -->
          <div class="tab-content" id="pairings-tab">
            <h4>🍷 Perfect Pairings</h4>
            
            <div class="pairing-categories">
              <div class="pairing-category">
                <h5>🥃 Spirits</h5>
                <div class="pairing-items">
                  ${this.generatePairingItems(['Single Malt Whisky', 'Aged Rum', 'Cognac', 'Bourbon'], 'spirit')}
                </div>
              </div>
              
              <div class="pairing-category">
                <h5>🍷 Wines</h5>
                <div class="pairing-items">
                  ${this.generatePairingItems(['Cabernet Sauvignon', 'Port Wine', 'Malbec', 'Madeira'], 'wine')}
                </div>
              </div>
              
              <div class="pairing-category">
                <h5>☕ Non-Alcoholic</h5>
                <div class="pairing-items">
                  ${this.generatePairingItems(['Dark Roast Coffee', 'Espresso', 'Black Tea', 'Hot Chocolate'], 'beverage')}
                </div>
              </div>
              
              <div class="pairing-category">
                <h5>🍫 Food</h5>
                <div class="pairing-items">
                  ${this.generatePairingItems(['Dark Chocolate', 'Roasted Nuts', 'Grilled Steak', 'Aged Cheese'], 'food')}
                </div>
              </div>
            </div>

            <div class="pairing-recommendation">
              <h5>🎯 Our Recommendation</h5>
              <div class="recommended-pairing">
                <div class="pairing-card featured">
                  <div class="pairing-icon">🥃</div>
                  <div class="pairing-info">
                    <h6>Lagavulin 16 Single Malt</h6>
                    <p>The smoky, peaty notes complement the ${cigar.wrapper} wrapper beautifully.</p>
                    <div class="pairing-match">
                      <span class="match-percentage">92% Match</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div class="tab-content" id="reviews-tab">
            <div class="reviews-summary">
              <div class="overall-rating">
                <div class="rating-display">
                  <span class="rating-number">4.2</span>
                  <div class="rating-stars">★★★★☆</div>
                  <span class="rating-count">(127 reviews)</span>
                </div>
              </div>
              
              <div class="rating-breakdown">
                ${this.generateRatingBreakdown()}
              </div>
            </div>

            <div class="reviews-list">
              <h5>Recent Reviews</h5>
              ${this.generateReviews()}
            </div>

            <div class="add-review">
              <h5>Write a Review</h5>
              <div class="review-form">
                <div class="rating-input">
                  <span>Your Rating:</span>
                  <div class="star-rating clickable" data-rating="0">
                    ☆☆☆☆☆
                  </div>
                </div>
                <textarea placeholder="Share your tasting experience..." rows="4"></textarea>
                <button class="submit-review-btn">Submit Review</button>
              </div>
            </div>
          </div>

          <!-- Notes Tab -->
          <div class="tab-content" id="notes-tab">
            <div class="notes-section">
              <h4>📝 My Tasting Notes</h4>
              
              <div class="notes-input">
                <textarea id="tastingNotes" placeholder="Record your tasting experience, flavor notes, pairing observations..." rows="6">${this.getTastingNotes(cigar.name)}</textarea>
                <div class="notes-actions">
                  <button class="action-btn" onclick="enhancedCigarModal.saveNotes()">💾 Save Notes</button>
                  <button class="action-btn" onclick="enhancedCigarModal.startVoiceRecording()">
                    🎙️ <span id="recordingStatus">Record Audio</span>
                  </button>
                </div>
              </div>

              <div class="smoking-session">
                <h5>🎭 Smoking Session Tracker</h5>
                <div class="session-controls">
                  <div class="session-timer">
                    <span>Session Time: </span>
                    <span id="sessionTimer">00:00</span>
                    <button id="sessionToggle" class="timer-btn">▶️ Start</button>
                  </div>
                  
                  <div class="session-notes">
                    <div class="third-markers">
                      <div class="third-note">
                        <label>First Third:</label>
                        <input type="text" placeholder="Initial flavors..." />
                      </div>
                      <div class="third-note">
                        <label>Second Third:</label>
                        <input type="text" placeholder="Developing flavors..." />
                      </div>
                      <div class="third-note">
                        <label>Final Third:</label>
                        <input type="text" placeholder="Finishing notes..." />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="previous-sessions">
                <h5>📅 Previous Sessions</h5>
                ${this.generatePreviousSessions(cigar.name)}
              </div>
            </div>
          </div>

          <!-- Details Tab -->
          <div class="tab-content" id="details-tab">
            <div class="detailed-info">
              <div class="construction-details">
                <h4>🏗️ Construction</h4>
                <div class="construction-grid">
                  <div class="construction-item">
                    <span class="detail-label">Cap Type:</span>
                    <span class="detail-value">${cigar.capType || 'Triple Cap'}</span>
                  </div>
                  <div class="construction-item">
                    <span class="detail-label">Draw:</span>
                    <span class="detail-value">${cigar.draw || 'Perfect'}</span>
                  </div>
                  <div class="construction-item">
                    <span class="detail-label">Burn Quality:</span>
                    <span class="detail-value">${cigar.burn || 'Even'}</span>
                  </div>
                </div>
              </div>

              <div class="origin-story">
                <h4>🌍 Origin & Story</h4>
                <p>${this.generateOriginStory(cigar)}</p>
              </div>

              <div class="technical-specs">
                <h4>🔬 Technical Analysis</h4>
                <div class="analysis-chart">
                  ${this.generateTechnicalChart(cigar)}
                </div>
              </div>

              <div class="availability">
                <h4>🛒 Availability</h4>
                <div class="retailer-links">
                  <button class="retailer-btn">🏪 Find Local Retailers</button>
                  <button class="retailer-btn">🌐 Buy Online</button>
                  <button class="retailer-btn">📍 Check Stock</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  addModalStyles() {
    if (document.getElementById('enhanced-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'enhanced-modal-styles';
    style.textContent = `
      .enhanced-cigar-modal {
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
      }

      .cigar-header {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid var(--border-color);
      }

      .cigar-visual {
        flex-shrink: 0;
        text-align: center;
      }

      .cigar-preview {
        width: 120px;
        height: 60px;
        border-radius: 30px;
        position: relative;
        margin: 0 auto 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        background: linear-gradient(45deg, var(--accent-bg), #8B4513);
      }

      .cigar-shape {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 60%;
        background: linear-gradient(90deg, #8B4513, #CD853F, #8B4513);
        border-radius: inherit;
      }

      .cigar-rating {
        text-align: center;
      }

      .star-rating {
        font-size: 1.2rem;
        color: #ffd700;
        cursor: pointer;
        margin-bottom: 0.25rem;
      }

      .star-rating.clickable {
        cursor: pointer;
      }

      .rating-text {
        font-size: 0.8rem;
        color: var(--secondary-text);
      }

      .cigar-basic-info {
        flex: 1;
      }

      .cigar-basic-info h3 {
        margin: 0 0 1rem 0;
        color: var(--accent-text);
        font-size: 1.5rem;
      }

      .cigar-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .badge {
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        font-weight: bold;
      }

      .wrapper-badge {
        background: var(--accent-text);
        color: var(--primary-bg);
      }

      .strength-badge {
        background: #ff6b35;
        color: white;
      }

      .origin-badge {
        background: #4a90e2;
        color: white;
      }

      .price-badge {
        background: #28a745;
        color: white;
      }

      .quick-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .modal-tabs {
        margin-top: 1.5rem;
      }

      .tab-headers {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid var(--border-color);
        overflow-x: auto;
      }

      .tab-header {
        background: transparent;
        border: none;
        color: var(--secondary-text);
        padding: 0.75rem 1rem;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.9rem;
        border-bottom: 2px solid transparent;
        transition: var(--transition);
        white-space: nowrap;
      }

      .tab-header.active {
        color: var(--accent-text);
        border-bottom-color: var(--accent-text);
      }

      .tab-header:hover {
        color: var(--accent-text);
      }

      .tab-content {
        display: none;
      }

      .tab-content.active {
        display: block;
      }

      .flavor-profile {
        margin-bottom: 2rem;
      }

      .flavor-description {
        font-style: italic;
        color: var(--secondary-text);
        margin-bottom: 1rem;
        line-height: 1.6;
      }

      .flavor-wheel {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .flavor-tag {
        background: rgba(198, 156, 109, 0.2);
        color: var(--accent-text);
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.85rem;
        border: 1px solid var(--accent-text);
      }

      .cigar-specs {
        margin-bottom: 2rem;
      }

      .specs-grid,
      .construction-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .spec-item,
      .construction-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: rgba(44, 44, 44, 0.3);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
      }

      .spec-label,
      .detail-label {
        color: var(--secondary-text);
        font-weight: bold;
      }

      .spec-value,
      .detail-value {
        color: var(--accent-text);
      }

      .pairing-categories {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .pairing-category h5 {
        margin: 0 0 1rem 0;
        color: var(--accent-text);
        font-size: 1rem;
      }

      .pairing-items {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .pairing-item {
        padding: 0.75rem;
        background: rgba(44, 44, 44, 0.3);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .pairing-item:hover {
        border-color: var(--accent-text);
        background: rgba(198, 156, 109, 0.1);
      }

      .pairing-recommendation {
        margin-top: 2rem;
      }

      .recommended-pairing {
        margin-top: 1rem;
      }

      .pairing-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(198, 156, 109, 0.1);
        border: 2px solid var(--accent-text);
        border-radius: var(--border-radius);
      }

      .pairing-icon {
        font-size: 2rem;
      }

      .pairing-info h6 {
        margin: 0 0 0.5rem 0;
        color: var(--accent-text);
      }

      .pairing-info p {
        margin: 0 0 0.75rem 0;
        color: var(--secondary-text);
        font-size: 0.9rem;
      }

      .match-percentage {
        background: var(--success-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        font-weight: bold;
      }

      .reviews-summary {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        align-items: center;
      }

      .overall-rating {
        text-align: center;
      }

      .rating-number {
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--accent-text);
        display: block;
      }

      .rating-stars {
        font-size: 1.2rem;
        color: #ffd700;
        margin: 0.5rem 0;
      }

      .rating-count {
        color: var(--secondary-text);
        font-size: 0.9rem;
      }

      .rating-breakdown {
        flex: 1;
      }

      .rating-bar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }

      .rating-bar-label {
        width: 20px;
        font-size: 0.9rem;
      }

      .rating-bar-fill {
        flex: 1;
        height: 8px;
        background: var(--border-color);
        border-radius: 4px;
        overflow: hidden;
      }

      .rating-bar-value {
        height: 100%;
        background: var(--accent-text);
        transition: width 0.5s ease;
      }

      .rating-bar-count {
        width: 30px;
        font-size: 0.8rem;
        color: var(--secondary-text);
      }

      .reviews-list {
        margin-bottom: 2rem;
      }

      .review-item {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 1rem;
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .reviewer-name {
        font-weight: bold;
        color: var(--accent-text);
      }

      .review-date {
        font-size: 0.8rem;
        color: var(--secondary-text);
      }

      .review-text {
        color: var(--primary-text);
        line-height: 1.5;
      }

      .add-review {
        border-top: 2px solid var(--border-color);
        padding-top: 1.5rem;
      }

      .review-form {
        margin-top: 1rem;
      }

      .rating-input {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .review-form textarea {
        width: 100%;
        padding: 0.75rem;
        background: var(--accent-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        color: var(--primary-text);
        font-family: inherit;
        resize: vertical;
        margin-bottom: 1rem;
      }

      .submit-review-btn {
        background: var(--accent-text);
        color: var(--primary-bg);
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-family: inherit;
        font-weight: bold;
      }

      .notes-input textarea {
        width: 100%;
        min-height: 150px;
        padding: 1rem;
        background: var(--accent-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        color: var(--primary-text);
        font-family: inherit;
        resize: vertical;
        margin-bottom: 1rem;
      }

      .notes-actions {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 2rem;
      }

      .smoking-session {
        margin-bottom: 2rem;
        padding: 1rem;
        background: rgba(44, 44, 44, 0.3);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
      }

      .session-controls {
        margin-top: 1rem;
      }

      .session-timer {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .timer-btn {
        background: var(--accent-text);
        color: var(--primary-bg);
        border: none;
        padding: 0.5rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 1rem;
      }

      .third-markers {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .third-note {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .third-note label {
        font-weight: bold;
        color: var(--accent-text);
      }

      .third-note input {
        padding: 0.5rem;
        background: var(--accent-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        color: var(--primary-text);
        font-family: inherit;
      }

      .previous-sessions {
        border-top: 1px solid var(--border-color);
        padding-top: 1rem;
      }

      .session-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: rgba(44, 44, 44, 0.3);
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
      }

      .session-date {
        color: var(--secondary-text);
        font-size: 0.9rem;
      }

      .session-duration {
        color: var(--accent-text);
        font-weight: bold;
      }

      .origin-story {
        margin-bottom: 2rem;
      }

      .origin-story p {
        line-height: 1.6;
        color: var(--primary-text);
      }

      .technical-specs {
        margin-bottom: 2rem;
      }

      .analysis-chart {
        background: rgba(44, 44, 44, 0.3);
        border-radius: var(--border-radius);
        padding: 1rem;
        margin-top: 1rem;
      }

      .chart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .chart-label {
        color: var(--secondary-text);
      }

      .chart-bar {
        flex: 1;
        margin: 0 1rem;
        height: 8px;
        background: var(--border-color);
        border-radius: 4px;
        overflow: hidden;
      }

      .chart-fill {
        height: 100%;
        background: var(--accent-text);
        border-radius: 4px;
      }

      .chart-value {
        color: var(--accent-text);
        font-weight: bold;
        min-width: 30px;
        text-align: right;
      }

      .retailer-links {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .retailer-btn {
        background: var(--accent-text);
        color: var(--primary-bg);
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-family: inherit;
        font-weight: bold;
        transition: var(--transition);
      }

      .retailer-btn:hover {
        background: #dab785;
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .enhanced-cigar-modal {
          max-width: 100%;
        }

        .cigar-header {
          flex-direction: column;
          gap: 1rem;
        }

        .tab-headers {
          flex-wrap: wrap;
        }

        .pairing-categories {
          grid-template-columns: 1fr;
        }

        .reviews-summary {
          flex-direction: column;
          gap: 1rem;
        }

        .specs-grid,
        .construction-grid {
          grid-template-columns: 1fr;
        }

        .third-markers {
          grid-template-columns: 1fr;
        }

        .retailer-links {
          flex-direction: column;
        }
      }
    `;

    document.head.appendChild(style);
  }

  setupModalEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-header').forEach(header => {
      header.addEventListener('click', e => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Star rating interaction
    document.querySelectorAll('.star-rating.clickable').forEach(rating => {
      rating.addEventListener('click', e => {
        this.handleRatingClick(e.target);
      });
    });

    // Session timer
    const sessionToggle = document.getElementById('sessionToggle');
    if (sessionToggle) {
      sessionToggle.addEventListener('click', () => {
        this.toggleSessionTimer();
      });
    }

    // Make enhancedCigarModal globally accessible for onclick handlers
    window.enhancedCigarModal = this;
  }

  switchTab(tabId) {
    // Update tab headers
    document.querySelectorAll('.tab-header').forEach(header => {
      header.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
  }

  getWrapperColor(wrapper) {
    const colors = {
      Maduro: '#8B4513',
      Connecticut: '#F5DEB3',
      Habano: '#CD853F',
      Natural: '#DEB887',
      Oscuro: '#2F1B14',
    };
    return colors[wrapper] || '#CD853F';
  }

  generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }

  generateFlavorWheel(flavorText) {
    if (!flavorText)
      return '<div class="flavor-tag">Rich</div><div class="flavor-tag">Complex</div>';

    const flavors = this.extractFlavors(flavorText);
    return flavors.map(flavor => `<div class="flavor-tag">${flavor}</div>`).join('');
  }

  extractFlavors(text) {
    const commonFlavors = [
      'woody',
      'spicy',
      'sweet',
      'earthy',
      'nutty',
      'chocolate',
      'coffee',
      'cedar',
      'pepper',
      'vanilla',
    ];
    const foundFlavors = [];

    commonFlavors.forEach(flavor => {
      if (text.toLowerCase().includes(flavor)) {
        foundFlavors.push(flavor.charAt(0).toUpperCase() + flavor.slice(1));
      }
    });

    return foundFlavors.length > 0 ? foundFlavors : ['Rich', 'Complex'];
  }

  generatePairingItems(items, type) {
    const icons = {
      spirit: '🥃',
      wine: '🍷',
      beverage: '☕',
      food: '🍫',
    };

    return items
      .map(
        item =>
          `<div class="pairing-item">
        <span>${icons[type]} ${item}</span>
      </div>`
      )
      .join('');
  }

  generateEmotionalContext(emotional) {
    return `
      <div class="emotional-context">
        <h4>🎭 Ritual & Atmosphere</h4>
        <p>${emotional.description || 'Perfect for contemplative moments and meaningful conversations.'}</p>
        <div class="ritual-elements">
          <span class="ritual-tag">🕯️ Candlelit</span>
          <span class="ritual-tag">🎵 Jazz</span>
          <span class="ritual-tag">📚 Reading</span>
        </div>
      </div>
    `;
  }

  generateRatingBreakdown() {
    const ratings = [
      { stars: 5, count: 67, percentage: 53 },
      { stars: 4, count: 38, percentage: 30 },
      { stars: 3, count: 15, percentage: 12 },
      { stars: 2, count: 5, percentage: 4 },
      { stars: 1, count: 2, percentage: 1 },
    ];

    return ratings
      .map(
        rating => `
      <div class="rating-bar">
        <span class="rating-bar-label">${rating.stars}★</span>
        <div class="rating-bar-fill">
          <div class="rating-bar-value" style="width: ${rating.percentage}%"></div>
        </div>
        <span class="rating-bar-count">${rating.count}</span>
      </div>
    `
      )
      .join('');
  }

  generateReviews() {
    const reviews = [
      {
        name: 'CigarMaster92',
        date: '2 days ago',
        rating: 5,
        text: 'Exceptional cigar with perfect construction. The flavor profile is complex and evolving throughout the smoke.',
      },
      {
        name: 'SmokeEnthusiast',
        date: '1 week ago',
        rating: 4,
        text: 'Great smoke for the price point. Pairs wonderfully with a good whisky. Would definitely purchase again.',
      },
      {
        name: 'TobaccoConnoisseur',
        date: '2 weeks ago',
        rating: 5,
        text: 'This is what premium cigars should be. Flawless burn, rich flavors, and an excellent finish.',
      },
    ];

    return reviews
      .map(
        review => `
      <div class="review-item">
        <div class="review-header">
          <span class="reviewer-name">${review.name}</span>
          <span class="review-date">${review.date}</span>
        </div>
        <div class="review-rating">${this.generateStarRating(review.rating)}</div>
        <p class="review-text">${review.text}</p>
      </div>
    `
      )
      .join('');
  }

  generatePreviousSessions(cigarName) {
    const sessions = this.getStoredSessions(cigarName);

    if (sessions.length === 0) {
      return '<p class="no-sessions">No previous sessions recorded.</p>';
    }

    return sessions
      .map(
        session => `
      <div class="session-item">
        <span class="session-date">${session.date}</span>
        <span class="session-duration">${session.duration}</span>
      </div>
    `
      )
      .join('');
  }

  generateOriginStory(cigar) {
    const stories = {
      Maduro:
        'This Maduro wrapper has been aged to perfection, developing its characteristic dark color and sweet, complex flavors through careful fermentation and aging processes.',
      Connecticut:
        'Grown in the Connecticut River Valley, this wrapper is prized for its smooth, creamy characteristics and golden color, cultivated under shade cloth for optimal texture.',
      Habano:
        'Cuban-seed tobacco grown in premium regions, this Habano wrapper brings spice and complexity, honoring traditional Cuban cigar-making techniques.',
    };

    return (
      stories[cigar.wrapper] ||
      'This premium cigar represents the pinnacle of tobacco craftsmanship, blending traditional techniques with modern quality standards.'
    );
  }

  generateTechnicalChart(_cigar) {
    const technicalData = [
      { label: 'Strength', value: 75 },
      { label: 'Complexity', value: 90 },
      { label: 'Construction', value: 95 },
      { label: 'Draw Quality', value: 88 },
      { label: 'Burn Quality', value: 92 },
      { label: 'Value', value: 85 },
    ];

    return technicalData
      .map(
        item => `
      <div class="chart-item">
        <span class="chart-label">${item.label}</span>
        <div class="chart-bar">
          <div class="chart-fill" style="width: ${item.value}%"></div>
        </div>
        <span class="chart-value">${item.value}</span>
      </div>
    `
      )
      .join('');
  }

  // User interaction methods
  getUserRating(cigarName) {
    const saved = localStorage.getItem(`rating_${cigarName}`);
    return saved ? parseInt(saved, 10) : 0;
  }

  setUserRating(cigarName, rating) {
    localStorage.setItem(`rating_${cigarName}`, rating.toString());
  }

  getTastingNotes(cigarName) {
    return localStorage.getItem(`notes_${cigarName}`) || '';
  }

  saveTastingNotes(cigarName, notes) {
    localStorage.setItem(`notes_${cigarName}`, notes);
  }

  getStoredSessions(cigarName) {
    const sessions = localStorage.getItem(`sessions_${cigarName}`);
    return sessions ? JSON.parse(sessions) : [];
  }

  // Action methods
  addToWishlist() {
    if (!this.currentCigar) return;

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const cigarName = this.currentCigar.userData.name;

    if (!wishlist.includes(cigarName)) {
      wishlist.push(cigarName);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      this.uiManager.showToast(`${cigarName} added to wishlist`, 'success');
    } else {
      this.uiManager.showToast(`${cigarName} is already in your wishlist`, 'info');
    }
  }

  shareCigar() {
    if (!this.currentCigar) return;

    const cigarName = this.currentCigar.userData.name;

    if (navigator.share) {
      navigator.share({
        title: `${cigarName} - Thee Cigar Maestro`,
        text: `Check out this amazing cigar: ${cigarName}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${cigarName} - ${window.location.href}`);
      this.uiManager.showToast('Cigar details copied to clipboard', 'success');
    }
  }

  startTastingSession() {
    if (!this.currentCigar) return;

    this.uiManager.closeModal();
    this.switchTab('notes');
    this.uiManager.showModal(
      `🎭 Tasting Session: ${this.currentCigar.userData.name}`,
      this.generateModalContent(this.currentCigar.userData, [], null),
      'large'
    );

    // Auto-switch to notes tab
    setTimeout(() => {
      this.switchTab('notes');
    }, 100);
  }

  saveNotes() {
    if (!this.currentCigar) return;

    const notes = document.getElementById('tastingNotes').value;
    const cigarName = this.currentCigar.userData.name;

    this.saveTastingNotes(cigarName, notes);
    this.uiManager.showToast('Tasting notes saved', 'success');
  }

  startVoiceRecording() {
    if (this.isRecording) {
      this.stopVoiceRecording();
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.uiManager.showToast('Voice recording not supported', 'error');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.addEventListener('dataavailable', event => {
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.saveAudioRecording(audioBlob);
        });

        this.mediaRecorder.start();
        this.isRecording = true;

        const status = document.getElementById('recordingStatus');
        if (status) {
          status.textContent = '🔴 Recording... (Click to stop)';
        }
      })
      .catch(_error => {
        this.uiManager.showToast('Failed to access microphone', 'error');
      });
  }

  stopVoiceRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;

      const status = document.getElementById('recordingStatus');
      if (status) {
        status.textContent = 'Record Audio';
      }
    }
  }

  saveAudioRecording(audioBlob) {
    const cigarName = this.currentCigar.userData.name;
    const recordings = JSON.parse(localStorage.getItem(`recordings_${cigarName}`) || '[]');

    // Convert blob to base64 for storage (in a real app, you'd upload to a server)
    const reader = new FileReader();
    reader.onload = () => {
      recordings.push({
        date: new Date().toISOString(),
        audio: reader.result,
      });
      localStorage.setItem(`recordings_${cigarName}`, JSON.stringify(recordings));
      this.uiManager.showToast('Voice recording saved', 'success');
    };
    reader.readAsDataURL(audioBlob);
  }

  toggleSessionTimer() {
    const toggle = document.getElementById('sessionToggle');
    const timer = document.getElementById('sessionTimer');

    if (!this.sessionStartTime) {
      // Start timer
      this.sessionStartTime = Date.now();
      this.sessionInterval = setInterval(() => {
        const elapsed = Date.now() - this.sessionStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }, 1000);

      toggle.textContent = '⏸️ Pause';
    } else {
      // Stop timer
      if (this.sessionInterval) {
        clearInterval(this.sessionInterval);
      }

      const duration = Math.floor((Date.now() - this.sessionStartTime) / 60000);
      this.saveSession(duration);

      this.sessionStartTime = null;
      toggle.textContent = '▶️ Start';
      timer.textContent = '00:00';
    }
  }

  saveSession(duration) {
    if (!this.currentCigar) return;

    const cigarName = this.currentCigar.userData.name;
    const sessions = this.getStoredSessions(cigarName);

    sessions.push({
      date: new Date().toLocaleDateString(),
      duration: `${duration} min`,
      timestamp: Date.now(),
    });

    localStorage.setItem(`sessions_${cigarName}`, JSON.stringify(sessions));
    this.uiManager.showToast(`Session saved: ${duration} minutes`, 'success');
  }

  handleRatingClick(element) {
    // Implementation for star rating interaction
    console.info('Rating clicked:', element);
  }
}

export default EnhancedCigarModal;
