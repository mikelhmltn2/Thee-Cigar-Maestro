/**
 * UI Enhancements for Thee Cigar Maestro
 * Loading states, error handling, skeletons, and mobile gestures
 */

class UIEnhancementManager {
  constructor() {
    this.loadingStates = new Map();
    this.errorStates = new Map();
    this.gestureHandlers = new Map();
    this.touchStartTime = 0;
    this.touchStartPos = { x: 0, y: 0 };
    
    this.init();
  }

  /**
   * Initialize UI enhancements
   */
  init() {
    this.createLoadingComponents();
    this.createErrorComponents();
    this.setupMobileGestures();
    this.setupAccessibilityFeatures();
    this.setupKeyboardNavigation();
    this.createToastSystem();
    
    console.info('✨ UI Enhancement Manager initialized');
  }

  /**
   * Create loading component templates
   */
  createLoadingComponents() {
    // Create CSS for loading animations
    const loadingStyles = `
      <style id="loading-styles">
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(18, 18, 18, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          backdrop-filter: blur(5px);
        }
        
        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 3px solid #444;
          border-top: 3px solid #c69c6d;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .loading-skeleton {
          background: linear-gradient(90deg, #2c2c2c 25%, #3c3c3c 50%, #2c2c2c 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }
        
        .skeleton-text {
          height: 16px;
          margin: 8px 0;
        }
        
        .skeleton-title {
          height: 24px;
          width: 60%;
          margin: 12px 0;
        }
        
        .skeleton-card {
          height: 200px;
          margin: 16px 0;
          border-radius: 8px;
        }
        
        .skeleton-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        
        .fade-out {
          animation: fadeOut 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .loading-dots {
          display: flex;
          gap: 4px;
        }
        
        .loading-dot {
          width: 8px;
          height: 8px;
          background: #c69c6d;
          border-radius: 50%;
          animation: loading-dot 1.4s infinite ease-in-out;
        }
        
        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes loading-dot {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      </style>
    `;
    
    if (!document.getElementById('loading-styles')) {
      document.head.insertAdjacentHTML('beforeend', loadingStyles);
    }
  }

  /**
   * Create error component templates
   */
  createErrorComponents() {
    const errorStyles = `
      <style id="error-styles">
        .error-container {
          background: rgba(220, 20, 60, 0.1);
          border: 1px solid rgba(220, 20, 60, 0.3);
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          color: #f0e6d2;
        }
        
        .error-title {
          font-weight: bold;
          color: #dc143c;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .error-message {
          margin-bottom: 12px;
          line-height: 1.5;
        }
        
        .error-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .error-btn {
          background: #c69c6d;
          color: #121212;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-family: Georgia, serif;
          transition: background 0.2s;
        }
        
        .error-btn:hover {
          background: #dab785;
        }
        
        .error-btn.secondary {
          background: transparent;
          color: #c69c6d;
          border: 1px solid #c69c6d;
        }
        
        .error-btn.secondary:hover {
          background: rgba(198, 156, 109, 0.1);
        }
        
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #2c2c2c;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 16px;
          max-width: 400px;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }
        
        .toast.show {
          transform: translateX(0);
        }
        
        .toast.success {
          border-color: #28a745;
        }
        
        .toast.error {
          border-color: #dc143c;
        }
        
        .toast.warning {
          border-color: #ffc107;
        }
        
        .toast-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .toast-title {
          font-weight: bold;
          color: #c69c6d;
        }
        
        .toast-close {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
          width: 24px;
          height: 24px;
        }
        
        .toast-close:hover {
          color: #999;
        }
        
        @media (max-width: 768px) {
          .toast {
            right: 10px;
            left: 10px;
            max-width: none;
          }
          
          .error-actions {
            flex-direction: column;
          }
          
          .error-btn {
            width: 100%;
            text-align: center;
          }
        }
      </style>
    `;
    
    if (!document.getElementById('error-styles')) {
      document.head.insertAdjacentHTML('beforeend', errorStyles);
    }
  }

  /**
   * Show loading state
   */
  showLoading(elementId, type = 'spinner') {
    const element = document.getElementById(elementId);
    if (!element) {return;}

    this.loadingStates.set(elementId, true);
    
    // Store original content
    if (!element.dataset.originalContent) {
      element.dataset.originalContent = element.innerHTML;
    }

    let loadingHTML;
    switch (type) {
      case 'skeleton':
        loadingHTML = this.createSkeletonLoader(element);
        break;
      case 'dots':
        loadingHTML = `
          <div class="loading-dots">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        `;
        break;
      case 'overlay':
        loadingHTML = `
          <div class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
        `;
        break;
      default:
        loadingHTML = '<div class="loading-spinner"></div>';
    }

    if (type === 'overlay') {
      document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
      element.innerHTML = loadingHTML;
      element.classList.add('loading');
    }
  }

