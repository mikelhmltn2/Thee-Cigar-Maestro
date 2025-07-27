/**
 * Onboarding Tour System for Thee Cigar Maestro
 * Provides guided introduction to the application features
 */

class OnboardingTour {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.currentStep = 0;
    this.isActive = false;
    this.overlay = null;
    this.tooltip = null;
    
    this.steps = [
      {
        target: '.main-header',
        title: 'Welcome to Thee Cigar Maestro! 🚬',
        content: 'This is your main navigation. Use these sections to explore different aspects of cigar culture.',
        position: 'bottom',
        action: 'highlight'
      },
      {
        target: '.nav-button[data-section="explore"]',
        title: 'Explore Cigars 🌀',
        content: 'Start here to discover cigars in our interactive 3D visualization. Click on any cigar to learn more!',
        position: 'bottom',
        action: 'click'
      },
      {
        target: '.floating-controls',
        title: 'Filter Controls 🎛️',
        content: 'Use these filters to narrow down cigars by wrapper type. Try unchecking and checking different options.',
        position: 'right',
        action: 'highlight'
      },
      {
        target: '#aiChatBtn',
        title: 'AI Assistant 🤖',
        content: 'Need help or recommendations? Click here to chat with our AI cigar expert!',
        position: 'left',
        action: 'highlight'
      },
      {
        target: '.nav-button[data-section="education"]',
        title: 'Learn & Grow 📚',
        content: 'Expand your cigar knowledge with structured educational content and courses.',
        position: 'bottom',
        action: 'click'
      },
      {
        target: '.nav-button[data-section="pairings"]',
        title: 'Perfect Pairings 🍷',
        content: 'Discover the ideal beverages and foods to complement your cigar experience.',
        position: 'bottom',
        action: 'highlight'
      },
      {
        target: '.nav-button[data-section="journal"]',
        title: 'Your Journal 📝',
        content: 'Record your tasting experiences and build your personal cigar database.',
        position: 'bottom',
        action: 'highlight'
      },
      {
        target: '.info-display',
        title: 'Contextual Information ℹ️',
        content: 'This panel provides helpful information based on what you\'re currently doing.',
        position: 'right',
        action: 'highlight'
      },
      {
        target: '.canvas-container',
        title: 'Interactive 3D World 🌍',
        content: 'This is where the magic happens! Explore cigars in 3D space. Use your mouse to rotate, zoom, and navigate.',
        position: 'center',
        action: 'highlight'
      }
    ];
    
