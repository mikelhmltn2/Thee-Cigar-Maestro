// Maintainability: Separated UI logic
/**
 * Manages the search UI
 */
class SearchUI {
  /**
   * Initialize with DOM elements and dependencies
   * @param {SearchAPI} searchAPI - Search API instance
   * @param {SearchHistory} searchHistory - Search history instance
   */
  constructor(searchAPI, searchHistory) {
    this.form = document.getElementById('spec-search-form');
    this.input = document.getElementById('cigar-search');
    this.button = this.form.querySelector('.search-button');
    this.spinner = this.form.querySelector('.loading-spinner');
    this.buttonText = this.form.querySelector('.button-text');
    this.resultsBox = document.getElementById('spec-results');
    this.statusDiv = document.getElementById('search-status');
    this.autocompleteDiv = document.getElementById('autocomplete-dropdown');
    this.progressBar = document.getElementById('progress-bar');
    this.progressBarFill = this.progressBar.querySelector('.progress-bar-fill');
    this.searchAPI = searchAPI;
    this.searchHistory = searchHistory;
    this.autocompleteTimeout = null;
    this.selectedSuggestionIndex = -1;
    this.isLoading = false;
    this.lastSearchTime = 0;
    this.init();
  }

  /**
   * Initialize event listeners and setup
   */
  init() {
    this.setupEventListeners();
    this.setupOfflineDetection();
    // Additional: Google Analytics (replace with real tracking ID)
    // gtag('event', 'page_view', { page_title: 'Cigar Specs Search' });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    this.form.addEventListener('submit', function(e) { this.handleSubmit(e); }.bind(this));
    this.input.addEventListener('input', function(e) { this.handleInput(e); }.bind(this));
    this.input.addEventListener('keydown', function(e) { this.handleKeydown(e); }.bind(this));
    this.input.addEventListener('blur', function() { this.hideAutocomplete(); }.bind(this));
    this.input.addEventListener('focus', function() { this.showRecentSuggestions(); }.bind(this));
    document.addEventListener('click', function(e) {
      if (!this.form.contains(e.target)) {
        this.hideAutocomplete();
      }
    }.bind(this));
    document.getElementById('clear-history').addEventListener('click', function() {
      this.searchHistory.clear();
    }.bind(this));
    this.searchHistory.historyItems.addEventListener('click', function(e) {
      if (e.target.classList.contains('history-item')) {
        this.selectHistoryItem(e.target.textContent);
      }
    }.bind(this));
  }

  /**
   * Cleanup event listeners
   */
  destroy() {
    this.form.removeEventListener('submit', this.handleSubmit);
    this.input.removeEventListener('input', this.handleInput);
    this.input.removeEventListener('keydown', this.handleKeydown);
    this.input.removeEventListener('blur', this.hideAutocomplete);
    this.input.removeEventListener('focus', this.showRecentSuggestions);
    document.removeEventListener('click', this.handleClickOutside);
    document.getElementById('clear-history').removeEventListener('click', this.searchHistory.clear);
    this.searchHistory.historyItems.removeEventListener('click', this.selectHistoryItem);
  }

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  handleSubmit(e) {
    e.preventDefault();
    if (this.isLoading) return;
    const query = this.sanitizeInput(this.input.value.trim());
    if (!this.validateInput(query)) return;
    if (Date.now() - this.lastSearchTime < CONFIG.rateLimitDelay) {
      this.showMessage(CONFIG.i18n.en.rateLimit, 'warning');
      return;
    }
    this.lastSearchTime = Date.now();
    this.hideAutocomplete();
    this.setLoadingState(true);
    this.searchAPI.performSearch(query)
      .then(data => {
        this.displayResults(data, query);
        this.searchHistory.add(query);
        this.updateStatus(`Found specifications for ${query}`);
      })
      .catch(error => this.handleError(error))
      .finally(() => this.setLoadingState(false));
  }

