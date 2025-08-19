/**
 * Advanced Search and Filtering System for Thee Cigar Maestro
 * Provides intelligent search, filtering, and cross-reference capabilities
 */

class AdvancedSearchEngine {
  constructor() {
    this.dataManager = null;
    this.searchIndex = new Map();
    this.filterState = {
      wrapperTypes: [],
      strengthLevels: [],
      flavorTags: [],
      priceRange: { min: 0, max: 1000 },
      ratings: { min: 0, max: 5 },
      availability: 'all', // 'available', 'discontinued', 'all'
      origin: [],
      size: [],
    };
    this.searchHistory = [];
    this.suggestions = [];
    this.isReady = false;

    this.init();
  }

  /**
   * Initialize the search engine
   */
  async init() {
    try {
      await this.loadSearchData();
      this.buildSearchIndex();
      this.loadUserPreferences();
      this.setupEventListeners();
      this.isReady = true;
      console.info('🔍 Advanced Search Engine initialized');
    } catch (error) {
      console.error('Failed to initialize search engine:', error);
    }
  }

  /**
   * Load data from all sources
   */
  async loadSearchData() {
    this.dataManager = {
      cigars: [],
      pairings: [],
      education: [],
      specifications: [],
      flavors: [],
    };

    try {
      // Load main cigar data
      const cigarResponse = await fetch('./flavorverse_nodes.json');
      this.dataManager.cigars = await cigarResponse.json();

      // Load detailed specifications
      const specsResponse = await fetch('./cigar-specs.json');
      const specsData = await specsResponse.json();
      this.dataManager.specifications = specsData.manufacturers || [];

      // Load pairing data
      const pairingsResponse = await fetch('./pairings.json');
      this.dataManager.pairings = await pairingsResponse.json();

      // Load educational content
      const educationResponse = await fetch('./education.json');
      this.dataManager.education = await educationResponse.json();

      // Load flavor atlas
      const flavorResponse = await fetch('./flavor-atlas.json');
      this.dataManager.flavors = await flavorResponse.json();
    } catch (error) {
      console.error('Error loading search data:', error);
    }
  }

  /**
   * Build searchable index for fast lookups
   */
  buildSearchIndex() {
    this.searchIndex.clear();

    // Index cigars
    this.dataManager.cigars.forEach((cigar, index) => {
      this.indexItem('cigar', cigar, index, [
        cigar.name,
        cigar.wrapper,
        cigar.flavor,
        cigar.strength,
        cigar.origin,
        cigar.size,
      ]);
    });

    // Index manufacturers from specifications
    this.dataManager.specifications.forEach((manufacturer, index) => {
      this.indexItem('manufacturer', manufacturer, index, [
        manufacturer.name,
        manufacturer.country,
        manufacturer.established,
        manufacturer.specialty,
      ]);
    });

    // Index pairing suggestions
    if (this.dataManager.pairings.pairingEngineV3?.ceuLessons) {
      this.dataManager.pairings.pairingEngineV3.ceuLessons.forEach((lesson, index) => {
        this.indexItem('pairing', lesson, index, [
          lesson.focus,
          lesson.title,
          lesson.description,
          ...(lesson.keyPairings?.map(p => p.spirit) || []),
        ]);
      });
    }

    console.info(`🔍 Search index built with ${this.searchIndex.size} entries`);
  }

  /**
   * Index an item for searching
   */
  indexItem(type, item, index, searchableFields) {
    const key = `${type}_${index}`;
    const searchText = searchableFields
      .filter(field => field)
      .join(' ')
      .toLowerCase();

    this.searchIndex.set(key, {
      type,
      item,
      index,
      searchText,
      tokens: this.tokenize(searchText),
    });
  }

