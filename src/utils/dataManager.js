/**
 * Enhanced Data Manager for Thee Cigar Maestro
 * Handles data loading, caching, validation, and synchronization
 */

import storageManager from './storage.js';
import errorHandler from './errorHandler.js';
import loadingSystem from '../components/LoadingSystem.js';
import searchEngine from './searchEngine.js';

class DataManager {
  constructor() {
    this.data = {
      cigars: [],
      features: {},
      education: {},
      pairings: {},
      interface: {},
      meta: {},
      emotional: {},
      lounge: {},
      flavorAtlas: {},
      specs: {}
    };
    
    this.dataSchemas = new Map();
    this.loadingStates = new Map();
    this.dataSources = new Map();
    this.syncCallbacks = new Set();
    this.isLoaded = false;
    this.lastSyncTime = null;
    this.syncInterval = 30 * 60 * 1000; // 30 minutes
    
    this.setupDataSources();
    this.setupSchemas();
    this.setupPeriodicSync();
  }

  setupDataSources() {
    this.dataSources.set('cigars', {
      file: 'flavorverse_nodes.json',
      endpoint: '/api/cigars',
      cacheDuration: 60 * 60 * 1000, // 1 hour
      priority: 1,
      required: true
    });

    this.dataSources.set('features', {
      file: 'features.json',
      endpoint: '/api/features',
      cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
      priority: 3,
      required: false
    });

    this.dataSources.set('education', {
      file: 'education.json',
      endpoint: '/api/education',
      cacheDuration: 4 * 60 * 60 * 1000, // 4 hours
      priority: 2,
      required: true
    });

    this.dataSources.set('pairings', {
      file: 'pairings.json',
      endpoint: '/api/pairings',
      cacheDuration: 2 * 60 * 60 * 1000, // 2 hours
      priority: 2,
      required: true
    });

    this.dataSources.set('interface', {
      file: 'interface.json',
      endpoint: '/api/interface',
      cacheDuration: 24 * 60 * 60 * 1000,
      priority: 3,
      required: false
    });

    this.dataSources.set('meta', {
      file: 'meta.json',
      endpoint: '/api/meta',
      cacheDuration: 24 * 60 * 60 * 1000,
      priority: 3,
      required: false
    });

    this.dataSources.set('emotional', {
      file: 'emotional.json',
      endpoint: '/api/emotional',
      cacheDuration: 4 * 60 * 60 * 1000,
      priority: 2,
      required: false
    });

    this.dataSources.set('lounge', {
      file: 'lounge.json',
      endpoint: '/api/lounge',
      cacheDuration: 60 * 60 * 1000,
      priority: 2,
      required: false
    });

    this.dataSources.set('flavorAtlas', {
      file: 'flavor-atlas.json',
      endpoint: '/api/flavor-atlas',
      cacheDuration: 4 * 60 * 60 * 1000,
      priority: 2,
      required: false
    });

    this.dataSources.set('specs', {
      file: 'cigar-specs.json',
      endpoint: '/api/specs',
      cacheDuration: 2 * 60 * 60 * 1000,
      priority: 1,
      required: true
    });
  }

  setupSchemas() {
    // Define validation schemas for data integrity
    this.dataSchemas.set('cigars', {
      type: 'array',
      items: {
        required: ['name', 'wrapper', 'flavor'],
        properties: {
          name: { type: 'string', minLength: 1 },
          wrapper: { type: 'string', enum: ['Maduro', 'Connecticut', 'Habano', 'Natural', 'Oscuro', 'Candela'] },
          flavor: { type: 'string', minLength: 1 },
          color: { type: 'number', minimum: 0 },
          origin: { type: 'string' },
          strength: { type: 'string', enum: ['Mild', 'Mild-Medium', 'Medium', 'Medium-Full', 'Full'] },
          size: { type: 'string' }
        }
      }
    });

    this.dataSchemas.set('pairings', {
      type: 'object',
      required: ['pairingEngineV3'],
      properties: {
        pairingEngineV3: {
          type: 'object',
          properties: {
            ceuLessons: { type: 'array' }
          }
        }
      }
    });

    this.dataSchemas.set('education', {
      type: 'object',
      required: ['educationTracks'],
      properties: {
        educationTracks: {
          type: 'object',
          properties: {
            tracks: { type: 'array' }
          }
        }
      }
    });
  }

