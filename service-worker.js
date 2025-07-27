/* global self, caches */

// Service Worker for Thee Cigar Maestro
// Handles caching, offline functionality, and background sync

const CACHE_NAME = 'thee-cigar-maestro-v1.2';
const STATIC_CACHE_NAME = 'static-v1.2';
const DATA_CACHE_NAME = 'data-v1.2';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/flavorverse_ritual_trail_interface.html',
  '/style.css',
  '/gpt.js',
  '/local-storage-manager.js',
  '/advanced-search.js',
  '/logo.png',
  // External dependencies
  'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js'
];

// Data files to cache
const DATA_FILES = [
  '/flavorverse_nodes.json',
  '/cigar-specs.json',
  '/pairings.json',
  '/education.json',
  '/features.json',
  '/interface.json',
  '/meta.json',
  '/emotional.json',
  '/lounge.json',
  '/flavor-atlas.json'
];

// Cache strategies (disabled for now)
// const CACHE_STRATEGIES = {
//   CACHE_FIRST: 'cache-first',
//   NETWORK_FIRST: 'network-first',
//   STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
// };

/**
 * Service Worker Installation
 */
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('📦 Caching static files...');
        return cache.addAll(STATIC_FILES.map(url => new Request(url, { mode: 'cors' })));
      }),
      
      // Cache data files
      caches.open(DATA_CACHE_NAME).then((cache) => {
        console.log('📊 Caching data files...');
        return cache.addAll(DATA_FILES);
      })
    ]).then(() => {
      console.log('✅ Service Worker installation complete');
      return self.skipWaiting();
    })
  );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DATA_CACHE_NAME && 
              cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

/**
 * Fetch Event Handler with intelligent caching strategies
 */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Handle API requests differently
  if (url.pathname.includes('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }
  
  // Handle data files with network-first strategy
  if (DATA_FILES.some(file => url.pathname.includes(file))) {
    event.respondWith(handleDataRequest(event.request));
    return;
  }
  
  // Handle static assets with cache-first strategy
  if (STATIC_FILES.some(file => url.pathname.includes(file) || url.href === file)) {
    event.respondWith(handleStaticRequest(event.request));
    return;
  }
  
  // Handle external CDN resources
  if (url.origin !== location.origin) {
    event.respondWith(handleExternalRequest(event.request));
    return;
  }
  
  // Default strategy for other requests
  event.respondWith(handleDefaultRequest(event.request));
});

/**
 * Handle API requests with network-first strategy
 */
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses for short periods
      const cache = await caches.open(DATA_CACHE_NAME);
      const responseClone = networkResponse.clone();
      
      // Add cache headers for API responses
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cache-timestamp', Date.now().toString());
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers
      });
      
      cache.put(request, cachedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📡 Network failed for API request, trying cache...');
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Check if cached response is stale (older than 5 minutes)
      const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (!cacheTimestamp || (now - parseInt(cacheTimestamp, 10)) < fiveMinutes) {
        return cachedResponse;
      }
    }
    
    // Return offline response for API failures
    return new Response(JSON.stringify({
      error: 'Network unavailable',
      offline: true,
      message: 'This feature requires an internet connection'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle data file requests with stale-while-revalidate strategy
 */
async function handleDataRequest(request) {
  const cache = await caches.open(DATA_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Start network request in background
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    // Update in background
    networkPromise.catch(() => {});
    return cachedResponse;
  }
  
  // Wait for network if no cache available
  try {
    return await networkPromise;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Data unavailable offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle static asset requests with cache-first strategy
 */
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/index.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

/**
 * Handle external CDN requests
 */
async function handleExternalRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache external resources with longer expiration
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Default request handler
 */
async function handleDefaultRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    return await cache.match(request) || new Response('Offline', { status: 503 });
  }
}

/**
 * Background Sync for data synchronization
 */
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
  
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

/**
 * Sync user data when back online
 */
async function syncUserData() {
  try {
    // Get stored data that needs syncing
    const clients = await self.clients.matchAll();
    
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_REQUEST',
        action: 'user-data'
      });
    });
    
    console.log('📤 User data sync initiated');
  } catch (error) {
    console.error('❌ User data sync failed:', error);
  }
}

/**
 * Sync analytics data
 */
async function syncAnalytics() {
  try {
    const clients = await self.clients.matchAll();
    
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_REQUEST',
        action: 'analytics'
      });
    });
    
    console.log('📊 Analytics sync initiated');
  } catch (error) {
    console.error('❌ Analytics sync failed:', error);
  }
}

/**
 * Push notification handler (for future features)
 */
self.addEventListener('push', (event) => {
  if (!event.data) {return;}
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'cigar-maestro',
    renotify: true,
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

/**
 * Message handler for communication with main thread
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_UPDATE':
      handleCacheUpdate(data);
      break;
      
    case 'CLEAR_CACHE':
      handleClearCache(data);
      break;
      
    case 'GET_CACHE_INFO':
      handleGetCacheInfo(event);
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

/**
 * Handle cache update requests
 */
async function handleCacheUpdate(data) {
  try {
    const cache = await caches.open(DATA_CACHE_NAME);
    
    if (data.urls) {
      await Promise.all(
        data.urls.map(url => 
          fetch(url).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
            return Promise.resolve();
          }).catch(() => {})
        )
      );
    }
    
    console.log('✅ Cache updated successfully');
  } catch (error) {
    console.error('❌ Cache update failed:', error);
  }
}

/**
 * Handle cache clearing requests
 */
async function handleClearCache(data) {
  try {
    if (data.cacheNames) {
      await Promise.all(
        data.cacheNames.map(name => caches.delete(name))
      );
    } else {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
    }
    
    console.log('🗑️ Cache cleared successfully');
  } catch (error) {
    console.error('❌ Cache clearing failed:', error);
  }
}

/**
 * Handle cache info requests
 */
async function handleGetCacheInfo(event) {
  try {
    const cacheNames = await caches.keys();
    const cacheInfo = {};
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      cacheInfo[name] = {
        count: keys.length,
        urls: keys.map(req => req.url)
      };
    }
    
    event.ports[0].postMessage({
      type: 'CACHE_INFO',
      data: cacheInfo
    });
  } catch (error) {
    event.ports[0].postMessage({
      type: 'CACHE_INFO_ERROR',
      error: error.message
    });
  }
}

/**
 * Periodic background tasks
 */
setInterval(() => {
  // Clean old cache entries periodically
  cleanOldCacheEntries();
}, 60000); // Every minute

/**
 * Clean old cache entries to prevent storage bloat
 */
async function cleanOldCacheEntries() {
  try {
    const cache = await caches.open(DATA_CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const cacheTimestamp = response.headers.get('sw-cache-timestamp');
      
      if (cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp, 10);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (age > maxAge) {
          await cache.delete(request);
          console.log('🗑️ Cleaned old cache entry:', request.url);
        }
      }
    }
  } catch (error) {
    console.error('❌ Cache cleaning failed:', error);
  }
}

console.log('🔧 Service Worker script loaded');