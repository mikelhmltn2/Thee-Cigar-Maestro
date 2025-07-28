/**
 * API Client with enhanced error handling, request/response interceptors, and retry logic
 * Integrates with centralized error handling system
 */

import { handleError, handleApiError, handleNetworkError, safeAsync } from './src/utils/errorHandler.js';

class APIClient {
  constructor(baseURL = 'https://api.theecigarmaestro.com') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    // Setup response interceptors for error handling
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  setupInterceptors() {
    // Add auth token to requests if available
    this.requestInterceptor = (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        };
      }
      return config;
    };
  }

  /**
   * Make HTTP request with enhanced error handling
   */
  async request(endpoint, options = {}) {
    return await safeAsync(async () => {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: { ...this.defaultHeaders, ...options.headers },
        ...options
      };

      // Apply request interceptor
      const finalConfig = this.requestInterceptor(config);

      const response = await fetch(url, finalConfig);

      if (!response.ok) {
        return await handleApiError(response, endpoint, {
          enableRetry: response.status >= 500,
          retryCallback: () => this.request(endpoint, options)
        });
      }

      return await response.json();
    }, 'API Request', null, {
      userMessage: `Failed to ${options.method || 'GET'} data from server`,
      showUserNotification: true
    });
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * User registration with enhanced error handling
   */
  async register(userData) {
    return await safeAsync(async () => {
      const response = await this.post('/auth/register', userData);
      
      if (response && response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
      
      return response;
    }, 'User Registration', null, {
      userMessage: 'Failed to create your account. Please try again.',
      showUserNotification: true
    });
  }

  /**
   * User login with enhanced error handling
   */
  async login(credentials) {
    return await safeAsync(async () => {
      const response = await this.post('/auth/login', credentials);
      
      if (response && response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
      
      return response;
    }, 'User Login', null, {
      userMessage: 'Failed to log in. Please check your credentials.',
      showUserNotification: true
    });
  }

  /**
   * Get cigars data
   */
  async getCigars(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/cigars${queryParams ? `?${queryParams}` : ''}`;
    
    return this.get(endpoint);
  }

  /**
   * Search cigars
   */
  async searchCigars(query) {
    return this.post('/cigars/search', { query });
  }

  /**
   * Get user profile
   */
  async getUserProfile() {
    return this.get('/user/profile');
  }

  /**
   * Update user profile
   */
  async updateUserProfile(profileData) {
    return this.put('/user/profile', profileData);
  }

  /**
   * Track analytics event
   */
  async trackEvent(eventData) {
    return await safeAsync(async () => {
      return this.post('/analytics/track', eventData);
    }, 'Analytics Tracking', null, {
      showUserNotification: false // Don't show errors for analytics failures
    });
  }
}

// Create and export singleton instance
const apiClient = new APIClient();
export default apiClient;