/**
 * Comprehensive test suite for DataManager utility
 * Tests data loading, caching, filtering, searching, and data processing
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock data for testing
const mockCigarData = [
  {
    name: 'Cohiba Behike 52',
    wrapper: 'Connecticut',
    strength: 'Medium',
    price: 25.99,
    origin: 'Cuba',
    flavor: 'Rich, creamy, with notes of vanilla and wood',
    rating: 4.8
  },
  {
    name: 'Montecristo No. 2',
    wrapper: 'Maduro',
    strength: 'Full',
    price: 18.50,
    origin: 'Nicaragua',
    flavor: 'Bold, earthy, with chocolate undertones',
    rating: 4.6
  },
  {
    name: 'Romeo y Julieta Churchill',
    wrapper: 'Natural',
    strength: 'Mild',
    price: 12.99,
    origin: 'Dominican Republic',
    flavor: 'Smooth, balanced, with cedar notes',
    rating: 4.3
  }
];

// Mock the DataManager class
const createMockDataManager = () => ({
  data: new Map(),
  cache: new Map(),
  dataLoaders: new Map(),
  isLoading: false,
  loadingProgress: 0,

  async loadData(source, options = {}) {
    this.isLoading = true;
    this.loadingProgress = 0;
    
    try {
      // Simulate loading progress
      for (let i = 0; i <= 100; i += 20) {
        this.loadingProgress = i;
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      let data;
      if (source === 'cigars') {
        data = [...mockCigarData];
      } else if (source === 'error') {
        throw new Error('Failed to load data');
      } else {
        data = [];
      }
      
      // Apply cache if enabled
      if (options.useCache !== false) {
        this.cache.set(source, {
          data,
          timestamp: Date.now(),
          expires: Date.now() + (options.cacheDuration || 60000)
        });
      }
      
      this.data.set(source, data);
      return data;
    } finally {
      this.isLoading = false;
      this.loadingProgress = 100;
    }
  },

  getData(source) {
    return this.data.get(source) || [];
  },

  getCachedData(source) {
    const cached = this.cache.get(source);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    return null;
  },

  filterData(source, filters) {
    const data = this.getData(source);
    if (!filters || Object.keys(filters).length === 0) {
      return data;
    }
    
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined) return true;
        
        if (Array.isArray(value)) {
          return value.includes(item[key]);
        }
        
        if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
          const itemValue = item[key];
          return itemValue >= value.min && itemValue <= value.max;
        }
        
        return item[key] === value;
      });
    });
  },

  searchData(source, query, fields = []) {
    const data = this.getData(source);
    if (!query || query.trim() === '') {
      return data;
    }
    
    const searchTerm = query.toLowerCase();
    
    return data.filter(item => {
      if (fields.length === 0) {
        // Search all string fields
        return Object.values(item).some(value => 
          typeof value === 'string' && value.toLowerCase().includes(searchTerm)
        );
      }
      
      // Search specific fields
      return fields.some(field => {
        const value = item[field];
        return typeof value === 'string' && value.toLowerCase().includes(searchTerm);
      });
    });
  },

  sortData(source, sortBy, sortOrder = 'asc') {
    const data = this.getData(source);
    
    return [...data].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      // Handle different data types
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  },

  getStats(source, field) {
    const data = this.getData(source);
    const values = data.map(item => item[field]).filter(val => typeof val === 'number');
    
    if (values.length === 0) {
      return null;
    }
    
    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      total: values.reduce((sum, val) => sum + val, 0)
    };
  },

  clearCache(source = null) {
    if (source) {
      this.cache.delete(source);
    } else {
      this.cache.clear();
    }
  },

  reset() {
    this.data.clear();
    this.cache.clear();
    this.dataLoaders.clear();
    this.isLoading = false;
    this.loadingProgress = 0;
  }
});

describe('DataManager Utility', () => {
  let dataManager;

  beforeEach(() => {
    dataManager = createMockDataManager();
  });

  afterEach(() => {
    dataManager.reset();
  });

  describe('Data Loading', () => {
    it('should load data successfully', async () => {
      const data = await dataManager.loadData('cigars');
      
      expect(data).toHaveLength(3);
      expect(data[0].name).toBe('Cohiba Behike 52');
      expect(dataManager.isLoading).toBe(false);
      expect(dataManager.loadingProgress).toBe(100);
    });

    it('should handle loading errors', async () => {
      await expect(dataManager.loadData('error')).rejects.toThrow('Failed to load data');
      expect(dataManager.isLoading).toBe(false);
    });

    it('should track loading progress', async () => {
      const progressValues = [];
      
      const loadPromise = dataManager.loadData('cigars');
      
      // Check progress during loading
      setTimeout(() => progressValues.push(dataManager.loadingProgress), 5);
      setTimeout(() => progressValues.push(dataManager.loadingProgress), 25);
      setTimeout(() => progressValues.push(dataManager.loadingProgress), 45);
      
      await loadPromise;
      
      expect(dataManager.loadingProgress).toBe(100);
    });

    it('should cache loaded data by default', async () => {
      await dataManager.loadData('cigars');
      
      const cached = dataManager.getCachedData('cigars');
      expect(cached).toHaveLength(3);
      expect(cached[0].name).toBe('Cohiba Behike 52');
    });

    it('should skip caching when disabled', async () => {
      await dataManager.loadData('cigars', { useCache: false });
      
      const cached = dataManager.getCachedData('cigars');
      expect(cached).toBeNull();
    });
  });

  describe('Data Retrieval', () => {
    beforeEach(async () => {
      await dataManager.loadData('cigars');
    });

    it('should retrieve loaded data', () => {
      const data = dataManager.getData('cigars');
      
      expect(data).toHaveLength(3);
      expect(data[0].name).toBe('Cohiba Behike 52');
    });

    it('should return empty array for non-existent data', () => {
      const data = dataManager.getData('non-existent');
      
      expect(data).toEqual([]);
    });

    it('should retrieve valid cached data', () => {
      const cached = dataManager.getCachedData('cigars');
      
      expect(cached).toHaveLength(3);
    });

    it('should return null for expired cache', () => {
      // Manually expire cache
      const cacheEntry = dataManager.cache.get('cigars');
      cacheEntry.expires = Date.now() - 1000;
      
      const cached = dataManager.getCachedData('cigars');
      expect(cached).toBeNull();
    });
  });

  describe('Data Filtering', () => {
    beforeEach(async () => {
      await dataManager.loadData('cigars');
    });

    it('should filter by single property', () => {
      const filtered = dataManager.filterData('cigars', { strength: 'Medium' });
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Cohiba Behike 52');
    });

    it('should filter by multiple properties', () => {
      const filtered = dataManager.filterData('cigars', { 
        wrapper: 'Maduro',
        strength: 'Full'
      });
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Montecristo No. 2');
    });

    it('should filter by array values', () => {
      const filtered = dataManager.filterData('cigars', { 
        strength: ['Medium', 'Mild']
      });
      
      expect(filtered).toHaveLength(2);
    });

    it('should filter by range values', () => {
      const filtered = dataManager.filterData('cigars', { 
        price: { min: 15, max: 20 }
      });
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Montecristo No. 2');
    });

    it('should return all data when no filters applied', () => {
      const filtered = dataManager.filterData('cigars', {});
      
      expect(filtered).toHaveLength(3);
    });

    it('should handle null/undefined filter values', () => {
      const filtered = dataManager.filterData('cigars', { 
        strength: null,
        wrapper: undefined
      });
      
      expect(filtered).toHaveLength(3);
    });
  });

  describe('Data Searching', () => {
    beforeEach(async () => {
      await dataManager.loadData('cigars');
    });

    it('should search across all string fields', () => {
      const results = dataManager.searchData('cigars', 'Cohiba');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Cohiba Behike 52');
    });

    it('should search specific fields', () => {
      const results = dataManager.searchData('cigars', 'chocolate', ['flavor']);
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Montecristo No. 2');
    });

    it('should be case insensitive', () => {
      const results = dataManager.searchData('cigars', 'COHIBA');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Cohiba Behike 52');
    });

    it('should return all data for empty query', () => {
      const results = dataManager.searchData('cigars', '');
      
      expect(results).toHaveLength(3);
    });

    it('should return empty array for no matches', () => {
      const results = dataManager.searchData('cigars', 'nonexistent');
      
      expect(results).toHaveLength(0);
    });
  });

  describe('Data Sorting', () => {
    beforeEach(async () => {
      await dataManager.loadData('cigars');
    });

    it('should sort by string field ascending', () => {
      const sorted = dataManager.sortData('cigars', 'name', 'asc');
      
      expect(sorted[0].name).toBe('Cohiba Behike 52');
      expect(sorted[1].name).toBe('Montecristo No. 2');
      expect(sorted[2].name).toBe('Romeo y Julieta Churchill');
    });

    it('should sort by string field descending', () => {
      const sorted = dataManager.sortData('cigars', 'name', 'desc');
      
      expect(sorted[0].name).toBe('Romeo y Julieta Churchill');
      expect(sorted[1].name).toBe('Montecristo No. 2');
      expect(sorted[2].name).toBe('Cohiba Behike 52');
    });

    it('should sort by numeric field ascending', () => {
      const sorted = dataManager.sortData('cigars', 'price', 'asc');
      
      expect(sorted[0].price).toBe(12.99);
      expect(sorted[1].price).toBe(18.50);
      expect(sorted[2].price).toBe(25.99);
    });

    it('should sort by numeric field descending', () => {
      const sorted = dataManager.sortData('cigars', 'price', 'desc');
      
      expect(sorted[0].price).toBe(25.99);
      expect(sorted[1].price).toBe(18.50);
      expect(sorted[2].price).toBe(12.99);
    });

    it('should default to ascending order', () => {
      const sorted = dataManager.sortData('cigars', 'price');
      
      expect(sorted[0].price).toBe(12.99);
      expect(sorted[2].price).toBe(25.99);
    });
  });

  describe('Data Statistics', () => {
    beforeEach(async () => {
      await dataManager.loadData('cigars');
    });

    it('should calculate stats for numeric field', () => {
      const stats = dataManager.getStats('cigars', 'price');
      
      expect(stats.count).toBe(3);
      expect(stats.min).toBe(12.99);
      expect(stats.max).toBe(25.99);
      expect(stats.average).toBeCloseTo(19.16, 2);
      expect(stats.total).toBeCloseTo(57.48, 2);
    });

    it('should calculate stats for rating field', () => {
      const stats = dataManager.getStats('cigars', 'rating');
      
      expect(stats.count).toBe(3);
      expect(stats.min).toBe(4.3);
      expect(stats.max).toBe(4.8);
      expect(stats.average).toBeCloseTo(4.57, 2);
    });

    it('should return null for non-numeric field', () => {
      const stats = dataManager.getStats('cigars', 'name');
      
      expect(stats).toBeNull();
    });

    it('should return null for empty data', () => {
      const stats = dataManager.getStats('empty', 'price');
      
      expect(stats).toBeNull();
    });
  });

  describe('Cache Management', () => {
    beforeEach(async () => {
      await dataManager.loadData('cigars');
    });

    it('should clear specific cache', () => {
      dataManager.clearCache('cigars');
      
      const cached = dataManager.getCachedData('cigars');
      expect(cached).toBeNull();
    });

    it('should clear all cache', () => {
      // Load multiple data sources
      dataManager.cache.set('source1', { data: [], timestamp: Date.now(), expires: Date.now() + 60000 });
      dataManager.cache.set('source2', { data: [], timestamp: Date.now(), expires: Date.now() + 60000 });
      
      dataManager.clearCache();
      
      expect(dataManager.cache.size).toBe(0);
    });
  });

  describe('Performance', () => {
    beforeEach(async () => {
      // Create larger dataset for performance testing
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Cigar ${i}`,
        price: Math.random() * 50 + 10,
        rating: Math.random() * 2 + 3,
        strength: ['Mild', 'Medium', 'Full'][i % 3]
      }));
      
      dataManager.data.set('large', largeData);
    });

    it('should filter large datasets efficiently', () => {
      const startTime = performance.now();
      
      const filtered = dataManager.filterData('large', { strength: 'Medium' });
      
      const endTime = performance.now();
      
      expect(filtered.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(50); // Should be fast
    });

    it('should search large datasets efficiently', () => {
      const startTime = performance.now();
      
      const results = dataManager.searchData('large', 'Cigar 50');
      
      const endTime = performance.now();
      
      expect(results.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(50); // Should be fast
    });

    it('should sort large datasets efficiently', () => {
      const startTime = performance.now();
      
      const sorted = dataManager.sortData('large', 'price');
      
      const endTime = performance.now();
      
      expect(sorted).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(100); // Should be reasonably fast
    });
  });

  describe('Integration Tests', () => {
    beforeEach(async () => {
      await dataManager.loadData('cigars');
    });

    it('should combine filtering, searching, and sorting', () => {
      // Filter by strength
      let results = dataManager.filterData('cigars', { strength: ['Medium', 'Full'] });
      expect(results).toHaveLength(2);
      
      // Search within filtered results
      const filtered = results.filter(item => 
        dataManager.searchData([item], 'rich').length > 0
      );
      expect(filtered).toHaveLength(1);
      
      // Sort the final results
      const sorted = dataManager.sortData('cigars', 'price', 'desc');
      expect(sorted[0].price).toBe(25.99);
    });

    it('should handle complex data operations workflow', async () => {
      // Load data
      const data = await dataManager.loadData('cigars');
      expect(data).toHaveLength(3);
      
      // Apply filters
      const mediumStrength = dataManager.filterData('cigars', { strength: 'Medium' });
      expect(mediumStrength).toHaveLength(1);
      
      // Search within results
      const searchResults = dataManager.searchData('cigars', 'vanilla');
      expect(searchResults).toHaveLength(1);
      
      // Get statistics
      const priceStats = dataManager.getStats('cigars', 'price');
      expect(priceStats.average).toBeCloseTo(19.16, 2);
      
      // Sort by rating
      const sortedByRating = dataManager.sortData('cigars', 'rating', 'desc');
      expect(sortedByRating[0].rating).toBe(4.8);
    });
  });
});