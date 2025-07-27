
/**
 * Background Sync Manager for Thee Cigar Maestro
 * Handles offline data synchronization and queue management
 */

class BackgroundSyncManager {
  constructor() {
    this.pendingData = new Map();
    this.isOnline = navigator.onLine;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processPendingSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async queueData(type, data) {
    const queueKey = `${type}-${Date.now()}`;
    
    try {
      // Store in localStorage for persistence
      const existingQueue = JSON.parse(localStorage.getItem('pendingSync') || '{}');
      existingQueue[queueKey] = {
        type,
        data,
        timestamp: Date.now(),
        retryCount: 0
      };
      
      localStorage.setItem('pendingSync', JSON.stringify(existingQueue));
      
      // If online, try to sync immediately
      if (this.isOnline) {
        await this.processPendingSync();
      } else {
        // Register for background sync when online
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('background-sync-cigar-data');
        }
      }
      
      console.log(`Queued ${type} data for sync:`, queueKey);
      
    } catch (_error) {
      console.error('Failed to queue data for sync:', error);
    }
  }

  async processPendingSync() {
    try {
      const pendingQueue = JSON.parse(localStorage.getItem('pendingSync') || '{}');
      const entries = Object.entries(pendingQueue);
      
      if (entries.length === 0) {
        return;
      }
      
      console.log(`Processing ${entries.length} pending sync items...`);
      
      for (const [key, item] of entries) {
        try {
          await this.syncItem(item);
          
          // Remove from queue on success
          delete pendingQueue[key];
          
        } catch (_error) {
          console.error(`Failed to sync item ${key}:`, error);
          
          // Increment retry count
          item.retryCount = (item.retryCount || 0) + 1;
          
          // Remove if too many retries
          if (item.retryCount > 3) {
            console.warn(`Removing item ${key} after 3 failed attempts`);
            delete pendingQueue[key];
          }
        }
      }
      
      // Update localStorage
      localStorage.setItem('pendingSync', JSON.stringify(pendingQueue));
      
    } catch (_error) {
      console.error('Error processing pending sync:', error);
    }
  }

  async syncItem(item) {
    const { type, data } = item;
    
    switch (type) {
      case 'cigar-rating':
        return await this.syncCigarRating(data);
      case 'user-preference':
        return await this.syncUserPreference(data);
      case 'analytics-event':
        return await this.syncAnalyticsEvent(data);
      case 'favorite-cigar':
        return await this.syncFavoriteCigar(data);
      default:
        throw new Error(`Unknown sync type: ${type}`);
    }
  }

  async syncCigarRating(data) {
    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync rating: ${response.status}`);
    }
    
    console.log('Synced cigar rating:', data);
  }

  async syncUserPreference(data) {
    const response = await fetch('/api/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync preference: ${response.status}`);
    }
    
    console.log('Synced user preference:', data);
  }

  async syncAnalyticsEvent(data) {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync analytics: ${response.status}`);
    }
    
    console.log('Synced analytics event:', data);
  }

  async syncFavoriteCigar(data) {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync favorite: ${response.status}`);
    }
    
    console.log('Synced favorite cigar:', data);
  }

  // Convenience methods for specific data types
  async queueCigarRating(cigarId, rating, notes) {
    await this.queueData('cigar-rating', { cigarId, rating, notes, timestamp: Date.now() });
  }

  async queueUserPreference(preference, value) {
    await this.queueData('user-preference', { preference, value, timestamp: Date.now() });
  }

  async queueAnalyticsEvent(event, properties) {
    await this.queueData('analytics-event', { event, properties, timestamp: Date.now() });
  }

  async queueFavoriteCigar(cigarId, action = 'add') {
    await this.queueData('favorite-cigar', { cigarId, action, timestamp: Date.now() });
  }

  getPendingCount() {
    const pendingQueue = JSON.parse(localStorage.getItem('pendingSync') || '{}');
    return Object.keys(pendingQueue).length;
  }
}

// Initialize background sync manager
const syncManager = new BackgroundSyncManager();

// Export for ES modules
export default BackgroundSyncManager;

// Also make available globally for backwards compatibility
if (typeof window !== 'undefined') {
  window.BackgroundSyncManager = BackgroundSyncManager;
  window.syncManager = syncManager;
}