  /**
   * Hide loading state
   */
  hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {return;}

    this.loadingStates.delete(elementId);
    
    // Remove overlay if it exists
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.remove();
    }

    // Restore original content
    if (element.dataset.originalContent) {
      element.innerHTML = element.dataset.originalContent;
      element.classList.remove('loading');
      element.classList.add('fade-in');
      
      // Remove fade-in class after animation
      setTimeout(() => {
        element.classList.remove('fade-in');
      }, 300);
    }
  }

  /**
   * Create skeleton loader based on element content
   */
  createSkeletonLoader(element) {
    const rect = element.getBoundingClientRect();
    const height = rect.height || 200;
    
    if (height < 50) {
      return '<div class="loading-skeleton skeleton-text"></div>';
    } else if (height < 100) {
      return `
        <div class="loading-skeleton skeleton-title"></div>
        <div class="loading-skeleton skeleton-text"></div>
      `;
    } else {
      return `
        <div class="loading-skeleton skeleton-title"></div>
        <div class="loading-skeleton skeleton-text"></div>
        <div class="loading-skeleton skeleton-text" style="width: 80%;"></div>
        <div class="loading-skeleton skeleton-text" style="width: 60%;"></div>
      `;
    }
  }

  /**
   * Show error state
   */
  showError(elementId, error) {
    const element = document.getElementById(elementId);
    if (!element) {return;}

    this.errorStates.set(elementId, error);
    
    const errorHTML = `
      <div class="error-container">
        <div class="error-title">
          ⚠️ ${error.title || 'Something went wrong'}
        </div>
        <div class="error-message">
          ${error.message || 'An unexpected error occurred. Please try again.'}
        </div>
        <div class="error-actions">
          <button class="error-btn" onclick="uiManager.retryAction('${elementId}')">
            Try Again
          </button>
          ${error.showDetails ? `
            <button class="error-btn secondary" onclick="uiManager.showErrorDetails('${elementId}')">
              Show Details
            </button>
          ` : ''}
        </div>
      </div>
    `;

    element.innerHTML = errorHTML;
    element.classList.add('error-state');
  }

  /**
   * Clear error state
   */
  clearError(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {return;}

    this.errorStates.delete(elementId);
    element.classList.remove('error-state');
  }

  /**
   * Setup mobile gesture handlers
   */
  setupMobileGestures() {
    // Swipe detection
    document.addEventListener('touchstart', (e) => {
      this.touchStartTime = Date.now();
      this.touchStartPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndTime = Date.now();
      const touchEndPos = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };

      const timeDiff = touchEndTime - this.touchStartTime;
      const distanceX = touchEndPos.x - this.touchStartPos.x;
      const distanceY = touchEndPos.y - this.touchStartPos.y;

      // Swipe detection (minimum 100px distance, maximum 300ms duration)
      if (timeDiff < 300 && Math.abs(distanceX) > 100) {
        const direction = distanceX > 0 ? 'right' : 'left';
        this.handleSwipe(direction, e.target);
      }

      // Pull to refresh detection
      if (distanceY > 100 && window.scrollY === 0 && timeDiff < 500) {
        this.handlePullToRefresh();
      }
    }, { passive: true });

    // Enhanced tap handling for better mobile experience
    let tapCount = 0;
    let tapTimer = null;

    document.addEventListener('touchend', (e) => {
      tapCount++;
      
      if (tapCount === 1) {
        tapTimer = setTimeout(() => {
          // Single tap
          this.handleTap(e.target);
          tapCount = 0;
        }, 250);
      } else if (tapCount === 2) {
        // Double tap
        clearTimeout(tapTimer);
        this.handleDoubleTap(e.target);
        tapCount = 0;
      }
    }, { passive: true });

    console.info('✅ Mobile gesture handlers initialized');
  }

  /**
   * Handle swipe gestures
   */
  handleSwipe(direction, target) {
    // Check if we're in a modal or panel
    const modal = target.closest('#modal, #educationPanel, #pairingPanel, #loungePanel');
    
    if (modal) {
      if (direction === 'left') {
        // Close modal/panel on left swipe
        modal.style.display = 'none';
        this.showToast('Panel closed', 'info');
      }
    }

    // Custom gesture handlers
    const customHandler = this.gestureHandlers.get(`swipe_${direction}`);
    if (customHandler) {
      customHandler(target);
    }

    // Track gesture analytics
    if (window.analyticsManager) {
      window.analyticsManager.trackEvent('mobile_gesture', {
        type: 'swipe',
        direction,
        element: target.tagName
      });
    }
  }

  /**
   * Handle pull to refresh
   */
  handlePullToRefresh() {
    this.showToast('Refreshing...', 'info');
    
    // Simulate refresh
    setTimeout(() => {
      window.location.reload();
    }, 500);

    if (window.analyticsManager) {
      window.analyticsManager.trackEvent('mobile_gesture', {
        type: 'pull_to_refresh'
      });
    }
  }

  /**
   * Handle tap gestures
   */
  handleTap(target) {
    // Add visual feedback for taps
    this.addTapFeedback(target);
  }

  /**
   * Handle double tap gestures
   */
  handleDoubleTap(target) {
    // Check if target is a cigar star in 3D scene
    if (target.closest('canvas')) {
      // Toggle favorite on double tap
      this.handleFavoriteToggle(target);
    }

    if (window.analyticsManager) {
      window.analyticsManager.trackEvent('mobile_gesture', {
        type: 'double_tap',
        element: target.tagName
      });
    }
  }

  /**
   * Add visual feedback for taps
   */
  addTapFeedback(target) {
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(198, 156, 109, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
      z-index: 1000;
    `;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${rect.left + rect.width / 2 - size / 2}px`;
    ripple.style.top = `${rect.top + rect.height / 2 - size / 2}px`;

    document.body.appendChild(ripple);

    // Add ripple animation CSS if not exists
    if (!document.getElementById('ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Setup accessibility features
   */
  setupAccessibilityFeatures() {
    // High contrast mode detection
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      document.body.classList.add('high-contrast');
    }

    // Reduced motion detection
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
      
      // Disable animations for users who prefer reduced motion
      const style = document.createElement('style');
      style.textContent = `
        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Focus management for keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    console.info('✅ Accessibility features initialized');
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Escape key to close modals
      if (e.key === 'Escape') {
        const openModal = document.querySelector('#modal[style*="block"], #educationPanel[style*="block"], #pairingPanel[style*="block"]');
        if (openModal) {
          openModal.style.display = 'none';
          e.preventDefault();
        }
      }

      // Arrow keys for navigation in 3D scene
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleKeyboardNavigation(e.key);
        e.preventDefault();
      }

      // Space bar for selection
      if (e.key === ' ' && e.target.tagName === 'BUTTON') {
        e.target.click();
        e.preventDefault();
      }
    });

    console.info('✅ Keyboard navigation initialized');
  }

  /**
   * Create toast notification system
   */
  createToastSystem() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const toastId = `toast_${Date.now()}`;
    toast.innerHTML = `
      <div class="toast-header">
        <div class="toast-title">${this.getToastIcon(type)} ${this.getToastTitle(type)}</div>
        <button class="toast-close" onclick="uiManager.closeToast('${toastId}')">&times;</button>
      </div>
      <div class="toast-message">${message}</div>
    `;
    
    toast.id = toastId;
    document.getElementById('toast-container').appendChild(toast);
    
    // Trigger show animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Auto remove toast
    setTimeout(() => {
      this.closeToast(toastId);
    }, duration);

    return toastId;
  }

  /**
   * Close toast notification
   */
  closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }
  }

  /**
   * Get toast icon by type
   */
  getToastIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }

  /**
   * Get toast title by type
   */
  getToastTitle(type) {
    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };
    return titles[type] || 'Notification';
  }

  /**
   * Register custom gesture handler
   */
  registerGestureHandler(gesture, handler) {
    this.gestureHandlers.set(gesture, handler);
  }

  /**
   * Retry action for error recovery
   */
  retryAction(elementId) {
    const error = this.errorStates.get(elementId);
    if (error && error.retryFunction) {
      this.clearError(elementId);
      this.showLoading(elementId, 'spinner');
      error.retryFunction();
    }
  }

  /**
   * Show error details
   */
  showErrorDetails(elementId) {
    const error = this.errorStates.get(elementId);
    if (error && error.details) {
      this.showToast(`Details: ${error.details}`, 'info', 5000);
    }
  }

  /**
   * Handle keyboard navigation in 3D scene
   */
  handleKeyboardNavigation(key) {
    // This would integrate with the 3D scene controls
    if (window.analyticsManager) {
      window.analyticsManager.trackEvent('keyboard_navigation', {
        key
      });
    }
  }

  /**
   * Handle favorite toggle for cigar items
   */
  handleFavoriteToggle(_target) {
    // This would integrate with the favorites system
    this.showToast('Favorite toggled!', 'success', 1500);
  }

  /**
   * Utility method to check if device supports touch
   */
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Get current loading states
   */
  getLoadingStates() {
    return Array.from(this.loadingStates.keys());
  }

  /**
   * Get current error states
   */
  getErrorStates() {
    return Array.from(this.errorStates.entries());
  }
}

// Initialize UI enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.uiManager = new UIEnhancementManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIEnhancementManager;
}