  /**
   * Handle input changes
   * @param {Event} e - Input event
   */
  handleInput(e) {
    var query = e.target.value.trim();
    if (this.autocompleteTimeout) {
      clearTimeout(this.autocompleteTimeout);
    }
    this.input.classList.remove('error');
    this.autocompleteTimeout = setTimeout(function() {
      if (query.length >= 2) {
        this.showAutocomplete(query);
      } else {
        this.hideAutocomplete();
      }
    }.bind(this), CONFIG.debounceDelay);
  }

  /**
   * Handle keyboard navigation
   * @param {Event} e - Keydown event
   */
  handleKeydown(e) {
    var suggestions = this.autocompleteDiv.querySelectorAll('.autocomplete-item');
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedSuggestionIndex = Math.min(this.selectedSuggestionIndex + 1, suggestions.length - 1);
        this.updateSuggestionSelection(suggestions);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
        this.updateSuggestionSelection(suggestions);
        break;
      case 'Enter':
        if (this.selectedSuggestionIndex >= 0 && suggestions[this.selectedSuggestionIndex]) {
          e.preventDefault();
          this.selectSuggestion(suggestions[this.selectedSuggestionIndex].textContent);
        }
        break;
      case 'Escape':
        this.hideAutocomplete();
        break;
    }
  }

  /**
   * Validate input
   * @param {string} query - Search query
   * @returns {boolean} Whether input is valid
   */
  validateInput(query) {
    if (!query) {
      this.showMessage(CONFIG.i18n.en.error, 'error');
      this.input.classList.add('error');
      this.input.focus();
      return false;
    }
    if (query.length > CONFIG.maxInputLength) {
      this.showMessage(`Search query is too long. Maximum ${CONFIG.maxInputLength} characters allowed.`, 'error');
      this.input.classList.add('error');
      return false;
    }
    if (this.containsScript(query)) {
      this.showMessage('Invalid characters detected in search query.', 'error');
      this.input.classList.add('error');
      return false;
    }
    return true;
  }

  /**
   * Sanitize input
   * @param {string} input - Raw input
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  /**
   * Check for script patterns
   * @param {string} input - Input to check
   * @returns {boolean} Whether input contains scripts
   */
  containsScript(input) {
    var scriptPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /eval\(/i,
      /alert\(/i
    ];
    return scriptPatterns.some(function(pattern) { return pattern.test(input); });
  }

  /**
   * Display search results
   * @param {SearchResult} data - API response
   * @param {string} query - Search query
   */
  displayResults(data, query) {
    if (!data || !data.result) {
      this.showNoResults(query);
      return;
    }
    try {
      var parsedData = JSON.parse(data.result);
      this.renderStructuredResults(parsedData, query);
    } catch (e) {
      console.warn('Failed to parse JSON, falling back to plain text:', e);
      this.renderPlainTextResults(data.result, query);
    }
  }

  /**
   * Render structured results
   * @param {SearchResult} data - Parsed JSON data
   * @param {string} query - Search query
   */
  renderStructuredResults(data, query) {
    var html = `
      <div class="spec-result">
        <h3>${this.escapeHtml(data.name || query)}</h3>
        <div class="spec-grid">
          ${data.length ? `<div class="spec-item"><div class="spec-label">Length:</div><div class="spec-value">${this.escapeHtml(data.length)}</div></div>` : ''}
          ${data.ring_gauge ? `<div class="spec-item"><div class="spec-label">Ring Gauge:</div><div class="spec-value">${this.escapeHtml(data.ring_gauge)}</div></div>` : ''}
          ${data.strength ? `<div class="spec-item"><div class="spec-label">Strength:</div><div class="spec-value">${this.escapeHtml(data.strength)}</div></div>` : ''}
          ${data.wrapper ? `<div class="spec-item"><div class="spec-label">Wrapper:</div><div class="spec-value">${this.escapeHtml(data.wrapper)}</div></div>` : ''}
          ${data.binder ? `<div class="spec-item"><div class="spec-label">Binder:</div><div class="spec-value">${this.escapeHtml(data.binder)}</div></div>` : ''}
          ${data.filler ? `<div class="spec-item"><div class="spec-label">Filler:</div><div class="spec-value">${this.escapeHtml(data.filler)}</div></div>` : ''}
        </div>
        ${data.tasting_notes ? `<div class="spec-item"><div class="spec-label">Tasting Notes:</div><div class="spec-value">${this.escapeHtml(data.tasting_notes)}</div></div>` : ''}
        ${data.description ? `<div class="spec-item"><div class="spec-label">Description:</div><div class="spec-value">${this.escapeHtml(data.description)}</div></div>` : ''}
      </div>
    `;
    this.resultsBox.innerHTML = html;
  }

  /**
   * Render plain text results
   * @param {string} result - Plain text result
   * @param {string} query - Search query
   */
  renderPlainTextResults(result, query) {
    var html = `
      <div class="spec-result">
        <h3>Specifications for "${this.escapeHtml(query)}"</h3>
        <pre>${this.escapeHtml(result)}</pre>
      </div>
    `;
    this.resultsBox.innerHTML = html;
  }

  /**
   * Show no results message
   * @param {string} query - Search query
   */
  showNoResults(query) {
    var html = `
      <div class="spec-result">
        <h3>${CONFIG.i18n.en.noResults.replace('{query}', this.escapeHtml(query))}</h3>
        <p>Please try:</p>
        <ul>
          <li>Checking the spelling</li>
          <li>Using a different cigar name format</li>
          <li>Searching for the brand name only</li>
          <li><a href="contact.html">Suggest a cigar to add</a></li>
        </ul>
      </div>
    `;
    this.resultsBox.innerHTML = html;
  }

  /**
   * Show autocomplete suggestions
   * @param {string} query - Search query
   */
  showAutocomplete(query) {
    this.searchAPI.fetchSuggestions(query)
      .then(function(suggestions) {
        if (suggestions.length === 0) {
          this.hideAutocomplete();
          return;
        }
        var html = suggestions.map(function(suggestion, index) {
          return `<div class="autocomplete-item" role="option" aria-selected="${index === this.selectedSuggestionIndex}" data-value="${this.escapeHtml(suggestion)}">${this.escapeHtml(suggestion)}</div>`;
        }.bind(this)).join('');
        this.autocompleteDiv.innerHTML = html;
        this.autocompleteDiv.style.display = 'block';
        this.selectedSuggestionIndex = -1;
        var items = this.autocompleteDiv.querySelectorAll('.autocomplete-item');
        items.forEach(function(item) {
          item.addEventListener('click', function() {
            this.selectSuggestion(item.dataset.value);
          }.bind(this));
        }.bind(this));
      }.bind(this))
      .catch(function(error) {
        console.warn('Autocomplete error:', error);
        this.hideAutocomplete();
      }.bind(this));
  }

  /**
   * Show recent search suggestions
   */
  showRecentSuggestions() {
    if (this.searchHistory.history.length > 0 && !this.input.value.trim()) {
      var html = this.searchHistory.history.slice(0, 3).map(function(item) {
        return `<div class="autocomplete-item" role="option" aria-selected="false" data-value="${this.escapeHtml(item)}">${this.escapeHtml(item)}</div>`;
      }.bind(this)).join('');
      this.autocompleteDiv.innerHTML = html;
      this.autocompleteDiv.style.display = 'block';
      var items = this.autocompleteDiv.querySelectorAll('.autocomplete-item');
      items.forEach(function(item) {
        item.addEventListener('click', function() {
          this.selectSuggestion(item.dataset.value);
        }.bind(this));
      }.bind(this));
    }
  }

  /**
   * Update suggestion selection
   * @param {NodeList} suggestions - Autocomplete items
   */
  updateSuggestionSelection(suggestions) {
    suggestions.forEach(function(item, index) {
      var isSelected = index === this.selectedSuggestionIndex;
      item.classList.toggle('selected', isSelected);
      item.setAttribute('aria-selected', isSelected);
    }.bind(this));
  }

  /**
   * Select an autocomplete suggestion
   * @param {string} suggestion - Selected suggestion
   */
  selectSuggestion(suggestion) {
    this.input.value = suggestion;
    this.hideAutocomplete();
    this.input.focus();
    this.form.dispatchEvent(new Event('submit'));
  }

  /**
   * Hide autocomplete dropdown
   */
  hideAutocomplete() {
    this.autocompleteDiv.style.display = 'none';
    this.selectedSuggestionIndex = -1;
  }

  /**
   * Select a history item
   * @param {string} item - History item text
   */
  selectHistoryItem(item) {
    this.input.value = item;
    this.input.focus();
    this.form.dispatchEvent(new Event('submit'));
  }

  /**
   * Set loading state
   * @param {boolean} loading - Whether to show loading state
   */
  setLoadingState(loading) {
    this.isLoading = loading;
    this.button.disabled = loading;
    this.spinner.style.display = loading ? 'inline-block' : 'none';
    this.buttonText.textContent = loading ? CONFIG.i18n.en.searching : CONFIG.i18n.en.searchButton;
    this.button.setAttribute('aria-label', loading ? CONFIG.i18n.en.searching : CONFIG.i18n.en.searchButton);
    this.progressBar.style.display = loading ? 'block' : 'none';
    this.progressBarFill.style.width = loading ? '100%' : '0';
    this.resultsBox.classList.toggle('loading', loading);
    if (loading) {
      this.resultsBox.innerHTML = '<div class="skeleton-loader"><div class="skeleton-item"></div><div class="skeleton-item"></div><div class="skeleton-item"></div></div>';
    }
  }

  /**
   * Update status message
   * @param {string} message - Status message
   */
  updateStatus(message) {
    this.statusDiv.textContent = message;
  }

  /**
   * Show message with focus management
   * @param {string} message - Message text
   * @param {string} type - Message type (info, error, warning, success)
   */
  showMessage(message, type) {
    var className = `${type}-message`;
    var messageDiv = document.createElement('div');
    messageDiv.className = className;
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');
    messageDiv.tabIndex = -1;
    this.form.parentNode.insertBefore(messageDiv, this.resultsBox);
    if (type === 'error') {
      messageDiv.focus();
    }
    setTimeout(function() {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 5000);
  }

  /**
   * Handle errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    console.error('Search error:', error);
    var message = CONFIG.i18n.en.error;
    if (!navigator.onLine) {
      message = CONFIG.i18n.en.offline;
    } else if (error.message.includes('429')) {
      message = CONFIG.i18n.en.rateLimit;
    } else if (error.message.includes('500')) {
      message = CONFIG.i18n.en.serverError;
    } else if (error.message.includes('timed out')) {
      message = error.message;
    }
    this.showMessage(message, 'error');
    this.updateStatus('Search failed');
    this.resultsBox.innerHTML = `
      <div class="error-message">
        <strong>Search Failed</strong><br>
        ${this.escapeHtml(message)}
      </div>
    `;
  }

  /**
   * Escape HTML characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Setup offline detection
   */
  setupOfflineDetection() {
    window.addEventListener('online', function() {
      this.showMessage('Connection restored. You can search again.', 'success');
    }.bind(this));
    window.addEventListener('offline', function() {
      this.showMessage(CONFIG.i18n.en.offline, 'error');
    }.bind(this));
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  var csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                  document.cookie.split('; ').find(row => row.startsWith('csrf-token=')).split('=')[1];
  if (!csrfToken) {
    console.warn('CSRF token not found. API requests may fail.');
  }
  var searchAPI = new SearchAPI(csrfToken);
  var searchHistory = new SearchHistory(
    document.getElementById('search-history'),
    document.getElementById('history-items'),
    function(item) { searchUI.selectHistoryItem(item); },
    function() { searchUI.hideAutocomplete(); }
  );
  var searchUI = new SearchUI(searchAPI, searchHistory);

  // Browser Compatibility: Service Worker Fallback
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('SW registered: ', registration);
      })
      .catch(function(error) {
        console.log('SW registration failed: ', error);
      });
  } else {
    console.warn('Service workers not supported. Offline functionality unavailable.');
    searchUI.showMessage('Your browser does not support offline functionality.', 'warning');
  }

  // Additional: Accessibility Testing
  // Run Lighthouse/axe audits in development to ensure WCAG compliance
});
