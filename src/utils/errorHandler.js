/**
 * Comprehensive Error Handling and Monitoring System
 * Includes error reporting, user feedback, and recovery mechanisms
 */

import storageManager from './storage.js';

class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 100;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.isOnline = navigator.onLine;
    this.errorCounts = new Map();
    this.userFeedbackCallbacks = new Set();
    
    this.setupEventListeners();
    this.loadPersistedErrors();
  }

  setupEventListeners() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        error: event.reason,
        stack: event.reason?.stack
      });
    });

    // Network status monitoring
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Resource loading errors
    document.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError({
          type: 'resource',
          message: `Failed to load ${event.target.tagName}: ${event.target.src || event.target.href}`,
          element: event.target.tagName,
          src: event.target.src || event.target.href
        });
      }
    }, true);
  }

  async loadPersistedErrors() {
    try {
      const persistedErrors = await storageManager.getLocal('errorQueue');
      if (persistedErrors && Array.isArray(persistedErrors)) {
        this.errorQueue = persistedErrors.slice(0, this.maxQueueSize);
      }
    } catch (e) {
      console.warn('Failed to load persisted errors:', e);
    }
  }

  async persistErrors() {
    try {
      await storageManager.setLocal('errorQueue', this.errorQueue);
    } catch (e) {
      console.warn('Failed to persist errors:', e);
    }
  }

  handleError(errorData) {
    const enrichedError = this.enrichError(errorData);
    
    // Track error frequency
    const errorKey = `${enrichedError.type}:${enrichedError.message}`;
    const count = this.errorCounts.get(errorKey) || 0;
    this.errorCounts.set(errorKey, count + 1);

    // Add to queue for processing
    this.errorQueue.push(enrichedError);
    
    // Limit queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }

    // Persist errors
    this.persistErrors();

    // Process immediately if online
    if (this.isOnline) {
      this.processErrorQueue();
    }

    // Notify user feedback callbacks
    this.notifyUserFeedback(enrichedError);

    // Attempt recovery for certain error types
    this.attemptRecovery(enrichedError);

    console.error('Error handled:', enrichedError);
  }

  enrichError(errorData) {
    return {
      ...errorData,
      id: this.generateErrorId(),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: this.getConnectionInfo(),
      localStorage: this.getStorageInfo(),
      performance: this.getPerformanceInfo()
    };
  }

  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getConnectionInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    } : null;
  }

  getStorageInfo() {
    return {
      localStorage: storageManager.isLocalStorageAvailable,
      sessionStorage: storageManager.isSessionStorageAvailable,
      indexedDB: storageManager.isIndexedDBAvailable
    };
  }

  getPerformanceInfo() {
    if (!window.performance) {return null;}
    
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      loadTime: navigation?.loadEventEnd - navigation?.loadEventStart,
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      memoryUsage: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    };
  }

  async processErrorQueue() {
    if (this.errorQueue.length === 0 || !this.isOnline) {
      return;
    }

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // Send errors to monitoring service (if configured)
      await this.sendErrorsToService(errors);
      
      // Clear persisted errors on successful send
      await storageManager.removeLocal('errorQueue');
    } catch (e) {
      // If sending fails, put errors back in queue
      this.errorQueue = [...errors, ...this.errorQueue];
      console.warn('Failed to send errors to monitoring service:', e);
    }
  }

  async sendErrorsToService(errors) {
    // This would integrate with your error monitoring service
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Report');
      errors.forEach(error => console.error(error));
      console.groupEnd();
      return;
    }

    // Example integration with a monitoring service
    // Replace with your actual error reporting endpoint
    const endpoint = '/api/errors';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ errors }),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Error reporting failed: ${response.status}`);
      }
    } catch (e) {
      // Don't create infinite error loops
      if (e.name !== 'AbortError') {
        console.warn('Error reporting service unavailable:', e.message);
      }
      throw e;
    }
  }

  notifyUserFeedback(error) {
    // Only show critical errors to users
    if (this.isCriticalError(error)) {
      const userMessage = this.getUserFriendlyMessage(error);
      
      this.userFeedbackCallbacks.forEach(callback => {
        try {
          callback(userMessage, error);
        } catch (e) {
          console.warn('User feedback callback failed:', e);
        }
      });
    }
  }

  isCriticalError(error) {
    const criticalTypes = ['network', 'resource', 'security'];
    const criticalMessages = ['network error', 'failed to load', 'permission denied'];
    
    return criticalTypes.includes(error.type) ||
           criticalMessages.some(msg => error.message?.toLowerCase().includes(msg));
  }

  getUserFriendlyMessage(error) {
    const messageMap = {
      'network': 'We\'re having trouble connecting to our servers. Please check your internet connection.',
      'resource': 'Some content failed to load. Please refresh the page.',
      'javascript': 'Something went wrong. We\'ve been notified and are working on a fix.',
      'promise': 'An unexpected error occurred. Please try again.',
      'security': 'A security error occurred. Please ensure you\'re using a secure connection.'
    };

    return messageMap[error.type] || 'An unexpected error occurred. Please try refreshing the page.';
  }

  attemptRecovery(error) {
    switch (error.type) {
      case 'network':
        this.scheduleRetry(() => this.testNetworkConnectivity(), 5000);
        break;
      case 'resource':
        this.scheduleRetry(() => this.reloadFailedResources(), 2000);
        break;
      case 'javascript':
        if (error.message?.includes('THREE')) {
          this.scheduleRetry(() => this.reinitializeThreeJS(), 3000);
        }
        break;
    }
  }

  scheduleRetry(retryFunction, delay) {
    setTimeout(() => {
      try {
        retryFunction();
      } catch (e) {
        console.warn('Recovery attempt failed:', e);
      }
    }, delay);
  }

  async testNetworkConnectivity() {
    try {
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      if (response.ok) {
        this.showUserFeedback('Connection restored!', 'success');
      }
    } catch (e) {
      console.warn('Network connectivity test failed:', e);
    }
  }

  reloadFailedResources() {
    // Attempt to reload failed scripts and stylesheets
    const failedScripts = document.querySelectorAll('script[src]:not([data-loaded])');
    const failedStyles = document.querySelectorAll('link[rel="stylesheet"]:not([data-loaded])');
    
    [...failedScripts, ...failedStyles].forEach(element => {
      const newElement = element.cloneNode(true);
      newElement.addEventListener('load', () => {
        newElement.setAttribute('data-loaded', 'true');
        this.showUserFeedback('Resources reloaded successfully!', 'success');
      });
      element.parentNode.replaceChild(newElement, element);
    });
  }

  reinitializeThreeJS() {
    // Attempt to reinitialize Three.js scene
    if (window.initializeThreeJS) {
      try {
        window.initializeThreeJS();
        this.showUserFeedback('3D scene restored!', 'success');
      } catch (e) {
        console.warn('Failed to reinitialize Three.js:', e);
      }
    }
  }

  // Public API methods
  addUserFeedbackCallback(callback) {
    this.userFeedbackCallbacks.add(callback);
  }

  removeUserFeedbackCallback(callback) {
    this.userFeedbackCallbacks.delete(callback);
  }

  showUserFeedback(message, type = 'info', duration = 5000) {
    this.userFeedbackCallbacks.forEach(callback => {
      try {
        callback(message, { type, duration });
      } catch (e) {
        console.warn('User feedback callback failed:', e);
      }
    });
  }

  async retryOperation(operation, maxRetries = this.retryAttempts, delay = this.retryDelay) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          this.handleError({
            type: 'retry_failed',
            message: `Operation failed after ${maxRetries} attempts`,
            originalError: error,
            attempts: attempt
          });
          break;
        }
        
        // Exponential backoff
        const currentDelay = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }
    
    throw lastError;
  }

  getErrorStats() {
    return {
      totalErrors: this.errorQueue.length,
      errorCounts: Object.fromEntries(this.errorCounts),
      isOnline: this.isOnline,
      queueSize: this.errorQueue.length
    };
  }

  async clearErrorHistory() {
    this.errorQueue = [];
    this.errorCounts.clear();
    await storageManager.removeLocal('errorQueue');
  }

  // Error boundary for React-like error handling
  createErrorBoundary(element, fallbackContent) {
    const originalContent = element.innerHTML;
    
    try {
      // Monitor for changes that might cause errors
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            // Check for script errors in new content
            const scripts = mutation.target.querySelectorAll('script');
            scripts.forEach(script => {
              script.addEventListener('error', (e) => {
                this.handleError({
                  type: 'script',
                  message: `Script error in ${script.src}`,
                  element: mutation.target
                });
                
                // Fallback to safe content
                element.innerHTML = fallbackContent || '<p>Content temporarily unavailable</p>';
              });
            });
          }
        });
      });
      
      observer.observe(element, { childList: true, subtree: true });
      
      return observer;
    } catch (e) {
      this.handleError({
        type: 'error_boundary',
        message: 'Failed to create error boundary',
        error: e
      });
      return null;
    }
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;