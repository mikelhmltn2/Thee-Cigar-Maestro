/**
 * Storage utility with localStorage, sessionStorage, and IndexedDB support
 * Includes automatic fallbacks and error handling
 */

class StorageManager {
  constructor() {
    this.isLocalStorageAvailable = this.checkStorageAvailability('localStorage');
    this.isSessionStorageAvailable = this.checkStorageAvailability('sessionStorage');
    this.isIndexedDBAvailable = this.checkIndexedDBAvailability();
    this.dbName = 'CigarMaestroApp';
    this.dbVersion = 1;
    this.db = null;
  }

  checkStorageAvailability(storageType) {
    try {
      // Check if we're in a browser environment or test environment with globals
      const storageObj = typeof window !== 'undefined' ? window[storageType] : (typeof globalThis !== 'undefined' ? globalThis[storageType] : undefined);
      if (!storageObj) return false;
      
      const testKey = '__storage_test__';
      storageObj.setItem(testKey, 'test');
      storageObj.removeItem(testKey);
      return true;
    } catch (_e) {
      return false;
    }
  }

  checkIndexedDBAvailability() {
    // Check if we're in a browser environment or test environment
    const globalScope = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : {});
    return !!(
      globalScope.indexedDB ||
      globalScope.mozIndexedDB ||
      globalScope.webkitIndexedDB ||
      globalScope.msIndexedDB
    );
  }

  async initIndexedDB() {
    if (!this.isIndexedDBAvailable || this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores for different data types
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cigarData')) {
          db.createObjectStore('cigarData', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'url' });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Local Storage methods
  setLocal(key, value, expiration = null) {
    if (!this.isLocalStorageAvailable) {
      console.warn('localStorage not available, falling back to memory storage');
      return this.setMemory(key, value, expiration);
    }

    try {
      const item = {
        value,
        timestamp: Date.now(),
        expiration: expiration ? Date.now() + expiration : null
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (e) {
      console.error('Failed to set localStorage item:', e);
      return false;
    }
  }

  getLocal(key) {
    if (!this.isLocalStorageAvailable) {
      return this.getMemory(key);
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) {return null;}

      const parsed = JSON.parse(item);
      
      // Check expiration
      if (parsed.expiration && Date.now() > parsed.expiration) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.value;
    } catch (e) {
      console.error('Failed to get localStorage item:', e);
      return null;
    }
  }

  removeLocal(key) {
    if (!this.isLocalStorageAvailable) {
      return this.removeMemory(key);
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Failed to remove localStorage item:', e);
      return false;
    }
  }

  // Session Storage methods
  setSession(key, value) {
    if (!this.isSessionStorageAvailable) {
      console.warn('sessionStorage not available, falling back to memory storage');
      return this.setMemory(key, value);
    }

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Failed to set sessionStorage item:', e);
      return false;
    }
  }

  getSession(key) {
    if (!this.isSessionStorageAvailable) {
      return this.getMemory(key);
    }

    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Failed to get sessionStorage item:', e);
      return null;
    }
  }

  // IndexedDB methods
  async setIndexedDB(storeName, data) {
    try {
      await this.initIndexedDB();
      if (!this.db) {return false;}

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      await new Promise((resolve, reject) => {
        const request = store.put(data);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      return true;
    } catch (e) {
      console.error('Failed to set IndexedDB item:', e);
      return false;
    }
  }

  async getIndexedDB(storeName, id) {
    try {
      await this.initIndexedDB();
      if (!this.db) {return null;}

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('Failed to get IndexedDB item:', e);
      return null;
    }
  }

  // Memory storage fallback
  memoryStorage = new Map();

  setMemory(key, value, expiration = null) {
    this.memoryStorage.set(key, {
      value,
      timestamp: Date.now(),
      expiration: expiration ? Date.now() + expiration : null
    });
    return true;
  }

  getMemory(key) {
    const item = this.memoryStorage.get(key);
    if (!item) {return null;}

    if (item.expiration && Date.now() > item.expiration) {
      this.memoryStorage.delete(key);
      return null;
    }

    return item.value;
  }

  removeMemory(key) {
    return this.memoryStorage.delete(key);
  }

  // Cache management
  async cacheData(url, data, expiration = 1000 * 60 * 60) { // 1 hour default
    const cacheItem = {
      url,
      data,
      timestamp: Date.now(),
      expiration: Date.now() + expiration
    };

    // Try IndexedDB first, then localStorage
    const success = await this.setIndexedDB('cache', cacheItem);
    if (!success) {
      this.setLocal(`cache_${url}`, cacheItem, expiration);
    }
  }

  async getCachedData(url) {
    // Try IndexedDB first
    let cached = await this.getIndexedDB('cache', url);
    
    // Fallback to localStorage
    if (!cached) {
      cached = this.getLocal(`cache_${url}`);
    }

    if (!cached) {return null;}

    // Check expiration
    if (cached.expiration && Date.now() > cached.expiration) {
      return null;
    }

    return cached.data;
  }

  // User preferences
  async setPreference(key, value) {
    const success = await this.setIndexedDB('preferences', { key, value });
    if (!success) {
      this.setLocal(`pref_${key}`, value);
    }
  }

  async getPreference(key, defaultValue = null) {
    const pref = await this.getIndexedDB('preferences', key);
    if (!pref) {
      const localPref = this.getLocal(`pref_${key}`);
      return localPref !== null ? localPref : defaultValue;
    }
    return pref.value !== undefined ? pref.value : defaultValue;
  }

  // Clear all storage
  async clearAll() {
    // Clear localStorage
    if (this.isLocalStorageAvailable) {
      localStorage.clear();
    }

    // Clear sessionStorage
    if (this.isSessionStorageAvailable) {
      sessionStorage.clear();
    }

    // Clear IndexedDB
    if (this.db) {
      this.db.close();
      await new Promise((resolve, reject) => {
        const deleteRequest = indexedDB.deleteDatabase(this.dbName);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      });
      this.db = null;
    }

    // Clear memory storage
    this.memoryStorage.clear();
  }

  // Export/import data
  async exportData() {
    const data = {
      localStorage: {},
      preferences: [],
      userData: [],
      timestamp: Date.now()
    };

    // Export localStorage
    if (this.isLocalStorageAvailable) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data.localStorage[key] = localStorage.getItem(key);
      }
    }

    // Export IndexedDB data
    if (this.db) {
      try {
        const transaction = this.db.transaction(['preferences', 'userData'], 'readonly');
        
        // Get preferences
        const prefStore = transaction.objectStore('preferences');
        data.preferences = await new Promise((resolve, reject) => {
          const request = prefStore.getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        // Get user data
        const userStore = transaction.objectStore('userData');
        data.userData = await new Promise((resolve, reject) => {
          const request = userStore.getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
          } catch (e) {
      console.error('Failed to export IndexedDB data:', e);
    }
    }

    return data;
  }

  async importData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid import data');
    }

    // Import localStorage
    if (data.localStorage && this.isLocalStorageAvailable) {
      for (const [key, value] of Object.entries(data.localStorage)) {
        localStorage.setItem(key, value);
      }
    }

    // Import IndexedDB data
    await this.initIndexedDB();
    if (this.db) {
      try {
        // Import preferences
        if (data.preferences && Array.isArray(data.preferences)) {
          for (const pref of data.preferences) {
            await this.setIndexedDB('preferences', pref);
          }
        }

        // Import user data
        if (data.userData && Array.isArray(data.userData)) {
          for (const userData of data.userData) {
            await this.setIndexedDB('userData', userData);
          }
        }
      } catch (e) {
        console.error('Failed to import data:', e);
        throw e;
      }
    }
  }
}

// Create singleton instance
const storageManager = new StorageManager();

export default storageManager;