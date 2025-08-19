/**
 * Luxury Enhancement Module for Thee Cigar Maestro
 * Implements sophisticated UI improvements and premium brand elements
 */

export class LuxuryEnhancements {
  constructor() {
    this.isInitialized = false;
    this.animationQueue = [];
    this.luxuryConfig = {
      animationDuration: 400,
      transitionEasing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      hoverScale: 1.02,
      goldGlow: 'rgba(212, 175, 55, 0.3)',
      shadowLevels: {
        subtle: '0 2px 8px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 16px rgba(0, 0, 0, 0.2)',
        strong: '0 8px 32px rgba(0, 0, 0, 0.4)',
        gold: '0 4px 20px rgba(212, 175, 55, 0.3)',
      },
    };

    this.init();
  }

  async init() {
    if (this.isInitialized) return;

    console.log('✨ Initializing Luxury Enhancements...');

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeLuxury());
    } else {
      this.initializeLuxury();
    }
  }

  async initializeLuxury() {
    try {
      // Add luxury CSS classes and animations
      await this.injectLuxuryStyles();

      // Enhance typography
      await this.enhanceTypography();

      // Add sophisticated animations
      await this.addLuxuryAnimations();

      // Implement interactive enhancements
      await this.addInteractiveElements();

      // Add loading states and transitions
      await this.addLoadingEnhancements();

      // Initialize particle effects
      await this.initializeParticleEffects();

      this.isInitialized = true;
      console.log('✅ Luxury Enhancements initialized');
    } catch (error) {
      console.error('❌ Failed to initialize luxury enhancements:', error);
    }
  }

  async injectLuxuryStyles() {
    const luxuryCSS = `
      /* Luxury Enhancement Styles */
      .luxury-container {
        background: linear-gradient(135deg, var(--primary-bg) 0%, var(--secondary-bg) 35%, var(--deep-brown) 100%);
        position: relative;
        overflow: hidden;
      }

      .luxury-card {
        background: linear-gradient(145deg, var(--secondary-bg), var(--accent-bg));
        border: 1px solid rgba(212, 175, 55, 0.1);
        border-radius: var(--border-radius);
        padding: 2rem;
        position: relative;
        overflow: hidden;
        transition: all ${this.luxuryConfig.animationDuration}ms ${this.luxuryConfig.transitionEasing};
      }

      .luxury-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
        opacity: 0;
        transition: opacity ${this.luxuryConfig.animationDuration}ms ease;
      }

      .luxury-card:hover {
        transform: translateY(-4px) scale(${this.luxuryConfig.hoverScale});
        box-shadow: ${this.luxuryConfig.shadowLevels.gold};
        border-color: var(--gold-primary);
      }

      .luxury-card:hover::before {
        opacity: 1;
      }

      .luxury-text {
        background: linear-gradient(135deg, var(--cream-primary), var(--gold-primary));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .luxury-button {
        background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
        color: var(--primary-bg);
        border: none;
        padding: 0.875rem 2rem;
        border-radius: var(--border-radius-small);
        font-family: var(--font-display);
        font-weight: 600;
        letter-spacing: 0.025em;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all ${this.luxuryConfig.animationDuration}ms ${this.luxuryConfig.transitionEasing};
      }

      .luxury-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 600ms ease;
      }

      .luxury-button:hover::before {
        left: 100%;
      }

      .luxury-button:hover {
        transform: translateY(-2px);
        box-shadow: ${this.luxuryConfig.shadowLevels.gold};
      }

      .luxury-input {
        background: rgba(42, 27, 20, 0.8);
        border: 1px solid rgba(212, 175, 55, 0.2);
        border-radius: var(--border-radius-small);
        padding: 0.875rem 1rem;
        color: var(--cream-primary);
        font-family: var(--font-body);
        transition: all ${this.luxuryConfig.animationDuration}ms ease;
      }

      .luxury-input:focus {
        outline: none;
        border-color: var(--gold-primary);
        box-shadow: 0 0 0 2px ${this.luxuryConfig.goldGlow};
        background: rgba(42, 27, 20, 0.95);
      }

      .luxury-divider {
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
        margin: 2rem 0;
      }

      .luxury-glow {
        animation: luxuryGlow 3s ease-in-out infinite alternate;
      }

      @keyframes luxuryGlow {
        from {
          box-shadow: 0 0 20px ${this.luxuryConfig.goldGlow};
        }
        to {
          box-shadow: 0 0 40px ${this.luxuryConfig.goldGlow}, 0 0 80px rgba(212, 175, 55, 0.1);
        }
      }

      .luxury-fade-in {
        animation: luxuryFadeIn 0.8s ${this.luxuryConfig.transitionEasing} forwards;
      }

      @keyframes luxuryFadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .luxury-slide-in {
        animation: luxurySlideIn 0.6s ${this.luxuryConfig.transitionEasing} forwards;
      }

      @keyframes luxurySlideIn {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .luxury-particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--gold-primary);
        border-radius: 50%;
        opacity: 0.6;
        animation: luxuryFloat 6s ease-in-out infinite;
      }

      @keyframes luxuryFloat {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
          opacity: 0.6;
        }
        50% {
          transform: translateY(-20px) rotate(180deg);
          opacity: 1;
        }
      }

      .luxury-backdrop {
        backdrop-filter: blur(10px) saturate(1.1);
        background: rgba(26, 15, 10, 0.85);
        border: 1px solid rgba(212, 175, 55, 0.1);
      }

      .luxury-scroll-indicator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, var(--gold-primary), var(--gold-accent));
        transform: translateX(-100%);
        transition: transform 0.1s ease;
        z-index: 9999;
      }
    `;

    // Inject styles into document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = luxuryCSS;
    document.head.appendChild(styleSheet);
  }

  async enhanceTypography() {
    // Enhance headings with luxury styling
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      heading.classList.add('luxury-text');

      // Add staggered animation
      setTimeout(() => {
        heading.classList.add('luxury-fade-in');
      }, index * 100);
    });

    // Enhance important text elements
    const importantText = document.querySelectorAll('.brand-tagline, .hero-title, .section-title');
    importantText.forEach(element => {
      element.classList.add('luxury-text', 'luxury-glow');
    });
  }

  async addLuxuryAnimations() {
    // Add intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('luxury-fade-in');
        }
      });
    }, observerOptions);

    // Observe sections and cards
    const animatedElements = document.querySelectorAll('.section, .card, .feature-item');
    animatedElements.forEach(element => {
      observer.observe(element);
    });

    // Add scroll progress indicator
    this.addScrollProgressIndicator();
  }

  async addInteractiveElements() {
    // Convert existing buttons to luxury buttons
    const buttons = document.querySelectorAll('button, .btn, .button');
    buttons.forEach(button => {
      if (!button.classList.contains('luxury-button')) {
        button.classList.add('luxury-button');
      }
    });

    // Convert input fields to luxury inputs
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
    inputs.forEach(input => {
      input.classList.add('luxury-input');
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .cigar-card, .feature-card');
    cards.forEach(card => {
      card.classList.add('luxury-card');
    });

    // Add luxury dividers
    this.addLuxuryDividers();
  }

  async addLoadingEnhancements() {
    // Create luxury loading spinner
    const loadingHTML = `
      <div class="luxury-loading" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--primary-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
      ">
        <div style="
          width: 60px;
          height: 60px;
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-top: 2px solid var(--gold-primary);
          border-radius: 50%;
          animation: luxurySpinner 1s linear infinite;
        "></div>
      </div>
    `;

    // Add spinner animation
    const spinnerCSS = `
      @keyframes luxurySpinner {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    const spinnerStyle = document.createElement('style');
    spinnerStyle.textContent = spinnerCSS;
    document.head.appendChild(spinnerStyle);

    // Show loading for image lazy loading
    this.enhanceImageLoading();
  }

  async initializeParticleEffects() {
    // Add floating particles to hero section
    const heroSection = document.querySelector('.hero, .main-header, .luxury-container');
    if (heroSection) {
      this.createFloatingParticles(heroSection, 8);
    }
  }

  createFloatingParticles(container, count) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'luxury-particle';

      // Random positioning and animation delay
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = Math.random() * 4 + 4 + 's';

      container.appendChild(particle);
    }
  }

  addScrollProgressIndicator() {
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'luxury-scroll-indicator';
    document.body.appendChild(progressIndicator);

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressIndicator.style.transform = `translateX(${scrolled - 100}%)`;
    });
  }

  addLuxuryDividers() {
    const sections = document.querySelectorAll('section, .section');
    sections.forEach((section, index) => {
      if (index > 0) {
        const divider = document.createElement('div');
        divider.className = 'luxury-divider';
        section.parentNode.insertBefore(divider, section);
      }
    });
  }

  enhanceImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';

        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });
      }
    });
  }

  // Public methods for dynamic enhancements
  addLuxuryCard(element) {
    element.classList.add('luxury-card', 'luxury-fade-in');
  }

  addLuxuryButton(element) {
    element.classList.add('luxury-button');
  }

  addLuxuryText(element) {
    element.classList.add('luxury-text');
  }

  addLuxuryAnimation(element, animationType = 'fade-in') {
    element.classList.add(`luxury-${animationType}`);
  }

  createLuxuryToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, var(--secondary-bg), var(--accent-bg));
      color: var(--cream-primary);
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius);
      border: 1px solid var(--gold-primary);
      box-shadow: ${this.luxuryConfig.shadowLevels.gold};
      z-index: 10000;
      font-family: var(--font-body);
      backdrop-filter: blur(10px);
      animation: luxurySlideIn 0.5s ease forwards;
    `;

    toast.textContent = message;
    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'luxuryFadeIn 0.5s ease reverse forwards';
      setTimeout(() => toast.remove(), 500);
    }, 3000);

    return toast;
  }

  // Performance optimization
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Cleanup method
  destroy() {
    // Remove event listeners and cleanup
    window.removeEventListener('scroll', this.scrollHandler);

    // Remove luxury elements
    document.querySelectorAll('.luxury-particle').forEach(p => p.remove());
    document.querySelector('.luxury-scroll-indicator')?.remove();

    this.isInitialized = false;
  }
}

// Auto-initialize when module loads
const luxuryEnhancements = new LuxuryEnhancements();

// Export for manual control
export default luxuryEnhancements;