  /**
   * Tokenize text for search
   */
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }

  /**
   * Perform intelligent search
   */
  search(query, options = {}) {
    if (!this.isReady || !query.trim()) {
      return {
        results: [],
        suggestions: [],
        total: 0,
        executionTime: 0,
      };
    }

    const startTime = performance.now();
    const queryTokens = this.tokenize(query);
    const results = new Map();

    // Search through index
    for (const [key, indexEntry] of this.searchIndex.entries()) {
      const score = this.calculateRelevanceScore(queryTokens, indexEntry);

      if (score > 0) {
        results.set(key, {
          ...indexEntry,
          score,
          relevance: this.calculateRelevance(score, indexEntry.type),
        });
      }
    }

    // Convert to array and sort by relevance
    let searchResults = Array.from(results.values()).sort((a, b) => b.relevance - a.relevance);

    // Apply filters
    searchResults = this.applyFilters(searchResults);

    // Apply options
    if (options.limit) {
      searchResults = searchResults.slice(0, options.limit);
    }

    // Track search
    this.trackSearch(query, searchResults);

    const executionTime = performance.now() - startTime;

    return {
      results: searchResults,
      suggestions: this.generateSuggestions(query, searchResults),
      total: searchResults.length,
      executionTime: Math.round(executionTime * 100) / 100,
    };
  }

  /**
   * Calculate relevance score for search results
   */
  calculateRelevanceScore(queryTokens, indexEntry) {
    let score = 0;
    const { searchText, tokens } = indexEntry;

    // Exact match bonus
    if (searchText.includes(queryTokens.join(' '))) {
      score += 100;
    }

    // Token matching
    queryTokens.forEach(queryToken => {
      tokens.forEach(token => {
        if (token.includes(queryToken) || queryToken.includes(token)) {
          score += token === queryToken ? 50 : 25;
        }
      });
    });

    // Fuzzy matching for typos
    queryTokens.forEach(queryToken => {
      tokens.forEach(token => {
        const similarity = this.calculateSimilarity(queryToken, token);
        if (similarity > 0.7) {
          score += similarity * 20;
        }
      });
    });

    return score;
  }

  /**
   * Calculate similarity between two strings (Jaro-Winkler distance)
   */
  calculateSimilarity(s1, s2) {
    if (s1 === s2) {
      return 1;
    }
    if (s1.length === 0 || s2.length === 0) {
      return 0;
    }

    const maxDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
    const s1Matches = new Array(s1.length).fill(false);
    const s2Matches = new Array(s2.length).fill(false);
    let matches = 0;
    let transpositions = 0;

    // Find matches
    for (let i = 0; i < s1.length; i++) {
      const start = Math.max(0, i - maxDistance);
      const end = Math.min(i + maxDistance + 1, s2.length);

      for (let j = start; j < end; j++) {
        if (s2Matches[j] || s1[i] !== s2[j]) {
          continue;
        }
        s1Matches[i] = s2Matches[j] = true;
        matches++;
        break;
      }
    }

    if (matches === 0) {
      return 0;
    }

    // Find transpositions
    let k = 0;
    for (let i = 0; i < s1.length; i++) {
      if (!s1Matches[i]) {
        continue;
      }
      while (!s2Matches[k]) {
        k++;
      }
      if (s1[i] !== s2[k]) {
        transpositions++;
      }
      k++;
    }

    const jaro =
      (matches / s1.length + matches / s2.length + (matches - transpositions / 2) / matches) / 3;

    // Jaro-Winkler prefix bonus
    let prefix = 0;
    for (let i = 0; i < Math.min(s1.length, s2.length, 4); i++) {
      if (s1[i] === s2[i]) {
        prefix++;
      } else {
        break;
      }
    }

    return jaro + 0.1 * prefix * (1 - jaro);
  }

  /**
   * Calculate final relevance considering item type
   */
  calculateRelevance(score, type) {
    const typeWeights = {
      cigar: 1.0,
      manufacturer: 0.8,
      pairing: 0.7,
      education: 0.6,
    };

    return score * (typeWeights[type] || 0.5);
  }

  /**
   * Apply active filters to results
   */
  applyFilters(results) {
    return results.filter(result => {
      if (result.type === 'cigar') {
        const cigar = result.item;

        // Wrapper type filter
        if (
          this.filterState.wrapperTypes.length > 0 &&
          !this.filterState.wrapperTypes.includes(cigar.wrapper)
        ) {
          return false;
        }

        // Strength level filter
        if (
          this.filterState.strengthLevels.length > 0 &&
          !this.filterState.strengthLevels.includes(cigar.strength)
        ) {
          return false;
        }

        // Flavor tags filter
        if (this.filterState.flavorTags.length > 0) {
          const cigarFlavors = this.extractFlavorTags(cigar.flavor);
          const hasMatchingFlavor = this.filterState.flavorTags.some(tag =>
            cigarFlavors.includes(tag.toLowerCase())
          );
          if (!hasMatchingFlavor) {
            return false;
          }
        }

        // Price range filter (if price data available)
        if (
          cigar.price &&
          (cigar.price < this.filterState.priceRange.min ||
            cigar.price > this.filterState.priceRange.max)
        ) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Extract flavor tags from flavor description
   */
  extractFlavorTags(flavorText) {
    if (!flavorText) {
      return [];
    }

    const commonFlavors = [
      'chocolate',
      'vanilla',
      'coffee',
      'cedar',
      'leather',
      'spice',
      'pepper',
      'cream',
      'honey',
      'tobacco',
      'earth',
      'wood',
      'nuts',
      'caramel',
      'cocoa',
    ];

    const text = flavorText.toLowerCase();
    return commonFlavors.filter(flavor => text.includes(flavor));
  }

  /**
   * Set filter value
   */
  setFilter(filterName, value) {
    if (Object.prototype.hasOwnProperty.call(this.filterState, filterName)) {
      this.filterState[filterName] = value;
      this.saveFilterPreferences();
    }
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this.filterState = {
      wrapperTypes: [],
      strengthLevels: [],
      flavorTags: [],
      priceRange: { min: 0, max: 1000 },
      ratings: { min: 0, max: 5 },
      availability: 'all',
      origin: [],
      size: [],
    };
    this.saveFilterPreferences();
  }

  /**
   * Generate search suggestions
   */
  generateSuggestions(query, _results) {
    const suggestions = [];
    const queryLower = query.toLowerCase();

    // Suggest based on popular searches
    if (window.storageManager) {
      const searchHistory = window.storageManager.getSessionData().searchHistory || [];
      const popularQueries = searchHistory
        .map(entry => entry.query)
        .filter(q => q.toLowerCase().includes(queryLower) && q !== query)
        .slice(0, 3);

      suggestions.push(...popularQueries.map(q => ({ type: 'history', text: q })));
    }

    // Suggest based on available wrappers
    const wrappers = ['Maduro', 'Connecticut', 'Habano', 'Natural', 'Oscuro'];
    wrappers.forEach(wrapper => {
      if (wrapper.toLowerCase().includes(queryLower)) {
        suggestions.push({ type: 'wrapper', text: wrapper });
      }
    });

    // Suggest based on flavor profiles
    const flavors = ['chocolate', 'spice', 'vanilla', 'coffee', 'cedar', 'cream'];
    flavors.forEach(flavor => {
      if (flavor.toLowerCase().includes(queryLower)) {
        suggestions.push({ type: 'flavor', text: flavor });
      }
    });

    return suggestions.slice(0, 5);
  }

  /**
   * Track search for analytics
   */
  trackSearch(query, results) {
    this.searchHistory.unshift({
      query,
      resultCount: results.length,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 100 searches
    if (this.searchHistory.length > 100) {
      this.searchHistory = this.searchHistory.slice(0, 100);
    }

    // Track in storage manager if available
    if (window.storageManager) {
      window.storageManager.trackSearch(query, results);
      window.storageManager.trackFeatureUsage('search');
    }
  }

  /**
   * Load user preferences from storage
   */
  loadUserPreferences() {
    if (window.storageManager) {
      const preferences = window.storageManager.getPreferences();
      if (preferences.filterPreferences) {
        this.filterState = { ...this.filterState, ...preferences.filterPreferences };
      }
    }
  }

  /**
   * Save filter preferences to storage
   */
  saveFilterPreferences() {
    if (window.storageManager) {
      window.storageManager.setPreference('filterPreferences', this.filterState);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Listen for storage changes
    if (window.storageManager) {
      window.storageManager.on('preferenceChanged', data => {
        if (data.key === 'filterPreferences') {
          this.filterState = { ...this.filterState, ...data.value };
        }
      });
    }
  }

  /**
   * Get search statistics
   */
  getSearchStats() {
    const recentSearches = this.searchHistory.slice(0, 10);
    const topQueries = this.searchHistory.reduce((acc, search) => {
      acc[search.query] = (acc[search.query] || 0) + 1;
      return acc;
    }, {});

    return {
      totalSearches: this.searchHistory.length,
      recentSearches,
      topQueries: Object.entries(topQueries)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([query, count]) => ({ query, count })),
      averageResultCount:
        this.searchHistory.reduce((sum, search) => sum + search.resultCount, 0) /
          this.searchHistory.length || 0,
    };
  }

  /**
   * Export search data for analysis
   */
  exportSearchData() {
    return {
      searchHistory: this.searchHistory,
      filterState: this.filterState,
      stats: this.getSearchStats(),
      exportedAt: new Date().toISOString(),
    };
  }
}

// Global instance
window.searchEngine = new AdvancedSearchEngine();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedSearchEngine;
}
