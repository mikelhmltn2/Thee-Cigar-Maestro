import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import storageManager from '../../src/utils/storage.js';

describe('StorageManager', () => {
  beforeEach(() => {
    // Clear all storage before each test
    localStorage.clear();
    sessionStorage.clear();
    storageManager.memoryStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
    sessionStorage.clear();
    storageManager.memoryStorage.clear();
  });

  describe('localStorage operations', () => {
    it('should set and get items from localStorage', () => {
      const key = 'testKey';
      const value = { test: 'data', number: 123 };
      
      const result = storageManager.setLocal(key, value);
      expect(result).toBe(true);
      
      const retrieved = storageManager.getLocal(key);
      expect(retrieved).toEqual(value);
    });

    it('should handle expiration correctly', async () => {
      const key = 'expireKey';
      const value = 'expireValue';
      const shortExpiration = 10; // 10ms
      
      storageManager.setLocal(key, value, shortExpiration);
      
      // Should be available immediately
      expect(storageManager.getLocal(key)).toBe(value);
      
      // Wait for expiration
      await new Promise(resolve => { setTimeout(resolve, 20); });
      
      // Should be null after expiration
      expect(storageManager.getLocal(key)).toBeNull();
    });

    it('should return null for non-existent keys', () => {
      expect(storageManager.getLocal('nonExistent')).toBeNull();
    });

    it('should remove items correctly', () => {
      const key = 'removeKey';
      const value = 'removeValue';
      
      storageManager.setLocal(key, value);
      expect(storageManager.getLocal(key)).toBe(value);
      
      const removed = storageManager.removeLocal(key);
      expect(removed).toBe(true);
      expect(storageManager.getLocal(key)).toBeNull();
    });

    it('should fallback to memory storage when localStorage is unavailable', () => {
      // Mock localStorage to throw an error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });
      
      const key = 'fallbackKey';
      const value = 'fallbackValue';
      
      const result = storageManager.setLocal(key, value);
      expect(result).toBe(true);
      
      const retrieved = storageManager.getLocal(key);
      expect(retrieved).toBe(value);
      
      // Restore original method
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('sessionStorage operations', () => {
    it('should set and get items from sessionStorage', () => {
      const key = 'sessionKey';
      const value = { session: 'data' };
      
      const result = storageManager.setSession(key, value);
      expect(result).toBe(true);
      
      const retrieved = storageManager.getSession(key);
      expect(retrieved).toEqual(value);
    });

    it('should handle complex objects', () => {
      const key = 'complexKey';
      const value = {
        nested: {
          array: [1, 2, 3],
          object: { deep: 'value' }
        },
        date: new Date().toISOString(),
        boolean: true
      };
      
      storageManager.setSession(key, value);
      const retrieved = storageManager.getSession(key);
      expect(retrieved).toEqual(value);
    });
  });

  describe('memory storage operations', () => {
    it('should set and get items from memory storage', () => {
      const key = 'memoryKey';
      const value = 'memoryValue';
      
      const result = storageManager.setMemory(key, value);
      expect(result).toBe(true);
      
      const retrieved = storageManager.getMemory(key);
      expect(retrieved).toBe(value);
    });

    it('should handle memory storage expiration', async () => {
      const key = 'memoryExpireKey';
      const value = 'memoryExpireValue';
      const expiration = 10; // 10ms
      
      storageManager.setMemory(key, value, expiration);
      expect(storageManager.getMemory(key)).toBe(value);
      
      await new Promise(resolve => { setTimeout(resolve, 20); });
      expect(storageManager.getMemory(key)).toBeNull();
    });

    it('should remove items from memory storage', () => {
      const key = 'memoryRemoveKey';
      const value = 'memoryRemoveValue';
      
      storageManager.setMemory(key, value);
      expect(storageManager.getMemory(key)).toBe(value);
      
      const removed = storageManager.removeMemory(key);
      expect(removed).toBe(true);
      expect(storageManager.getMemory(key)).toBeNull();
    });
  });

  describe('cache management', () => {
    it('should cache and retrieve data', async () => {
      const url = 'https://example.com/api/data';
      const data = { cached: 'data', timestamp: Date.now() };
      
      await storageManager.cacheData(url, data);
      const cached = await storageManager.getCachedData(url);
      
      expect(cached).toEqual(data);
    });

    it('should respect cache expiration', async () => {
      const url = 'https://example.com/api/expire';
      const data = { expire: 'soon' };
      const shortExpiration = 10; // 10ms
      
      await storageManager.cacheData(url, data, shortExpiration);
      
      // Should be available immediately
      let cached = await storageManager.getCachedData(url);
      expect(cached).toEqual(data);
      
      // Wait for expiration
      await new Promise(resolve => { setTimeout(resolve, 20); });
      
      // Should be null after expiration
      cached = await storageManager.getCachedData(url);
      expect(cached).toBeNull();
    });
  });

  describe('preferences management', () => {
    it('should set and get preferences', async () => {
      const key = 'theme';
      const value = 'dark';
      
      await storageManager.setPreference(key, value);
      const retrieved = await storageManager.getPreference(key);
      
      expect(retrieved).toBe(value);
    });

    it('should return default value for non-existent preferences', async () => {
      const defaultValue = 'light';
      const retrieved = await storageManager.getPreference('nonExistentTheme', defaultValue);
      
      expect(retrieved).toBe(defaultValue);
    });

    it('should handle boolean preferences', async () => {
      const key = 'notifications';
      const value = false;
      
      await storageManager.setPreference(key, value);
      const retrieved = await storageManager.getPreference(key, true);
      
      expect(retrieved).toBe(false);
    });
  });

  describe('data export/import', () => {
    it('should export data correctly', async () => {
      // Set up test data
      storageManager.setLocal('localKey', 'localValue');
      storageManager.setSession('sessionKey', 'sessionValue');
      await storageManager.setPreference('prefKey', 'prefValue');
      
      const exported = await storageManager.exportData();
      
      expect(exported).toHaveProperty('localStorage');
      expect(exported).toHaveProperty('preferences');
      expect(exported).toHaveProperty('userData');
      expect(exported).toHaveProperty('timestamp');
      expect(typeof exported.timestamp).toBe('number');
    });

    it('should handle export errors gracefully', async () => {
      // Mock IndexedDB error
      storageManager.db = null;
      
      const exported = await storageManager.exportData();
      
      expect(exported).toHaveProperty('localStorage');
      expect(exported.preferences).toEqual([]);
      expect(exported.userData).toEqual([]);
    });

    it('should validate import data', async () => {
      const invalidData = null;
      
      await expect(storageManager.importData(invalidData)).rejects.toThrow('Invalid import data');
    });

    it('should import valid data', async () => {
      const validData = {
        localStorage: {
          'importKey': JSON.stringify({
            value: 'importValue',
            timestamp: Date.now(),
            expiration: null
          })
        },
        preferences: [
          { key: 'importPref', value: 'importPrefValue' }
        ],
        userData: [],
        timestamp: Date.now()
      };
      
      await expect(storageManager.importData(validData)).resolves.not.toThrow();
      
      // Verify data was imported
      expect(storageManager.getLocal('importKey')).toBe('importValue');
    });
  });

  describe('storage availability detection', () => {
    it('should correctly detect localStorage availability', () => {
      expect(storageManager.isLocalStorageAvailable).toBe(true);
    });

    it('should correctly detect sessionStorage availability', () => {
      expect(storageManager.isSessionStorageAvailable).toBe(true);
    });

    it('should handle storage detection errors', () => {
      // Mock storage to throw an error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('Storage not available');
      });
      
      const available = storageManager.checkStorageAvailability('localStorage');
      expect(available).toBe(false);
      
      // Restore original method
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('clear all storage', () => {
    it('should clear all storage types', async () => {
      // Set up data in all storage types
      storageManager.setLocal('localClearKey', 'localClearValue');
      storageManager.setSession('sessionClearKey', 'sessionClearValue');
      storageManager.setMemory('memoryClearKey', 'memoryClearValue');
      
      await storageManager.clearAll();
      
      // Verify all data is cleared
      expect(storageManager.getLocal('localClearKey')).toBeNull();
      expect(storageManager.getSession('sessionClearKey')).toBeNull();
      expect(storageManager.getMemory('memoryClearKey')).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle JSON parsing errors gracefully', () => {
      // Manually set invalid JSON in localStorage
      localStorage.setItem('invalidJson', 'invalid{json}');
      
      const result = storageManager.getLocal('invalidJson');
      expect(result).toBeNull();
    });

    it('should handle storage quota exceeded errors', () => {
      // Mock localStorage to throw QuotaExceededError
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError');
      });
      
      const result = storageManager.setLocal('quotaTest', 'value');
      expect(result).toBe(true); // Should fallback to memory storage
      
      // Restore original method
      localStorage.setItem = originalSetItem;
    });
  });

  describe('performance', () => {
    it('should handle large data efficiently', () => {
      // Create large data structure (reduce size to avoid storage limits)
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        data: 'x'.repeat(50) // Reduced from 100 to 50 chars
      }));
      
      const startTime = performance.now();
      const setResult = storageManager.setLocal('largeData', largeData);
      const setTime = performance.now() - startTime;
      
      // If localStorage fails due to size, it should fall back to memory storage
      expect(setResult).toBe(true);
      
      const retrieveStart = performance.now();
      const retrieved = storageManager.getLocal('largeData');
      const retrieveTime = performance.now() - retrieveStart;
      
      expect(retrieved).toEqual(largeData);
      expect(setTime).toBeLessThan(200); // Increased tolerance for CI
      expect(retrieveTime).toBeLessThan(100); // Increased tolerance for CI
    });

    it('should handle many small operations efficiently', () => {
      const startTime = performance.now();
      
      // Perform many small operations
      for (let i = 0; i < 100; i++) {
        storageManager.setLocal(`key${i}`, `value${i}`);
        storageManager.getLocal(`key${i}`);
      }
      
      const totalTime = performance.now() - startTime;
      expect(totalTime).toBeLessThan(100); // Should be fast
    });
  });
});