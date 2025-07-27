/**
 * Personal Dashboard for Thee Cigar Maestro
 * Provides user statistics, favorites, history, and personalized recommendations
 */

class PersonalDashboard {
  constructor(uiManager, dataManager) {
    this.uiManager = uiManager;
    this.dataManager = dataManager;
    this.userStats = this.loadUserStats();
    this.isVisible = false;
    
    this.init();
  }

  init() {
    this.createDashboard();
    this.setupEventListeners();
    console.info('📊 Personal Dashboard initialized');
  }

  createDashboard() {
    const dashboardHTML = `
      <div class="personal-dashboard" id="personalDashboard">
        <div class="dashboard-header">
          <h2>📊 My Cigar Journey</h2>
          <button class="close-dashboard" id="closeDashboard">×</button>
        </div>

        <div class="dashboard-content">
          <!-- User Statistics -->
          <div class="dashboard-section stats-section">
            <h3>📈 Statistics</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">🚬</div>
                <div class="stat-info">
                  <span class="stat-number" id="totalCigarsSmoked">${this.userStats.totalSmoked}</span>
                  <span class="stat-label">Cigars Smoked</span>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-info">
                  <span class="stat-number" id="averageRating">${this.userStats.averageRating.toFixed(1)}</span>
                  <span class="stat-label">Avg. Rating</span>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">⏱️</div>
                <div class="stat-info">
                  <span class="stat-number" id="totalSmokeTime">${this.userStats.totalTime}</span>
                  <span class="stat-label">Hours Enjoyed</span>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-info">
                  <span class="stat-number" id="totalValue">$${this.userStats.totalValue}</span>
                  <span class="stat-label">Collection Value</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="dashboard-section quick-actions-section">
            <h3>⚡ Quick Actions</h3>
            <div class="quick-actions-grid">
              <button class="action-card" onclick="personalDashboard.startRandomSession()">
                <div class="action-icon">🎲</div>
                <div class="action-text">Random Cigar</div>
              </button>
              
              <button class="action-card" onclick="personalDashboard.showRecommendations()">
                <div class="action-icon">🎯</div>
                <div class="action-text">Get Recommendations</div>
              </button>
              
              <button class="action-card" onclick="personalDashboard.viewWishlist()">
                <div class="action-icon">❤️</div>
                <div class="action-text">My Wishlist</div>
              </button>
              
              <button class="action-card" onclick="personalDashboard.exportData()">
                <div class="action-icon">📤</div>
                <div class="action-text">Export Data</div>
              </button>
            </div>
          </div>

          <!-- Favorite Cigars -->
          <div class="dashboard-section favorites-section">
            <h3>⭐ Favorite Cigars</h3>
            <div class="favorites-list" id="favoritesList">
              ${this.generateFavoritesList()}
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="dashboard-section activity-section">
            <h3>📝 Recent Activity</h3>
            <div class="activity-timeline" id="activityTimeline">
              ${this.generateActivityTimeline()}
            </div>
          </div>

          <!-- Wrapper Preferences -->
          <div class="dashboard-section preferences-section">
            <h3>🎨 Your Preferences</h3>
            <div class="preferences-content">
              <div class="preference-chart">
                <h4>Wrapper Type Distribution</h4>
                <div class="wrapper-chart" id="wrapperChart">
                  ${this.generateWrapperChart()}
                </div>
              </div>
              
              <div class="preference-insights">
                <h4>🔍 Insights</h4>
                <div class="insights-list">
                  ${this.generateInsights()}
                </div>
              </div>
            </div>
          </div>

          <!-- Monthly Progress -->
          <div class="dashboard-section progress-section">
            <h3>📅 Monthly Progress</h3>
            <div class="progress-content">
              <div class="progress-chart">
                <canvas id="monthlyChart" width="400" height="200"></canvas>
              </div>
              
              <div class="progress-goals">
                <h4>🎯 Goals</h4>
                <div class="goals-list">
                  <div class="goal-item">
                    <span class="goal-label">Monthly Target:</span>
                    <div class="goal-progress">
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.getMonthlyProgress()}%"></div>
                      </div>
                      <span class="progress-text">${this.userStats.monthlyCount}/10</span>
                    </div>
                  </div>
                  
                  <div class="goal-item">
                    <span class="goal-label">Try New Wrapper:</span>
                    <div class="goal-status ${this.userStats.newWrapperThisMonth ? 'completed' : 'pending'}">
                      ${this.userStats.newWrapperThisMonth ? '✅ Completed' : '⏳ Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Personalized Recommendations -->
          <div class="dashboard-section recommendations-section">
            <h3>🎯 Personalized Recommendations</h3>
            <div class="recommendations-content">
              <div class="recommendation-categories">
                <div class="rec-category">
                  <h4>🌟 Based on Your Favorites</h4>
                  <div class="rec-list">
                    ${this.generatePersonalizedRecommendations('favorites')}
                  </div>
                </div>
                
                <div class="rec-category">
                  <h4>🆕 Try Something New</h4>
                  <div class="rec-list">
                    ${this.generatePersonalizedRecommendations('exploration')}
                  </div>
                </div>
                
                <div class="rec-category">
                  <h4>💰 Great Value Picks</h4>
                  <div class="rec-list">
                    ${this.generatePersonalizedRecommendations('value')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Create overlay and insert dashboard
    const overlay = document.createElement('div');
    overlay.className = 'dashboard-overlay';
    overlay.innerHTML = dashboardHTML;
    document.body.appendChild(overlay);

    this.addDashboardStyles();
  }

  addDashboardStyles() {
    if (document.getElementById('dashboard-styles')) return;

    const style = document.createElement('style');
    style.id = 'dashboard-styles';
    style.textContent = `
      .dashboard-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 2000;
        display: none;
        padding: 2rem;
        overflow-y: auto;
      }

