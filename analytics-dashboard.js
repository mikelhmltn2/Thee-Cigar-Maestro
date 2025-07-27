/**
 * Enhanced Analytics Dashboard
 * Provides comprehensive analytics and insights for user behavior
 */

class AnalyticsDashboard {
  constructor() {
    this.apiClient = window.CigarMaestroAPI;
    this.isVisible = false;
    this.refreshInterval = null;
    this.analytics = {
      pageViews: {},
      userInteractions: {},
      searchQueries: [],
      popularCigars: [],
      sessionData: {}
    };
    
    this.init();
  }

  init() {
    this.createDashboard();
    this.setupEventListeners();
    this.startDataCollection();
  }

  createDashboard() {
    // Create dashboard overlay
    const dashboardOverlay = document.createElement('div');
    dashboardOverlay.id = 'analytics-dashboard-overlay';
    dashboardOverlay.className = 'analytics-dashboard-overlay';
    dashboardOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(5px);
    `;

    // Create dashboard container
    const dashboardContainer = document.createElement('div');
    dashboardContainer.className = 'analytics-dashboard-container';
    dashboardContainer.style.cssText = `
      background: linear-gradient(135deg, #1a1a1a 0%, #2c1810 100%);
      border-radius: 15px;
      padding: 2rem;
      width: 90%;
      max-width: 1200px;
      height: 90%;
      max-height: 800px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      border: 1px solid #CD853F;
      color: #f4f1eb;
      position: relative;
      overflow: auto;
    `;

    dashboardContainer.innerHTML = `
      <div class="dashboard-header" style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        border-bottom: 1px solid #8B4513;
        padding-bottom: 1rem;
      ">
        <h2 style="color: #CD853F; margin: 0; font-size: 2rem;">📊 Analytics Dashboard</h2>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <button id="refresh-analytics-btn" style="
            background: linear-gradient(135deg, #CD853F 0%, #D2B48C 100%);
            color: #2c1810;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          ">🔄 Refresh</button>
          <button id="close-analytics-btn" style="
            background: none;
            border: none;
            font-size: 24px;
            color: #CD853F;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">&times;</button>
        </div>
      </div>

      <div class="dashboard-content" style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        height: calc(100% - 120px);
        overflow-y: auto;
      ">
        <!-- Key Metrics Cards -->
        <div class="metrics-card" style="
          background: rgba(139, 69, 19, 0.1);
          border: 1px solid #8B4513;
          border-radius: 10px;
          padding: 1.5rem;
          min-height: 150px;
        ">
          <h3 style="color: #CD853F; margin: 0 0 1rem 0; font-size: 1.3rem;">🎯 Key Metrics</h3>
          <div id="key-metrics" style="display: flex; flex-direction: column; gap: 0.8rem;">
            <div class="metric-item" style="display: flex; justify-content: space-between;">
              <span style="color: #D2B48C;">Total Page Views:</span>
              <span id="total-page-views" style="color: #CD853F; font-weight: bold;">-</span>
            </div>
            <div class="metric-item" style="display: flex; justify-content: space-between;">
              <span style="color: #D2B48C;">User Interactions:</span>
              <span id="total-interactions" style="color: #CD853F; font-weight: bold;">-</span>
            </div>
            <div class="metric-item" style="display: flex; justify-content: space-between;">
              <span style="color: #D2B48C;">Session Duration:</span>
              <span id="session-duration" style="color: #CD853F; font-weight: bold;">-</span>
            </div>
            <div class="metric-item" style="display: flex; justify-content: space-between;">
              <span style="color: #D2B48C;">Search Queries:</span>
              <span id="search-count" style="color: #CD853F; font-weight: bold;">-</span>
            </div>
          </div>
        </div>

        <!-- Real-time Activity -->
        <div class="activity-card" style="
          background: rgba(139, 69, 19, 0.1);
          border: 1px solid #8B4513;
          border-radius: 10px;
          padding: 1.5rem;
          min-height: 150px;
        ">
          <h3 style="color: #CD853F; margin: 0 0 1rem 0; font-size: 1.3rem;">⚡ Real-time Activity</h3>
          <div id="activity-feed" style="
            max-height: 200px;
            overflow-y: auto;
            font-size: 0.9rem;
          ">
            <div style="color: #D2B48C; font-style: italic;">No recent activity</div>
          </div>
        </div>

        <!-- Popular Pages -->
        <div class="pages-card" style="
          background: rgba(139, 69, 19, 0.1);
          border: 1px solid #8B4513;
          border-radius: 10px;
          padding: 1.5rem;
          min-height: 150px;
        ">
          <h3 style="color: #CD853F; margin: 0 0 1rem 0; font-size: 1.3rem;">📈 Popular Pages</h3>
          <div id="popular-pages" style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="color: #D2B48C; font-style: italic;">No data available</div>
          </div>
        </div>

        <!-- User Behavior -->
        <div class="behavior-card" style="
          background: rgba(139, 69, 19, 0.1);
          border: 1px solid #8B4513;
          border-radius: 10px;
          padding: 1.5rem;
          min-height: 150px;
        ">
          <h3 style="color: #CD853F; margin: 0 0 1rem 0; font-size: 1.3rem;">👥 User Behavior</h3>
          <div id="user-behavior" style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="color: #D2B48C; font-style: italic;">Collecting data...</div>
          </div>
        </div>

        <!-- Search Analytics -->
        <div class="search-card" style="
          background: rgba(139, 69, 19, 0.1);
          border: 1px solid #8B4513;
          border-radius: 10px;
          padding: 1.5rem;
          min-height: 150px;
        ">
          <h3 style="color: #CD853F; margin: 0 0 1rem 0; font-size: 1.3rem;">🔍 Search Analytics</h3>
          <div id="search-analytics" style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="color: #D2B48C; font-style: italic;">No searches yet</div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="performance-card" style="
          background: rgba(139, 69, 19, 0.1);
          border: 1px solid #8B4513;
          border-radius: 10px;
          padding: 1.5rem;
          min-height: 150px;
        ">
          <h3 style="color: #CD853F; margin: 0 0 1rem 0; font-size: 1.3rem;">⚡ Performance</h3>
          <div id="performance-metrics" style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div class="metric-item" style="display: flex; justify-content: space-between;">
              <span style="color: #D2B48C;">Load Time:</span>
              <span id="load-time" style="color: #CD853F; font-weight: bold;">-</span>
            </div>
            <div class="metric-item" style="display: flex; justify-content: space-between;">
              <span style="color: #D2B48C;">API Response:</span>
              <span id="api-response-time" style="color: #CD853F; font-weight: bold;">-</span>
            </div>
          </div>
        </div>
      </div>
    `;

    dashboardOverlay.appendChild(dashboardContainer);
    document.body.appendChild(dashboardOverlay);

    this.dashboard = dashboardOverlay;
    this.container = dashboardContainer;
  }

  setupEventListeners() {
    // Close dashboard
    document.getElementById('close-analytics-btn').addEventListener('click', () => this.hide());
    
    // Refresh data
    document.getElementById('refresh-analytics-btn').addEventListener('click', () => this.refreshData());

    // Close on overlay click
    this.dashboard.addEventListener('click', (e) => {
      if (e.target === this.dashboard) this.hide();
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  startDataCollection() {
    // Track page load time
    this.trackPerformance();
    
    // Start session tracking
    this.startSession();
    
    // Listen for user interactions
    this.setupInteractionTracking();
  }

  trackPerformance() {
    // Measure page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    this.analytics.sessionData.loadTime = loadTime;
    
    // Test API response time
    this.testAPIPerformance();
  }

  async testAPIPerformance() {
    try {
      const startTime = performance.now();
      await this.apiClient.checkHealth();
      const endTime = performance.now();
      
      this.analytics.sessionData.apiResponseTime = Math.round(endTime - startTime);
    } catch (error) {
      this.analytics.sessionData.apiResponseTime = 'Failed';
    }
  }

  startSession() {
    this.analytics.sessionData.startTime = Date.now();
    this.analytics.sessionData.pageViews = 0;
    this.analytics.sessionData.interactions = 0;
  }

  setupInteractionTracking() {
    // Track clicks
    document.addEventListener('click', (e) => {
      this.trackInteraction('click', e.target.tagName, {
        className: e.target.className,
        id: e.target.id
      });
    });

    // Track navigation
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname);
    });
  }

  trackInteraction(action, target, properties = {}) {
    this.analytics.sessionData.interactions++;
    
    const interaction = {
      action,
      target,
      properties,
      timestamp: Date.now()
    };

    if (!this.analytics.userInteractions[action]) {
      this.analytics.userInteractions[action] = [];
    }
    this.analytics.userInteractions[action].push(interaction);

    // Send to API if authenticated
    if (this.apiClient.isUserAuthenticated()) {
      this.apiClient.trackInteraction(action, target, properties);
    }

    // Update real-time activity
    this.updateActivityFeed(interaction);
  }

  trackPageView(page) {
    this.analytics.sessionData.pageViews++;
    
    if (!this.analytics.pageViews[page]) {
      this.analytics.pageViews[page] = 0;
    }
    this.analytics.pageViews[page]++;

    // Send to API if authenticated
    if (this.apiClient.isUserAuthenticated()) {
      this.apiClient.trackPageView(page);
    }
  }

  updateActivityFeed(interaction) {
    const activityFeed = document.getElementById('activity-feed');
    if (!activityFeed) return;

    const activityItem = document.createElement('div');
    activityItem.style.cssText = `
      padding: 0.5rem;
      border-left: 3px solid #CD853F;
      margin: 0.3rem 0;
      background: rgba(205, 133, 63, 0.1);
      border-radius: 0 5px 5px 0;
      color: #D2B48C;
    `;
    
    const timeStr = new Date(interaction.timestamp).toLocaleTimeString();
    activityItem.innerHTML = `
      <div style="font-size: 0.8rem; color: #CD853F;">${timeStr}</div>
      <div>${interaction.action} on ${interaction.target}</div>
    `;

    // Clear "no activity" message
    if (activityFeed.children.length === 1 && activityFeed.children[0].textContent.includes('No recent activity')) {
      activityFeed.innerHTML = '';
    }

    activityFeed.insertBefore(activityItem, activityFeed.firstChild);

    // Keep only last 10 items
    while (activityFeed.children.length > 10) {
      activityFeed.removeChild(activityFeed.lastChild);
    }
  }

  async refreshData() {
    this.updateMetrics();
    this.updatePopularPages();
    this.updateUserBehavior();
    this.updateSearchAnalytics();
    this.updatePerformanceMetrics();
  }

  updateMetrics() {
    const totalPageViews = Object.values(this.analytics.pageViews).reduce((sum, views) => sum + views, 0);
    const totalInteractions = Object.values(this.analytics.userInteractions).reduce((sum, interactions) => sum + interactions.length, 0);
    const sessionDuration = this.analytics.sessionData.startTime ? 
      Math.round((Date.now() - this.analytics.sessionData.startTime) / 1000) : 0;

    document.getElementById('total-page-views').textContent = totalPageViews;
    document.getElementById('total-interactions').textContent = totalInteractions;
    document.getElementById('session-duration').textContent = `${sessionDuration}s`;
    document.getElementById('search-count').textContent = this.analytics.searchQueries.length;
  }

  updatePopularPages() {
    const popularPages = document.getElementById('popular-pages');
    if (!popularPages) return;

    const sortedPages = Object.entries(this.analytics.pageViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    if (sortedPages.length === 0) {
      popularPages.innerHTML = '<div style="color: #D2B48C; font-style: italic;">No data available</div>';
      return;
    }

    popularPages.innerHTML = sortedPages.map(([page, views]) => `
      <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
        <span style="color: #D2B48C;">${page || 'Home'}</span>
        <span style="color: #CD853F; font-weight: bold;">${views} views</span>
      </div>
    `).join('');
  }

  updateUserBehavior() {
    const userBehavior = document.getElementById('user-behavior');
    if (!userBehavior) return;

    const clickCount = this.analytics.userInteractions.click?.length || 0;
    const avgSessionTime = this.analytics.sessionData.startTime ? 
      Math.round((Date.now() - this.analytics.sessionData.startTime) / 60000) : 0;

    userBehavior.innerHTML = `
      <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
        <span style="color: #D2B48C;">Total Clicks:</span>
        <span style="color: #CD853F; font-weight: bold;">${clickCount}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
        <span style="color: #D2B48C;">Session Time:</span>
        <span style="color: #CD853F; font-weight: bold;">${avgSessionTime}m</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
        <span style="color: #D2B48C;">Engagement:</span>
        <span style="color: #CD853F; font-weight: bold;">${clickCount > 10 ? 'High' : clickCount > 5 ? 'Medium' : 'Low'}</span>
      </div>
    `;
  }

  updateSearchAnalytics() {
    const searchAnalytics = document.getElementById('search-analytics');
    if (!searchAnalytics) return;

    const recentSearches = this.analytics.searchQueries.slice(-5);
    
    if (recentSearches.length === 0) {
      searchAnalytics.innerHTML = '<div style="color: #D2B48C; font-style: italic;">No searches yet</div>';
      return;
    }

    searchAnalytics.innerHTML = recentSearches.map(query => `
      <div style="padding: 0.3rem 0; color: #D2B48C;">
        "${query}"
      </div>
    `).join('');
  }

  updatePerformanceMetrics() {
    document.getElementById('load-time').textContent = 
      this.analytics.sessionData.loadTime ? `${Math.round(this.analytics.sessionData.loadTime)}ms` : '-';
    
    document.getElementById('api-response-time').textContent = 
      this.analytics.sessionData.apiResponseTime ? `${this.analytics.sessionData.apiResponseTime}ms` : '-';
  }

  show() {
    this.isVisible = true;
    this.dashboard.style.display = 'flex';
    this.refreshData();
    
    // Start auto-refresh
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, 5000); // Refresh every 5 seconds
  }

  hide() {
    this.isVisible = false;
    this.dashboard.style.display = 'none';
    
    // Stop auto-refresh
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // Public method to track search queries
  trackSearch(query) {
    this.analytics.searchQueries.push(query);
    
    // Send to API if authenticated
    if (this.apiClient.isUserAuthenticated()) {
      this.apiClient.trackEvent('search_query', { query });
    }
  }
}

// Initialize Analytics Dashboard
document.addEventListener('DOMContentLoaded', () => {
  window.analyticsDashboard = new AnalyticsDashboard();
});

export default AnalyticsDashboard;