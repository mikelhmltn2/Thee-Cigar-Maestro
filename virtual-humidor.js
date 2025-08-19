/**
 * Virtual Humidor Management System for Thee Cigar Maestro
 * Luxury digital humidor with aging alerts, inventory tracking, and pairing memory
 */

class VirtualHumidorSystem {
  constructor() {
    this.isInitialized = false;
    this.inventory = new Map();
    this.agingAlerts = [];
    this.pairingMemory = new Map();
    this.humidorSettings = {
      temperature: 70, // Fahrenheit
      humidity: 70, // Percentage
      capacity: 250, // Number of cigars
      zones: ['Premium Reserve', 'Daily Selection', 'Aging Vault', 'Limited Editions'],
    };

    // Humidor analytics
    this.analytics = {
      totalCigars: 0,
      totalValue: 0,
      averageAge: 0,
      mostPopularBrand: '',
      agingProgress: [],
      smokingHistory: [],
    };

    this.init();
  }

  /**
   * Initialize the Virtual Humidor System
   */
  async init() {
    try {
      await this.loadInventory();
      await this.loadHumidorSettings();
      await this.loadAgingAlerts();
      await this.loadPairingMemory();
      await this.setupHumidorInterface();

      this.isInitialized = true;
      console.info('🏛️ Virtual Humidor System initialized');

      // Start monitoring
      this.startAgingMonitoring();
      this.updateAnalytics();
    } catch (error) {
      console.error('❌ Virtual Humidor initialization failed:', error);
    }
  }