      .dashboard-overlay.active {
        display: block;
      }

      .personal-dashboard {
        max-width: 1200px;
        margin: 0 auto;
        background: var(--secondary-bg);
        border-radius: var(--border-radius);
        border: 2px solid var(--accent-text);
        box-shadow: var(--shadow);
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 2px solid var(--border-color);
        background: var(--accent-bg);
      }

      .dashboard-header h2 {
        margin: 0;
        color: var(--accent-text);
        font-size: 1.5rem;
      }

      .close-dashboard {
        background: transparent;
        border: none;
        color: var(--primary-text);
        font-size: 2rem;
        cursor: pointer;
        padding: 0.5rem;
        transition: var(--transition);
      }

      .close-dashboard:hover {
        color: var(--accent-text);
      }

      .dashboard-content {
        padding: 2rem;
        display: grid;
        gap: 2rem;
      }

      .dashboard-section {
        background: rgba(44, 44, 44, 0.3);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        border: 1px solid var(--border-color);
      }

      .dashboard-section h3 {
        margin: 0 0 1.5rem 0;
        color: var(--accent-text);
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .stat-card {
        background: var(--accent-bg);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid var(--border-color);
        transition: var(--transition);
      }

      .stat-card:hover {
        border-color: var(--accent-text);
        background: rgba(198, 156, 109, 0.1);
      }

      .stat-icon {
        font-size: 2rem;
      }

      .stat-info {
        display: flex;
        flex-direction: column;
      }

      .stat-number {
        font-size: 1.8rem;
        font-weight: bold;
        color: var(--accent-text);
      }

      .stat-label {
        font-size: 0.9rem;
        color: var(--secondary-text);
      }

      .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }

      .action-card {
        background: var(--accent-bg);
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        color: var(--primary-text);
        font-family: inherit;
      }

      .action-card:hover {
        border-color: var(--accent-text);
        background: rgba(198, 156, 109, 0.1);
        transform: translateY(-2px);
      }

      .action-icon {
        font-size: 2rem;
      }

      .action-text {
        font-weight: bold;
        text-align: center;
      }

      .favorites-list {
        display: grid;
        gap: 1rem;
      }

