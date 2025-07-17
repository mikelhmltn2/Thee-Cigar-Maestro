// Maintainability: Separated search history logic
/**
 * Manages search history
 */
class SearchHistory {
  /**
   * Initialize with DOM elements
   * @param {HTMLElement} historyDiv - History container
   * @param {HTMLElement} historyItems - History items container
   * @param {function(string):void} onSelect - Callback for selecting history item
   * @param {function():void} onClear - Callback for clearing history
   */
  constructor(historyDiv, historyItems, onSelect, onClear) {
    this.historyDiv = historyDiv;
    this.historyItems = historyItems;
    this.onSelect = onSelect;
    this.onClear = onClear;
    this.history = this.load();
    this.maxItems = CONFIG.maxHistoryItems;
  }

  /**
   * Load history from sessionStorage
   * @returns {string[]} History items
   */
  load() {
    try {
      const saved = sessionStorage.getItem('cigar-search-history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load search history:', e);
      return [];
    }
  }

  /**
   * Save history to sessionStorage
   */
  save() {
    try {
      sessionStorage.setItem('cigar-search-history', JSON.stringify(this.history));
    } catch (e) {
      console.warn('Failed to save search history:', e);
    }
  }

  /**
   * Add item to history
   * @param {string} query - Search query
   */
  add(query) {
    const index = this.history.indexOf(query);
    if (index > -1) {
      this.history.splice(index, 1);
    }
    this.history.unshift(query);
    if (this.history.length > this.maxItems) {
      this.history = this.history.slice(0, this.maxItems);
    }
    this.save();
    this.render();
  }

  /**
   * Clear history
   */
  clear() {
    this.history = [];
    this.save();
    this.render();
    this.onClear();
  }

  /**
   * Render history items
   */
  render() {
    if (this.history.length === 0) {
      this.historyDiv.style.display = 'none';
      return;
    }
    this.historyItems.innerHTML = this.history
      .map(item => `<span class="history-item">${this.escapeHtml(item)}</span>`)
      .join('');
    this.historyDiv.style.display = 'block';
  }

  /**
   * Escape HTML characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
