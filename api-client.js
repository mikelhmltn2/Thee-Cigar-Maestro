/**
 * Thee Cigar Maestro API Client
 * Frontend client for backend API integration
 */

class CigarMaestroAPIClient {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
    this.token = localStorage.getItem('authToken');
    this.isAuthenticated = !!this.token;
    
    // Setup interceptors
    this.setupResponseInterceptors();
  }

  /**
   * Setup response interceptors for error handling
   */
  setupResponseInterceptors() {
    // Handle token expiration
    this.on401 = () => {
      this.logout();
      window.location.href = '/login';
    };
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add auth token if available
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle authentication errors
      if (response.status === 401) {
        this.on401();
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  /**
   * Register new user
   */
  async register(userData) {
    try {
      const response = await this.post('/auth/register', userData);
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(credentials) {
    try {
      const response = await this.post('/auth/login', credentials);
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    this.isAuthenticated = true;
    localStorage.setItem('authToken', token);
  }

  /**
   * Get user profile
   */
  async getUserProfile() {
    return this.get('/user/profile');
  }

  // Cigar methods
  /**
   * Get cigars with pagination
   */
  async getCigars(params = {}) {
    return this.get('/cigars', params);
  }

  /**
   * Search cigars
   */
  async searchCigars(searchParams) {
    return this.post('/cigars/search', searchParams);
  }

  /**
   * Get cigar by ID
   */
  async getCigar(id) {
    return this.get(`/cigars/${id}`);
  }

  // Analytics methods
  /**
   * Track analytics event
   */
  async trackEvent(event, properties = {}) {
    try {
      return await this.post('/analytics/track', { event, properties });
    } catch (error) {
      // Don't throw on analytics failures
      console.warn('Analytics tracking failed:', error);
    }
  }

  /**
   * Track page view
   */
  async trackPageView(page, properties = {}) {
    return this.trackEvent('page_view', { page, ...properties });
  }

  /**
   * Track user interaction
   */
  async trackInteraction(action, target, properties = {}) {
    return this.trackEvent('user_interaction', { action, target, ...properties });
  }

  // Health check
  /**
   * Check API health
   */
  async checkHealth() {
    return this.get('/health');
  }

  // Utility methods
  /**
   * Check if user is authenticated
   */
  isUserAuthenticated() {
    return this.isAuthenticated && this.token;
  }

  /**
   * Get current user data from localStorage
   */
  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Set current user data
   */
  setCurrentUser(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
}

// Create singleton instance
const apiClient = new CigarMaestroAPIClient();

// Auto-track page views
if (typeof window !== 'undefined') {
  // Track initial page load
  apiClient.trackPageView(window.location.pathname);

  // Track navigation changes
  let lastUrl = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastUrl) {
      lastUrl = window.location.pathname;
      apiClient.trackPageView(window.location.pathname);
    }
  });

  observer.observe(document, { subtree: true, childList: true });
}

// Export for use in other modules
window.CigarMaestroAPI = apiClient;
export default apiClient;