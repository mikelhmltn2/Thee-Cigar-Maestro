
/* global self, caches, clients */

// Enhanced Service Worker Features
// Background Sync, Push Notifications, Advanced Caching

// Register background sync
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-cigar-data') {
    event.waitUntil(doBackgroundSync());
  }
  
  if (event.tag === 'background-sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New cigar recommendations available!',
    icon: 'assets/logos/logo-96.png',
    badge: 'assets/logos/logo-96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Now',
        icon: 'assets/logos/logo-96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: 'assets/logos/logo-96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Thee Cigar Maestro', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for cigar data
async function doBackgroundSync() {
  try {
    console.log('Performing background sync for cigar data...');
    
    // Sync pending cigar ratings
    const pendingRatings = await getPendingRatings();
    if (pendingRatings.length > 0) {
      await syncRatings(pendingRatings);
    }
    
    // Sync user preferences
    const pendingPreferences = await getPendingPreferences();
    if (pendingPreferences.length > 0) {
      await syncPreferences(pendingPreferences);
    }
    
    console.log('Background sync completed successfully');
    
    // Show success notification
    await self.registration.showNotification('Sync Complete', {
      body: 'Your cigar data has been synchronized',
      icon: 'assets/logos/logo-96.png',
      tag: 'sync-complete'
    });
    
  } catch (error) {
    console.error('Background sync failed:', error);
    
    // Show error notification
    await self.registration.showNotification('Sync Failed', {
      body: 'Unable to sync data. Will retry when online.',
      icon: 'assets/logos/logo-96.png',
      tag: 'sync-failed'
    });
  }
}

// Background sync for analytics
async function syncAnalytics() {
  try {
    console.log('Syncing analytics data...');
    
    const pendingEvents = await getPendingAnalytics();
    if (pendingEvents.length > 0) {
      await sendAnalytics(pendingEvents);
    }
    
    console.log('Analytics sync completed');
  } catch (error) {
    console.error('Analytics sync failed:', error);
  }
}

// Helper functions for background sync
async function getPendingRatings() {
  const cache = await caches.open('pending-data');
  const response = await cache.match('/pending-ratings');
  return response ? await response.json() : [];
}

async function getPendingPreferences() {
  const cache = await caches.open('pending-data');
  const response = await cache.match('/pending-preferences');
  return response ? await response.json() : [];
}

async function getPendingAnalytics() {
  const cache = await caches.open('pending-data');
  const response = await cache.match('/pending-analytics');
  return response ? await response.json() : [];
}

async function syncRatings(ratings) {
  // Sync ratings with server
  const response = await fetch('/api/sync-ratings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ratings)
  });
  
  if (response.ok) {
    // Clear pending ratings
    const cache = await caches.open('pending-data');
    await cache.delete('/pending-ratings');
  }
}

async function syncPreferences(preferences) {
  // Sync preferences with server
  const response = await fetch('/api/sync-preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences)
  });
  
  if (response.ok) {
    // Clear pending preferences
    const cache = await caches.open('pending-data');
    await cache.delete('/pending-preferences');
  }
}

async function sendAnalytics(events) {
  // Send analytics events
  const response = await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events)
  });
  
  if (response.ok) {
    // Clear pending analytics
    const cache = await caches.open('pending-data');
    await cache.delete('/pending-analytics');
  }
}

// Enhanced offline handling
self.addEventListener('fetch', event => {
  // Handle API requests with background sync fallback
  if (event.request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(event.request));
  }
  // Handle other requests with existing logic
  else {
    // Use existing fetch handling from service-worker.js
  }
});

async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // If offline, queue for background sync
    if (request.method === 'POST') {
      await queueForBackgroundSync(request);
    }
    
    // Return cached response or offline fallback
    const cache = await caches.open('api-cache');
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'Request queued for when online'
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function queueForBackgroundSync(request) {
  const body = await request.text();
  const queueItem = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers),
    body,
    timestamp: Date.now()
  };
  
  // Store in pending queue
  const cache = await caches.open('pending-data');
  const pendingKey = `/pending-${  Date.now()}`;
  await cache.put(pendingKey, new Response(JSON.stringify(queueItem)));
  
  // Register for background sync
  await self.registration.sync.register('background-sync-cigar-data');
}
