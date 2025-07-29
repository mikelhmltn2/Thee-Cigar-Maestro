/**
 * Enhanced UI Manager for Thee Cigar Maestro
 * Provides intuitive navigation, user feedback, and responsive interface management
 */

import loadingSystem from './LoadingSystem.js';

class UIManager {
  constructor() {
    this.currentSection = 'explore';
    this.sidePanel = null;
    this.modalOverlay = null;
    this.loadingOverlay = null;
    this.toastContainer = null;
    
    this.mobileBreakpoint = 768;
    this.isMobile = window.innerWidth <= this.mobileBreakpoint;
    
    this.navigationState = {
      history: ['explore'],
      currentIndex: 0
    };
    
    this.userPreferences = {
      theme: 'dark',
      animations: true,
      autoSave: true,
      notifications: true
    };
    
    this.init();
  }

  /**
   * Initialize the UI Manager
   */
  init() {
    this.initializeElements();
    this.setupEventListeners();
    this.loadUserPreferences();
    this.setupKeyboardNavigation();
    this.setupGestureHandling();
    this.initializeTooltips();
    
    console.info('🎨 UI Manager initialized');
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.sidePanel = document.getElementById('sidePanel');
    this.modalOverlay = document.getElementById('modalOverlay');
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.toastContainer = document.getElementById('toastContainer');
    this.panelContent = document.getElementById('panelContent');
    this.modalContent = document.getElementById('modalContent');
    this.infoDisplay = document.getElementById('infoDisplay');
    this.dynamicInfo = document.getElementById('dynamicInfo');
  }

