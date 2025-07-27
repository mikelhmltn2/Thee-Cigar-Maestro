/**
 * Error Handler Utility for Thee Cigar Maestro
 * Provides consistent error handling and logging across the application
 */

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.init();
  }

  init() {
    // Set up global error handling
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: 'unhandledrejection'
      });
    });

    console.log('🛡️ Error Handler initialized');
  }

  handleError(error, context = {}) {
    const errorInfo = {
      message: error.message || error.toString(),
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Store error
    this.errors.unshift(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log error
    console.error('🚨 Application Error:', errorInfo);

    // Show user-friendly message
    this.showUserMessage(error, context);

    // Save to localStorage for debugging
    this.saveToStorage();

    return errorInfo;
  }

  showUserMessage(error, context) {
    let message = 'An unexpected error occurred.';
    let type = 'error';

    // Categorize errors for better user messages
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      message = 'Network connection issue. Please check your internet connection.';
    } else if (error.message.includes('permission')) {
      message = 'Permission denied. Please check your browser settings.';
    } else if (error.message.includes('3D') || error.message.includes('WebGL')) {
      message = 'Graphics rendering issue. Try refreshing the page or updating your browser.';
    } else if (error.message.includes('audio') || error.message.includes('microphone')) {
      message = 'Audio feature unavailable. Please check your microphone permissions.';
    } else if (context.type === 'data') {
      message = 'Data loading issue. Some features may be unavailable.';
      type = 'warning';
    }

    // Show toast if UI manager is available
    if (window.uiManager && typeof window.uiManager.showToast === 'function') {
      window.uiManager.showToast(message, type, 5000);
    } else {
      // Fallback to alert
      console.warn('Toast system unavailable, falling back to console warning:', message);
    }
  }

  saveToStorage() {
    try {
      const recentErrors = this.errors.slice(0, 10); // Only save recent errors
      localStorage.setItem('cigar_maestro_errors', JSON.stringify(recentErrors));
    } catch (e) {
      console.warn('Could not save errors to localStorage:', e);
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('cigar_maestro_errors');
      if (saved) {
        const savedErrors = JSON.parse(saved);
        this.errors = savedErrors.concat(this.errors);
      }
    } catch (e) {
      console.warn('Could not load errors from localStorage:', e);
    }
  }

  // Utility methods
  logWarning(message, context = {}) {
    const warning = {
      level: 'warning',
      message,
      timestamp: new Date().toISOString(),
      context
    };

    console.warn('⚠️ Warning:', warning);
    
    if (window.uiManager && typeof window.uiManager.showToast === 'function') {
      window.uiManager.showToast(message, 'warning', 3000);
    }

    return warning;
  }

  logInfo(message, context = {}) {
    const info = {
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      context
    };

    console.info('ℹ️ Info:', info);
    
    if (window.uiManager && typeof window.uiManager.showToast === 'function') {
      window.uiManager.showToast(message, 'info', 2000);
    }

    return info;
  }

  logSuccess(message, context = {}) {
    const success = {
      level: 'success',
      message,
      timestamp: new Date().toISOString(),
      context
    };

    console.log('✅ Success:', success);
    
    if (window.uiManager && typeof window.uiManager.showToast === 'function') {
      window.uiManager.showToast(message, 'success', 2000);
    }

    return success;
  }

  // Performance monitoring
  measurePerformance(name, fn) {
    const start = performance.now();
    try {
      const result = fn();
      const end = performance.now();
      const duration = end - start;
      
      console.log(`⏱️ Performance: ${name} took ${duration.toFixed(2)}ms`);
      
      // Log slow operations
      if (duration > 1000) {
        this.logWarning(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`, {
          operation: name,
          duration
        });
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      
      this.handleError(error, {
        operation: name,
        duration
      });
      
      throw error;
    }
  }

  async measureAsyncPerformance(name, asyncFn) {
    const start = performance.now();
    try {
      const result = await asyncFn();
      const end = performance.now();
      const duration = end - start;
      
      console.log(`⏱️ Async Performance: ${name} took ${duration.toFixed(2)}ms`);
      
      // Log slow operations
      if (duration > 2000) {
        this.logWarning(`Slow async operation detected: ${name} took ${duration.toFixed(2)}ms`, {
          operation: name,
          duration
        });
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      
      this.handleError(error, {
        operation: name,
        duration
      });
      
      throw error;
    }
  }

  // Data validation helpers
  validateRequired(value, fieldName) {
    if (value === null || value === undefined || value === '') {
      throw new Error(`Required field missing: ${fieldName}`);
    }
    return true;
  }

  validateType(value, expectedType, fieldName) {
    if (typeof value !== expectedType) {
      throw new Error(`Invalid type for ${fieldName}: expected ${expectedType}, got ${typeof value}`);
    }
    return true;
  }

  validateArray(value, fieldName) {
    if (!Array.isArray(value)) {
      throw new Error(`Invalid type for ${fieldName}: expected array, got ${typeof value}`);
    }
    return true;
  }

  validateObject(value, fieldName) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error(`Invalid type for ${fieldName}: expected object, got ${typeof value}`);
    }
    return true;
  }

  // Network error handling
  handleNetworkError(error, url, options = {}) {
    const networkError = new Error(`Network request failed: ${error.message}`);
    networkError.name = 'NetworkError';
    
    return this.handleError(networkError, {
      url,
      options,
      originalError: error.message
    });
  }

  // 3D/WebGL error handling
  handleWebGLError(error, context = {}) {
    const webglError = new Error(`WebGL/3D rendering error: ${error.message || error}`);
    webglError.name = 'WebGLError';
    
    return this.handleError(webglError, {
      ...context,
      webglSupported: !!window.WebGLRenderingContext,
      webgl2Supported: !!window.WebGL2RenderingContext
    });
  }

  // Audio error handling
  handleAudioError(error, context = {}) {
    const audioError = new Error(`Audio error: ${error.message || error}`);
    audioError.name = 'AudioError';
    
    return this.handleError(audioError, {
      ...context,
      mediaDevicesSupported: !!navigator.mediaDevices,
      getUserMediaSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    });
  }

  // Data error handling
  handleDataError(error, dataSource, context = {}) {
    const dataError = new Error(`Data error from ${dataSource}: ${error.message || error}`);
    dataError.name = 'DataError';
    
    return this.handleError(dataError, {
      ...context,
      dataSource,
      type: 'data'
    });
  }

  // Recovery suggestions
  getSuggestions(error) {
    const suggestions = [];
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      suggestions.push('Check your internet connection');
      suggestions.push('Try refreshing the page');
    }
    
    if (error.message.includes('WebGL') || error.message.includes('3D')) {
      suggestions.push('Update your browser to the latest version');
      suggestions.push('Enable hardware acceleration in browser settings');
      suggestions.push('Try using a different browser');
    }
    
    if (error.message.includes('permission')) {
      suggestions.push('Check browser permissions for this site');
      suggestions.push('Reload the page and allow permissions when prompted');
    }
    
    if (error.message.includes('storage') || error.message.includes('localStorage')) {
      suggestions.push('Clear browser cache and cookies');
      suggestions.push('Check available storage space');
    }
    
    return suggestions;
  }

  // Debug information
  getDebugInfo() {
    return {
      errors: this.errors.slice(0, 5), // Last 5 errors
      browser: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      },
      features: {
        webgl: !!window.WebGLRenderingContext,
        webgl2: !!window.WebGL2RenderingContext,
        mediaDevices: !!navigator.mediaDevices,
        serviceWorker: 'serviceWorker' in navigator,
        localStorage: this.checkLocalStorage(),
        webAudio: !!(window.AudioContext || window.webkitAudioContext)
      },
      performance: {
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1048576),
          total: Math.round(performance.memory.totalJSHeapSize / 1048576),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        } : null
      }
    };
  }

  checkLocalStorage() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Export error report
  exportErrorReport() {
    const report = {
      timestamp: new Date().toISOString(),
      errors: this.errors,
      debugInfo: this.getDebugInfo(),
      url: window.location.href
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cigar-maestro-error-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    this.logSuccess('Error report exported successfully');
  }

  // Clear errors
  clearErrors() {
    this.errors = [];
    localStorage.removeItem('cigar_maestro_errors');
    this.logInfo('Error history cleared');
  }

  // Get error statistics
  getErrorStats() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;

    const recentErrors = this.errors.filter(error => 
      now - new Date(error.timestamp).getTime() < oneHour
    );

    const dailyErrors = this.errors.filter(error => 
      now - new Date(error.timestamp).getTime() < oneDay
    );

    return {
      total: this.errors.length,
      lastHour: recentErrors.length,
      lastDay: dailyErrors.length,
      mostCommon: this.getMostCommonError()
    };
  }

  getMostCommonError() {
    const errorCounts = {};
    
    this.errors.forEach(error => {
      const key = error.message.substring(0, 50); // First 50 chars
      errorCounts[key] = (errorCounts[key] || 0) + 1;
    });

    let mostCommon = null;
    let maxCount = 0;

    Object.entries(errorCounts).forEach(([message, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = { message, count };
      }
    });

    return mostCommon;
  }
}

// Create global instance
const errorHandler = new ErrorHandler();

// Load any saved errors
errorHandler.loadFromStorage();

export default errorHandler;