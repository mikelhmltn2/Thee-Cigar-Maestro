/**
 * Luxury Enhancements for Thee Cigar Maestro
 * Premium animations, micro-interactions, and visual depth effects
 * Part of Phase I Autonomous Upgrade
 */

class LuxuryEnhancementEngine {
  constructor() {
    this.animationObserver = null;
    this.luxuryEffects = new Map();
    this.premiumInteractions = new Set();
    this.parallaxElements = new Set();
    this.particleSystem = null;
    
    this.init();
  }

  /**
   * Initialize luxury enhancement system
   */
  init() {
    this.createLuxuryStyles();
    this.setupPremiumAnimations();
    this.initializeParallaxEffects();
    this.createParticleSystem();
    this.setupMicroInteractions();
    this.enhanceScrollExperience();
    this.addLuxuryTransitions();
    
    console.info('🏆 Luxury Enhancement Engine initialized');
  }

  /**
   * Create comprehensive luxury styling system
   */
  createLuxuryStyles() {
    const luxuryCSS = `
      <style id="luxury-enhancements">
        :root {
          /* Enhanced Luxury Palette */
          --luxury-gold-primary: #d4af37;
          --luxury-gold-secondary: #b8941f;
          --luxury-gold-accent: #ffd700;
          --luxury-gold-glow: rgba(212, 175, 55, 0.4);
          --luxury-brown-deep: #1a0f0a;
          --luxury-brown-rich: #2a1b14;
          --luxury-brown-warm: #3d2a1f;
          --luxury-leather: #4a3429;
          --luxury-cream: #f4f1e8;
          --luxury-mahogany: #c04000;
          
          /* Premium Shadows */
          --luxury-shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.15);
          --luxury-shadow-medium: 0 8px 32px rgba(0, 0, 0, 0.25);
          --luxury-shadow-deep: 0 16px 64px rgba(0, 0, 0, 0.4);
          --luxury-glow-gold: 0 0 30px var(--luxury-gold-glow);
          --luxury-glow-warm: 0 0 25px rgba(196, 64, 0, 0.3);
          
          /* Advanced Transitions */
          --luxury-ease-elegant: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          --luxury-ease-premium: cubic-bezier(0.23, 1, 0.32, 1);
          --luxury-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
          
          /* Glassmorphism Effects */
          --glass-bg: rgba(42, 27, 20, 0.25);
          --glass-border: rgba(212, 175, 55, 0.15);
          --glass-blur: blur(20px);
        }

        /* Premium Glassmorphism Components */
        .luxury-glass {
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          box-shadow: var(--luxury-shadow-medium);
        }

        .luxury-glass:hover {
          background: rgba(42, 27, 20, 0.35);
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateY(-2px);
          transition: all 0.4s var(--luxury-ease-premium);
        }

        /* Enhanced Button Interactions */
        .luxury-btn {
          position: relative;
          background: linear-gradient(135deg, var(--luxury-gold-primary), var(--luxury-gold-secondary));
          border: none;
          border-radius: 12px;
          color: var(--luxury-brown-deep);
          font-weight: 600;
          letter-spacing: 0.5px;
          padding: 14px 28px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s var(--luxury-ease-premium);
          box-shadow: var(--luxury-shadow-soft), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .luxury-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s var(--luxury-ease-premium);
        }

        .luxury-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: var(--luxury-shadow-deep), var(--luxury-glow-gold);
        }

        .luxury-btn:hover::before {
          left: 100%;
        }

        .luxury-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        /* Premium Card Animations */
        .luxury-card {
          background: linear-gradient(145deg, var(--luxury-brown-rich), var(--luxury-brown-warm));
          border-radius: 20px;
          padding: 24px;
          box-shadow: var(--luxury-shadow-medium);
          border: 1px solid rgba(212, 175, 55, 0.1);
          transition: all 0.4s var(--luxury-ease-premium);
          position: relative;
          overflow: hidden;
        }

        .luxury-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--luxury-gold-primary), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .luxury-card:hover {
          transform: translateY(-8px) rotateX(5deg);
          box-shadow: var(--luxury-shadow-deep), var(--luxury-glow-gold);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .luxury-card:hover::before {
          opacity: 1;
        }

        /* Floating Animation */
        @keyframes luxuryFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }

        .luxury-float {
          animation: luxuryFloat 6s ease-in-out infinite;
        }

        /* Gold Shimmer Effect */
        @keyframes goldShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .luxury-shimmer {
          background: linear-gradient(
            90deg,
            var(--luxury-gold-secondary) 0%,
            var(--luxury-gold-primary) 50%,
            var(--luxury-gold-accent) 100%
          );
          background-size: 200% 100%;
          animation: goldShimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Premium Loading States */
        .luxury-loading {
          position: relative;
          overflow: hidden;
        }

        .luxury-loading::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(212, 175, 55, 0.3),
            transparent
          );
          animation: luxuryLoading 2s infinite;
        }

        @keyframes luxuryLoading {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* Enhanced Focus States */
        .luxury-focus:focus-visible {
          outline: 2px solid var(--luxury-gold-primary);
          outline-offset: 4px;
          box-shadow: var(--luxury-glow-gold);
        }

        /* Scroll-triggered Animations */
        .luxury-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s var(--luxury-ease-premium);
        }

        .luxury-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .luxury-scale-reveal {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.6s var(--luxury-ease-bounce);
        }

        .luxury-scale-reveal.revealed {
          opacity: 1;
          transform: scale(1);
        }

        /* Premium Typography Effects */
        .luxury-text-glow {
          text-shadow: 
            0 0 10px var(--luxury-gold-glow),
            0 0 20px var(--luxury-gold-glow),
            0 0 30px var(--luxury-gold-glow);
        }

        .luxury-text-gradient {
          background: linear-gradient(45deg, var(--luxury-gold-primary), var(--luxury-gold-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Particle Background */
        .luxury-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: var(--luxury-gold-primary);
          border-radius: 50%;
          opacity: 0.3;
          animation: particleFloat 8s linear infinite;
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-10vh) translateX(100px);
            opacity: 0;
          }
        }

        /* Responsive Luxury Adjustments */
        @media (max-width: 768px) {
          .luxury-card:hover {
            transform: translateY(-4px);
          }
          
          .luxury-btn {
            padding: 12px 24px;
          }
          
          .particle {
            display: none;
          }
        }

        /* Performance Optimizations */
        .luxury-card,
        .luxury-btn,
        .luxury-glass {
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', luxuryCSS);
  }

  /**
   * Setup premium animation system
   */
  setupPremiumAnimations() {
    // Intersection Observer for scroll-triggered animations
    this.animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Auto-apply luxury classes to existing elements
    this.enhanceExistingElements();
  }

  /**
   * Enhance existing elements with luxury styling
   */
  enhanceExistingElements() {
    // Enhance buttons
    document.querySelectorAll('button, .btn').forEach(btn => {
      if (!btn.classList.contains('luxury-btn')) {
        btn.classList.add('luxury-btn', 'luxury-focus');
      }
    });

    // Enhance cards
    document.querySelectorAll('.card, .panel, .section').forEach(card => {
      if (!card.classList.contains('luxury-card')) {
        card.classList.add('luxury-card', 'luxury-reveal');
        this.animationObserver.observe(card);
      }
    });

    // Enhance headings
    document.querySelectorAll('h1, h2, h3').forEach(heading => {
      if (!heading.classList.contains('luxury-text-gradient')) {
        heading.classList.add('luxury-text-gradient');
      }
    });
  }

  /**
   * Create floating particle system
   */
  createParticleSystem() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'luxury-particles';
    document.body.appendChild(particleContainer);

    // Create floating particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
      
      particleContainer.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 10000);
    };

    // Create particles periodically
    setInterval(createParticle, 2000);
    
    // Create initial particles
    for (let i = 0; i < 10; i++) {
      setTimeout(createParticle, i * 500);
    }
  }

  /**
   * Setup micro-interactions
   */
  setupMicroInteractions() {
    // Enhanced hover effects for interactive elements
    document.addEventListener('mouseover', (e) => {
      const element = e.target;
      
      if (element.matches('a, button, .clickable')) {
        element.style.transform = 'translateY(-2px)';
        element.style.transition = 'transform 0.2s var(--luxury-ease-premium)';
      }
    });

    document.addEventListener('mouseout', (e) => {
      const element = e.target;
      
      if (element.matches('a, button, .clickable')) {
        element.style.transform = 'translateY(0)';
      }
    });

    // Click ripple effect
    document.addEventListener('click', (e) => {
      if (e.target.matches('.luxury-btn, .luxury-card')) {
        this.createRippleEffect(e);
      }
    });
  }

  /**
   * Create ripple effect on click
   */
  createRippleEffect(event) {
    const element = event.target;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(212, 175, 55, 0.6);
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      left: ${x - 10}px;
      top: ${y - 10}px;
      width: 20px;
      height: 20px;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);

    // Add ripple animation if not exists
    if (!document.getElementById('ripple-animation')) {
      const rippleCSS = `
        <style id="ripple-animation">
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        </style>
      `;
      document.head.insertAdjacentHTML('beforeend', rippleCSS);
    }
  }

  /**
   * Initialize parallax effects
   */
  initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
      this.parallaxElements.add(element);
    });

    // Parallax scroll handler
    const handleParallax = () => {
      const scrollY = window.pageYOffset;
      
      this.parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    };

    // Throttled scroll event
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Enhance scroll experience
   */
  enhanceScrollExperience() {
    // Smooth scrolling for internal links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });

    // Scroll progress indicator
    const createScrollIndicator = () => {
      const indicator = document.createElement('div');
      indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--luxury-gold-primary), var(--luxury-gold-accent));
        z-index: 10000;
        transition: width 0.1s ease-out;
        box-shadow: var(--luxury-glow-gold);
      `;
      document.body.appendChild(indicator);

      window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        indicator.style.width = scrollPercent + '%';
      });
    };

    createScrollIndicator();
  }

  /**
   * Add luxury transition effects
   */
  addLuxuryTransitions() {
    // Page transition effects
    const addPageTransition = () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, var(--luxury-brown-deep), var(--luxury-brown-rich));
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s ease;
      `;
      document.body.appendChild(overlay);

      return overlay;
    };

    // Enhanced loading state
    window.addEventListener('beforeunload', () => {
      const overlay = addPageTransition();
      overlay.style.opacity = '1';
    });
  }

  /**
   * Apply luxury enhancements to specific element
   */
  enhanceElement(element, type = 'auto') {
    if (!element) return;

    switch (type) {
      case 'button':
        element.classList.add('luxury-btn', 'luxury-focus');
        break;
      case 'card':
        element.classList.add('luxury-card', 'luxury-reveal');
        this.animationObserver.observe(element);
        break;
      case 'glass':
        element.classList.add('luxury-glass');
        break;
      case 'text':
        element.classList.add('luxury-text-gradient');
        break;
      case 'auto':
      default:
        this.autoEnhanceElement(element);
        break;
    }
  }

  /**
   * Auto-enhance element based on its type
   */
  autoEnhanceElement(element) {
    const tagName = element.tagName.toLowerCase();
    const classList = element.classList;

    if (tagName === 'button' || classList.contains('btn')) {
      this.enhanceElement(element, 'button');
    } else if (classList.contains('card') || classList.contains('panel')) {
      this.enhanceElement(element, 'card');
    } else if (tagName.match(/^h[1-6]$/)) {
      this.enhanceElement(element, 'text');
    }
  }

  /**
   * Create luxury notification system
   */
  createLuxuryNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 16px 20px;
      color: var(--luxury-cream);
      font-weight: 500;
      z-index: 10000;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.4s var(--luxury-ease-premium);
      box-shadow: var(--luxury-shadow-medium);
      max-width: 300px;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Animate out and remove
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100px)';
      setTimeout(() => notification.remove(), 400);
    }, duration);

    return notification;
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.animationObserver) {
      this.animationObserver.disconnect();
    }
    
    this.luxuryEffects.clear();
    this.premiumInteractions.clear();
    this.parallaxElements.clear();
    
    // Remove particle system
    const particles = document.querySelector('.luxury-particles');
    if (particles) {
      particles.remove();
    }
  }
}

// Auto-initialize and expose globally
const luxuryEngine = new LuxuryEnhancementEngine();
window.LuxuryEngine = luxuryEngine;

export default luxuryEngine;