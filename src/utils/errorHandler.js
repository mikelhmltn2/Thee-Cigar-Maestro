/**
 * Centralized Error Handling Utility
 * Provides consistent error handling, logging, and user feedback
 */

class ErrorHandler {
  constructor() {
    this.isProduction = process?.env?.NODE_ENV === 'production';
    this.errorQueue = [];
    this.maxErrors = 100;
    
    // Setup global error handlers
    this.setupGlobalHandlers();
  }

  /**
   * Setup global error handlers for unhandled errors
   */
  setupGlobalHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.handleError(event.error, 'Global Error Handler');
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
   */
  handleError(error, context = 'Unknown', metadata = {}) {
    const errorInfo = this.processError(error, context, metadata);
    
    // Log error
    this.logError(errorInfo);
    
    // Store error for analytics
    this.storeError(errorInfo);
    
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
      metadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
        ...metadata
      }
    };
  }

  /**
   * Log error based on environment
   * @param {Object} errorInfo - Processed error information
   */
  logError(errorInfo) {
    if (this.isProduction) {
      // In production, use console.error for critical errors only
      console.error(`[${errorInfo.context}] ${errorInfo.error.message}`);
    } else {
      // In development, provide detailed logging
      console.error('🚨 Error Details:', {
        context: errorInfo.context,
        message: errorInfo.error.message,
        timestamp: errorInfo.timestamp,
        metadata: errorInfo.metadata
      });
      
      if (errorInfo.error.stack) {
        console.error('📍 Stack Trace:', errorInfo.error.stack);
      }
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
   * Generate unique error ID
   * @returns {string} Unique error identifier
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle API errors specifically
   * @param {Response} response - Fetch response object
   * @param {string} endpoint - API endpoint
   * @returns {Object} Error information
   */
  async handleApiError(response, endpoint) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (parseError) {
      // Response body is not JSON, use status text
      console.warn('Could not parse API error response');
    }
    
    return this.handleError(new Error(errorMessage), 'API Request', {
      endpoint,
      status: response.status,
      statusText: response.statusText
    });
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
   * Clear error queue
   */
  clearErrors() {
    this.errorQueue = [];
    
    if (!this.isProduction && typeof localStorage !== 'undefined') {
      localStorage.removeItem('errorLog');
    }
  }

  /**
   * Safe async operation wrapper
   * @param {Function} operation - Async operation to execute
   * @param {string} context - Context for error handling
   * @param {*} fallbackValue - Value to return on error
   * @returns {Promise} Operation result or fallback value
   */
  async safeAsync(operation, context, fallbackValue = null) {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, context);
      return fallbackValue;
    }
  }

  /**
   * Safe sync operation wrapper
   * @param {Function} operation - Sync operation to execute
   * @param {string} context - Context for error handling
   * @param {*} fallbackValue - Value to return on error
   * @returns {*} Operation result or fallback value
   */
  safeSync(operation, context, fallbackValue = null) {
    try {
      return operation();
    } catch (error) {
      this.handleError(error, context);
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
  clearErrors
} = errorHandler;