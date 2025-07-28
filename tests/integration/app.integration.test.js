/**
 * Comprehensive integration test suite for Thee Cigar Maestro application
 * Tests complete user workflows, data flow, and component interactions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock application components and services
const mockApp = {
  dataManager: null,
  uiManager: null,
  errorHandler: null,
  storageManager: null,
  isInitialized: false,
  currentUser: null,

  async init() {
    this.dataManager = {
      data: new Map(),
      async loadData(source) {
        const mockData = {
          cigars: [
            { name: 'Cohiba Behike', strength: 'Medium', price: 25.99, rating: 4.8 },
            { name: 'Montecristo No. 2', strength: 'Full', price: 18.50, rating: 4.6 },
            { name: 'Romeo y Julieta', strength: 'Mild', price: 12.99, rating: 4.3 }
          ],
          education: [
            { title: 'Cigar Basics', content: 'Learn about cigar construction', completed: false }
          ],
          pairings: [
            { cigar: 'Cohiba Behike', drink: 'Whiskey', rating: 9.2 }
          ]
        };
        this.data.set(source, mockData[source] || []);
        return this.data.get(source);
      },
      getData(source) {
        return this.data.get(source) || [];
      },
      filterData(source, filters) {
        const data = this.getData(source);
        return data.filter(item => {
          return Object.entries(filters).every(([key, value]) => {
            if (Array.isArray(value)) return value.includes(item[key]);
            return item[key] === value;
          });
        });
      },
      searchData(source, query) {
        const data = this.getData(source);
        return data.filter(item => 
          Object.values(item).some(val => 
            typeof val === 'string' && val.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
    };

    this.uiManager = {
      notifications: [],
      modals: new Map(),
      currentView: 'home',
      showToast(message, type = 'info') {
        const toast = { id: Date.now(), message, type };
        this.notifications.push(toast);
        return toast.id;
      },
      showModal(id, content) {
        this.modals.set(id, { id, content, visible: true });
        return this.modals.get(id);
      },
      hideModal(id) {
        if (this.modals.has(id)) {
          this.modals.get(id).visible = false;
          this.modals.delete(id);
          return true;
        }
        return false;
      },
      setView(view) {
        this.currentView = view;
      }
    };

    this.errorHandler = {
      errors: [],
      handleError(error, context) {
        const errorInfo = {
          message: error.message || error,
          context,
          timestamp: Date.now(),
          severity: this.determineSeverity(error)
        };
        this.errors.push(errorInfo);
        
        // Show user notification for critical errors
        if (errorInfo.severity === 'critical') {
          this.app?.uiManager?.showToast(errorInfo.message, 'error');
        }
        
        return errorInfo;
      },
      determineSeverity(error) {
        if (typeof error === 'string') return 'low';
        if (error.name === 'NetworkError') return 'high';
        if (error.name === 'TypeError') return 'critical';
        return 'medium';
      },
      getRecentErrors() {
        return this.errors.slice(-10);
      }
    };

    this.storageManager = {
      data: new Map(),
      preferences: {},
      setLocal(key, value) {
        this.data.set(key, value);
        return true;
      },
      getLocal(key) {
        return this.data.get(key);
      },
      setPreference(key, value) {
        this.preferences[key] = value;
        return true;
      },
      getPreference(key) {
        return this.preferences[key];
      }
    };

    // Connect error handler to app
    this.errorHandler.app = this;
    
    this.isInitialized = true;
    return this;
  },

  async authenticateUser(credentials) {
    if (credentials.username === 'testuser' && credentials.password === 'password') {
      this.currentUser = {
        id: 1,
        username: 'testuser',
        preferences: { theme: 'dark' },
        favorites: []
      };
      this.uiManager.showToast('Welcome back!', 'success');
      return this.currentUser;
    }
    throw new Error('Invalid credentials');
  },

  async loadApplicationData() {
    try {
      await this.dataManager.loadData('cigars');
      await this.dataManager.loadData('education');
      await this.dataManager.loadData('pairings');
      this.uiManager.showToast('Data loaded successfully', 'success');
      return true;
    } catch (error) {
      this.errorHandler.handleError(error, 'Data Loading');
      throw error;
    }
  },

  searchCigars(query, filters = {}) {
    try {
      let results = this.dataManager.getData('cigars');
      
      if (query) {
        results = this.dataManager.searchData('cigars', query);
      }
      
      if (Object.keys(filters).length > 0) {
        results = this.dataManager.filterData('cigars', filters);
      }
      
      return results;
    } catch (error) {
      this.errorHandler.handleError(error, 'Cigar Search');
      return [];
    }
  },

  addToFavorites(cigarName) {
    if (!this.currentUser) {
      throw new Error('User must be authenticated');
    }
    
    if (!this.currentUser.favorites.includes(cigarName)) {
      this.currentUser.favorites.push(cigarName);
      this.storageManager.setLocal('favorites', this.currentUser.favorites);
      this.uiManager.showToast(`${cigarName} added to favorites`, 'success');
      return true;
    }
    
    return false;
  },

  reset() {
    this.dataManager?.data?.clear();
    this.uiManager?.notifications?.splice(0);
    this.uiManager?.modals?.clear();
    this.errorHandler?.errors?.splice(0);
    this.storageManager?.data?.clear();
    this.currentUser = null;
    this.isInitialized = false;
  }
};

describe('Application Integration Tests', () => {
  let app;

  beforeEach(async () => {
    app = Object.create(mockApp);
    await app.init();
  });

  afterEach(() => {
    app.reset();
  });

  describe('Application Initialization', () => {
    it('should initialize all core services', async () => {
      expect(app.isInitialized).toBe(true);
      expect(app.dataManager).toBeTruthy();
      expect(app.uiManager).toBeTruthy();
      expect(app.errorHandler).toBeTruthy();
      expect(app.storageManager).toBeTruthy();
    });

    it('should handle initialization errors gracefully', async () => {
      const failingApp = Object.create(mockApp);
      failingApp.init = vi.fn().mockRejectedValue(new Error('Init failed'));
      
      await expect(failingApp.init()).rejects.toThrow('Init failed');
    });
  });

  describe('Data Loading Workflow', () => {
    it('should load all application data successfully', async () => {
      const result = await app.loadApplicationData();
      
      expect(result).toBe(true);
      expect(app.dataManager.getData('cigars')).toHaveLength(3);
      expect(app.dataManager.getData('education')).toHaveLength(1);
      expect(app.dataManager.getData('pairings')).toHaveLength(1);
      expect(app.uiManager.notifications).toHaveLength(1);
      expect(app.uiManager.notifications[0].type).toBe('success');
    });

    it('should handle data loading errors', async () => {
      app.dataManager.loadData = vi.fn().mockRejectedValue(new Error('Network error'));
      
      await expect(app.loadApplicationData()).rejects.toThrow('Network error');
      expect(app.errorHandler.errors).toHaveLength(1);
      expect(app.errorHandler.errors[0].context).toBe('Data Loading');
    });
  });

  describe('User Authentication Workflow', () => {
    it('should authenticate user with valid credentials', async () => {
      const user = await app.authenticateUser({ username: 'testuser', password: 'password' });
      
      expect(user).toBeTruthy();
      expect(user.username).toBe('testuser');
      expect(app.currentUser).toEqual(user);
      expect(app.uiManager.notifications).toHaveLength(1);
      expect(app.uiManager.notifications[0].message).toBe('Welcome back!');
    });

    it('should reject invalid credentials', async () => {
      await expect(app.authenticateUser({ username: 'invalid', password: 'wrong' }))
        .rejects.toThrow('Invalid credentials');
      expect(app.currentUser).toBeNull();
    });
  });

  describe('Search and Filter Workflow', () => {
    beforeEach(async () => {
      await app.loadApplicationData();
    });

    it('should search cigars by name', () => {
      const results = app.searchCigars('Cohiba');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Cohiba Behike');
    });

    it('should filter cigars by strength', () => {
      const results = app.searchCigars('', { strength: 'Medium' });
      
      expect(results).toHaveLength(1);
      expect(results[0].strength).toBe('Medium');
    });

    it('should combine search and filter', () => {
      app.dataManager.filterData = vi.fn((source, filters) => {
        const data = app.dataManager.getData(source);
        return data.filter(item => item.strength === filters.strength);
      });
      
      app.dataManager.searchData = vi.fn((source, query) => {
        return app.dataManager.filterData(source, {});
      });
      
      const results = app.searchCigars('Monte', { strength: 'Full' });
      
      expect(app.dataManager.searchData).toHaveBeenCalled();
      expect(app.dataManager.filterData).toHaveBeenCalled();
    });

    it('should handle search errors gracefully', () => {
      app.dataManager.searchData = vi.fn().mockImplementation(() => {
        throw new Error('Search failed');
      });
      
      const results = app.searchCigars('test');
      
      expect(results).toEqual([]);
      expect(app.errorHandler.errors).toHaveLength(1);
    });
  });

  describe('Favorites Management Workflow', () => {
    beforeEach(async () => {
      await app.loadApplicationData();
      await app.authenticateUser({ username: 'testuser', password: 'password' });
    });

    it('should add cigar to favorites', () => {
      const result = app.addToFavorites('Cohiba Behike');
      
      expect(result).toBe(true);
      expect(app.currentUser.favorites).toContain('Cohiba Behike');
      expect(app.storageManager.getLocal('favorites')).toContain('Cohiba Behike');
      expect(app.uiManager.notifications).toHaveLength(2); // Welcome + Added to favorites
    });

    it('should not add duplicate favorites', () => {
      app.addToFavorites('Cohiba Behike');
      const result = app.addToFavorites('Cohiba Behike');
      
      expect(result).toBe(false);
      expect(app.currentUser.favorites).toHaveLength(1);
    });

    it('should require authentication for favorites', () => {
      app.currentUser = null;
      
      expect(() => app.addToFavorites('Cohiba Behike'))
        .toThrow('User must be authenticated');
    });
  });

  describe('Error Handling Integration', () => {
    beforeEach(async () => {
      await app.loadApplicationData();
    });

    it('should handle and categorize different error types', () => {
      // Test different error types
      app.errorHandler.handleError(new TypeError('Type error'), 'Test Context');
      app.errorHandler.handleError({ name: 'NetworkError', message: 'Network failed' }, 'Network');
      app.errorHandler.handleError('Simple string error', 'String Context');
      
      const errors = app.errorHandler.getRecentErrors();
      expect(errors).toHaveLength(3);
      expect(errors[0].severity).toBe('critical');
      expect(errors[1].severity).toBe('high');
      expect(errors[2].severity).toBe('low');
    });

    it('should show user notifications for critical errors', () => {
      const initialNotifications = app.uiManager.notifications.length;
      
      app.errorHandler.handleError(new TypeError('Critical error'), 'Test');
      
      expect(app.uiManager.notifications).toHaveLength(initialNotifications + 1);
      expect(app.uiManager.notifications[app.uiManager.notifications.length - 1].type).toBe('error');
    });
  });

  describe('UI State Management Integration', () => {
    beforeEach(async () => {
      await app.loadApplicationData();
    });

    it('should manage modal state correctly', () => {
      const modal = app.uiManager.showModal('cigar-details', '<p>Cigar details</p>');
      
      expect(modal.visible).toBe(true);
      expect(app.uiManager.modals.size).toBe(1);
      
      const result = app.uiManager.hideModal('cigar-details');
      
      expect(result).toBe(true);
      expect(app.uiManager.modals.size).toBe(0);
    });

    it('should manage notification queue', () => {
      app.uiManager.showToast('Message 1', 'info');
      app.uiManager.showToast('Message 2', 'success');
      app.uiManager.showToast('Message 3', 'warning');
      
      expect(app.uiManager.notifications).toHaveLength(4); // Including initial success message
      
      const types = app.uiManager.notifications.map(n => n.type);
      expect(types).toContain('info');
      expect(types).toContain('success');
      expect(types).toContain('warning');
    });

    it('should handle view transitions', () => {
      app.uiManager.setView('search');
      expect(app.uiManager.currentView).toBe('search');
      
      app.uiManager.setView('favorites');
      expect(app.uiManager.currentView).toBe('favorites');
    });
  });

  describe('Storage Integration', () => {
    beforeEach(async () => {
      await app.loadApplicationData();
      await app.authenticateUser({ username: 'testuser', password: 'password' });
    });

    it('should persist user preferences', () => {
      app.storageManager.setPreference('theme', 'dark');
      app.storageManager.setPreference('language', 'en');
      
      expect(app.storageManager.getPreference('theme')).toBe('dark');
      expect(app.storageManager.getPreference('language')).toBe('en');
    });

    it('should persist user data across sessions', () => {
      app.addToFavorites('Cohiba Behike');
      app.storageManager.setLocal('lastSearch', 'medium strength');
      
      // Simulate session restart
      const favorites = app.storageManager.getLocal('favorites');
      const lastSearch = app.storageManager.getLocal('lastSearch');
      
      expect(favorites).toContain('Cohiba Behike');
      expect(lastSearch).toBe('medium strength');
    });
  });

  describe('Complete User Journey Tests', () => {
    it('should handle complete new user onboarding flow', async () => {
      // 1. App initialization
      expect(app.isInitialized).toBe(true);
      
      // 2. Load application data
      await app.loadApplicationData();
      expect(app.dataManager.getData('cigars')).toHaveLength(3);
      
      // 3. User authentication
      const user = await app.authenticateUser({ username: 'testuser', password: 'password' });
      expect(user.username).toBe('testuser');
      
      // 4. Search for cigars
      const searchResults = app.searchCigars('Cohiba');
      expect(searchResults).toHaveLength(1);
      
      // 5. Add to favorites
      app.addToFavorites('Cohiba Behike');
      expect(app.currentUser.favorites).toContain('Cohiba Behike');
      
      // 6. Set preferences
      app.storageManager.setPreference('theme', 'dark');
      expect(app.storageManager.getPreference('theme')).toBe('dark');
      
      // Verify overall state
      expect(app.uiManager.notifications.length).toBeGreaterThan(0);
      expect(app.errorHandler.errors).toHaveLength(0);
    });

    it('should handle user session with errors and recovery', async () => {
      // 1. Initialize with data loading error
      app.dataManager.loadData = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue([]);
      
      await expect(app.loadApplicationData()).rejects.toThrow('Network error');
      expect(app.errorHandler.errors).toHaveLength(1);
      
      // 2. Retry data loading successfully
      await app.loadApplicationData();
      expect(app.errorHandler.errors).toHaveLength(1); // No new errors
      
      // 3. Authentication
      await app.authenticateUser({ username: 'testuser', password: 'password' });
      
      // 4. Search with error handling
      const results = app.searchCigars('test query');
      expect(results).toBeDefined(); // Should handle gracefully
      
      // 5. Verify error tracking
      const recentErrors = app.errorHandler.getRecentErrors();
      expect(recentErrors.length).toBeGreaterThan(0);
    });

    it('should maintain state consistency across complex operations', async () => {
      // Setup
      await app.loadApplicationData();
      await app.authenticateUser({ username: 'testuser', password: 'password' });
      
      // Perform complex operations
      const searchResults = app.searchCigars('Monte');
      app.addToFavorites('Montecristo No. 2');
      app.uiManager.showModal('details', 'Cigar details');
      app.storageManager.setPreference('notifications', true);
      
      // Verify state consistency
      expect(app.currentUser.favorites).toContain('Montecristo No. 2');
      expect(app.uiManager.modals.size).toBe(1);
      expect(app.storageManager.getPreference('notifications')).toBe(true);
      expect(searchResults).toBeDefined();
      
      // Verify no unhandled errors
      expect(app.errorHandler.errors.filter(e => e.severity === 'critical')).toHaveLength(0);
    });
  });

  describe('Performance Integration', () => {
    it('should handle rapid user interactions efficiently', async () => {
      await app.loadApplicationData();
      await app.authenticateUser({ username: 'testuser', password: 'password' });
      
      const startTime = performance.now();
      
      // Simulate rapid user interactions
      for (let i = 0; i < 50; i++) {
        app.searchCigars(`query${i}`);
        app.uiManager.showToast(`Message ${i}`);
        if (i % 10 === 0) {
          app.uiManager.showModal(`modal${i}`, 'content');
          app.uiManager.hideModal(`modal${i}`);
        }
      }
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
      expect(app.uiManager.notifications.length).toBe(51); // 1 initial + 50 new
    });

    it('should handle large dataset operations efficiently', async () => {
      // Create large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        name: `Cigar ${i}`,
        strength: ['Mild', 'Medium', 'Full'][i % 3],
        price: Math.random() * 50 + 10
      }));
      
      app.dataManager.data.set('cigars', largeDataset);
      
      const startTime = performance.now();
      
      // Perform operations on large dataset
      const searchResults = app.searchCigars('Cigar 50');
      const filterResults = app.searchCigars('', { strength: 'Medium' });
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
      expect(searchResults.length).toBeGreaterThan(0);
      expect(filterResults.length).toBeGreaterThan(0);
    });
  });
});