  /**
   * Load inventory from storage
   */
  async loadInventory() {
    try {
      if (window.storageManager) {
        const humidorData = window.storageManager.getHumidorData() || {};
        this.inventory = new Map(Object.entries(humidorData.inventory || {}));
        this.analytics = { ...this.analytics, ...humidorData.analytics };
      }

      console.info('✅ Humidor inventory loaded');
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  }

  /**
   * Load humidor settings
   */
  async loadHumidorSettings() {
    try {
      if (window.storageManager) {
        const settings = window.storageManager.getHumidorSettings();
        if (settings) {
          this.humidorSettings = { ...this.humidorSettings, ...settings };
        }
      }
    } catch (error) {
      console.error('Error loading humidor settings:', error);
    }
  }

  /**
   * Load aging alerts
   */
  async loadAgingAlerts() {
    try {
      if (window.storageManager) {
        this.agingAlerts = window.storageManager.getAgingAlerts() || [];
      }
    } catch (error) {
      console.error('Error loading aging alerts:', error);
    }
  }

  /**
   * Load pairing memory
   */
  async loadPairingMemory() {
    try {
      if (window.storageManager) {
        const pairingData = window.storageManager.getPairingMemory() || {};
        this.pairingMemory = new Map(Object.entries(pairingData));
      }
    } catch (error) {
      console.error('Error loading pairing memory:', error);
    }
  }

  /**
   * Setup the Virtual Humidor interface
   */
  async setupHumidorInterface() {
    this.createHumidorInterface();
    this.attachEventHandlers();
  }

  /**
   * Create the luxury humidor interface
   */
  createHumidorInterface() {
    const humidorHTML = `
      <div id="virtualHumidorModal" class="humidor-modal" style="display: none;">
        <div class="humidor-container">
          <div class="humidor-header">
            <div class="humidor-title">
              <h2>🏛️ Virtual Humidor</h2>
              <p class="humidor-subtitle">Your Personal Cigar Collection</p>
            </div>
            <div class="humidor-stats">
              <div class="stat-item">
                <span class="stat-value" id="totalCigarsCount">0</span>
                <span class="stat-label">Cigars</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" id="totalValue">$0</span>
                <span class="stat-label">Collection Value</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" id="humidityLevel">${this.humidorSettings.humidity}%</span>
                <span class="stat-label">Humidity</span>
              </div>
            </div>
            <button class="close-humidor" onclick="window.virtualHumidor.hide()">×</button>
          </div>
          
          <div class="humidor-content">
            <div class="humidor-sidebar">
              <div class="humidor-controls">
                <button class="control-btn active" data-section="inventory">
                  📦 Inventory
                </button>
                <button class="control-btn" data-section="aging">
                  ⏰ Aging Alerts
                </button>
                <button class="control-btn" data-section="pairings">
                  🍷 Pairing Memory
                </button>
                <button class="control-btn" data-section="analytics">
                  📊 Analytics
                </button>
                <button class="control-btn" data-section="settings">
                  ⚙️ Settings
                </button>
              </div>
              
              <div class="quick-actions">
                <button class="action-btn" onclick="window.virtualHumidor.showAddCigarDialog()">
                  ➕ Add Cigar
                </button>
                <button class="action-btn" onclick="window.virtualHumidor.setAgingAlert()">
                  🔔 Set Alert
                </button>
                <button class="action-btn" onclick="window.virtualHumidor.recordPairing()">
                  📝 Record Pairing
                </button>
              </div>
            </div>
            
            <div class="humidor-main">
              <div id="inventorySection" class="humidor-section active">
                <div class="section-header">
                  <h3>Cigar Inventory</h3>
                  <div class="view-controls">
                    <button class="view-btn active" data-view="grid">Grid</button>
                    <button class="view-btn" data-view="list">List</button>
                  </div>
                </div>
                <div class="inventory-zones">
                  <div class="zone-tabs">
                    <button class="zone-tab active" data-zone="all">All Cigars</button>
                    <button class="zone-tab" data-zone="premium">Premium Reserve</button>
                    <button class="zone-tab" data-zone="daily">Daily Selection</button>
                    <button class="zone-tab" data-zone="aging">Aging Vault</button>
                    <button class="zone-tab" data-zone="limited">Limited Editions</button>
                  </div>
                  <div class="inventory-grid" id="inventoryGrid">
                    <!-- Inventory items will be populated here -->
                  </div>
                </div>
              </div>
              
              <div id="agingSection" class="humidor-section">
                <div class="section-header">
                  <h3>Aging Alerts</h3>
                  <button class="add-alert-btn" onclick="window.virtualHumidor.showAddAlertDialog()">
                    + Add Alert
                  </button>
                </div>
                <div class="aging-alerts" id="agingAlerts">
                  <!-- Aging alerts will be populated here -->
                </div>
              </div>
              
              <div id="pairingsSection" class="humidor-section">
                <div class="section-header">
                  <h3>Pairing Memory</h3>
                  <button class="add-pairing-btn" onclick="window.virtualHumidor.showAddPairingDialog()">
                    + Record Pairing
                  </button>
                </div>
                <div class="pairing-memory" id="pairingMemory">
                  <!-- Pairing memories will be populated here -->
                </div>
              </div>
              
              <div id="analyticsSection" class="humidor-section">
                <div class="section-header">
                  <h3>Collection Analytics</h3>
                </div>
                <div class="analytics-dashboard" id="analyticsDashboard">
                  <!-- Analytics charts and data will be populated here -->
                </div>
              </div>
              
              <div id="settingsSection" class="humidor-section">
                <div class="section-header">
                  <h3>Humidor Settings</h3>
                </div>
                <div class="humidor-settings" id="humidorSettings">
                  <!-- Settings controls will be populated here -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inject into DOM
    document.body.insertAdjacentHTML('beforeend', humidorHTML);

    // Add luxury styling
    this.addHumidorStyles();
  }

  /**
   * Add luxury styling for the humidor
   */
  addHumidorStyles() {
    const styles = `
      <style>
        .humidor-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(26, 15, 10, 0.95);
          backdrop-filter: blur(20px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .humidor-modal.show {
          opacity: 1;
        }

        .humidor-container {
          width: 95%;
          max-width: 1200px;
          height: 90vh;
          background: linear-gradient(135deg, var(--secondary-bg) 0%, var(--accent-bg) 100%);
          border: 3px solid var(--gold-primary);
          border-radius: var(--border-radius-large);
          box-shadow: var(--luxury-shadow);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .humidor-header {
          padding: 1.5rem 2rem;
          background: linear-gradient(135deg, var(--leather-bg), var(--accent-bg));
          border-bottom: 2px solid var(--gold-primary);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .humidor-title h2 {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.8rem;
          color: var(--gold-primary);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .humidor-subtitle {
          margin: 0.3rem 0 0 0;
          font-family: var(--font-accent);
          color: var(--cream-secondary);
          font-style: italic;
        }

        .humidor-stats {
          display: flex;
          gap: 2rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 1rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid var(--gold-primary);
          border-radius: var(--border-radius);
        }

        .stat-value {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--gold-primary);
        }

        .stat-label {
          font-family: var(--font-body);
          font-size: 0.8rem;
          color: var(--cream-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .close-humidor {
          background: var(--deep-brown);
          color: var(--gold-primary);
          border: 2px solid var(--cream-primary);
          border-radius: 50%;
          width: 45px;
          height: 45px;
          font-size: 1.5rem;
          cursor: pointer;
          transition: var(--smooth-transition);
        }

        .close-humidor:hover {
          background: var(--cream-primary);
          color: var(--deep-brown);
        }

        .humidor-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .humidor-sidebar {
          width: 250px;
          background: var(--accent-bg);
          border-right: 2px solid var(--gold-primary);
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
        }

        .humidor-controls {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .control-btn {
          padding: 1rem 1.5rem;
          background: transparent;
          color: var(--cream-primary);
          border: 1px solid var(--gold-primary);
          border-radius: var(--border-radius);
          font-family: var(--font-body);
          font-size: 1rem;
          text-align: left;
          cursor: pointer;
          transition: var(--smooth-transition);
        }

        .control-btn:hover,
        .control-btn.active {
          background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
          color: var(--deep-brown);
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .action-btn {
          padding: 0.8rem 1.2rem;
          background: var(--leather-bg);
          color: var(--cream-primary);
          border: 1px solid var(--gold-primary);
          border-radius: var(--border-radius);
          font-family: var(--font-body);
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--smooth-transition);
        }

        .action-btn:hover {
          background: var(--gold-primary);
          color: var(--deep-brown);
        }

        .humidor-main {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .humidor-section {
          display: none;
        }

        .humidor-section.active {
          display: block;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--gold-primary);
        }

        .section-header h3 {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--gold-primary);
        }

        .view-controls {
          display: flex;
          gap: 0.5rem;
        }

        .view-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          color: var(--cream-primary);
          border: 1px solid var(--gold-primary);
          border-radius: var(--border-radius);
          font-family: var(--font-body);
          cursor: pointer;
          transition: var(--smooth-transition);
        }

        .view-btn.active,
        .view-btn:hover {
          background: var(--gold-primary);
          color: var(--deep-brown);
        }

        .zone-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .zone-tab {
          padding: 0.7rem 1.2rem;
          background: transparent;
          color: var(--cream-primary);
          border: 1px solid var(--gold-primary);
          border-radius: var(--border-radius);
          font-family: var(--font-body);
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--smooth-transition);
        }

        .zone-tab.active,
        .zone-tab:hover {
          background: var(--gold-primary);
          color: var(--deep-brown);
        }

        .inventory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .cigar-card {
          background: linear-gradient(135deg, var(--leather-bg), var(--accent-bg));
          border: 2px solid var(--gold-primary);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          transition: var(--smooth-transition);
          cursor: pointer;
        }

        .cigar-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--gold-shadow);
        }

        .cigar-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .cigar-name {
          font-family: var(--font-display);
          font-size: 1.2rem;
          color: var(--gold-primary);
          margin: 0;
        }

        .cigar-brand {
          font-family: var(--font-body);
          color: var(--cream-secondary);
          font-size: 0.9rem;
          margin: 0.2rem 0 0 0;
        }

        .cigar-actions {
          display: flex;
          gap: 0.5rem;
        }

        .cigar-action {
          background: transparent;
          border: 1px solid var(--gold-primary);
          color: var(--gold-primary);
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--smooth-transition);
        }

        .cigar-action:hover {
          background: var(--gold-primary);
          color: var(--deep-brown);
        }

        .cigar-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 1rem;
        }

        .cigar-detail {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-family: var(--font-body);
          font-size: 0.8rem;
          color: var(--muted-text);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-value {
          font-family: var(--font-body);
          color: var(--cream-primary);
          font-weight: 500;
        }

        .aging-progress {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(212, 175, 55, 0.3);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: var(--accent-bg);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold-secondary), var(--gold-primary));
          transition: width 0.3s ease;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: var(--muted-text);
        }