      .favorite-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--accent-bg);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        transition: var(--transition);
        cursor: pointer;
      }

      .favorite-item:hover {
        border-color: var(--accent-text);
        background: rgba(198, 156, 109, 0.1);
      }

      .favorite-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .favorite-wrapper {
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        font-weight: bold;
        background: var(--accent-text);
        color: var(--primary-bg);
      }

      .favorite-rating {
        color: #ffd700;
        font-size: 1rem;
      }

      .activity-timeline {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .activity-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--accent-bg);
        border-radius: var(--border-radius);
        border-left: 4px solid var(--accent-text);
      }

      .activity-icon {
        font-size: 1.5rem;
        width: 40px;
        text-align: center;
      }

      .activity-details {
        flex: 1;
      }

      .activity-text {
        color: var(--primary-text);
        margin-bottom: 0.25rem;
      }

      .activity-time {
        color: var(--secondary-text);
        font-size: 0.8rem;
      }

      .preferences-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }

      .wrapper-chart {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .wrapper-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .wrapper-bar {
        flex: 1;
        margin: 0 1rem;
        height: 8px;
        background: var(--border-color);
        border-radius: 4px;
        overflow: hidden;
      }

      .wrapper-fill {
        height: 100%;
        background: var(--accent-text);
        border-radius: 4px;
        transition: width 0.5s ease;
      }

      .wrapper-percentage {
        color: var(--accent-text);
        font-weight: bold;
        min-width: 40px;
        text-align: right;
      }

      .insights-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .insight-item {
        padding: 1rem;
        background: rgba(198, 156, 109, 0.1);
        border-radius: var(--border-radius);
        border-left: 4px solid var(--accent-text);
      }

      .insight-title {
        font-weight: bold;
        color: var(--accent-text);
        margin-bottom: 0.5rem;
      }

      .insight-description {
        color: var(--secondary-text);
        font-size: 0.9rem;
      }

      .progress-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        align-items: start;
      }

      .progress-chart {
        background: var(--accent-bg);
        border-radius: var(--border-radius);
        padding: 1rem;
      }

      .goals-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .goal-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--accent-bg);
        border-radius: var(--border-radius);
      }

      .goal-label {
        font-weight: bold;
        color: var(--secondary-text);
      }

      .goal-progress {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 120px;
      }

      .progress-bar {
        flex: 1;
        height: 8px;
        background: var(--border-color);
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: var(--accent-text);
        border-radius: 4px;
        transition: width 0.5s ease;
      }

      .progress-text {
        font-size: 0.8rem;
        color: var(--accent-text);
        font-weight: bold;
        min-width: 40px;
      }

      .goal-status {
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        font-weight: bold;
      }

      .goal-status.completed {
        background: var(--success-color);
        color: white;
      }

      .goal-status.pending {
        background: var(--warning-color);
        color: var(--primary-bg);
      }

      .recommendation-categories {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .rec-category h4 {
        margin: 0 0 1rem 0;
        color: var(--accent-text);
        font-size: 1rem;
      }

      .rec-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .rec-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--accent-bg);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: var(--transition);
      }

      .rec-item:hover {
        border-color: var(--accent-text);
        background: rgba(198, 156, 109, 0.1);
      }

      .rec-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .rec-name {
        font-weight: bold;
        color: var(--primary-text);
      }

      .rec-reason {
        font-size: 0.8rem;
        color: var(--secondary-text);
      }

      .rec-score {
        background: var(--accent-text);
        color: var(--primary-bg);
        padding: 0.25rem 0.5rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        font-weight: bold;
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .dashboard-overlay {
          padding: 1rem;
        }

        .dashboard-content {
          padding: 1rem;
          gap: 1.5rem;
        }

        .stats-grid {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }

        .quick-actions-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .preferences-content {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .progress-content {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .recommendation-categories {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  setupEventListeners() {
    // Close dashboard
    const closeBtn = document.getElementById('closeDashboard');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hide();
      });
    }

    // Close on overlay click
    const overlay = document.querySelector('.dashboard-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.hide();
        }
      });
    }

    // Make personalDashboard globally accessible for onclick handlers
    window.personalDashboard = this;
  }

  // Data loading and management
  loadUserStats() {
    const defaultStats = {
      totalSmoked: 0,
      averageRating: 0,
      totalTime: 0,
      totalValue: 0,
      monthlyCount: 0,
      newWrapperThisMonth: false,
      wrapperDistribution: {
        'Maduro': 0,
        'Connecticut': 0,
        'Habano': 0,
        'Natural': 0,
        'Oscuro': 0
      },
      recentActivity: []
    };

    const saved = localStorage.getItem('userStats');
    return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
  }

  saveUserStats() {
    localStorage.setItem('userStats', JSON.stringify(this.userStats));
  }

  // Generation methods
  generateFavoritesList() {
    const favorites = this.getFavorites();
    
    if (favorites.length === 0) {
      return '<p class="no-data">No favorite cigars yet. Rate some cigars to see them here!</p>';
    }

    return favorites.map(cigar => `
      <div class="favorite-item" onclick="personalDashboard.focusOnCigar('${cigar.name}')">
        <div class="favorite-info">
          <span class="favorite-name">${cigar.name}</span>
          <span class="favorite-wrapper">${cigar.wrapper}</span>
        </div>
        <div class="favorite-rating">${this.generateStarRating(cigar.rating)}</div>
      </div>
    `).join('');
  }

  generateActivityTimeline() {
    const activities = this.userStats.recentActivity.slice(0, 5);
    
    if (activities.length === 0) {
      return '<p class="no-data">No recent activity. Start exploring cigars to see your journey!</p>';
    }

    return activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">${this.getActivityIcon(activity.type)}</div>
        <div class="activity-details">
          <div class="activity-text">${activity.text}</div>
          <div class="activity-time">${this.formatRelativeTime(activity.timestamp)}</div>
        </div>
      </div>
    `).join('');
  }

  generateWrapperChart() {
    const total = Object.values(this.userStats.wrapperDistribution).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
      return '<p class="no-data">Try some cigars to see your wrapper preferences!</p>';
    }

    return Object.entries(this.userStats.wrapperDistribution).map(([wrapper, count]) => {
      const percentage = Math.round((count / total) * 100);
      return `
        <div class="wrapper-item">
          <span class="wrapper-label">${wrapper}</span>
          <div class="wrapper-bar">
            <div class="wrapper-fill" style="width: ${percentage}%"></div>
          </div>
          <span class="wrapper-percentage">${percentage}%</span>
        </div>
      `;
    }).join('');
  }

  generateInsights() {
    const insights = this.calculateInsights();
    
    return insights.map(insight => `
      <div class="insight-item">
        <div class="insight-title">${insight.title}</div>
        <div class="insight-description">${insight.description}</div>
      </div>
    `).join('');
  }

  generatePersonalizedRecommendations(type) {
    const recommendations = this.getRecommendations(type);
    
    return recommendations.map(rec => `
      <div class="rec-item" onclick="personalDashboard.focusOnCigar('${rec.name}')">
        <div class="rec-info">
          <div class="rec-name">${rec.name}</div>
          <div class="rec-reason">${rec.reason}</div>
        </div>
        <div class="rec-score">${rec.score}%</div>
      </div>
    `).join('');
  }

  generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  }

  // Helper methods
  getFavorites() {
    const favorites = [];
    const cigars = this.dataManager.data.cigars || [];
    
    cigars.forEach(cigar => {
      const rating = this.getUserRating(cigar.name);
      if (rating >= 4) {
        favorites.push({
          name: cigar.name,
          wrapper: cigar.wrapper || 'Unknown',
          rating
        });
      }
    });
    
    return favorites.sort((a, b) => b.rating - a.rating).slice(0, 5);
  }

  getUserRating(cigarName) {
    const saved = localStorage.getItem(`rating_${cigarName}`);
    return saved ? parseInt(saved, 10) : 0;
  }

  getActivityIcon(type) {
    const icons = {
      'rated': '⭐',
      'noted': '📝',
      'session': '🎭',
      'wishlist': '❤️',
      'shared': '📤'
    };
    return icons[type] || '📊';
  }

  formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  calculateInsights() {
    const insights = [];
    const _favorites = this.getFavorites();
    const distribution = this.userStats.wrapperDistribution;
    
    // Wrapper preference insight
    const preferredWrapper = Object.entries(distribution).reduce((a, b) => distribution[a[0]] > distribution[b[0]] ? a : b);
    if (preferredWrapper[1] > 0) {
      insights.push({
        title: `${preferredWrapper[0]} Enthusiast`,
        description: `You've shown a strong preference for ${preferredWrapper[0]} wrappers, representing ${Math.round((preferredWrapper[1] / Object.values(distribution).reduce((a, b) => a + b, 0)) * 100)}% of your selections.`
      });
    }
    
    // Rating insight
    if (this.userStats.averageRating > 4) {
      insights.push({
        title: 'Discerning Palate',
        description: `Your average rating of ${this.userStats.averageRating.toFixed(1)} stars shows you have high standards and appreciate quality cigars.`
      });
    }
    
    // Time insight
    if (this.userStats.totalTime > 20) {
      insights.push({
        title: 'Dedicated Aficionado',
        description: `You've spent ${this.userStats.totalTime} hours enjoying cigars, showing true dedication to the craft.`
      });
    }

    return insights.length > 0 ? insights : [{
      title: 'Start Your Journey',
      description: 'Rate more cigars and track your sessions to unlock personalized insights!'
    }];
  }

  getRecommendations(type) {
    const cigars = this.dataManager.data.cigars || [];
    const favorites = this.getFavorites();
    const recommendations = [];

    switch (type) {
      case 'favorites':
        // Recommend similar cigars to favorites
        favorites.forEach(fav => {
          const similar = cigars.filter(c => 
            c.wrapper === fav.wrapper && 
            c.name !== fav.name
          ).slice(0, 2);
          
          similar.forEach(cigar => {
            recommendations.push({
              name: cigar.name,
              reason: `Similar to your favorite ${fav.name}`,
              score: 85 + Math.floor(Math.random() * 15)
            });
          });
        });
        break;
        
      case 'exploration': {
        // Recommend different wrapper types
        const triedWrappers = Object.keys(this.userStats.wrapperDistribution)
          .filter(w => this.userStats.wrapperDistribution[w] > 0);
        const untriedWrappers = ['Maduro', 'Connecticut', 'Habano', 'Natural', 'Oscuro']
          .filter(w => !triedWrappers.includes(w));
        
        untriedWrappers.forEach(wrapper => {
          const cigar = cigars.find(c => c.wrapper === wrapper);
          if (cigar) {
            recommendations.push({
              name: cigar.name,
              reason: `Try a ${wrapper} wrapper`,
              score: 75 + Math.floor(Math.random() * 20)
            });
          }
        });
        break;
      }
        
      case 'value': {
        // Recommend highly rated, reasonably priced cigars
        cigars.filter(c => c.price && c.price < 15)
          .slice(0, 3)
          .forEach(cigar => {
            recommendations.push({
              name: cigar.name,
              reason: `Great value at $${cigar.price}`,
              score: 80 + Math.floor(Math.random() * 15)
            });
          });
        break;
      }
    }

    return recommendations.slice(0, 3);
  }

  getMonthlyProgress() {
    return Math.min((this.userStats.monthlyCount / 10) * 100, 100);
  }

  // Public methods
  show() {
    this.updateStats();
    const overlay = document.querySelector('.dashboard-overlay');
    if (overlay) {
      overlay.classList.add('active');
      this.isVisible = true;
    }
  }

  hide() {
    const overlay = document.querySelector('.dashboard-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      this.isVisible = false;
    }
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  updateStats() {
    // Recalculate stats from stored data
    this.userStats = this.loadUserStats();
    
    // Update DOM elements
    const elements = {
      'totalCigarsSmoked': this.userStats.totalSmoked,
      'averageRating': this.userStats.averageRating.toFixed(1),
      'totalSmokeTime': this.userStats.totalTime,
      'totalValue': this.userStats.totalValue
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });

    // Update dynamic content
    const favoritesList = document.getElementById('favoritesList');
    if (favoritesList) {
      favoritesList.innerHTML = this.generateFavoritesList();
    }

    const activityTimeline = document.getElementById('activityTimeline');
    if (activityTimeline) {
      activityTimeline.innerHTML = this.generateActivityTimeline();
    }

    const wrapperChart = document.getElementById('wrapperChart');
    if (wrapperChart) {
      wrapperChart.innerHTML = this.generateWrapperChart();
    }
  }

  // Action methods
  startRandomSession() {
    this.hide();
    if (window.uiManager) {
      window.uiManager.navigateToSection('explore');
      // Trigger random cigar selection
      document.dispatchEvent(new CustomEvent('randomCigar'));
    }
  }

  showRecommendations() {
    this.hide();
    // Could open a recommendations modal or navigate to recommendations section
    if (window.uiManager) {
      window.uiManager.showToast('Personalized recommendations coming soon!', 'info');
    }
  }

  viewWishlist() {
    this.hide();
    // Show wishlist modal or navigate to wishlist section
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (window.uiManager) {
      if (wishlist.length === 0) {
        window.uiManager.showToast('Your wishlist is empty. Add some cigars!', 'info');
      } else {
        window.uiManager.showToast(`You have ${wishlist.length} cigars in your wishlist`, 'success');
      }
    }
  }

  exportData() {
    const userData = {
      stats: this.userStats,
      ratings: this.getAllRatings(),
      notes: this.getAllNotes(),
      sessions: this.getAllSessions(),
      wishlist: JSON.parse(localStorage.getItem('wishlist') || '[]')
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cigar-maestro-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    if (window.uiManager) {
      window.uiManager.showToast('Data exported successfully!', 'success');
    }
  }

  focusOnCigar(cigarName) {
    this.hide();
    
    // Focus on the cigar in the 3D scene
    if (window.cigarsInScene) {
      const cigar = window.cigarsInScene.find(c => c.userData.name === cigarName);
      if (cigar) {
        // Animate camera to cigar
        if (window.camera && window.controls) {
          window.controls.target.copy(cigar.position);
          window.camera.position.set(
            cigar.position.x + 15,
            cigar.position.y + 15,
            cigar.position.z + 15
          );
          window.controls.update();
        }

        // Show cigar details
        window.dispatchEvent(new CustomEvent('cigarSelected', {
          detail: { cigar }
        }));
      }
    }
  }

  getAllRatings() {
    const ratings = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('rating_')) {
        const cigarName = key.replace('rating_', '');
        ratings[cigarName] = parseInt(localStorage.getItem(key), 10);
      }
    }
    return ratings;
  }

  getAllNotes() {
    const notes = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('notes_')) {
        const cigarName = key.replace('notes_', '');
        notes[cigarName] = localStorage.getItem(key);
      }
    }
    return notes;
  }

  getAllSessions() {
    const sessions = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('sessions_')) {
        const cigarName = key.replace('sessions_', '');
        sessions[cigarName] = JSON.parse(localStorage.getItem(key) || '[]');
      }
    }
    return sessions;
  }

  // Methods to track user activity
  trackActivity(type, text) {
    this.userStats.recentActivity.unshift({
      type,
      text,
      timestamp: Date.now()
    });

    // Keep only recent 50 activities
    this.userStats.recentActivity = this.userStats.recentActivity.slice(0, 50);
    this.saveUserStats();
  }

  incrementCigarCount(wrapper) {
    this.userStats.totalSmoked++;
    this.userStats.monthlyCount++;
    
    if (this.userStats.wrapperDistribution[wrapper] !== undefined) {
      this.userStats.wrapperDistribution[wrapper]++;
    }
    
    this.saveUserStats();
  }

  updateAverageRating() {
    const ratings = this.getAllRatings();
    const values = Object.values(ratings).filter(r => r > 0);
    
    if (values.length > 0) {
      this.userStats.averageRating = values.reduce((a, b) => a + b, 0) / values.length;
    }
    
    this.saveUserStats();
  }
}

export default PersonalDashboard;