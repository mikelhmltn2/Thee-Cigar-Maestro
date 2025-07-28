/**
 * Comprehensive Test Suite for Enhanced Error Handler
 * Tests error processing, severity determination, retry logic, and analytics integration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import errorHandler, { 
  handleError, 
  handleApiError, 
  handleNetworkError, 
  handleValidationError,
  safeAsync,
  safeSync,
  getRecentErrors,
  getErrorStats,
  clearErrors
} from '../../src/utils/errorHandler.js';

// Mock global objects
const mockWindow = {
  location: { href: 'https://test.example.com' },
  addEventListener: vi.fn(),
  uiManager: {
    showToast: vi.fn()
  },
  analytics: {
    trackError: vi.fn()
  }
};

const mockNavigator = {
  userAgent: 'Test Browser 1.0',
  onLine: true
};

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

const mockGtag = vi.fn();

// Setup globals
global.window = mockWindow;
global.navigator = mockNavigator;
global.localStorage = mockLocalStorage;
global.gtag = mockGtag;

describe('Enhanced Error Handler', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Reset error handler state
    errorHandler.clearErrors();
    
    // Mock localStorage responses
    mockLocalStorage.getItem.mockReturnValue('[]');
  });

  afterEach(() => {
    errorHandler.clearErrors();
  });

  describe('Error Processing and Severity', () => {
    it('should correctly determine critical severity for auth errors', () => {
      const error = new Error('Authentication failed');
      const errorInfo = handleError(error, 'Auth Login');
      
      expect(errorInfo.severity).toBe('critical');
      expect(errorInfo.context).toBe('Auth Login');
      expect(errorInfo.error.name).toBe('Error');
    });

    it('should correctly determine high severity for API errors', () => {
      const error = new TypeError('Network request failed');
      const errorInfo = handleError(error, 'API Request');
      
      expect(errorInfo.severity).toBe('high');
      expect(errorInfo.error.name).toBe('TypeError');
    });

    it('should correctly determine medium severity for UI errors', () => {
      const error = new Error('Animation failed');
      const errorInfo = handleError(error, 'UI Animation');
      
      expect(errorInfo.severity).toBe('medium');
    });

    it('should correctly determine low severity for other errors', () => {
      const error = new Error('Minor issue');
      const errorInfo = handleError(error, 'General Operation');
      
      expect(errorInfo.severity).toBe('low');
    });

    it('should handle string errors', () => {
      const errorInfo = handleError('Custom error message', 'Test Context');
      
      expect(errorInfo.error.name).toBe('CustomError');
      expect(errorInfo.error.message).toBe('Custom error message');
      expect(errorInfo.context).toBe('Test Context');
    });

    it('should handle unknown error types', () => {
      const errorInfo = handleError({ weird: 'object' }, 'Test Context');
      
      expect(errorInfo.error.name).toBe('UnknownError');
      expect(errorInfo.error.originalError).toEqual({ weird: 'object' });
    });
  });

  describe('User-Friendly Messages', () => {
    it('should show offline message when navigator is offline', () => {
      global.navigator.onLine = false;
      
      const error = new Error('Network error');
      handleError(error, 'Network Request');
      
      expect(mockWindow.uiManager.showToast).toHaveBeenCalledWith(
        '🌐 You appear to be offline. Please check your internet connection.',
        'error'
      );
      
      // Reset for other tests
      global.navigator.onLine = true;
    });

    it('should show auth-specific message for authentication errors', () => {
      const error = new Error('Token expired');
      handleError(error, 'Auth Token Validation');
      
      expect(mockWindow.uiManager.showToast).toHaveBeenCalledWith(
        '🔐 Authentication issue. Please log in again.',
        'error'
      );
    });

    it('should show network message for API errors', () => {
      const error = new Error('Connection failed');
      handleError(error, 'API Request');
      
      expect(mockWindow.uiManager.showToast).toHaveBeenCalledWith(
        '🔌 Connection issue. Please try again in a moment.',
        'error'
      );
    });

    it('should show storage message for storage errors', () => {
      const error = new Error('Save failed');
      handleError(error, 'Storage Save Operation');
      
      expect(mockWindow.uiManager.showToast).toHaveBeenCalledWith(
        '💾 Unable to save your data. Please try again.',
        'warning'
      );
    });

    it('should use custom user message when provided', () => {
      const error = new Error('Test error');
      handleError(error, 'Test Context', {}, { 
        userMessage: 'Custom error message for user' 
      });
      
      expect(mockWindow.uiManager.showToast).toHaveBeenCalledWith(
        'Custom error message for user',
        'low' === 'critical' ? 'error' : 'warning'
      );
    });
  });

  describe('Analytics Integration', () => {
    it('should send error to Google Analytics when available', () => {
      const error = new Error('Test error');
      const errorInfo = handleError(error, 'Test Context');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'Test Context: Test error',
        fatal: false, // low severity
        custom_map: {
          severity: 'low',
          context: 'Test Context'
        }
      });
    });

    it('should send critical errors as fatal to analytics', () => {
      const error = new Error('Critical auth error');
      handleError(error, 'Auth System Failure');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'Auth System Failure: Critical auth error',
        fatal: true, // critical severity
        custom_map: {
          severity: 'critical',
          context: 'Auth System Failure'
        }
      });
    });

    it('should send error to custom analytics', () => {
      const error = new Error('Test error');
      const errorInfo = handleError(error, 'Test Context');
      
      expect(mockWindow.analytics.trackError).toHaveBeenCalledWith(errorInfo);
    });

    it('should handle analytics errors gracefully', () => {
      mockGtag.mockImplementation(() => {
        throw new Error('Analytics error');
      });

      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const error = new Error('Test error');
      handleError(error, 'Test Context');
      
      expect(consoleWarn).toHaveBeenCalledWith(
        'Failed to send error to analytics:',
        expect.any(Error)
      );
      
      consoleWarn.mockRestore();
    });
  });

  describe('API Error Handling with Retry Logic', () => {
    it('should handle successful API error without retry', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({ message: 'Invalid data' })
      };

      const errorInfo = await handleApiError(mockResponse, '/api/test');
      
      expect(errorInfo.error.message).toBe('API Error: Invalid data');
      expect(errorInfo.metadata.status).toBe(400);
      expect(errorInfo.metadata.endpoint).toBe('/api/test');
    });

    it('should retry on server errors (500)', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockRejectedValue(new Error('No JSON'))
      };

      const retryCallback = vi.fn().mockResolvedValue({ success: true });
      
      const result = await handleApiError(mockResponse, '/api/test', { 
        retryCallback,
        enableRetry: true 
      });
      
      expect(retryCallback).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should not retry on client errors (400)', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({ message: 'Invalid data' })
      };

      const retryCallback = vi.fn();
      
      const result = await handleApiError(mockResponse, '/api/test', { 
        retryCallback,
        enableRetry: true 
      });
      
      expect(retryCallback).not.toHaveBeenCalled();
      expect(result.error).toBeDefined();
    });

    it('should implement exponential backoff for retries', async () => {
      const startTime = Date.now();
      
      const mockResponse = {
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: vi.fn().mockRejectedValue(new Error('No JSON'))
      };

      const retryCallback = vi.fn()
        .mockRejectedValueOnce(new Error('Still failing'))
        .mockRejectedValueOnce(new Error('Still failing'))
        .mockResolvedValue({ success: true });
      
      // Mock setTimeout to track delays
      const originalSetTimeout = global.setTimeout;
      const delays = [];
      global.setTimeout = vi.fn((callback, delay) => {
        delays.push(delay);
        return originalSetTimeout(callback, 0); // Execute immediately for testing
      });
      
      const result = await handleApiError(mockResponse, '/api/test', { 
        retryCallback,
        enableRetry: true 
      });
      
      expect(delays).toEqual([1000, 2000]); // Exponential backoff: 2^0 * 1000, 2^1 * 1000
      expect(retryCallback).toHaveBeenCalledTimes(3);
      expect(result.success).toBe(true);
      
      global.setTimeout = originalSetTimeout;
    });
  });

  describe('Safe Operation Wrappers', () => {
    it('should handle successful async operations', async () => {
      const operation = vi.fn().mockResolvedValue('success');
      
      const result = await safeAsync(operation, 'Test Operation');
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalled();
    });

    it('should handle failed async operations', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Async error'));
      
      const result = await safeAsync(operation, 'Test Operation', 'fallback');
      
      expect(result).toBe('fallback');
      expect(getRecentErrors()).toHaveLength(1);
      expect(getRecentErrors()[0].context).toBe('Test Operation');
    });

    it('should retry failed async operations when enabled', async () => {
      let attemptCount = 0;
      const operation = vi.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Network failure');
        }
        return Promise.resolve('success after retry');
      });
      
      const result = await safeAsync(operation, 'Network Operation', 'fallback', {
        enableRetry: true
      });
      
      expect(result).toBe('success after retry');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should handle successful sync operations', () => {
      const operation = vi.fn().mockReturnValue('sync success');
      
      const result = safeSync(operation, 'Sync Test');
      
      expect(result).toBe('sync success');
      expect(operation).toHaveBeenCalled();
    });

    it('should handle failed sync operations', () => {
      const operation = vi.fn().mockImplementation(() => {
        throw new Error('Sync error');
      });
      
      const result = safeSync(operation, 'Sync Test', 'sync fallback');
      
      expect(result).toBe('sync fallback');
      expect(getRecentErrors()).toHaveLength(1);
    });
  });

  describe('Error Statistics and Management', () => {
    it('should track error statistics correctly', () => {
      // Create errors with different severities
      handleError(new Error('Critical error'), 'Auth Failure');
      handleError(new Error('High error'), 'API Request');
      handleError(new Error('Medium error'), 'UI Component');
      handleError(new Error('Low error'), 'General');
      
      const stats = getErrorStats();
      
      expect(stats.total).toBe(4);
      expect(stats.bySeverity.critical).toBe(1);
      expect(stats.bySeverity.high).toBe(1);
      expect(stats.bySeverity.medium).toBe(1);
      expect(stats.bySeverity.low).toBe(1);
      expect(stats.byContext['Auth Failure']).toBe(1);
      expect(stats.byContext['API Request']).toBe(1);
    });

    it('should limit recent errors correctly', () => {
      // Add more errors than the limit
      for (let i = 0; i < 15; i++) {
        handleError(new Error(`Error ${i}`), 'Test Context');
      }
      
      const recentErrors = getRecentErrors(10);
      expect(recentErrors).toHaveLength(10);
      expect(recentErrors[9].error.message).toBe('Error 14'); // Last error
    });

    it('should clear errors correctly', () => {
      handleError(new Error('Test error'), 'Test Context');
      expect(getRecentErrors()).toHaveLength(1);
      
      clearErrors();
      expect(getRecentErrors()).toHaveLength(0);
      expect(getErrorStats().total).toBe(0);
    });

    it('should store errors in localStorage in development', () => {
      // Mock development environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      handleError(new Error('Dev error'), 'Development Test');
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'errorLog',
        expect.stringContaining('Dev error')
      );
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Network and Validation Errors', () => {
    it('should handle network errors with online status', () => {
      const networkError = new Error('Failed to fetch');
      const errorInfo = handleNetworkError(networkError, 'Data Fetch');
      
      expect(errorInfo.context).toBe('Data Fetch');
      expect(errorInfo.metadata.type).toBe('network');
      expect(errorInfo.metadata.online).toBe(true);
    });

    it('should handle validation errors with field info', () => {
      const errorInfo = handleValidationError('email', 'Invalid email format', 'test@');
      
      expect(errorInfo.error.message).toBe('Validation Error: Invalid email format');
      expect(errorInfo.context).toBe('Data Validation');
      expect(errorInfo.metadata.field).toBe('email');
      expect(errorInfo.metadata.value).toBe('test@');
      expect(errorInfo.metadata.type).toBe('validation');
    });
  });

  describe('Global Error Handlers', () => {
    it('should setup global error handlers on initialization', () => {
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'error',
        expect.any(Function)
      );
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'unhandledrejection',
        expect.any(Function)
      );
    });

    it('should handle global errors with file information', () => {
      const errorHandler = mockWindow.addEventListener.mock.calls.find(
        call => call[0] === 'error'
      )[1];
      
      const mockEvent = {
        error: new Error('Global error'),
        filename: 'test.js',
        lineno: 42,
        colno: 10
      };
      
      errorHandler(mockEvent);
      
      const recentError = getRecentErrors(1)[0];
      expect(recentError.context).toBe('Global Error Handler');
      expect(recentError.metadata.filename).toBe('test.js');
      expect(recentError.metadata.lineno).toBe(42);
      expect(recentError.metadata.colno).toBe(10);
    });

    it('should handle unhandled promise rejections', () => {
      const rejectionHandler = mockWindow.addEventListener.mock.calls.find(
        call => call[0] === 'unhandledrejection'
      )[1];
      
      const mockEvent = {
        reason: new Error('Unhandled promise rejection')
      };
      
      rejectionHandler(mockEvent);
      
      const recentError = getRecentErrors(1)[0];
      expect(recentError.context).toBe('Unhandled Promise Rejection');
      expect(recentError.error.message).toBe('Unhandled promise rejection');
    });
  });

  describe('Production vs Development Behavior', () => {
    it('should log less in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Low severity error should not log in production
      handleError(new Error('Low priority'), 'General Operation');
      expect(consoleError).not.toHaveBeenCalled();
      
      // High severity error should log in production
      handleError(new Error('High priority'), 'API Request');
      expect(consoleError).toHaveBeenCalled();
      
      consoleError.mockRestore();
      consoleWarn.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });

    it('should not store in localStorage in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      handleError(new Error('Prod error'), 'Production Test');
      
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });
  });
});