  setupPeriodicSync() {
    setInterval(() => {
      this.syncData();
    }, this.syncInterval);

    // Sync on visibility change (user returns to tab)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.shouldSync()) {
        this.syncData();
      }
    });

    // Sync on network status change
    window.addEventListener('online', () => {
      this.syncData();
    });
  }

  async loadAllData(options = {}) {
    const {
      showProgress = true,
      useCache = true,
      forceRefresh = false,
      concurrent = 3
    } = options;

    const loadingId = 'dataManager_loadAll';
    
    if (showProgress) {
      loadingSystem.startLoading(loadingId, {
        message: 'Loading application data...',
        showProgress: true
      });
    }

    try {
      // Sort data sources by priority and required status
      const sources = Array.from(this.dataSources.entries())
        .sort(([, a], [, b]) => {
          if (a.required !== b.required) {
            return a.required ? -1 : 1;
          }
          return a.priority - b.priority;
        });

      const loadItems = sources.map(([key, config]) => ({
        key,
        config,
        loadFunction: () => this.loadDataSource(key, { useCache, forceRefresh })
      }));

      // Use batch loader for concurrent loading
      const results = await loadingSystem.createBatchLoader(loadingId, loadItems, {
        concurrent,
        onItemComplete: (item, result, _index) => {
          if (result) {
            this.data[item.key] = result;
            this.notifySyncCallbacks('dataLoaded', item.key, result);
          }
        }
      });

      // Validate all loaded data
      await this.validateAllData();

      // Build search index
      searchEngine.buildSearchIndex(this.data);

      // Mark as loaded
      this.isLoaded = true;
      this.lastSyncTime = Date.now();

      // Save successful load state
      await storageManager.setLocal('lastDataLoad', {
        timestamp: this.lastSyncTime,
        dataKeys: Object.keys(this.data).filter(key => this.data[key] && 
          (Array.isArray(this.data[key]) ? this.data[key].length > 0 : Object.keys(this.data[key]).length > 0))
      });

      loadingSystem.finishLoading(loadingId, true, 'Data loaded successfully');
      
      this.notifySyncCallbacks('allDataLoaded', this.data);
      
      return {
        success: true,
        loadedSources: results.filter(r => r.value?.success).length,
        failedSources: results.filter(r => !r.value?.success).length,
        data: this.data
      };

    } catch (error) {
      errorHandler.handleError({
        type: 'data_load_critical',
        message: `Critical error loading data: ${error.message}`,
        error
      });

      loadingSystem.finishLoading(loadingId, false, 'Failed to load data');
      
      // Try to load from cache as fallback
      const cachedData = await this.loadFromCache();
      if (cachedData) {
        this.data = cachedData;
        this.isLoaded = true;
        return { success: true, fromCache: true, data: this.data };
      }

      throw error;
    }
  }

  async loadDataSource(key, options = {}) {
    const { useCache = true, forceRefresh = false, timeout = 10000 } = options;
    const config = this.dataSources.get(key);
    
    if (!config) {
      throw new Error(`Unknown data source: ${key}`);
    }

    // Check cache first if enabled
    if (useCache && !forceRefresh) {
      const cached = await this.getCachedData(key);
      if (cached) {
        return cached;
      }
    }

    // Try to load from API first, then fallback to local file
    try {
      const data = await this.loadFromAPI(key, config, timeout);
      await this.cacheData(key, data);
      return data;
    } catch (apiError) {
      console.warn(`API load failed for ${key}, trying local file:`, apiError.message);
      
      try {
        const data = await this.loadFromFile(key, config, timeout);
        await this.cacheData(key, data);
        return data;
      } catch (fileError) {
        if (config.required) {
          throw new Error(`Failed to load required data source ${key}: ${fileError.message}`);
        }
        
        console.warn(`Optional data source ${key} failed to load:`, fileError.message);
        return null;
      }
    }
  }

  async loadFromAPI(key, config, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(config.endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return this.processLoadedData(key, data);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async loadFromFile(key, config, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(config.file, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to load ${config.file}: ${response.status}`);
      }

      const data = await response.json();
      return this.processLoadedData(key, data);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  processLoadedData(key, data) {
    // Apply any data transformations specific to the data type
    switch (key) {
      case 'cigars':
        return this.processCigarData(data);
      case 'pairings':
        return this.processPairingData(data);
      case 'education':
        return this.processEducationData(data);
      default:
        return data;
    }
  }

  processCigarData(data) {
    if (!Array.isArray(data)) {
      throw new Error('Cigar data must be an array');
    }
    
    return data.map(cigar => ({
      ...cigar,
      // Ensure color is a number
      color: typeof cigar.color === 'string' ? parseInt(cigar.color, 16) : cigar.color,
      // Add computed fields
      id: `${cigar.name}_${cigar.wrapper}`.replace(/\s+/g, '_').toLowerCase(),
      searchText: `${cigar.name} ${cigar.wrapper} ${cigar.flavor}`.toLowerCase()
    }));
  }

  processPairingData(data) {
    // Ensure pairing data has the expected structure
    if (!data.pairingEngineV3) {
      throw new Error('Pairing data missing pairingEngineV3');
    }
    
    return data;
  }

  processEducationData(data) {
    // Ensure education data has tracks
    if (!data.educationTracks || !data.educationTracks.tracks) {
      throw new Error('Education data missing tracks');
    }
    
    return data;
  }

  async validateAllData() {
    const validationPromises = Array.from(this.dataSchemas.entries()).map(
      ([key, schema]) => this.validateData(key, this.data[key], schema)
    );

    const results = await Promise.allSettled(validationPromises);
    const failures = results.filter(result => result.status === 'rejected');
    
    if (failures.length > 0) {
      console.warn('Data validation warnings:', failures.map(f => f.reason.message));
      // Don't throw, just warn - allow app to continue with potentially imperfect data
    }
  }

  async validateData(key, data, schema) {
    try {
      if (!data) {
        const config = this.dataSources.get(key);
        if (config && config.required) {
          throw new Error(`Required data source ${key} is missing`);
        }
        return true;
      }

      // Basic type validation
      if (schema.type === 'array' && !Array.isArray(data)) {
        throw new Error(`${key} should be an array`);
      }
      
      if (schema.type === 'object' && (typeof data !== 'object' || Array.isArray(data))) {
        throw new Error(`${key} should be an object`);
      }

      // Validate required properties for objects
      if (schema.required && schema.type === 'object') {
        for (const requiredProp of schema.required) {
          if (!(requiredProp in data)) {
            throw new Error(`${key} missing required property: ${requiredProp}`);
          }
        }
      }

      // Validate array items
      if (schema.type === 'array' && schema.items) {
        // Check for invalid items for potential logging
        data.filter((item, index) => {
          try {
            return !this.validateItem(item, schema.items, `${key}[${index}]`);
          } catch (error) {
            console.warn(`Validation warning for ${key}[${index}]:`, error.message);
            return false; // Don't filter out, just warn
          }
        });
      }

      return true;
    } catch (error) {
      throw new Error(`Validation failed for ${key}: ${error.message}`);
    }
  }

  validateItem(item, schema, path) {
    if (schema.required) {
      for (const requiredProp of schema.required) {
        if (!(requiredProp in item)) {
          throw new Error(`${path} missing required property: ${requiredProp}`);
        }
      }
    }

    if (schema.properties) {
      for (const [prop, propSchema] of Object.entries(schema.properties)) {
        if (prop in item) {
          const value = item[prop];
          
          if (propSchema.type && typeof value !== propSchema.type) {
            throw new Error(`${path}.${prop} should be ${propSchema.type}`);
          }
          
          if (propSchema.enum && !propSchema.enum.includes(value)) {
            throw new Error(`${path}.${prop} should be one of: ${propSchema.enum.join(', ')}`);
          }
          
          if (propSchema.minLength && typeof value === 'string' && value.length < propSchema.minLength) {
            throw new Error(`${path}.${prop} should be at least ${propSchema.minLength} characters`);
          }
        }
      }
    }

    return true;
  }

  async getCachedData(key) {
    const config = this.dataSources.get(key);
    const cacheKey = `data_${key}`;
    
    const cached = await storageManager.getCachedData(cacheKey);
    
    if (cached && cached.timestamp) {
      const age = Date.now() - cached.timestamp;
      if (age < config.cacheDuration) {
        return cached.data;
      }
    }
    
    return null;
  }

  async cacheData(key, data) {
    const config = this.dataSources.get(key);
    const cacheKey = `data_${key}`;
    
    await storageManager.cacheData(cacheKey, {
      data,
      timestamp: Date.now(),
      version: this.getDataVersion(key, data)
    }, config.cacheDuration);
  }

  getDataVersion(key, data) {
    // Generate a simple version hash based on data content
    const content = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  async loadFromCache() {
    try {
      const lastLoad = await storageManager.getLocal('lastDataLoad');
      if (!lastLoad || !lastLoad.dataKeys) {
        return null;
      }

      const cachedData = {};
      let hasValidCache = false;

      for (const key of lastLoad.dataKeys) {
        const cached = await this.getCachedData(key);
        if (cached) {
          cachedData[key] = cached;
          hasValidCache = true;
        }
      }

      return hasValidCache ? cachedData : null;
    } catch (error) {
      console.warn('Failed to load from cache:', error);
      return null;
    }
  }

  shouldSync() {
    if (!this.lastSyncTime) {return true;}
    const timeSinceSync = Date.now() - this.lastSyncTime;
    return timeSinceSync > this.syncInterval;
  }

  async syncData() {
    if (!navigator.onLine) {return;}

    try {
      console.log('🔄 Syncing data...');
      
      const result = await this.loadAllData({
        showProgress: false,
        useCache: true,
        forceRefresh: false,
        concurrent: 2
      });

      if (result.success) {
        this.notifySyncCallbacks('dataSynced', result);
      }
    } catch (error) {
      console.warn('Data sync failed:', error);
      errorHandler.handleError({
        type: 'data_sync',
        message: `Background data sync failed: ${error.message}`,
        error
      });
    }
  }

  // Public API methods
  getCigarData() {
    return this.data.cigars || [];
  }

  getPairingData() {
    return this.data.pairings || {};
  }

  getEducationData() {
    return this.data.education || {};
  }

  getCigarById(id) {
    return this.getCigarData().find(cigar => cigar.id === id);
  }

  getCigarsByWrapper(wrapper) {
    return this.getCigarData().filter(cigar => cigar.wrapper === wrapper);
  }

  getCigarPairings(cigarName) {
    const pairings = this.getPairingData();
    if (!pairings.pairingEngineV3) {return [];}
    
    const cigar = this.getCigarData().find(c => c.name === cigarName);
    if (!cigar) {return [];}

    const results = [];
    const engine = pairings.pairingEngineV3;
    
    if (engine.ceuLessons) {
      engine.ceuLessons.forEach(lesson => {
        if (lesson.focus && lesson.focus.includes(cigar.wrapper)) {
          results.push({
            type: 'Spirit Pairing',
            recommendation: lesson.lessonTitle,
            logic: lesson.learningObjective
          });
        }
      });
    }

    return results;
  }

  getEducationalContent(topic) {
    const education = this.getEducationData();
    if (!education.educationTracks || !education.educationTracks.tracks) {return [];}
    
    const {tracks} = education.educationTracks;
    return tracks.filter(track => 
      track.title.toLowerCase().includes(topic.toLowerCase()) ||
      track.lessons.some(lesson => lesson.toLowerCase().includes(topic.toLowerCase()))
    );
  }

  addSyncCallback(callback) {
    this.syncCallbacks.add(callback);
  }

  removeSyncCallback(callback) {
    this.syncCallbacks.delete(callback);
  }

  notifySyncCallbacks(event, ...args) {
    this.syncCallbacks.forEach(callback => {
      try {
        callback(event, ...args);
      } catch (error) {
        console.warn('Sync callback error:', error);
      }
    });
  }

  getStats() {
    return {
      isLoaded: this.isLoaded,
      lastSyncTime: this.lastSyncTime,
      dataSources: Array.from(this.dataSources.keys()),
      dataStats: Object.fromEntries(
        Object.entries(this.data).map(([key, value]) => [
          key,
          {
            loaded: !!value,
            count: Array.isArray(value) ? value.length : 
                   typeof value === 'object' ? Object.keys(value).length : 0,
            size: JSON.stringify(value).length
          }
        ])
      )
    };
  }

  async clearCache() {
    const keys = Array.from(this.dataSources.keys());
    for (const key of keys) {
      await storageManager.removeLocal(`cache_data_${key}`);
    }
    await storageManager.removeLocal('lastDataLoad');
  }
}

// Create singleton instance
const dataManager = new DataManager();

// Make it available globally for backwards compatibility
if (typeof window !== 'undefined') {
  window.dataManager = dataManager;
}

export default dataManager;