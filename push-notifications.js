
/* global Notification */

/**
 * Push Notification Handler for Thee Cigar Maestro
 * Handles notification permissions, subscription, and display
 */

class PushNotificationManager {
  constructor() {
    this.vapidPublicKey = 'your-vapid-public-key-here'; // Replace with actual VAPID key
    this.subscription = null;
  }

  async initialize() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      await this.requestPermission();
      await this.subscribeUser();
    } else {
      console.warn('Push notifications not supported');
    }
  }

  async requestPermission() {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      return true;
    } else {
      console.warn('Notification permission denied');
      return false;
    }
  }

  async subscribeUser() {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      this.subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });
      
      console.log('User subscribed to push notifications:', this.subscription);
      
      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);
      
    } catch (error) {
      console.error('Failed to subscribe user:', error);
    }
  }

  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });
      
      if (response.ok) {
        console.log('Subscription sent to server successfully');
      } else {
        console.error('Failed to send subscription to server');
      }
    } catch (error) {
      console.error('Error sending subscription:', error);
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async showLocalNotification(title, options = {}) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: 'assets/logos/logo-96.png',
        badge: 'assets/logos/logo-96.png',
        ...options
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  // Predefined notification types for cigar app
  async notifyNewRecommendation(cigarName) {
    await this.showLocalNotification('New Recommendation', {
      body: `We found a perfect match: ${cigarName}`,
      tag: 'recommendation',
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    });
  }

  async notifyPairingMatch(cigar, pairing) {
    await this.showLocalNotification('Perfect Pairing Found', {
      body: `${cigar} pairs excellently with ${pairing}`,
      tag: 'pairing',
      vibrate: [100, 50, 100]
    });
  }

  async notifyEducationalContent(title) {
    await this.showLocalNotification('New Educational Content', {
      body: `Learn about: ${title}`,
      tag: 'education',
      icon: 'assets/logos/logo-96.png'
    });
  }
}

// Initialize push notification manager
const pushManager = new PushNotificationManager();

// Export for ES modules
export default PushNotificationManager;

// Also make available globally for backwards compatibility
if (typeof window !== 'undefined') {
  window.PushNotificationManager = PushNotificationManager;
  window.pushManager = pushManager;
}
