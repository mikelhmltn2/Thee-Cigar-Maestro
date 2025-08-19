/**
 * Advanced Controls Panel for Thee Cigar Maestro
 * Provides sophisticated controls for 3D scene manipulation, search, and filtering
 */

class AdvancedControlsPanel {
  constructor(uiManager, dataManager) {
    this.uiManager = uiManager;
    this.dataManager = dataManager;
    this.isInitialized = false;
    this.activeFilters = {
      wrapper: new Set(['all']),
      strength: new Set(['all']),
      origin: new Set(['all']),
      price: { min: 0, max: 1000 },
    };
    this.searchQuery = '';
    this.visualizationMode = 'default';

    this.init();
  }

  init() {
    this.createControlsHTML();
    this.setupEventListeners();
    this.isInitialized = true;
    console.info('🎛️ Advanced Controls Panel initialized');
  }

  createControlsHTML() {
    const controlsContainer =
      document.querySelector('.floating-controls') || this.createControlsContainer();

    const advancedControls = document.createElement('div');
    advancedControls.className = 'control-group advanced-controls';
    advancedControls.innerHTML = `
      <h3>🎯 Advanced Controls</h3>
      
      <!-- Search Section -->
      <div class="control-section">
        <div class="search-container">
          <input type="text" id="advancedSearch" class="search-input" 
                 placeholder="Search cigars, flavors, pairings..." />
          <button id="searchBtn" class="search-btn">🔍 Search</button>
          <div id="searchSuggestions" class="search-suggestions"></div>
        </div>
      </div>

      <!-- Visualization Controls -->
      <div class="control-section">
        <h4>📊 Visualization</h4>
        <div class="viz-controls">
          <select id="visualizationMode" class="control-select">
            <option value="default">Default View</option>
            <option value="strength">By Strength</option>
            <option value="wrapper">By Wrapper Type</option>
            <option value="origin">By Origin</option>
            <option value="flavor">Flavor Profile</option>
            <option value="price">Price Range</option>
          </select>
          
          <div class="color-coding-legend" id="colorLegend">
            <!-- Dynamic color legend will be inserted here -->
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="control-section">
        <h4>🔧 Filters</h4>
        
        <!-- Wrapper Type Filter -->
        <div class="filter-group">
          <label>Wrapper Type:</label>
          <div class="filter-options">
            <label><input type="checkbox" value="all" checked> All Types</label>
            <label><input type="checkbox" value="Maduro"> Maduro</label>
            <label><input type="checkbox" value="Connecticut"> Connecticut</label>
            <label><input type="checkbox" value="Habano"> Habano</label>
            <label><input type="checkbox" value="Natural"> Natural</label>
            <label><input type="checkbox" value="Oscuro"> Oscuro</label>
          </div>
        </div>

        <!-- Strength Filter -->
        <div class="filter-group">
          <label>Strength:</label>
          <div class="filter-options">
            <label><input type="checkbox" value="all" checked> All Strengths</label>
            <label><input type="checkbox" value="Mild"> Mild</label>
            <label><input type="checkbox" value="Medium"> Medium</label>
            <label><input type="checkbox" value="Full"> Full</label>
          </div>
        </div>

        <!-- Price Range Filter -->
        <div class="filter-group">
          <label>Price Range:</label>
          <div class="price-range">
            <input type="range" id="minPrice" min="0" max="1000" value="0" />
            <input type="range" id="maxPrice" min="0" max="1000" value="1000" />
            <div class="price-display">
              $<span id="minPriceDisplay">0</span> - $<span id="maxPriceDisplay">1000</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scene Controls -->
      <div class="control-section">
        <h4>🎬 Scene Controls</h4>
        <div class="scene-controls">
          <button id="resetCamera" class="control-btn">📷 Reset View</button>
          <button id="randomCigar" class="control-btn">🎲 Random Cigar</button>
          <button id="tourMode" class="control-btn">🎭 Virtual Tour</button>
          <button id="compareMode" class="control-btn">⚖️ Compare</button>
        </div>
      </div>

      <!-- Display Options -->
      <div class="control-section">
        <h4>⚙️ Display Options</h4>
        <div class="display-options">
          <label><input type="checkbox" id="showLabels" checked> Show Labels</label>
          <label><input type="checkbox" id="showConnections"> Show Flavor Connections</label>
          <label><input type="checkbox" id="enableAnimations" checked> Smooth Animations</label>
          <label><input type="checkbox" id="enableSounds"> Sound Effects</label>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="control-section">
        <h4>📈 Quick Stats</h4>
        <div class="quick-stats">
          <div class="stat-item">
            <span class="stat-label">Visible Cigars:</span>
            <span class="stat-value" id="visibleCount">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Collection:</span>
            <span class="stat-value" id="totalCount">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Avg. Rating:</span>
            <span class="stat-value" id="avgRating">-</span>
          </div>
        </div>
      </div>
    `;

    controlsContainer.appendChild(advancedControls);
    this.addControlsStyles();
  }

  addControlsStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .advanced-controls {
        max-width: 320px;
        max-height: 70vh;
        overflow-y: auto;
      }

      .control-section {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
      }

      .control-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .control-section h4 {
        margin: 0 0 0.75rem 0;
        font-size: 0.9rem;
        color: var(--accent-text);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .search-container {
        position: relative;
      }

      .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--secondary-bg);
        border: 1px solid var(--border-color);
        border-top: none;
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
      }

      .search-suggestion {
        padding: 0.75rem;
        cursor: pointer;
        border-bottom: 1px solid var(--border-color);
        transition: var(--transition);
      }

      .search-suggestion:hover {
        background: var(--accent-bg);
      }

      .search-suggestion:last-child {
        border-bottom: none;
      }

      .viz-controls {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .control-select {
        padding: 0.5rem;
        background: var(--accent-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        color: var(--primary-text);
        font-family: inherit;
        width: 100%;
      }

      .color-coding-legend {
        padding: 0.75rem;
        background: rgba(44, 44, 44, 0.3);
        border-radius: var(--border-radius);
        font-size: 0.8rem;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
      }

      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }

      .filter-group {
        margin-bottom: 1rem;
      }

      .filter-group label:first-child {
        font-weight: bold;
        color: var(--secondary-text);
        margin-bottom: 0.5rem;
      }

      .filter-options {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-left: 0.5rem;
      }

      .filter-options label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        cursor: pointer;
      }

      .price-range {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .price-range input[type="range"] {
        width: 100%;
        accent-color: var(--accent-text);
      }

      .price-display {
        text-align: center;
        font-size: 0.9rem;
        color: var(--secondary-text);
      }

      .scene-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }

      .control-btn {
        padding: 0.5rem;
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--primary-text);
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 0.8rem;
        transition: var(--transition);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
      }

      .control-btn:hover {
        border-color: var(--accent-text);
        background: rgba(198, 156, 109, 0.1);
      }

      .display-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .display-options label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        cursor: pointer;
      }

      .quick-stats {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
      }

      .stat-label {
        color: var(--secondary-text);
      }

      .stat-value {
        color: var(--accent-text);
        font-weight: bold;
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .advanced-controls {
          max-width: 280px;
        }

        .scene-controls {
          grid-template-columns: 1fr;
        }

        .control-btn {
          padding: 0.75rem;
          font-size: 0.9rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

  createControlsContainer() {
    const container = document.createElement('div');
    container.className = 'floating-controls';
    document.body.appendChild(container);
    return container;
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('advancedSearch');
    const searchBtn = document.getElementById('searchBtn');
    const _searchSuggestions = document.getElementById('searchSuggestions');

    if (searchInput) {
      searchInput.addEventListener('input', e => {
        this.handleSearchInput(e.target.value);
      });

      searchInput.addEventListener('focus', () => {
        if (this.searchQuery) {
          this.showSearchSuggestions();
        }
      });

      searchInput.addEventListener('blur', () => {
        // Delay hiding to allow clicking on suggestions
        setTimeout(() => {
          this.hideSearchSuggestions();
        }, 200);
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.performSearch();
      });
    }

    // Visualization mode
    const vizMode = document.getElementById('visualizationMode');
    if (vizMode) {
      vizMode.addEventListener('change', e => {
        this.changeVisualizationMode(e.target.value);
      });
    }

    // Filter controls
    this.setupFilterListeners();

    // Scene controls
    this.setupSceneControlListeners();

    // Display options
    this.setupDisplayOptionListeners();

    // Price range
    this.setupPriceRangeListeners();
  }

  setupFilterListeners() {
    // Wrapper type filters
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', e => {
        this.handleFilterChange(e.target);
      });
    });
  }

  setupSceneControlListeners() {
    const resetCamera = document.getElementById('resetCamera');
    const randomCigar = document.getElementById('randomCigar');
    const tourMode = document.getElementById('tourMode');
    const compareMode = document.getElementById('compareMode');

    if (resetCamera) {
      resetCamera.addEventListener('click', () => {
        this.resetCameraView();
      });
    }

    if (randomCigar) {
      randomCigar.addEventListener('click', () => {
        this.selectRandomCigar();
      });
    }

    if (tourMode) {
      tourMode.addEventListener('click', () => {
        this.startVirtualTour();
      });
    }

    if (compareMode) {
      compareMode.addEventListener('click', () => {
        this.toggleCompareMode();
      });
    }
  }

  setupDisplayOptionListeners() {
    const showLabels = document.getElementById('showLabels');
    const showConnections = document.getElementById('showConnections');
    const enableAnimations = document.getElementById('enableAnimations');
    const enableSounds = document.getElementById('enableSounds');

    if (showLabels) {
      showLabels.addEventListener('change', e => {
        this.toggleLabels(e.target.checked);
      });
    }

    if (showConnections) {
      showConnections.addEventListener('change', e => {
        this.toggleFlavorConnections(e.target.checked);
      });
    }

    if (enableAnimations) {
      enableAnimations.addEventListener('change', e => {
        this.toggleAnimations(e.target.checked);
      });
    }

    if (enableSounds) {
      enableSounds.addEventListener('change', e => {
        this.toggleSounds(e.target.checked);
      });
    }
  }

  setupPriceRangeListeners() {
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');

    if (minPrice && maxPrice) {
      minPrice.addEventListener('input', e => {
        this.updatePriceRange('min', e.target.value);
      });

      maxPrice.addEventListener('input', e => {
        this.updatePriceRange('max', e.target.value);
      });
    }
  }

  // Search functionality
  handleSearchInput(query) {
    this.searchQuery = query.toLowerCase();

    if (query.length >= 2) {
      this.generateSearchSuggestions(query);
      this.showSearchSuggestions();
    } else {
      this.hideSearchSuggestions();
    }

    // Real-time search if enabled
    if (query.length >= 3) {
      this.performSearch();
    }
  }

  generateSearchSuggestions(query) {
    const suggestions = [];
    const cigars = this.dataManager.data.cigars || [];

    // Search in cigar names
    cigars.forEach(cigar => {
      if (cigar.name && cigar.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'cigar',
          text: cigar.name,
          subtitle: `${cigar.wrapper || 'Unknown'} wrapper`,
        });
      }
    });

    // Search in flavor profiles
    cigars.forEach(cigar => {
      if (cigar.flavor && cigar.flavor.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'flavor',
          text: cigar.name,
          subtitle: `Flavor: ${cigar.flavor.substring(0, 50)}...`,
        });
      }
    });

    // Limit suggestions
    const limitedSuggestions = suggestions.slice(0, 8);
    this.displaySearchSuggestions(limitedSuggestions);
  }

  displaySearchSuggestions(suggestions) {
    const container = document.getElementById('searchSuggestions');
    if (!container) return;

    container.innerHTML = '';

    suggestions.forEach(suggestion => {
      const item = document.createElement('div');
      item.className = 'search-suggestion';
      item.innerHTML = `
        <div class="suggestion-main">${suggestion.text}</div>
        <div class="suggestion-subtitle">${suggestion.subtitle}</div>
      `;

      item.addEventListener('click', () => {
        this.selectSearchSuggestion(suggestion);
      });

      container.appendChild(item);
    });
  }

  showSearchSuggestions() {
    const container = document.getElementById('searchSuggestions');
    if (container) {
      container.style.display = 'block';
    }
  }

  hideSearchSuggestions() {
    const container = document.getElementById('searchSuggestions');
    if (container) {
      container.style.display = 'none';
    }
  }

  selectSearchSuggestion(suggestion) {
    const searchInput = document.getElementById('advancedSearch');
    if (searchInput) {
      searchInput.value = suggestion.text;
    }
    this.hideSearchSuggestions();
    this.performSearch();
  }

  performSearch() {
    const query = this.searchQuery;
    if (!query) return;

    // Filter cigars based on search query
    const cigars = this.dataManager.data.cigars || [];
    const matchingCigars = cigars.filter(cigar => {
      return (
        (cigar.name && cigar.name.toLowerCase().includes(query)) ||
        (cigar.flavor && cigar.flavor.toLowerCase().includes(query)) ||
        (cigar.wrapper && cigar.wrapper.toLowerCase().includes(query))
      );
    });

    // Update 3D scene visibility
    this.updateCigarVisibility(matchingCigars);

    // Show search results
    this.uiManager.showToast(
      `Found ${matchingCigars.length} cigars matching "${query}"`,
      matchingCigars.length > 0 ? 'success' : 'warning'
    );

    // Update stats
    this.updateQuickStats();
  }

  // Visualization controls
  changeVisualizationMode(mode) {
    this.visualizationMode = mode;

    const cigars = this.dataManager.data.cigars || [];
    let colorMap = {};

    switch (mode) {
      case 'wrapper':
        colorMap = {
          Maduro: 0x8b4513,
          Connecticut: 0xf5deb3,
          Habano: 0xcd853f,
          Natural: 0xdeb887,
          Oscuro: 0x2f1b14,
        };
        break;
      case 'strength':
        colorMap = {
          Mild: 0x90ee90,
          Medium: 0xffd700,
          Full: 0xff6347,
        };
        break;
      case 'origin':
        // Add origin-based coloring
        colorMap = {
          Cuban: 0xff4500,
          Dominican: 0x32cd32,
          Nicaraguan: 0x4169e1,
          Honduran: 0x8a2be2,
        };
        break;
      case 'price':
        // Price-based gradient
        colorMap = this.generatePriceColorMap(cigars);
        break;
      default:
        // Reset to default colors
        this.resetCigarColors();
        return;
    }

    this.applyCigarColors(colorMap, mode);
    this.updateColorLegend(colorMap, mode);
  }

  generatePriceColorMap(cigars) {
    const prices = cigars.map(c => c.price || 0).filter(p => p > 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return { min: minPrice, max: maxPrice };
  }

  applyCigarColors(colorMap, mode) {
    if (!window.cigarsInScene) return;

    window.cigarsInScene.forEach(cigar => {
      let color = 0xffffff; // Default white

      if (mode === 'price') {
        const price = cigar.userData.price || 0;
        const ratio = (price - colorMap.min) / (colorMap.max - colorMap.min);
        color = this.interpolateColor(0x00ff00, 0xff0000, ratio); // Green to red
      } else {
        const key = cigar.userData[mode] || 'Unknown';
        color = colorMap[key] || 0xffffff;
      }

      if (cigar.material) {
        cigar.material.color.setHex(color);
      }
    });
  }

  interpolateColor(color1, color2, ratio) {
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;

    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;

    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);

    return (r << 16) | (g << 8) | b;
  }

  updateColorLegend(colorMap, mode) {
    const legend = document.getElementById('colorLegend');
    if (!legend) return;

    legend.innerHTML = '<div class="legend-title">Color Coding:</div>';

    if (mode === 'price') {
      legend.innerHTML += `
        <div class="legend-item">
          <div class="legend-color" style="background: linear-gradient(to right, #00FF00, #FF0000)"></div>
          <span>$${colorMap.min} - $${colorMap.max}</span>
        </div>
      `;
    } else {
      Object.entries(colorMap).forEach(([key, color]) => {
        const hexColor = `#${color.toString(16).padStart(6, '0')}`;
        legend.innerHTML += `
          <div class="legend-item">
            <div class="legend-color" style="background-color: ${hexColor}"></div>
            <span>${key}</span>
          </div>
        `;
      });
    }
  }

  resetCigarColors() {
    if (!window.cigarsInScene) return;

    window.cigarsInScene.forEach(cigar => {
      if (cigar.material) {
        cigar.material.color.setHex(cigar.userData.originalColor || 0xffffff);
      }
    });

    const legend = document.getElementById('colorLegend');
    if (legend) {
      legend.innerHTML = '<div class="legend-title">Default View</div>';
    }
  }

  // Filter functionality
  handleFilterChange(checkbox) {
    const filterType = checkbox
      .closest('.filter-group')
      .querySelector('label')
      .textContent.replace(':', '')
      .toLowerCase();
    const { value } = checkbox;
    const isChecked = checkbox.checked;

    if (value === 'all') {
      // Handle "All" checkbox
      const otherCheckboxes = checkbox
        .closest('.filter-options')
        .querySelectorAll('input[type="checkbox"]:not([value="all"])');
      otherCheckboxes.forEach(cb => {
        cb.checked = isChecked;
      });

      if (isChecked) {
        this.activeFilters[filterType] = new Set(['all']);
      } else {
        this.activeFilters[filterType] = new Set();
      }
    } else {
      // Handle individual filter
      const allCheckbox = checkbox.closest('.filter-options').querySelector('input[value="all"]');

      if (isChecked) {
        this.activeFilters[filterType].add(value);
        allCheckbox.checked = false;
        this.activeFilters[filterType].delete('all');
      } else {
        this.activeFilters[filterType].delete(value);

        // If no filters selected, check "All"
        if (this.activeFilters[filterType].size === 0) {
          allCheckbox.checked = true;
          this.activeFilters[filterType].add('all');
        }
      }
    }

    this.applyFilters();
  }

  applyFilters() {
    if (!window.cigarsInScene) return;

    window.cigarsInScene.forEach(cigar => {
      let visible = true;

      // Check wrapper filter
      if (!this.activeFilters.wrapper.has('all')) {
        visible = visible && this.activeFilters.wrapper.has(cigar.userData.wrapper);
      }

      // Check strength filter (if available)
      if (cigar.userData.strength && !this.activeFilters.strength.has('all')) {
        visible = visible && this.activeFilters.strength.has(cigar.userData.strength);
      }

      // Check price range
      if (cigar.userData.price) {
        const { price } = cigar.userData;
        visible =
          visible && price >= this.activeFilters.price.min && price <= this.activeFilters.price.max;
      }

      cigar.visible = visible;
    });

    this.updateQuickStats();
  }

  updatePriceRange(type, value) {
    this.activeFilters.price[type] = parseInt(value, 10);

    const display = document.getElementById(`${type}PriceDisplay`);
    if (display) {
      display.textContent = value;
    }

    // Ensure min doesn't exceed max
    if (type === 'min') {
      const maxSlider = document.getElementById('maxPrice');
      if (maxSlider && parseInt(value, 10) > parseInt(maxSlider.value, 10)) {
        maxSlider.value = value;
        this.activeFilters.price.max = parseInt(value, 10);
        document.getElementById('maxPriceDisplay').textContent = value;
      }
    } else {
      const minSlider = document.getElementById('minPrice');
      if (minSlider && parseInt(value, 10) < parseInt(minSlider.value, 10)) {
        minSlider.value = value;
        this.activeFilters.price.min = parseInt(value, 10);
        document.getElementById('minPriceDisplay').textContent = value;
      }
    }

    this.applyFilters();
  }

  // Scene control functions
  resetCameraView() {
    if (window.camera && window.controls) {
      window.camera.position.set(50, 50, 50);
      window.controls.target.set(0, 0, 0);
      window.controls.update();

      this.uiManager.showToast('Camera view reset', 'success');
    }
  }

  selectRandomCigar() {
    if (!window.cigarsInScene || window.cigarsInScene.length === 0) return;

    const visibleCigars = window.cigarsInScene.filter(cigar => cigar.visible);
    if (visibleCigars.length === 0) {
      this.uiManager.showToast('No visible cigars to select', 'warning');
      return;
    }

    const randomCigar = visibleCigars[Math.floor(Math.random() * visibleCigars.length)];

    // Animate camera to cigar
    if (window.camera && window.controls) {
      window.controls.target.copy(randomCigar.position);
      window.camera.position.set(
        randomCigar.position.x + 15,
        randomCigar.position.y + 15,
        randomCigar.position.z + 15
      );
      window.controls.update();
    }

    // Highlight the cigar temporarily
    this.highlightCigar(randomCigar);

    // Dispatch event for cigar selection
    window.dispatchEvent(
      new CustomEvent('cigarSelected', {
        detail: { cigar: randomCigar },
      })
    );
  }

  highlightCigar(cigar) {
    const originalColor = cigar.material.color.getHex();
    cigar.material.color.setHex(0xffff00); // Yellow highlight

    setTimeout(() => {
      cigar.material.color.setHex(originalColor);
    }, 2000);
  }

  startVirtualTour() {
    this.uiManager.showToast('Starting virtual tour...', 'info');

    // This would integrate with the OnboardingTour component
    if (window.onboardingTour) {
      window.onboardingTour.startCustomTour('3d-exploration');
    }
  }

  toggleCompareMode() {
    // Implementation for compare mode
    this.uiManager.showToast('Compare mode coming soon!', 'info');
  }

  // Display option functions
  toggleLabels(show) {
    // Implementation for showing/hiding labels
    console.info(`Labels ${show ? 'enabled' : 'disabled'}`);
  }

  toggleFlavorConnections(show) {
    // Implementation for showing flavor connections
    console.info(`Flavor connections ${show ? 'enabled' : 'disabled'}`);
  }

  toggleAnimations(enable) {
    document.body.style.setProperty(
      '--transition',
      enable ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
    );
    console.info(`Animations ${enable ? 'enabled' : 'disabled'}`);
  }

  toggleSounds(enable) {
    // Implementation for sound effects
    console.info(`Sounds ${enable ? 'enabled' : 'disabled'}`);
  }

  // Utility functions
  updateCigarVisibility(visibleCigars) {
    if (!window.cigarsInScene) return;

    const visibleNames = new Set(visibleCigars.map(c => c.name));

    window.cigarsInScene.forEach(cigar => {
      cigar.visible = visibleNames.has(cigar.userData.name);
    });
  }

  updateQuickStats() {
    if (!window.cigarsInScene) return;

    const totalCount = window.cigarsInScene.length;
    const visibleCount = window.cigarsInScene.filter(c => c.visible).length;

    const totalCountEl = document.getElementById('totalCount');
    const visibleCountEl = document.getElementById('visibleCount');
    const avgRatingEl = document.getElementById('avgRating');

    if (totalCountEl) totalCountEl.textContent = totalCount;
    if (visibleCountEl) visibleCountEl.textContent = visibleCount;
    if (avgRatingEl) avgRatingEl.textContent = '4.2★'; // Placeholder
  }

  // Public methods for external use
  focusOnCigar(cigarName) {
    if (!window.cigarsInScene) return;

    const cigar = window.cigarsInScene.find(c => c.userData.name === cigarName);
    if (cigar && window.camera && window.controls) {
      window.controls.target.copy(cigar.position);
      window.camera.position.set(
        cigar.position.x + 10,
        cigar.position.y + 10,
        cigar.position.z + 10
      );
      window.controls.update();
      this.highlightCigar(cigar);
    }
  }

  getActiveFilters() {
    return { ...this.activeFilters };
  }

  setVisualizationMode(mode) {
    const select = document.getElementById('visualizationMode');
    if (select) {
      select.value = mode;
      this.changeVisualizationMode(mode);
    }
  }
}

export default AdvancedControlsPanel;