    this.mobileSteps = [
      {
        target: '.main-header',
        title: 'Welcome! 🚬',
        content: 'Tap the menu button (☰) to access all features on mobile.',
        position: 'bottom',
        action: 'highlight'
      },
      {
        target: '.mobile-menu-btn',
        title: 'Mobile Menu 📱',
        content: 'Tap here to open the navigation menu. You can also swipe right from the edge.',
        position: 'bottom',
        action: 'click'
      },
      {
        target: '.quick-actions',
        title: 'Quick Actions ⚡',
        content: 'These floating buttons give you quick access to key features.',
        position: 'left',
        action: 'highlight'
      },
      {
        target: '.canvas-container',
        title: 'Touch Controls 👆',
        content: 'Use touch gestures to explore: pinch to zoom, drag to rotate, tap to select cigars.',
        position: 'center',
        action: 'highlight'
      }
    ];
  }

  /**
   * Start the onboarding tour
   */
  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.currentStep = 0;
    
    // Choose appropriate steps based on device
    const isMobile = window.innerWidth <= 768;
    this.activeSteps = isMobile ? this.mobileSteps : this.steps;
    
    this.createOverlay();
    this.showStep(0);
    
    // Track tour start
    this.trackEvent('tour_started', { device: isMobile ? 'mobile' : 'desktop' });
  }

  /**
   * Show a specific step
   */
  showStep(stepIndex) {
    if (stepIndex >= this.activeSteps.length) {
      this.complete();
      return;
    }

    this.currentStep = stepIndex;
    const step = this.activeSteps[stepIndex];
    
    // Clear previous highlights
    this.clearHighlights();
    
    // Find target element
    const target = document.querySelector(step.target);
    if (!target) {
      console.warn(`Tour target not found: ${step.target}`);
      this.nextStep();
      return;
    }

    // Apply highlight effect
    this.highlightElement(target, step.action);
    
    // Show tooltip
    this.showTooltip(target, step);
    
    // Track step view
    this.trackEvent('tour_step_viewed', { 
      step: stepIndex, 
      target: step.target 
    });
  }

  /**
   * Go to next step
   */
  nextStep() {
    this.showStep(this.currentStep + 1);
  }

  /**
   * Go to previous step
   */
  previousStep() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }

  /**
   * Skip the tour
   */
  skip() {
    this.trackEvent('tour_skipped', { step: this.currentStep });
    this.complete();
  }

  /**
   * Complete the tour
   */
  complete() {
    this.isActive = false;
    this.clearHighlights();
    this.removeOverlay();
    this.removeTooltip();
    
    // Mark tour as completed
    localStorage.setItem('cigar-maestro-tour-completed', 'true');
    
    // Show completion message
    this.uiManager.showToast('Tour completed! Welcome to Thee Cigar Maestro! 🎉', 'success', 5000);
    
    // Track tour completion
    this.trackEvent('tour_completed', { total_steps: this.activeSteps.length });
  }

  /**
   * Create tour overlay
   */
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'tour-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10000;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(this.overlay);
    
    // Fade in
    setTimeout(() => {
      this.overlay.style.opacity = '1';
    }, 10);
  }

  /**
   * Remove tour overlay
   */
  removeOverlay() {
    if (this.overlay) {
      this.overlay.style.opacity = '0';
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
      }, 300);
    }
  }

  /**
   * Highlight an element
   */
  highlightElement(element, action = 'highlight') {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Create highlight box
    const highlight = document.createElement('div');
    highlight.className = 'tour-highlight';
    highlight.style.cssText = `
      position: absolute;
      top: ${rect.top + scrollTop - 10}px;
      left: ${rect.left + scrollLeft - 10}px;
      width: ${rect.width + 20}px;
      height: ${rect.height + 20}px;
      border: 3px solid #c69c6d;
      border-radius: 8px;
      background: rgba(198, 156, 109, 0.1);
      z-index: 10001;
      pointer-events: none;
      animation: tour-pulse 2s infinite;
      box-shadow: 0 0 20px rgba(198, 156, 109, 0.5);
    `;

    // Add animation styles if not already present
    if (!document.getElementById('tour-styles')) {
      const style = document.createElement('style');
      style.id = 'tour-styles';
      style.textContent = `
        @keyframes tour-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        .tour-highlight-clickable {
          cursor: pointer;
          pointer-events: auto !important;
        }
        
        .tour-tooltip {
          position: absolute;
          background: #1c1c1c;
          border: 2px solid #c69c6d;
          border-radius: 8px;
          padding: 1.5rem;
          max-width: 320px;
          z-index: 10002;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          color: #f0e6d2;
          font-family: Georgia, serif;
        }
        
        .tour-tooltip::before {
          content: '';
          position: absolute;
          border: 8px solid transparent;
        }
        
        .tour-tooltip.bottom::before {
          top: -16px;
          left: 50%;
          transform: translateX(-50%);
          border-bottom-color: #c69c6d;
        }
        
        .tour-tooltip.top::before {
          bottom: -16px;
          left: 50%;
          transform: translateX(-50%);
          border-top-color: #c69c6d;
        }
        
        .tour-tooltip.left::before {
          right: -16px;
          top: 50%;
          transform: translateY(-50%);
          border-left-color: #c69c6d;
        }
        
        .tour-tooltip.right::before {
          left: -16px;
          top: 50%;
          transform: translateY(-50%);
          border-right-color: #c69c6d;
        }
        
        .tour-tooltip.center {
          left: 50% !important;
          top: 50% !important;
          transform: translate(-50%, -50%) !important;
        }
        
        .tour-tooltip.center::before {
          display: none;
        }
      `;
      document.head.appendChild(style);
    }

    // Make clickable if needed
    if (action === 'click') {
      highlight.classList.add('tour-highlight-clickable');
      highlight.style.pointerEvents = 'auto';
      highlight.style.cursor = 'pointer';
      
      highlight.addEventListener('click', () => {
        element.click();
        setTimeout(() => this.nextStep(), 500);
      });
    }

    document.body.appendChild(highlight);
    this.currentHighlight = highlight;

    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Clear all highlights
   */
  clearHighlights() {
    if (this.currentHighlight) {
      this.currentHighlight.remove();
      this.currentHighlight = null;
    }
  }

  /**
   * Show tooltip for current step
   */
  showTooltip(target, step) {
    this.removeTooltip();

    const tooltip = document.createElement('div');
    tooltip.className = `tour-tooltip ${step.position}`;
    
    const stepNumber = this.currentStep + 1;
    const totalSteps = this.activeSteps.length;
    
    tooltip.innerHTML = `
      <div class="tour-tooltip-header">
        <h4 style="margin: 0 0 0.5rem 0; color: #c69c6d; font-size: 1.1rem;">
          ${step.title}
        </h4>
        <div style="font-size: 0.8rem; color: #a67856; margin-bottom: 1rem;">
          Step ${stepNumber} of ${totalSteps}
        </div>
      </div>
      <div class="tour-tooltip-content">
        <p style="margin: 0 0 1.5rem 0; line-height: 1.5;">
          ${step.content}
        </p>
      </div>
      <div class="tour-tooltip-actions">
        <button onclick="onboardingTour.skip()" 
                style="background: transparent; border: 1px solid #666; color: #f0e6d2; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">
          Skip Tour
        </button>
        ${stepNumber > 1 ? `
          <button onclick="onboardingTour.previousStep()" 
                  style="background: transparent; border: 1px solid #c69c6d; color: #c69c6d; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">
            Previous
          </button>
        ` : ''}
        <button onclick="onboardingTour.nextStep()" 
                style="background: #c69c6d; border: none; color: #121212; padding: 0.5rem 1.5rem; border-radius: 4px; cursor: pointer; font-weight: bold;">
          ${stepNumber === totalSteps ? 'Complete' : 'Next'}
        </button>
      </div>
    `;

    document.body.appendChild(tooltip);
    this.tooltip = tooltip;

    // Position tooltip
    this.positionTooltip(target, tooltip, step.position);
  }

  /**
   * Position tooltip relative to target
   */
  positionTooltip(target, tooltip, position) {
    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 20;

    let top, left;

    switch (position) {
      case 'bottom':
        top = rect.bottom + scrollTop + padding;
        left = rect.left + scrollLeft + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'top':
        top = rect.top + scrollTop - tooltipRect.height - padding;
        left = rect.left + scrollLeft + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = rect.top + scrollTop + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.left + scrollLeft - tooltipRect.width - padding;
        break;
      case 'right':
        top = rect.top + scrollTop + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.right + scrollLeft + padding;
        break;
      case 'center':
        top = window.innerHeight / 2 - tooltipRect.height / 2 + scrollTop;
        left = window.innerWidth / 2 - tooltipRect.width / 2 + scrollLeft;
        break;
    }

    // Keep tooltip within viewport
    const maxLeft = window.innerWidth - tooltipRect.width - 20;
    const maxTop = window.innerHeight - tooltipRect.height - 20;
    
    left = Math.max(20, Math.min(left, maxLeft));
    top = Math.max(20, Math.min(top, maxTop));

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  /**
   * Remove tooltip
   */
  removeTooltip() {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }

  /**
   * Check if user should see the tour
   */
  static shouldShowTour() {
    return !localStorage.getItem('cigar-maestro-tour-completed');
  }

  /**
   * Track tour events for analytics
   */
  trackEvent(event, data = {}) {
    // Basic event tracking - could be extended with analytics service
    console.log(`Tour Event: ${event}`, data);
    
    try {
      // Store tour analytics locally
      const analytics = JSON.parse(localStorage.getItem('cigar-maestro-tour-analytics') || '[]');
      analytics.push({
        event,
        data,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 50 events
      if (analytics.length > 50) {
        analytics.splice(0, analytics.length - 50);
      }
      
      localStorage.setItem('cigar-maestro-tour-analytics', JSON.stringify(analytics));
    } catch (error) {
      console.warn('Could not save tour analytics:', error);
    }
  }

  /**
   * Reset tour (for testing or user request)
   */
  static reset() {
    localStorage.removeItem('cigar-maestro-tour-completed');
    localStorage.removeItem('cigar-maestro-tour-analytics');
  }
}

export default OnboardingTour;