  /**
   * Setup event listeners for navigation and interaction
   */
  setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-button, .mobile-nav-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const section = e.target.dataset.section || e.target.closest('[data-section]')?.dataset.section;
        if (section) {
          this.navigateToSection(section);
        }
      });
    });

    // Mobile menu with enhanced toggle logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMobileMenu();
      });

      // Add keyboard accessibility
      mobileMenuBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleMobileMenu();
        }
      });

      // Update ARIA attributes
      mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.setAttribute('aria-controls', 'sidePanel');
    }

    // Panel controls
    const closePanelBtn = document.getElementById('closePanelBtn');
    if (closePanelBtn) {
      closePanelBtn.addEventListener('click', () => {
        this.closeSidePanel();
      });
    }

    // Modal controls
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Quick action buttons
    this.setupQuickActions();

    // Filter controls
    this.setupFilterControls();

    // Window resize handling
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Click outside handlers
    this.setupClickOutsideHandlers();
  }

  /**
   * Setup quick action buttons
   */
  setupQuickActions() {
    const aiChatBtn = document.getElementById('aiChatBtn');
    const recordBtn = document.getElementById('recordBtn');
    const helpBtn = document.getElementById('helpBtn');

    if (aiChatBtn) {
      aiChatBtn.addEventListener('click', () => {
        this.openAIChat();
      });
    }

    if (recordBtn) {
      recordBtn.addEventListener('click', () => {
        this.startRecording();
      });
    }

    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.showHelp();
      });
    }
  }

  /**
   * Setup filter controls
   */
  setupFilterControls() {
    const filterInputs = document.querySelectorAll('#wrapperFilters input[type="checkbox"]');
    filterInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.handleFilterChange(e.target.value, e.target.checked);
      });
    });
  }

  /**
   * Handle filter changes
   */
  handleFilterChange(wrapper, checked) {
    // Emit custom event for the main application to handle
    const event = new CustomEvent('filterChange', {
      detail: { wrapper, checked }
    });
    document.dispatchEvent(event);
    
    this.showToast(`${wrapper} cigars ${checked ? 'shown' : 'hidden'}`, 'success');
  }

  /**
   * Navigate to a specific section
   */
  navigateToSection(section) {
    if (this.currentSection === section) return;

    // Update navigation state
    this.navigationState.history.push(section);
    this.navigationState.currentIndex = this.navigationState.history.length - 1;

    // Update UI
    this.updateActiveNavButton(section);
    this.currentSection = section;

    // Load section content
    this.loadSectionContent(section);

    // Update side panel
    this.updateSidePanel(section);

    // Update info display
    this.updateInfoDisplay(section);

    // Close mobile menu if open
    if (this.isMobile) {
      this.closeSidePanel();
    }
  }

  /**
   * Update active navigation button
   */
  updateActiveNavButton(section) {
    document.querySelectorAll('.nav-button, .mobile-nav-item').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.section === section) {
        btn.classList.add('active');
      }
    });
  }

  /**
   * Load content for a specific section
   */
  loadSectionContent(section) {
    loadingSystem.startLoading('section-content', {
      element: this.panelContent,
      message: `Loading ${section} content...`,
      showSkeleton: true,
      skeletonType: 'default'
    });

    // Simulate content loading
    setTimeout(() => {
      const content = this.generateSectionContent(section);
      this.panelContent.innerHTML = content;
      loadingSystem.finishLoading('section-content', true);
    }, 300);
  }

  /**
   * Generate content for different sections
   */
  generateSectionContent(section) {
    const contentMap = {
      explore: `
        <div class="section-content">
          <h4>🌀 Explore Cigars</h4>
          <p>Discover cigars in the 3D visualization. Use the filters to narrow down your search.</p>
          <div class="action-list">
            <button class="action-item" onclick="uiManager.resetFilters()">
              🔄 Reset Filters
            </button>
            <button class="action-item" onclick="uiManager.randomCigar()">
              🎲 Random Cigar
            </button>
            <button class="action-item" onclick="uiManager.toggleView()">
              👁️ Toggle View Mode
            </button>
          </div>
        </div>
      `,
      education: `
        <div class="section-content">
          <h4>📚 Educational Content</h4>
          <p>Learn about cigar construction, flavor profiles, and traditions.</p>
          <div class="lesson-list">
            <div class="lesson-item" onclick="uiManager.openLesson('basics')">
              <h5>Cigar Basics</h5>
              <p>Wrapper, binder, and filler fundamentals</p>
            </div>
            <div class="lesson-item" onclick="uiManager.openLesson('flavors')">
              <h5>Flavor Profiles</h5>
              <p>Understanding taste and aroma complexities</p>
            </div>
            <div class="lesson-item" onclick="uiManager.openLesson('pairing')">
              <h5>Pairing Principles</h5>
              <p>Matching cigars with beverages and food</p>
            </div>
          </div>
        </div>
      `,
      pairings: `
        <div class="section-content">
          <h4>🍷 Pairing Engine</h4>
          <p>Find the perfect beverage or food pairing for your cigar.</p>
          <div class="pairing-search">
            <input type="text" id="pairingInput" placeholder="Enter beverage or food..." 
                   class="search-input" />
            <button onclick="uiManager.findPairings()" class="search-btn">Find Pairings</button>
          </div>
          <div id="pairingResults" class="pairing-results"></div>
        </div>
      `,
      journal: `
        <div class="section-content">
          <h4>📝 Tasting Journal</h4>
          <p>Record your cigar experiences and build your personal database.</p>
          <div class="journal-actions">
            <button class="action-item" onclick="uiManager.newJournalEntry()">
              ➕ New Entry
            </button>
            <button class="action-item" onclick="uiManager.viewJournal()">
              📖 View Entries
            </button>
            <button class="action-item" onclick="uiManager.exportJournal()">
              💾 Export Journal
            </button>
          </div>
        </div>
      `,
      search: `
        <div class="section-content">
          <h4>🔍 Advanced Search</h4>
          <p>Search cigars by name, wrapper, origin, or flavor notes.</p>
          <div class="search-interface">
            <input type="text" id="searchInput" placeholder="Search cigars..." 
                   class="search-input" />
            <div class="search-filters">
              <select id="searchCategory">
                <option value="all">All Categories</option>
                <option value="name">Name</option>
                <option value="wrapper">Wrapper</option>
                <option value="origin">Origin</option>
                <option value="flavor">Flavor</option>
              </select>
            </div>
            <div id="searchResults" class="search-results"></div>
          </div>
        </div>
      `,
      humidor: `
        <div class="section-content">
          <h4>🏛️ Personal Humidor</h4>
          <p>Manage your cigar collection with intelligent tracking and aging insights.</p>
          
          <div class="humidor-stats">
            <div class="stat-card">
              <div class="stat-number" id="totalCigars">47</div>
              <div class="stat-label">Total Cigars</div>
            </div>
            <div class="stat-card">
              <div class="stat-number" id="humidityLevel">68%</div>
              <div class="stat-label">Humidity</div>
            </div>
            <div class="stat-card">
              <div class="stat-number" id="temperature">70°F</div>
              <div class="stat-label">Temperature</div>
            </div>
            <div class="stat-card">
              <div class="stat-number" id="readyToSmoke">12</div>
              <div class="stat-label">Ready to Smoke</div>
            </div>
          </div>

          <div class="humidor-actions">
            <button class="action-item" onclick="uiManager.addToHumidor()">
              ➕ Add Cigar
            </button>
            <button class="action-item" onclick="uiManager.scanQRCode()">
              📷 Scan QR Code
            </button>
            <button class="action-item" onclick="uiManager.viewInventory()">
              📦 View Inventory
            </button>
            <button class="action-item" onclick="uiManager.agingReport()">
              📈 Aging Report
            </button>
            <button class="action-item" onclick="uiManager.humidorSettings()">
              ⚙️ Humidor Settings
            </button>
          </div>

          <div class="recent-additions">
            <h5>Recent Additions</h5>
            <div class="cigar-list">
              <div class="cigar-item">
                <div class="cigar-info">
                  <span class="cigar-name">Montecristo No. 2</span>
                  <span class="cigar-date">Added 2 days ago</span>
                </div>
                <div class="cigar-status ready">Ready</div>
              </div>
              <div class="cigar-item">
                <div class="cigar-info">
                  <span class="cigar-name">Padron 1964 Anniversary</span>
                  <span class="cigar-date">Added 1 week ago</span>
                </div>
                <div class="cigar-status aging">Aging</div>
              </div>
              <div class="cigar-item">
                <div class="cigar-info">
                  <span class="cigar-name">Arturo Fuente Opus X</span>
                  <span class="cigar-date">Added 2 weeks ago</span>
                </div>
                <div class="cigar-status aging">Aging</div>
              </div>
            </div>
          </div>
        </div>
      `
    };

    return contentMap[section] || '<p>Content coming soon...</p>';
  }

  /**
   * Update side panel for current section
   */
  updateSidePanel(section) {
    const panelTitle = document.getElementById('panelTitle');
    const titleMap = {
      explore: '🌀 Explore Cigars',
      education: '📚 Learn',
      pairings: '🍷 Pairings',
      journal: '📝 Journal',
      search: '🔍 Search',
      humidor: '🏛️ Humidor'
    };

    if (panelTitle) {
      panelTitle.textContent = titleMap[section] || section;
    }

    // Auto-open panel on mobile for certain sections
    if (this.isMobile && ['education', 'pairings', 'journal', 'search', 'humidor'].includes(section)) {
      this.openSidePanel();
    }
  }

  /**
   * Update info display based on current section
   */
  updateInfoDisplay(section) {
    const infoMap = {
      explore: 'Click on any cigar in the 3D space to learn more about its flavor profile, wrapper, and perfect pairings.',
      education: 'Explore our educational content to deepen your cigar knowledge and expertise.',
      pairings: 'Discover perfect beverage and food pairings to enhance your cigar experience.',
      journal: 'Document your cigar journey with detailed tasting notes and personal reviews.',
      search: 'Use advanced search to find exactly the cigar you\'re looking for.',
      humidor: 'Manage your personal cigar collection with smart tracking, aging insights, and environmental monitoring.'
    };

    if (this.dynamicInfo) {
      this.dynamicInfo.innerHTML = `<p>${infoMap[section]}</p>`;
    }
  }

  /**
   * Toggle mobile menu with enhanced logic for mobile devices
   */
  toggleMobileMenu() {
    if (!this.isMobile) {
      // On desktop, use regular side panel behavior
      this.toggleSidePanel();
      return;
    }

    // Enhanced mobile menu logic
    const isOpen = this.sidePanel.classList.contains('open');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }

    // Update button state and ARIA attributes
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', (!isOpen).toString());
      mobileMenuBtn.innerHTML = isOpen ? '☰' : '✕';
      mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    }

    // Track mobile menu usage
    if (window.gtag) {
      window.gtag('event', 'mobile_menu_toggle', {
        'event_category': 'user_interface',
        'event_label': isOpen ? 'close' : 'open',
        'value': 1
      });
    }
  }

  /**
   * Toggle side panel (desktop behavior)
   */
  toggleSidePanel() {
    if (this.sidePanel.classList.contains('open')) {
      this.closeSidePanel();
    } else {
      this.openSidePanel();
    }
  }

  /**
   * Open mobile menu with animation and accessibility
   */
  openMobileMenu() {
    if (!this.sidePanel || !this.isMobile) return;

    // Add opening class for animation
    this.sidePanel.classList.add('opening');
    this.sidePanel.classList.add('open');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.classList.add('mobile-menu-open');

    // Add backdrop
    this.addMobileMenuBackdrop();

    // Focus management for accessibility
    setTimeout(() => {
      this.sidePanel.classList.remove('opening');
      const firstFocusable = this.sidePanel.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 50);

    // Add escape key listener
    this.addEscapeKeyListener();
  }

  /**
   * Close mobile menu with animation
   */
  closeMobileMenu() {
    if (!this.sidePanel) return;

    // Add closing animation class
    this.sidePanel.classList.add('closing');
    
    setTimeout(() => {
      this.sidePanel.classList.remove('open', 'closing');
      document.body.style.overflow = 'auto';
      document.body.classList.remove('mobile-menu-open');
      this.removeMobileMenuBackdrop();
      this.removeEscapeKeyListener();
      
      // Return focus to menu button
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      if (mobileMenuBtn) {
        mobileMenuBtn.focus();
      }
    }, 300); // Match CSS transition duration
  }

  /**
   * Open side panel (desktop behavior)
   */
  openSidePanel() {
    if (this.sidePanel) {
      this.sidePanel.classList.add('open');
      document.body.style.overflow = this.isMobile ? 'hidden' : 'auto';
    }
  }

  /**
   * Close side panel (desktop behavior)
   */
  closeSidePanel() {
    if (this.sidePanel) {
      this.sidePanel.classList.remove('open');
      document.body.style.overflow = 'auto';
      
      // Also close mobile menu if it's open
      if (this.isMobile) {
        this.closeMobileMenu();
      }
    }
  }

  /**
   * Add backdrop for mobile menu
   */
  addMobileMenuBackdrop() {
    if (document.querySelector('.mobile-menu-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop';
    backdrop.addEventListener('click', () => this.closeMobileMenu());
    document.body.appendChild(backdrop);

    // Animate backdrop
    setTimeout(() => backdrop.classList.add('visible'), 10);
  }

  /**
   * Remove mobile menu backdrop
   */
  removeMobileMenuBackdrop() {
    const backdrop = document.querySelector('.mobile-menu-backdrop');
    if (backdrop) {
      backdrop.classList.remove('visible');
      setTimeout(() => backdrop.remove(), 300);
    }
  }

  /**
   * Add escape key listener for mobile menu
   */
  addEscapeKeyListener() {
    this.escapeKeyHandler = (e) => {
      if (e.key === 'Escape' && this.isMobile && this.sidePanel.classList.contains('open')) {
        this.closeMobileMenu();
      }
    };
    document.addEventListener('keydown', this.escapeKeyHandler);
  }

  /**
   * Remove escape key listener
   */
  removeEscapeKeyListener() {
    if (this.escapeKeyHandler) {
      document.removeEventListener('keydown', this.escapeKeyHandler);
      this.escapeKeyHandler = null;
    }
  }

  /**
   * Show modal with content
   */
  showModal(title, content) {
    if (!this.modalOverlay) return;

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
      modalTitle.textContent = title;
    }

    if (this.modalContent) {
      this.modalContent.innerHTML = content;
    }

    this.modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Focus trap for accessibility
    this.trapFocus(this.modalOverlay);
  }

  /**
   * Close modal
   */
  closeModal() {
    if (this.modalOverlay) {
      this.modalOverlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  /**
   * Show loading overlay
   */
  showLoading(message = 'Loading...') {
    if (this.loadingOverlay) {
      const loadingMessage = document.getElementById('loadingMessage');
      if (loadingMessage) {
        loadingMessage.textContent = message;
      }
      this.loadingOverlay.style.display = 'flex';
    }
  }

  /**
   * Hide loading overlay
   */
  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.style.display = 'none';
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info', duration = 3000) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    this.toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto-hide toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= this.mobileBreakpoint;

    // Handle transitions between mobile and desktop
    if (wasMobile && !this.isMobile) {
      // Switching from mobile to desktop
      this.closeMobileMenu();
      this.removeMobileMenuBackdrop();
      this.removeEscapeKeyListener();
      document.body.classList.remove('mobile-menu-open');
      
      // Reset mobile menu button
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
      }
    }

    // Handle side panel state when switching to mobile
    if (!wasMobile && this.isMobile) {
      // Close side panel if open when switching to mobile
      if (this.sidePanel && this.sidePanel.classList.contains('open')) {
        this.closeSidePanel();
      }
    }
  }

  /**
   * Setup click outside handlers
   */
  setupClickOutsideHandlers() {
    document.addEventListener('click', (e) => {
      // Close side panel when clicking outside on mobile
      if (this.isMobile && this.sidePanel && this.sidePanel.classList.contains('open')) {
        if (!this.sidePanel.contains(e.target) && !e.target.closest('.mobile-menu-btn')) {
          this.closeSidePanel();
        }
      }

      // Close modal when clicking outside
      if (this.modalOverlay && this.modalOverlay.style.display === 'flex') {
        if (e.target === this.modalOverlay) {
          this.closeModal();
        }
      }
    });
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC key handling
      if (e.key === 'Escape') {
        if (this.modalOverlay && this.modalOverlay.style.display === 'flex') {
          this.closeModal();
        } else if (this.sidePanel && this.sidePanel.classList.contains('open')) {
          this.closeSidePanel();
        }
      }

      // Number keys for quick navigation
      if (e.key >= '1' && e.key <= '5' && !e.target.matches('input, textarea')) {
        const sections = ['explore', 'education', 'pairings', 'journal', 'search'];
        const index = parseInt(e.key, 10) - 1;
        if (sections[index]) {
          this.navigateToSection(sections[index]);
        }
      }

      // Ctrl+S for save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.saveCurrentState();
      }

      // ? for help
      if (e.key === '?' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        this.showHelp();
      }
    });
  }

  /**
   * Setup gesture handling for mobile
   */
  setupGestureHandling() {
    let startX = 0;
    let startY = 0;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Swipe gestures
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
        if (deltaX > 0) {
          // Swipe right - open panel
          if (!this.sidePanel.classList.contains('open')) {
            this.openSidePanel();
          }
        } else {
          // Swipe left - close panel
          if (this.sidePanel.classList.contains('open')) {
            this.closeSidePanel();
          }
        }
      }

      startX = 0;
      startY = 0;
    });
  }

  /**
   * Initialize tooltips
   */
  initializeTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[title]');
    elementsWithTooltips.forEach(element => {
      this.createTooltip(element);
    });
  }

  /**
   * Create tooltip for an element
   */
  createTooltip(element) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = element.title;
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
    `;

    document.body.appendChild(tooltip);

    element.addEventListener('mouseenter', (e) => {
      tooltip.style.opacity = '1';
      this.positionTooltip(tooltip, e.target);
    });

    element.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });

    element.addEventListener('mousemove', (e) => {
      this.positionTooltip(tooltip, e.target);
    });

    // Remove default title to avoid double tooltips
    element.removeAttribute('title');
  }

  /**
   * Position tooltip relative to element
   */
  positionTooltip(tooltip, element) {
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
  }

  /**
   * Trap focus within element for accessibility
   */
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });

    firstElement.focus();
  }

  /**
   * Load user preferences
   */
  loadUserPreferences() {
    try {
      const saved = localStorage.getItem('cigar-maestro-preferences');
      if (saved) {
        this.userPreferences = { ...this.userPreferences, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Could not load user preferences:', error);
    }
  }

  /**
   * Save user preferences
   */
  saveUserPreferences() {
    try {
      localStorage.setItem('cigar-maestro-preferences', JSON.stringify(this.userPreferences));
    } catch (error) {
      console.warn('Could not save user preferences:', error);
    }
  }

  /**
   * Quick action methods
   */
  openAIChat() {
    this.showModal('🤖 AI Assistant', `
      <div class="ai-chat-interface">
        <div class="chat-messages" id="chatMessages">
          <div class="message assistant">
            Hello! I'm your cigar assistant. How can I help you today?
          </div>
        </div>
        <div class="chat-input">
          <input type="text" id="chatInput" placeholder="Ask me anything about cigars..." />
          <button onclick="uiManager.sendChatMessage()">Send</button>
        </div>
      </div>
    `);
  }

  startRecording() {
    this.showToast('Starting voice recording...', 'info');
    // Implementation would connect to existing voice recording functionality
  }

  showHelp() {
    this.showModal('❓ Help & Tour', `
      <div class="help-content">
        <h4>Welcome to Thee Cigar Maestro!</h4>
        
        <div class="help-section">
          <h5>🎯 Quick Start</h5>
          <button onclick="uiManager.restartTour()" 
                  style="background: #c69c6d; color: #121212; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; font-weight: bold; margin-bottom: 1rem;">
            🚀 Take the Interactive Tour
          </button>
          <p>New to the app? Take our guided tour to learn all the features!</p>
        </div>
        
        <div class="help-section">
          <h5>Navigation</h5>
          <p>Use the navigation bar to switch between different sections:</p>
          <ul>
            <li><strong>🌀 Explore:</strong> 3D visualization of cigars</li>
            <li><strong>📚 Learn:</strong> Educational content and courses</li>
            <li><strong>🍷 Pairings:</strong> Find perfect drink pairings</li>
            <li><strong>📝 Journal:</strong> Record your tasting experiences</li>
            <li><strong>🔍 Search:</strong> Find specific cigars</li>
          </ul>
        </div>
        
        <div class="help-section">
          <h5>Keyboard Shortcuts</h5>
          <ul>
            <li><strong>1-5:</strong> Quick navigation to sections</li>
            <li><strong>ESC:</strong> Close panels and modals</li>
            <li><strong>Ctrl+S:</strong> Save current state</li>
            <li><strong>?:</strong> Show this help dialog</li>
          </ul>
        </div>
        
        <div class="help-section">
          <h5>Mobile Gestures</h5>
          <ul>
            <li><strong>Swipe right:</strong> Open side panel</li>
            <li><strong>Swipe left:</strong> Close side panel</li>
            <li><strong>Pinch to zoom:</strong> In 3D view</li>
            <li><strong>Drag to rotate:</strong> Navigate 3D space</li>
          </ul>
        </div>
        
        <div class="help-section">
          <h5>Tips & Tricks</h5>
          <ul>
            <li>Click any cigar in the 3D view to see detailed information</li>
            <li>Use filters to narrow down cigars by wrapper type</li>
            <li>Try the AI assistant for personalized recommendations</li>
            <li>Record voice notes while tasting for a complete journal</li>
            <li>Explore educational content to become a cigar expert</li>
          </ul>
        </div>
      </div>
    `);
  }

  restartTour() {
    this.closeModal();
    if (window.onboardingTour) {
      window.onboardingTour.start();
    }
  }

  // Additional utility methods would be added here for specific functionality
  resetFilters() {
    document.querySelectorAll('#wrapperFilters input').forEach(input => {
      input.checked = true;
    });
    this.showToast('Filters reset', 'success');
  }

  randomCigar() {
    // Emit event for main app to handle
    document.dispatchEvent(new CustomEvent('randomCigar'));
    this.showToast('Selecting random cigar...', 'info');
  }

  saveCurrentState() {
    // Save current application state
    this.showToast('State saved', 'success');
  }

  /**
   * Humidor functionality methods
   */
  addToHumidor() {
    this.showModal('➕ Add Cigar to Humidor', `
      <div class="add-cigar-form">
        <div class="form-group">
          <label for="cigarName">Cigar Name</label>
          <input type="text" id="cigarName" placeholder="e.g., Montecristo No. 2" class="search-input" />
        </div>
        <div class="form-group">
          <label for="cigarBrand">Brand</label>
          <input type="text" id="cigarBrand" placeholder="e.g., Montecristo" class="search-input" />
        </div>
        <div class="form-group">
          <label for="cigarWrapper">Wrapper</label>
          <select id="cigarWrapper" class="search-input">
            <option value="">Select wrapper</option>
            <option value="Connecticut">Connecticut</option>
            <option value="Maduro">Maduro</option>
            <option value="Habano">Habano</option>
            <option value="Oscuro">Oscuro</option>
            <option value="Natural">Natural</option>
          </select>
        </div>
        <div class="form-group">
          <label for="cigarQuantity">Quantity</label>
          <input type="number" id="cigarQuantity" value="1" min="1" class="search-input" />
        </div>
        <div class="form-group">
          <label for="purchaseDate">Purchase Date</label>
          <input type="date" id="purchaseDate" class="search-input" />
        </div>
        <div class="form-group">
          <label for="cigarNotes">Notes</label>
          <textarea id="cigarNotes" placeholder="Optional notes about this cigar..." rows="3" class="search-input"></textarea>
        </div>
        <div class="form-actions">
          <button onclick="uiManager.saveCigarToHumidor()" class="action-btn primary">
            💾 Save to Humidor
          </button>
          <button onclick="uiManager.closeModal()" class="action-btn">
            ❌ Cancel
          </button>
        </div>
      </div>
    `);
  }

  scanQRCode() {
    this.showModal('📷 Scan QR Code', `
      <div class="qr-scanner">
        <div class="scanner-placeholder">
          <div class="camera-icon">📷</div>
          <p>Position the QR code within the frame</p>
          <div class="scan-frame"></div>
        </div>
        <div class="scanner-controls">
          <button onclick="uiManager.startScanning()" class="action-btn primary">
            📸 Start Camera
          </button>
          <button onclick="uiManager.manualEntry()" class="action-btn">
            ⌨️ Manual Entry
          </button>
        </div>
      </div>
    `);
  }

  viewInventory() {
    this.showModal('📦 Humidor Inventory', `
      <div class="inventory-view">
        <div class="inventory-filters">
          <select id="sortBy" class="search-input" style="margin-bottom: 1rem;">
            <option value="recent">Sort by: Recently Added</option>
            <option value="alphabetical">Sort by: Name A-Z</option>
            <option value="wrapper">Sort by: Wrapper Type</option>
            <option value="ready">Sort by: Ready to Smoke</option>
          </select>
        </div>
        <div class="inventory-grid">
          <div class="inventory-item">
            <div class="item-info">
              <h5>Montecristo No. 2</h5>
              <p>Maduro • Added 2 days ago • Qty: 5</p>
              <div class="item-status ready">Ready to Smoke</div>
            </div>
            <div class="item-actions">
              <button onclick="uiManager.editCigar('1')" class="action-btn">✏️</button>
              <button onclick="uiManager.smokeCigar('1')" class="action-btn primary">🔥</button>
            </div>
          </div>
          <div class="inventory-item">
            <div class="item-info">
              <h5>Padron 1964 Anniversary</h5>
              <p>Natural • Added 1 week ago • Qty: 3</p>
              <div class="item-status aging">Aging (2 weeks left)</div>
            </div>
            <div class="item-actions">
              <button onclick="uiManager.editCigar('2')" class="action-btn">✏️</button>
              <button onclick="uiManager.smokeCigar('2')" class="action-btn" disabled>🕐</button>
            </div>
          </div>
          <div class="inventory-item">
            <div class="item-info">
              <h5>Arturo Fuente Opus X</h5>
              <p>Habano • Added 2 weeks ago • Qty: 2</p>
              <div class="item-status aging">Aging (1 month left)</div>
            </div>
            <div class="item-actions">
              <button onclick="uiManager.editCigar('3')" class="action-btn">✏️</button>
              <button onclick="uiManager.smokeCigar('3')" class="action-btn" disabled>🕐</button>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  agingReport() {
    this.showModal('📈 Aging Report & Analytics', `
      <div class="aging-report">
        <div class="report-summary">
          <h5>📊 Collection Overview</h5>
          <div class="aging-stats">
            <div class="aging-stat">
              <span class="stat-number">12</span>
              <span class="stat-label">Ready to Smoke</span>
            </div>
            <div class="aging-stat">
              <span class="stat-number">25</span>
              <span class="stat-label">Currently Aging</span>
            </div>
            <div class="aging-stat">
              <span class="stat-number">10</span>
              <span class="stat-label">Optimal Window</span>
            </div>
          </div>
        </div>
        
        <div class="aging-recommendations">
          <h5>🎯 AI Recommendations</h5>
          <div class="recommendation-item">
            <strong>🔴 Smoke Soon:</strong> Montecristo White Series - optimal window closing in 1 week
          </div>
          <div class="recommendation-item">
            <strong>🟡 Check Progress:</strong> Padron Anniversary Series - entering peak aging window
          </div>
          <div class="recommendation-item">
            <strong>🟢 Continue Aging:</strong> Opus X collection - 2 months until optimal
          </div>
        </div>

        <div class="aging-chart-placeholder">
          <h5>📈 Aging Timeline</h5>
          <div class="chart-area">
            <p style="text-align: center; color: #a67856; font-style: italic;">
              Interactive aging timeline chart would appear here
            </p>
          </div>
        </div>
      </div>
    `);
  }

  humidorSettings() {
    this.showModal('⚙️ Humidor Settings', `
      <div class="humidor-settings">
        <div class="settings-section">
          <h5>🌡️ Environmental Controls</h5>
          <div class="setting-item">
            <label>Target Humidity (%)</label>
            <input type="range" min="65" max="75" value="68" class="humidity-slider" />
            <span class="setting-value">68%</span>
          </div>
          <div class="setting-item">
            <label>Target Temperature (°F)</label>
            <input type="range" min="65" max="75" value="70" class="temp-slider" />
            <span class="setting-value">70°F</span>
          </div>
        </div>

        <div class="settings-section">
          <h5>🔔 Notifications</h5>
          <div class="setting-toggle">
            <label>
              <input type="checkbox" checked /> Humidity alerts
            </label>
          </div>
          <div class="setting-toggle">
            <label>
              <input type="checkbox" checked /> Temperature alerts
            </label>
          </div>
          <div class="setting-toggle">
            <label>
              <input type="checkbox" checked /> Aging reminders
            </label>
          </div>
          <div class="setting-toggle">
            <label>
              <input type="checkbox" /> Weekly inventory reports
            </label>
          </div>
        </div>

        <div class="settings-section">
          <h5>🤖 AI Features</h5>
          <div class="setting-toggle">
            <label>
              <input type="checkbox" checked /> Smart aging recommendations
            </label>
          </div>
          <div class="setting-toggle">
            <label>
              <input type="checkbox" checked /> Optimal smoking windows
            </label>
          </div>
          <div class="setting-toggle">
            <label>
              <input type="checkbox" /> Auto-reorder suggestions
            </label>
          </div>
        </div>

        <div class="settings-actions">
          <button onclick="uiManager.saveHumidorSettings()" class="action-btn primary">
            💾 Save Settings
          </button>
          <button onclick="uiManager.resetToDefaults()" class="action-btn">
            🔄 Reset to Defaults
          </button>
        </div>
      </div>
    `);
  }

  saveCigarToHumidor() {
    const name = document.getElementById('cigarName')?.value;
    const brand = document.getElementById('cigarBrand')?.value;
    
    if (!name || !brand) {
      this.showToast('Please fill in the required fields', 'error');
      return;
    }
    
    this.showToast(`Added ${name} to your humidor!`, 'success');
    this.closeModal();
    // Update humidor stats
    this.updateHumidorStats();
  }

  startScanning() {
    this.showToast('Starting camera for QR scanning...', 'info');
    // Implementation would connect to camera API
  }

  manualEntry() {
    this.closeModal();
    this.addToHumidor();
  }

  editCigar(id) {
    this.showToast(`Editing cigar ${id}...`, 'info');
  }

  smokeCigar(id) {
    this.closeModal();
    this.navigateToSection('journal');
    this.showToast('Starting smoking session. Document your experience!', 'success');
  }

  saveHumidorSettings() {
    this.showToast('Humidor settings saved successfully!', 'success');
    this.closeModal();
  }

  resetToDefaults() {
    this.showToast('Settings reset to defaults', 'info');
  }

  updateHumidorStats() {
    // Update the stats in the humidor section
    const totalCigars = document.getElementById('totalCigars');
    const readyToSmoke = document.getElementById('readyToSmoke');
    
    if (totalCigars) {
      const current = parseInt(totalCigars.textContent) || 47;
      totalCigars.textContent = current + 1;
    }
    
    if (readyToSmoke) {
      const current = parseInt(readyToSmoke.textContent) || 12;
      readyToSmoke.textContent = current + 1;
    }
  }
}

// Export for use in main application
export default UIManager;