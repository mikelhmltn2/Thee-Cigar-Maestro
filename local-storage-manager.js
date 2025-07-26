/**
 * Local Storage Manager for Thee Cigar Maestro
 * Handles user preferences, session data, and application state persistence
 */

class LocalStorageManager {
  constructor() {
    this.storageKey = 'thee-cigar-maestro';
    this.defaults = {
      preferences: {
        theme: 'dark',
        defaultView: 'flavorverse',
        filterPreferences: {
          wrapperTypes: [],
          strengthLevels: [],
          priceRange: { min: 0, max: 1000 }
        },
        displayOptions: {
          showAnimations: true,
          autoPlay3D: true,
          soundEnabled: true,
          reduceMotion: false
        }
      },
      sessionData: {
        lastVisitedCigar: null,
        searchHistory: [],
        favoritesCigars: [],
        completedEducationModules: [],
        pairingHistory: [],
        voiceRecordings: []
      },
      analytics: {
        visitCount: 0,
        lastVisit: null,
        timeSpent: 0,
        featuresUsed: {},
        searchQueries: []
      }
    };
    this.cache = null;
    this.syncInProgress = false;
    this.eventHandlers = new Map();
    
    this.init();
  }

  /**
   * Initialize the storage manager
   */
  init() {
    this.cache = this.loadData();
    this.updateAnalytics();
    this.setupPerformanceMonitoring();
    this.setupAutoSave();
    
    // Listen for storage events from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        this.handleStorageChange(e);
      }
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.saveSession();
    });

    console.log('🔄 Local Storage Manager initialized');
  }

  /**
   * Load data from localStorage with fallback to defaults
   */
  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.mergeWithDefaults(parsed);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
    
    return { ...this.defaults };
  }

  /**
   * Merge stored data with defaults to handle schema updates
   */
  mergeWithDefaults(stored) {
    const merged = { ...this.defaults };
    
    // Deep merge preferences
    if (stored.preferences) {
      merged.preferences = { ...merged.preferences, ...stored.preferences };
      if (stored.preferences.filterPreferences) {
        merged.preferences.filterPreferences = {
          ...merged.preferences.filterPreferences,
          ...stored.preferences.filterPreferences
        };
      }
      if (stored.preferences.displayOptions) {
        merged.preferences.displayOptions = {
          ...merged.preferences.displayOptions,
          ...stored.preferences.displayOptions
        };
      }
    }

    // Merge session data
    if (stored.sessionData) {
      merged.sessionData = { ...merged.sessionData, ...stored.sessionData };
    }

    // Merge analytics
    if (stored.analytics) {
      merged.analytics = { ...merged.analytics, ...stored.analytics };
    }

    return merged;
  }

  /**
   * Save data to localStorage
   */
  saveData() {
    if (this.syncInProgress) return;
    
    try {
      this.syncInProgress = true;
      const dataToSave = {
        ...this.cache,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      this.triggerEvent('dataSaved', dataToSave);
    } catch (error) {
      console.error('Error saving data:', error);
      this.triggerEvent('saveError', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Get user preferences
   */
  getPreferences() {
    return this.cache.preferences;
  }

  /**
   * Update user preferences
   */
  setPreference(key, value) {
    if (!this.cache.preferences) {
      this.cache.preferences = { ...this.defaults.preferences };
    }
    
    this.cache.preferences[key] = value;
    this.saveData();
    this.triggerEvent('preferenceChanged', { key, value });
  }

  /**
   * Get session data
   */
  getSessionData() {
    return this.cache.sessionData;
  }

  /**
   * Add to favorites
   */
  addToFavorites(cigar) {
    if (!this.cache.sessionData.favoritesCigars) {
      this.cache.sessionData.favoritesCigars = [];
    }
    
    const exists = this.cache.sessionData.favoritesCigars.find(c => c.name === cigar.name);
    if (!exists) {
      this.cache.sessionData.favoritesCigars.push({
        ...cigar,
        addedAt: new Date().toISOString()
      });
      this.saveData();
      this.triggerEvent('favoriteAdded', cigar);
    }
  }

  /**
   * Remove from favorites
   */
  removeFromFavorites(cigarName) {
    if (this.cache.sessionData.favoritesCigars) {
      this.cache.sessionData.favoritesCigars = this.cache.sessionData.favoritesCigars
        .filter(c => c.name !== cigarName);
      this.saveData();
      this.triggerEvent('favoriteRemoved', cigarName);
    }
  }

  /**
   * Track search query
   */
  trackSearch(query, results) {
    if (!this.cache.sessionData.searchHistory) {
      this.cache.sessionData.searchHistory = [];
    }
    
    const searchEntry = {
      query,
      resultCount: results.length,
      timestamp: new Date().toISOString()
    };
    
    this.cache.sessionData.searchHistory.unshift(searchEntry);
    
    // Keep only last 50 searches
    if (this.cache.sessionData.searchHistory.length > 50) {
      this.cache.sessionData.searchHistory = this.cache.sessionData.searchHistory.slice(0, 50);
    }
    
    this.saveData();
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureName) {
    if (!this.cache.analytics.featuresUsed) {
      this.cache.analytics.featuresUsed = {};
    }
    
    this.cache.analytics.featuresUsed[featureName] = 
      (this.cache.analytics.featuresUsed[featureName] || 0) + 1;
    
    this.saveData();
  }

  /**
   * Update analytics on page visit
   */
  updateAnalytics() {
    this.cache.analytics.visitCount = (this.cache.analytics.visitCount || 0) + 1;
    this.cache.analytics.lastVisit = new Date().toISOString();
    this.saveData();
  }

  /**
   * Clear all data
   */
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    this.cache = { ...this.defaults };
    this.triggerEvent('dataCleared');
  }

  /**
   * Export user data
   */
  exportData() {
    return {
      ...this.cache,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  }

  /**
   * Import user data
   */
  importData(data) {
    try {
      this.cache = this.mergeWithDefaults(data);
      this.saveData();
      this.triggerEvent('dataImported', data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Event system for storage changes
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  triggerEvent(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Handle storage changes from other tabs
   */
  handleStorageChange(event) {
    if (event.newValue) {
      try {
        const newData = JSON.parse(event.newValue);
        this.cache = this.mergeWithDefaults(newData);
        this.triggerEvent('externalUpdate', newData);
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    }
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    const startTime = performance.now();
    
    // Track time spent on page
    setInterval(() => {
      const currentTime = performance.now();
      const sessionTime = Math.round((currentTime - startTime) / 1000); // seconds
      this.cache.analytics.timeSpent = 
        (this.cache.analytics.timeSpent || 0) + sessionTime;
    }, 30000); // Update every 30 seconds
  }

  /**
   * Setup auto-save functionality
   */
  setupAutoSave() {
    // Auto-save every 2 minutes
    setInterval(() => {
      this.saveData();
    }, 120000);
  }

  /**
   * Save session data before page unload
   */
  saveSession() {
    this.cache.sessionData.lastSession = {
      endTime: new Date().toISOString(),
      currentPage: window.location.pathname
    };
    this.saveData();
  }

  /**
   * Get storage usage information
   */
  getStorageInfo() {
    const data = localStorage.getItem(this.storageKey);
    const sizeInBytes = data ? new Blob([data]).size : 0;
    const sizeInKB = Math.round(sizeInBytes / 1024 * 100) / 100;
    
    return {
      sizeInBytes,
      sizeInKB,
      itemCount: data ? Object.keys(JSON.parse(data)).length : 0,
      lastUpdated: this.cache.lastUpdated
    };
  }
}

// Global instance
window.storageManager = new LocalStorageManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocalStorageManager;
}