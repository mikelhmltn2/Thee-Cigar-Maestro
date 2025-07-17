// Maintainability: Separated API logic
// @typedef {Object} SearchResult
// @property {string} name
// @property {string} [length]
// @property {string} [ring_gauge]
// @property {string} [strength]
// @property {string} [wrapper]
// @property {string} [binder]
// @property {string} [filler]
// @property {string} [tasting_notes]
// @property {string} [description]

/**
 * Handles API interactions for search and autocomplete
 */
class SearchAPI {
  /**
   * Initialize with CSRF token
   * @param {string|null} csrfToken - CSRF token for API requests
   */
  constructor(csrfToken) {
    this.csrfToken = csrfToken;
    this.cache = new Map();
  }

  /**
   * Performs a search request with timeout
   * @param {string} query - Search query
   * @returns {Promise<SearchResult>} Search results
   */
  performSearch(query) {
    const cacheKey = query.toLowerCase();
    if (this.cache.has(cacheKey)) {
      return Promise.resolve(this.cache.get(cacheKey));
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.fetchTimeout);

    // Security: Server-side validation required
    // Backend should validate input, enforce rate limiting, and require authentication
    return fetch(CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(this.csrfToken && { 'X-CSRF-Token': this.csrfToken })
      },
      body: JSON.stringify({
        prompt: query,
        type: 'cigar-specs',
        timestamp: Date.now()
      }),
      signal: controller.signal
    })
      .then(response => {
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        this.cache.set(cacheKey, data);
        return data;
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      });
  }

  /**
   * Fetches autocomplete suggestions
   * @param {string} query - Search query
   * @returns {Promise<string[]>} Array of suggestions
   */
  fetchSuggestions(query) {
    // Mock API call for demo (replace with real API in production)
    const mockSuggestions = [
      'Padron 1964 Anniversary Maduro',
      'Padron 1926 Serie',
      'Montecristo No. 2',
      'Cohiba Behike',
      'Arturo Fuente Opus X'
    ];
    return Promise.resolve(
      mockSuggestions
        .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    );
    // Uncomment for real API call
    /*
    return fetch(`${CONFIG.autocompleteEndpoint}?q=${encodeURIComponent(query)}`, {
      headers: {
        'X-CSRF-Token': this.csrfToken
      }
    })
      .then(response => response.json())
      .then(data => data.suggestions || []);
    */
  }
}
