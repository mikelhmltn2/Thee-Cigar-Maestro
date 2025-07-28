/**
 * Centralized Error Handling Utility
 * Provides consistent error handling, logging, and user feedback
 */

class ErrorHandler {
  constructor() {
    this.isProduction = process?.env?.NODE_ENV === 'production';
    this.errorQueue = [];
    this.maxErrors = 100;
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    
    // Setup global error handlers
    this.setupGlobalHandlers();
  }

  /**
   * Setup global error handlers for unhandled errors
   */
  setupGlobalHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.handleError(event.error, 'Global Error Handler', {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.handleError(event.reason, 'Unhandled Promise Rejection');
      });
    }
  }

  /**
   * Main error handling method
   * @param {Error|string} error - The error object or message
   * @param {string} context - Context where the error occurred
   * @param {Object} metadata - Additional metadata
   * @param {Object} options - Error handling options
   */
  handleError(error, context = 'Unknown', metadata = {}, options = {}) {
    const errorInfo = this.processError(error, context, metadata);
    
    // Log error
    this.logError(errorInfo);
    
    // Store error for analytics
    this.storeError(errorInfo);
    
    // Send to analytics if available
    this.sendToAnalytics(errorInfo);
    
    // Show user notification if enabled
    if (options.showUserNotification !== false) {
      this.showUserFriendlyError(errorInfo, options.userMessage);
    }
    
    // Show user feedback if not in production
    if (!this.isProduction) {
      console.error('🚨 Error Handler:', errorInfo);
    }
    
    return errorInfo;
  }

  /**
   * Process and normalize error information
   * @param {Error|string} error - The error
   * @param {string} context - Error context
   * @param {Object} metadata - Additional data
   * @returns {Object} Processed error information
   */
  processError(error, context, metadata) {
    const timestamp = new Date().toISOString();
    
    // Normalize error object
    let errorObj;
    if (error instanceof Error) {
      errorObj = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    } else if (typeof error === 'string') {
      errorObj = {
        name: 'CustomError',
        message: error,
        stack: new Error().stack
      };
    } else {
      errorObj = {
        name: 'UnknownError',
        message: 'An unknown error occurred',
        stack: new Error().stack,
        originalError: error
      };
    }

    return {
      id: this.generateErrorId(),
      timestamp,
      context,
      error: errorObj,
      severity: this.determineSeverity(errorObj, context),
      metadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
        online: typeof navigator !== 'undefined' ? navigator.onLine : true,
        ...metadata
      }
    };
  }

  /**
   * Determine error severity based on context and error type
   * @param {Object} errorObj - Error object
   * @param {string} context - Error context
   * @returns {string} Severity level (critical, high, medium, low)
   */
  determineSeverity(errorObj, context) {
    // Critical errors that break core functionality
    if (context.includes('Auth') || 
        context.includes('Database') || 
        errorObj.name === 'SecurityError' ||
        context.includes('Payment')) {
      return 'critical';
    }

    // High priority errors that affect user experience
    if (context.includes('API') || 
        context.includes('Network') || 
        errorObj.name === 'TypeError' ||
        context.includes('Service Worker')) {
      return 'high';
    }

    // Medium priority errors
    if (context.includes('UI') || 
        context.includes('Animation') || 
        context.includes('Storage')) {
      return 'medium';
    }

    // Low priority errors
    return 'low';
  }

  /**
   * Show user-friendly error messages
   * @param {Object} errorInfo - Processed error information
   * @param {string} customMessage - Custom message to show user
   */
  showUserFriendlyError(errorInfo, customMessage) {
    if (typeof window === 'undefined') return;

    let userMessage = customMessage;
    
    if (!userMessage) {
      userMessage = this.getUserFriendlyMessage(errorInfo);
    }

    // Try to use the app's UI manager if available
    if (window.uiManager && typeof window.uiManager.showToast === 'function') {
      const toastType = errorInfo.severity === 'critical' ? 'error' : 'warning';
      window.uiManager.showToast(userMessage, toastType);
    } else if (errorInfo.severity === 'critical' && !this.isProduction) {
      // Only show alerts for critical errors in development
      alert(userMessage);
    }
  }

  /**
   * Get user-friendly error message based on error type
   * @param {Object} errorInfo - Error information
   * @returns {string} User-friendly message
   */
  getUserFriendlyMessage(errorInfo) {
    const { error, context, metadata } = errorInfo;

    // Network-related errors
    if (!metadata.online) {
      return '🌐 You appear to be offline. Please check your internet connection.';
    }

    if (context.includes('Network') || context.includes('API')) {
      return '🔌 Connection issue. Please try again in a moment.';
    }

    // Authentication errors
    if (context.includes('Auth')) {
      return '🔐 Authentication issue. Please log in again.';
    }

    // Storage errors
    if (context.includes('Storage')) {
      return '💾 Unable to save your data. Please try again.';
    }

    // Generic errors by severity
    switch (errorInfo.severity) {
      case 'critical':
        return '⚠️ Something went wrong. Please refresh the page.';
      case 'high':
        return '⚠️ There was an issue processing your request.';
      case 'medium':
        return '⚠️ A minor issue occurred. You can continue using the app.';
      default:
        return '⚠️ Something unexpected happened.';
    }
  }

  /**
   * Log error based on environment
   * @param {Object} errorInfo - Processed error information
   */
  logError(errorInfo) {
    const logLevel = this.getLogLevel(errorInfo.severity);
    
    if (this.isProduction) {
      // In production, only log critical and high severity errors
      if (errorInfo.severity === 'critical' || errorInfo.severity === 'high') {
        console.error(`[${errorInfo.context}] ${errorInfo.error.message}`);
      }
    } else {
      // In development, provide detailed logging
      console[logLevel]('🚨 Error Details:', {
        id: errorInfo.id,
        severity: errorInfo.severity,
        context: errorInfo.context,
        message: errorInfo.error.message,
        timestamp: errorInfo.timestamp,
        metadata: errorInfo.metadata
      });
      
      if (errorInfo.error.stack && errorInfo.severity !== 'low') {
        console.error('📍 Stack Trace:', errorInfo.error.stack);
      }
    }
  }

  /**
   * Get appropriate console log level based on severity
   * @param {string} severity - Error severity
   * @returns {string} Console method name
   */
  getLogLevel(severity) {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warn';
      case 'low': return 'info';
      default: return 'log';
    }
  }

  /**
   * Store error for analytics and monitoring
   * @param {Object} errorInfo - Processed error information
   */
  storeError(errorInfo) {
    // Add to error queue
    this.errorQueue.push(errorInfo);
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxErrors) {
      this.errorQueue.shift();
    }
    
    // Store in localStorage for debugging (development only)
    if (!this.isProduction && typeof localStorage !== 'undefined') {
      try {
        const existingErrors = JSON.parse(localStorage.getItem('errorLog') || '[]');
        existingErrors.push(errorInfo);
        
        // Keep only last 50 errors
        const recentErrors = existingErrors.slice(-50);
        localStorage.setItem('errorLog', JSON.stringify(recentErrors));
      } catch (storageError) {
        console.warn('Failed to store error in localStorage:', storageError);
      }
    }
  }

  /**
   * Send error to analytics service
   * @param {Object} errorInfo - Error information
   */
  sendToAnalytics(errorInfo) {
    try {
      // Send to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: `${errorInfo.context}: ${errorInfo.error.message}`,
          fatal: errorInfo.severity === 'critical',
          custom_map: {
            severity: errorInfo.severity,
            context: errorInfo.context
          }
        });
      }

      // Send to custom analytics if available
      if (typeof window !== 'undefined' && window.analytics && typeof window.analytics.trackError === 'function') {
        window.analytics.trackError(errorInfo);
      }
    } catch (analyticsError) {
      // Don't let analytics errors cause more errors
      console.warn('Failed to send error to analytics:', analyticsError);
    }
  }

  /**
   * Generate unique error ID
   * @returns {string} Unique error identifier
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle API errors specifically with retry logic
   * @param {Response} response - Fetch response object
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Retry options
   * @returns {Object} Error information
   */
  async handleApiError(response, endpoint, options = {}) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (parseError) {
      // Response body is not JSON, use status text
      console.warn('Could not parse API error response');
    }

    const errorInfo = this.handleError(new Error(errorMessage), 'API Request', {
      endpoint,
      status: response.status,
      statusText: response.statusText
    });

    // Handle retry logic for certain status codes
    if (options.enableRetry !== false && this.shouldRetry(response.status, endpoint)) {
      const retryInfo = await this.handleRetry(endpoint, options.retryCallback);
      if (retryInfo.success) {
        return retryInfo;
      }
    }
    
    return errorInfo;
  }

  /**
   * Determine if a request should be retried
   * @param {number} status - HTTP status code
   * @param {string} endpoint - API endpoint
   * @returns {boolean} Whether to retry
   */
  shouldRetry(status, endpoint) {
    // Retry on server errors and rate limiting
    const retryableStatuses = [500, 502, 503, 504, 429];
    const currentRetries = this.retryAttempts.get(endpoint) || 0;
    
    return retryableStatuses.includes(status) && currentRetries < this.maxRetries;
  }

  /**
   * Handle retry logic
   * @param {string} endpoint - API endpoint
   * @param {Function} retryCallback - Function to retry
   * @returns {Object} Retry result
   */
  async handleRetry(endpoint, retryCallback) {
    const currentRetries = this.retryAttempts.get(endpoint) || 0;
    const newRetryCount = currentRetries + 1;
    this.retryAttempts.set(endpoint, newRetryCount);

    // Exponential backoff
    const delay = Math.min(1000 * Math.pow(2, currentRetries), 10000);
    
    console.warn(`⏳ Retrying ${endpoint} (attempt ${newRetryCount}/${this.maxRetries}) after ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      if (retryCallback) {
        const result = await retryCallback();
        // Clear retry count on success
        this.retryAttempts.delete(endpoint);
        return { success: true, result };
      }
    } catch (retryError) {
      console.warn(`🔄 Retry ${newRetryCount} failed for ${endpoint}:`, retryError.message);
      
      if (newRetryCount >= this.maxRetries) {
        this.retryAttempts.delete(endpoint);
        this.handleError(
          new Error(`Max retries (${this.maxRetries}) exceeded for ${endpoint}`),
          'API Retry Failed'
        );
      }
    }

    return { success: false };
  }

  /**
   * Handle network errors
   * @param {Error} networkError - Network error object
   * @param {string} context - Context of the network operation
   * @returns {Object} Error information
   */
  handleNetworkError(networkError, context = 'Network Operation') {
    return this.handleError(networkError, context, {
      type: 'network',
      online: typeof navigator !== 'undefined' ? navigator.onLine : true
    });
  }

  /**
   * Handle validation errors
   * @param {string} field - Field that failed validation
   * @param {string} message - Validation error message
   * @param {*} value - Invalid value
   * @returns {Object} Error information
   */
  handleValidationError(field, message, value = null) {
    return this.handleError(
      new Error(`Validation Error: ${message}`),
      'Data Validation',
      { field, value, type: 'validation' }
    );
  }

  /**
   * Get recent errors for debugging
   * @param {number} limit - Number of recent errors to return
   * @returns {Array} Recent error objects
   */
  getRecentErrors(limit = 10) {
    return this.errorQueue.slice(-limit);
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errorQueue.length,
      bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
      byContext: {},
      last24Hours: 0
    };

    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);

    this.errorQueue.forEach(error => {
      // Count by severity
      stats.bySeverity[error.severity]++;
      
      // Count by context
      stats.byContext[error.context] = (stats.byContext[error.context] || 0) + 1;
      
      // Count recent errors
      if (new Date(error.timestamp).getTime() > last24Hours) {
        stats.last24Hours++;
      }
    });

    return stats;
  }

  /**
   * Clear error queue
   */
  clearErrors() {
    this.errorQueue = [];
    this.retryAttempts.clear();
    
    if (!this.isProduction && typeof localStorage !== 'undefined') {
      localStorage.removeItem('errorLog');
    }
  }

  /**
   * Safe async operation wrapper with retry logic
   * @param {Function} operation - Async operation to execute
   * @param {string} context - Context for error handling
   * @param {*} fallbackValue - Value to return on error
   * @param {Object} options - Options for retry and error handling
   * @returns {Promise} Operation result or fallback value
   */
  async safeAsync(operation, context, fallbackValue = null, options = {}) {
    try {
      return await operation();
    } catch (error) {
      const errorInfo = this.handleError(error, context, {}, {
        showUserNotification: options.showUserNotification,
        userMessage: options.userMessage
      });
      
      // Retry logic for async operations
      if (options.enableRetry && this.shouldRetryOperation(context)) {
        const retryResult = await this.handleRetry(context, operation);
        if (retryResult.success) {
          return retryResult.result;
        }
      }
      
      return fallbackValue;
    }
  }

  /**
   * Determine if an operation should be retried
   * @param {string} context - Operation context
   * @returns {boolean} Whether to retry
   */
  shouldRetryOperation(context) {
    const retryableContexts = ['Network', 'API', 'Storage', 'Database'];
    const currentRetries = this.retryAttempts.get(context) || 0;
    
    return retryableContexts.some(ctx => context.includes(ctx)) && currentRetries < this.maxRetries;
  }

  /**
   * Safe sync operation wrapper
   * @param {Function} operation - Sync operation to execute
   * @param {string} context - Context for error handling
   * @param {*} fallbackValue - Value to return on error
   * @param {Object} options - Error handling options
   * @returns {*} Operation result or fallback value
   */
  safeSync(operation, context, fallbackValue = null, options = {}) {
    try {
      return operation();
    } catch (error) {
      this.handleError(error, context, {}, {
        showUserNotification: options.showUserNotification,
        userMessage: options.userMessage
      });
      return fallbackValue;
    }
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Export for use throughout the application
export default errorHandler;

// Export specific methods for convenience
export const {
  handleError,
  handleApiError,
  handleNetworkError,
  handleValidationError,
  safeAsync,
  safeSync,
  getRecentErrors,
  getErrorStats,
  clearErrors
} = errorHandler;