        .alert-item {
          background: var(--accent-bg);
          border: 1px solid var(--warning-color);
          border-radius: var(--border-radius);
          padding: 1.2rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .alert-info h4 {
          margin: 0 0 0.5rem 0;
          color: var(--warning-color);
          font-family: var(--font-display);
        }

        .alert-description {
          color: var(--cream-primary);
          font-family: var(--font-body);
          margin: 0;
        }

        .alert-actions {
          display: flex;
          gap: 0.5rem;
        }

        .alert-btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--warning-color);
          background: transparent;
          color: var(--warning-color);
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--smooth-transition);
        }

        .alert-btn:hover {
          background: var(--warning-color);
          color: var(--deep-brown);
        }

        .pairing-item {
          background: var(--accent-bg);
          border: 1px solid var(--gold-primary);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .pairing-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .pairing-cigar {
          font-family: var(--font-display);
          color: var(--gold-primary);
          font-size: 1.1rem;
        }

        .pairing-date {
          font-family: var(--font-body);
          color: var(--muted-text);
          font-size: 0.9rem;
        }

        .pairing-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .pairing-with {
          color: var(--cream-primary);
          font-family: var(--font-body);
        }

        .pairing-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--gold-primary);
        }

        .rating-stars {
          display: flex;
          gap: 0.2rem;
        }

        .star {
          font-size: 1.2rem;
        }

        .star.filled {
          color: var(--gold-primary);
        }

        .star.empty {
          color: var(--muted-text);
        }

        .pairing-notes {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(212, 175, 55, 0.3);
          color: var(--cream-secondary);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .humidor-container {
            width: 98%;
            height: 95vh;
          }
          
          .humidor-content {
            flex-direction: column;
          }
          
          .humidor-sidebar {
            width: 100%;
            order: 2;
            border-right: none;
            border-top: 2px solid var(--gold-primary);
            padding: 1rem;
          }
          
          .humidor-controls {
            flex-direction: row;
            overflow-x: auto;
            gap: 0.8rem;
          }
          
          .control-btn {
            white-space: nowrap;
            min-width: 120px;
          }
          
          .humidor-main {
            order: 1;
          }
          
          .inventory-grid {
            grid-template-columns: 1fr;
          }
          
          .humidor-stats {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .stat-item {
            padding: 0.3rem 0.8rem;
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  /**
   * Show the humidor interface
   */
  show() {
    const modal = document.getElementById('virtualHumidorModal');
    if (modal) {
      modal.style.display = 'flex';
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);

      // Load current section data
      this.populateInventory();
      this.updateStats();
    }
  }

  /**
   * Hide the humidor interface
   */
  hide() {
    const modal = document.getElementById('virtualHumidorModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 400);
    }
  }

  /**
   * Add a cigar to the inventory
   */
  addCigar(cigarData) {
    const cigarId = this.generateCigarId();
    const cigar = {
      id: cigarId,
      name: cigarData.name,
      brand: cigarData.brand,
      wrapper: cigarData.wrapper,
      strength: cigarData.strength,
      size: cigarData.size,
      price: cigarData.price || 0,
      purchaseDate: new Date(),
      zone: cigarData.zone || 'daily',
      agingTarget: cigarData.agingTarget || null,
      quantity: cigarData.quantity || 1,
      notes: cigarData.notes || '',
      smokingHistory: [],
    };

    this.inventory.set(cigarId, cigar);
    this.saveInventory();
    this.updateAnalytics();

    console.info(`✅ Added ${cigar.name} to humidor`);
    return cigarId;
  }

  /**
   * Remove a cigar from inventory
   */
  removeCigar(cigarId) {
    if (this.inventory.has(cigarId)) {
      this.inventory.delete(cigarId);
      this.saveInventory();
      this.updateAnalytics();
      console.info(`🗑️ Removed cigar ${cigarId} from humidor`);
    }
  }

  /**
   * Update cigar quantity (when smoking one)
   */
  smokeCigar(cigarId, pairingData = null) {
    const cigar = this.inventory.get(cigarId);
    if (cigar && cigar.quantity > 0) {
      cigar.quantity -= 1;

      // Record smoking session
      const session = {
        date: new Date(),
        pairing: pairingData,
        enjoyment: pairingData?.rating || null,
      };
      cigar.smokingHistory.push(session);

      // If quantity reaches 0, remove from inventory
      if (cigar.quantity === 0) {
        this.inventory.delete(cigarId);
      }

      // Record pairing if provided
      if (pairingData) {
        this.recordPairingExperience(cigarId, pairingData);
      }

      this.saveInventory();
      this.updateAnalytics();

      console.info(`🚬 Smoked ${cigar.name}`);
    }
  }

  /**
   * Set aging alert for a cigar
   */
  setAgingAlert(cigarId, targetDate, alertType = 'ready') {
    const cigar = this.inventory.get(cigarId);
    if (cigar) {
      const alert = {
        id: this.generateAlertId(),
        cigarId: cigarId,
        cigarName: cigar.name,
        targetDate: new Date(targetDate),
        alertType: alertType,
        isActive: true,
        created: new Date(),
      };

      this.agingAlerts.push(alert);
      cigar.agingTarget = new Date(targetDate);

      this.saveAgingAlerts();
      this.saveInventory();

      console.info(`⏰ Set aging alert for ${cigar.name}`);
    }
  }

  /**
   * Record pairing experience
   */
  recordPairingExperience(cigarId, pairingData) {
    const cigar = this.inventory.get(cigarId);
    if (cigar) {
      const pairingKey = `${cigar.name}_${pairingData.pairedWith}`;
      const experience = {
        cigarId: cigarId,
        cigarName: cigar.name,
        pairedWith: pairingData.pairedWith,
        rating: pairingData.rating,
        notes: pairingData.notes || '',
        date: new Date(),
        occasion: pairingData.occasion || '',
      };

      this.pairingMemory.set(pairingKey, experience);
      this.savePairingMemory();

      console.info(`📝 Recorded pairing: ${cigar.name} with ${pairingData.pairedWith}`);
    }
  }

  /**
   * Start aging monitoring
   */
  startAgingMonitoring() {
    // Check aging alerts daily
    setInterval(() => {
      this.checkAgingAlerts();
    }, 86400000); // 24 hours

    // Initial check
    this.checkAgingAlerts();
  }

  /**
   * Check aging alerts
   */
  checkAgingAlerts() {
    const now = new Date();

    this.agingAlerts.forEach(alert => {
      if (alert.isActive && alert.targetDate <= now) {
        this.triggerAgingAlert(alert);
      }
    });
  }

  /**
   * Trigger aging alert
   */
  triggerAgingAlert(alert) {
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Aging Alert - Thee Cigar Maestro', {
        body: `${alert.cigarName} is ready for enjoying!`,
        icon: '/assets/logos/logo-192.png',
      });
    }

    // Mark alert as triggered
    alert.isActive = false;
    this.saveAgingAlerts();

    console.info(`🔔 Aging alert triggered for ${alert.cigarName}`);
  }

  /**
   * Update analytics
   */
  updateAnalytics() {
    const cigars = Array.from(this.inventory.values());

    this.analytics.totalCigars = cigars.reduce((sum, cigar) => sum + cigar.quantity, 0);
    this.analytics.totalValue = cigars.reduce(
      (sum, cigar) => sum + cigar.price * cigar.quantity,
      0
    );

    // Calculate average age in days
    const now = new Date();
    const totalAgeDays = cigars.reduce((sum, cigar) => {
      const ageDays = Math.floor((now - cigar.purchaseDate) / (1000 * 60 * 60 * 24));
      return sum + ageDays * cigar.quantity;
    }, 0);
    this.analytics.averageAge =
      this.analytics.totalCigars > 0 ? Math.floor(totalAgeDays / this.analytics.totalCigars) : 0;

    // Most popular brand
    const brandCounts = {};
    cigars.forEach(cigar => {
      brandCounts[cigar.brand] = (brandCounts[cigar.brand] || 0) + cigar.quantity;
    });
    this.analytics.mostPopularBrand = Object.keys(brandCounts).reduce(
      (a, b) => (brandCounts[a] > brandCounts[b] ? a : b),
      ''
    );

    this.saveAnalytics();
  }

  /**
   * Populate inventory display
   */
  populateInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    if (!inventoryGrid) return;

    const cigars = Array.from(this.inventory.values());

    if (cigars.length === 0) {
      inventoryGrid.innerHTML = `
        <div class="empty-state">
          <h3>Your humidor is empty</h3>
          <p>Add some cigars to get started</p>
          <button class="action-btn" onclick="window.virtualHumidor.showAddCigarDialog()">
            ➕ Add First Cigar
          </button>
        </div>
      `;
      return;
    }

    inventoryGrid.innerHTML = cigars.map(cigar => this.createCigarCard(cigar)).join('');
  }

  /**
   * Create cigar card HTML
   */
  createCigarCard(cigar) {
    const agingProgress = this.calculateAgingProgress(cigar);

    return `
      <div class="cigar-card" data-cigar-id="${escapeHTML(cigar.id)}">
        <div class="cigar-header">
          <div>
            <h4 class="cigar-name">${escapeHTML(cigar.name)}</h4>
            <p class="cigar-brand">${escapeHTML(cigar.brand)}</p>
          </div>
          <div class="cigar-actions">
            <button class="cigar-action" onclick="window.virtualHumidor.smokeCigar('${escapeHTML(cigar.id)}')" title="Smoke">
              🚬
            </button>
            <button class="cigar-action" onclick="window.virtualHumidor.editCigar('${escapeHTML(cigar.id)}')" title="Edit">
              ✏️
            </button>
            <button class="cigar-action" onclick="window.virtualHumidor.removeCigar('${escapeHTML(cigar.id)}')" title="Remove">
              🗑️
            </button>
          </div>
        </div>
        
        <div class="cigar-details">
          <div class="cigar-detail">
            <span class="detail-label">Wrapper</span>
            <span class="detail-value">${escapeHTML(cigar.wrapper)}</span>
          </div>
          <div class="cigar-detail">
            <span class="detail-label">Strength</span>
            <span class="detail-value">${escapeHTML(cigar.strength)}</span>
          </div>
          <div class="cigar-detail">
            <span class="detail-label">Size</span>
            <span class="detail-value">${escapeHTML(cigar.size)}</span>
          </div>
          <div class="cigar-detail">
            <span class="detail-label">Quantity</span>
            <span class="detail-value">${escapeHTML(cigar.quantity)}</span>
          </div>
        </div>
        
        ${
          cigar.agingTarget
            ? `
          <div class="aging-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${agingProgress.percentage}%"></div>
            </div>
            <div class="progress-label">
              <span>Aging Progress</span>
              <span>${agingProgress.daysRemaining} days remaining</span>
            </div>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  /**
   * Calculate aging progress
   */
  calculateAgingProgress(cigar) {
    if (!cigar.agingTarget) {
      return { percentage: 0, daysRemaining: 0 };
    }

    const now = new Date();
    const purchaseDate = new Date(cigar.purchaseDate);
    const targetDate = new Date(cigar.agingTarget);

    const totalAgeTime = targetDate.getTime() - purchaseDate.getTime();
    const currentAgeTime = now.getTime() - purchaseDate.getTime();

    const percentage = Math.min((currentAgeTime / totalAgeTime) * 100, 100);
    const daysRemaining = Math.max(
      Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      0
    );

    return { percentage, daysRemaining };
  }

  /**
   * Update statistics display
   */
  updateStats() {
    document.getElementById('totalCigarsCount').textContent = this.analytics.totalCigars;
    document.getElementById('totalValue').textContent = `$${this.analytics.totalValue.toFixed(2)}`;
    document.getElementById('humidityLevel').textContent = `${this.humidorSettings.humidity}%`;
  }

  /**
   * Show add cigar dialog
   */
  showAddCigarDialog() {
    // This would open a modal dialog for adding cigars
    console.info('🔜 Add cigar dialog would open here');
  }

  /**
   * Attach event handlers
   */
  attachEventHandlers() {
    // Section navigation
    document.addEventListener('click', e => {
      if (e.target.classList.contains('control-btn')) {
        this.switchSection(e.target.dataset.section);
      }
    });

    // Zone filtering
    document.addEventListener('click', e => {
      if (e.target.classList.contains('zone-tab')) {
        this.filterByZone(e.target.dataset.zone);
      }
    });

    // View controls
    document.addEventListener('click', e => {
      if (e.target.classList.contains('view-btn')) {
        this.switchView(e.target.dataset.view);
      }
    });
  }

  /**
   * Switch humidor section
   */
  switchSection(section) {
    // Update active button
    document.querySelectorAll('.control-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Show relevant section
    document.querySelectorAll('.humidor-section').forEach(sec => {
      sec.classList.remove('active');
    });
    document.getElementById(`${section}Section`).classList.add('active');

    // Load section data
    switch (section) {
      case 'inventory':
        this.populateInventory();
        break;
      case 'aging':
        this.populateAgingAlerts();
        break;
      case 'pairings':
        this.populatePairingMemory();
        break;
      case 'analytics':
        this.populateAnalytics();
        break;
      case 'settings':
        this.populateSettings();
        break;
    }
  }

  /**
   * Populate aging alerts
   */
  populateAgingAlerts() {
    const alertsContainer = document.getElementById('agingAlerts');
    if (!alertsContainer) return;

    const activeAlerts = this.agingAlerts.filter(alert => alert.isActive);

    if (activeAlerts.length === 0) {
      alertsContainer.innerHTML = `
        <div class="empty-state">
          <h3>No aging alerts set</h3>
          <p>Set alerts to track your cigars' aging progress</p>
        </div>
      `;
      return;
    }

    alertsContainer.innerHTML = activeAlerts
      .map(
        alert => `
      <div class="alert-item">
        <div class="alert-info">
          <h4>${escapeHTML(alert.cigarName)}</h4>
          <p class="alert-description">Ready on ${alert.targetDate.toLocaleDateString()}</p>
        </div>
        <div class="alert-actions">
          <button class="alert-btn" onclick="window.virtualHumidor.dismissAlert('${escapeHTML(alert.id)}')">
            Dismiss
          </button>
        </div>
      </div>
    `
      )
      .join('');
  }

  /**
   * Populate pairing memory
   */
  populatePairingMemory() {
    const pairingContainer = document.getElementById('pairingMemory');
    if (!pairingContainer) return;

    const pairings = Array.from(this.pairingMemory.values());

    if (pairings.length === 0) {
      pairingContainer.innerHTML = `
        <div class="empty-state">
          <h3>No pairings recorded</h3>
          <p>Record your cigar and spirit pairings to build your flavor memory</p>
        </div>
      `;
      return;
    }

    pairingContainer.innerHTML = pairings
      .map(
        pairing => `
      <div class="pairing-item">
        <div class="pairing-header">
          <span class="pairing-cigar">${escapeHTML(pairing.cigarName)}</span>
          <span class="pairing-date">${pairing.date.toLocaleDateString()}</span>
        </div>
        <div class="pairing-details">
          <div class="pairing-with">
            <strong>Paired with:</strong> ${escapeHTML(pairing.pairedWith)}
          </div>
          <div class="pairing-rating">
            <span>Rating:</span>
            <div class="rating-stars">
              ${this.renderStars(pairing.rating)}
            </div>
          </div>
        </div>
        ${pairing.notes ? `<div class="pairing-notes">${escapeHTML(pairing.notes)}</div>` : ''}
      </div>
    `
      )
      .join('');
  }

  /**
   * Render star rating
   */
  renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<span class="star ${i <= rating ? 'filled' : 'empty'}">★</span>`;
    }
    return stars;
  }

  /**
   * Populate analytics dashboard
   */
  populateAnalytics() {
    const analyticsContainer = document.getElementById('analyticsDashboard');
    if (!analyticsContainer) return;

    analyticsContainer.innerHTML = `
      <div class="analytics-grid">
        <div class="analytics-card">
          <h4>Collection Overview</h4>
          <div class="metric">
            <span class="metric-value">${this.analytics.totalCigars}</span>
            <span class="metric-label">Total Cigars</span>
          </div>
          <div class="metric">
            <span class="metric-value">$${this.analytics.totalValue.toFixed(2)}</span>
            <span class="metric-label">Collection Value</span>
          </div>
          <div class="metric">
            <span class="metric-value">${this.analytics.averageAge} days</span>
            <span class="metric-label">Average Age</span>
          </div>
        </div>
        
        <div class="analytics-card">
          <h4>Popular Brands</h4>
          <div class="brand-list">
            <div class="brand-item">
              <span class="brand-name">${this.analytics.mostPopularBrand}</span>
              <span class="brand-count">Most Popular</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Populate settings
   */
  populateSettings() {
    const settingsContainer = document.getElementById('humidorSettings');
    if (!settingsContainer) return;

    settingsContainer.innerHTML = `
      <div class="settings-group">
        <h4>Environmental Controls</h4>
        <div class="setting-item">
          <label>Temperature (°F)</label>
          <input type="range" min="65" max="75" value="${this.humidorSettings.temperature}" 
                 oninput="window.virtualHumidor.updateTemperature(this.value)">
          <span>${this.humidorSettings.temperature}°F</span>
        </div>
        <div class="setting-item">
          <label>Humidity (%)</label>
          <input type="range" min="65" max="75" value="${this.humidorSettings.humidity}" 
                 oninput="window.virtualHumidor.updateHumidity(this.value)">
          <span>${this.humidorSettings.humidity}%</span>
        </div>
      </div>
      
      <div class="settings-group">
        <h4>Capacity</h4>
        <div class="setting-item">
          <label>Maximum Cigars</label>
          <input type="number" min="50" max="1000" value="${this.humidorSettings.capacity}" 
                 onchange="window.virtualHumidor.updateCapacity(this.value)">
        </div>
      </div>
    `;
  }

  /**
   * Save methods
   */
  saveInventory() {
    if (window.storageManager) {
      const inventoryData = Object.fromEntries(this.inventory);
      window.storageManager.saveHumidorData({
        inventory: inventoryData,
        analytics: this.analytics,
      });
    }
  }

  saveAgingAlerts() {
    if (window.storageManager) {
      window.storageManager.saveAgingAlerts(this.agingAlerts);
    }
  }

  savePairingMemory() {
    if (window.storageManager) {
      const pairingData = Object.fromEntries(this.pairingMemory);
      window.storageManager.savePairingMemory(pairingData);
    }
  }

  saveAnalytics() {
    this.saveInventory(); // Analytics are saved with inventory
  }

  /**
   * Utility methods
   */
  generateCigarId() {
    return 'cigar_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateAlertId() {
    return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Simple HTML escape to prevent XSS when injecting dynamic content
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

// Initialize Virtual Humidor System
window.virtualHumidor = new VirtualHumidorSystem();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VirtualHumidorSystem;
}
