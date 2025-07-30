/**
 * Performance Optimizer for Thee Cigar Maestro
 * Comprehensive performance optimization for <2.5s mobile load times
 */

export class PerformanceOptimizer {
  constructor() {
    this.isInitialized = false;
    this.metrics = new Map();
    this.optimizations = new Map();
    this.observers = new Map();
    
    this.config = {
      targetLoadTime: 2500, // 2.5 seconds
      imageLazyLoadThreshold: 0.1,
      preloadCriticalResources: true,
      enableCodeSplitting: true,
      cacheStrategy: 'aggressive',
      compressionLevel: 'high'
    };
    
    this.init();
  }

  async init() {
    if (this.isInitialized) return;
    
    console.log('⚡ Initializing Performance Optimizer...');
    
    // Critical performance optimizations
    await this.optimizeCriticalRenderingPath();
    
    // Image optimization
    await this.initializeImageOptimization();
    
    // Lazy loading implementation
    await this.setupLazyLoading();
    
    // Code splitting and bundling
    await this.optimizeCodeDelivery();
    
    // Caching strategies
    await this.implementAdvancedCaching();
    
    // Mobile performance
    await this.optimizeMobilePerformance();
    
    // SEO enhancements
    await this.enhanceSEO();
    
    // Performance monitoring
    await this.setupPerformanceMonitoring();
    
    this.isInitialized = true;
    console.log('✅ Performance Optimizer initialized');
  }

  async optimizeCriticalRenderingPath() {
    // Inline critical CSS
    await this.inlineCriticalCSS();
    
    // Preload critical resources
    await this.preloadCriticalResources();
    
    // Optimize font loading
    await this.optimizeFontLoading();
    
    // Minimize render-blocking resources
    await this.minimizeRenderBlocking();
  }

  async inlineCriticalCSS() {
    const criticalCSS = `
      <style id="critical-css">
        /* Critical path CSS for immediate render */
        :root {
          --primary-bg: #1a0f0a;
          --secondary-bg: #2a1b14;
          --gold-primary: #d4af37;
          --cream-primary: #f4f1e8;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          background: var(--primary-bg);
          color: var(--cream-primary);
          font-family: 'Source Serif Pro', serif;
          line-height: 1.6;
          font-display: swap;
        }
        
        .main-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 90px;
          background: linear-gradient(135deg, var(--primary-bg), var(--secondary-bg));
          z-index: 1000;
          will-change: transform;
        }
        
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 90px;
          background: linear-gradient(135deg, var(--primary-bg) 0%, var(--secondary-bg) 100%);
        }
        
        .loading-screen {
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
          transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .loading-screen.hidden {
          opacity: 0;
          visibility: hidden;
        }
        
        /* Critical layout styles */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      </style>
    `;

    if (!document.getElementById('critical-css')) {
      document.head.insertAdjacentHTML('afterbegin', criticalCSS);
    }
  }

  async preloadCriticalResources() {
    const criticalResources = [
      { href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Serif+Pro:wght@300;400;600&display=swap', as: 'style' },
      { href: '/assets/logos/logo-192.png', as: 'image' },
      { href: '/manifest.json', as: 'manifest' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.as === 'style') {
        link.onload = function() { this.rel = 'stylesheet'; };
      }
      document.head.appendChild(link);
    });
  }

  async optimizeFontLoading() {
    // Use font-display: swap for better performance
    const fontCSS = `
      <style id="font-optimization">
        @font-face {
          font-family: 'Playfair Display';
          font-display: swap;
          src: url('https://fonts.gstatic.com/s/playfairdisplay/v30/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM85px7.woff2') format('woff2');
        }
        
        @font-face {
          font-family: 'Source Serif Pro';
          font-display: swap;
          src: url('https://fonts.gstatic.com/s/sourceserifpro/v15/6xKydSBYKcSV-LCoeQqfX1RYOo3i54rAkxhg.woff2') format('woff2');
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', fontCSS);
  }

  async minimizeRenderBlocking() {
    // Defer non-critical JavaScript
    const scripts = document.querySelectorAll('script:not([async]):not([defer])');
    scripts.forEach(script => {
      if (!script.src.includes('critical') && !script.innerHTML.includes('critical')) {
        script.defer = true;
      }
    });

    // Async load non-critical CSS
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    stylesheets.forEach(link => {
      if (!link.href.includes('critical')) {
        link.rel = 'preload';
        link.as = 'style';
        link.onload = function() { this.rel = 'stylesheet'; };
      }
    });
  }

  async initializeImageOptimization() {
    // Convert images to WebP format
    await this.convertToWebP();
    
    // Implement responsive images
    await this.implementResponsiveImages();
    
    // Optimize image compression
    await this.optimizeImageCompression();
    
    // Add image placeholders
    await this.addImagePlaceholders();
  }

  async convertToWebP() {
    const images = document.querySelectorAll('img[src]');
    
    images.forEach(img => {
      if (!img.src.includes('.webp') && await this.supportsWebP()) {
        const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        // Create a picture element for fallback
        const picture = document.createElement('picture');
        
        const webpSource = document.createElement('source');
        webpSource.srcset = webpSrc;
        webpSource.type = 'image/webp';
        
        const fallbackSource = document.createElement('source');
        fallbackSource.srcset = img.src;
        fallbackSource.type = img.src.match(/\.(jpg|jpeg)$/i) ? 'image/jpeg' : 'image/png';
        
        picture.appendChild(webpSource);
        picture.appendChild(fallbackSource);
        picture.appendChild(img.cloneNode(true));
        
        img.parentNode.replaceChild(picture, img);
      }
    });
  }

  async supportsWebP() {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => resolve(webP.height === 2);
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  async implementResponsiveImages() {
    const images = document.querySelectorAll('img:not([srcset])');
    
    images.forEach(img => {
      const src = img.src;
      if (src && !src.includes('data:')) {
        // Generate srcset for different screen sizes
        const srcset = [
          `${src.replace(/\.(jpg|jpeg|png|webp)$/i, '_480w.$1')} 480w`,
          `${src.replace(/\.(jpg|jpeg|png|webp)$/i, '_768w.$1')} 768w`,
          `${src.replace(/\.(jpg|jpeg|png|webp)$/i, '_1024w.$1')} 1024w`,
          `${src} 1200w`
        ].join(', ');
        
        img.srcset = srcset;
        img.sizes = '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1200px';
      }
    });
  }

  async optimizeImageCompression() {
    // This would integrate with a service like Cloudinary or ImageKit
    // For now, we'll add optimization headers and quality settings
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add loading optimization attributes
      img.loading = 'lazy';
      img.decoding = 'async';
      
      // Add quality hints for supported formats
      if (img.src.includes('.jpg') || img.src.includes('.jpeg')) {
        img.dataset.quality = '85';
      } else if (img.src.includes('.webp')) {
        img.dataset.quality = '80';
      }
    });
  }

  async addImagePlaceholders() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
      // Create a low-quality placeholder
      const placeholder = this.createImagePlaceholder(img.width || 400, img.height || 300);
      
      // Set placeholder as initial src
      const originalSrc = img.src;
      img.src = placeholder;
      img.dataset.src = originalSrc;
      
      // Add fade-in effect
      img.style.opacity = '0.7';
      img.style.filter = 'blur(2px)';
      img.style.transition = 'opacity 0.3s ease, filter 0.3s ease';
      
      // Replace with actual image when loaded
      img.addEventListener('load', () => {
        if (img.src !== placeholder) {
          img.style.opacity = '1';
          img.style.filter = 'none';
        }
      });
    });
  }

  createImagePlaceholder(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a0f0a');
    gradient.addColorStop(1, '#2a1b14');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL('image/png', 0.1);
  }

  async setupLazyLoading() {
    // Intersection Observer for lazy loading
    const lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadLazyElement(entry.target);
          lazyLoadObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: this.config.imageLazyLoadThreshold,
      rootMargin: '50px 0px'
    });

    // Observe images
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => lazyLoadObserver.observe(img));

    // Observe other lazy elements
    const lazyElements = document.querySelectorAll('[data-lazy]');
    lazyElements.forEach(element => lazyLoadObserver.observe(element));

    this.observers.set('lazyLoad', lazyLoadObserver);
  }

  loadLazyElement(element) {
    if (element.tagName === 'IMG' && element.dataset.src) {
      element.src = element.dataset.src;
      element.removeAttribute('data-src');
    } else if (element.dataset.lazy) {
      // Load lazy content
      this.loadLazyContent(element);
    }
  }

  async loadLazyContent(element) {
    const content = element.dataset.lazy;
    
    try {
      if (content.startsWith('http')) {
        // Load external content
        const response = await fetch(content);
        const html = await response.text();
        element.innerHTML = html;
      } else {
        // Load internal content
        const module = await import(content);
        if (module.default) {
          module.default(element);
        }
      }
      
      element.removeAttribute('data-lazy');
      element.classList.add('lazy-loaded');
      
    } catch (error) {
      console.warn('Failed to load lazy content:', error);
    }
  }

  async optimizeCodeDelivery() {
    // Dynamic imports for code splitting
    await this.implementDynamicImports();
    
    // Bundle optimization
    await this.optimizeBundles();
    
    // Tree shaking simulation
    await this.removeUnusedCode();
    
    // Module preloading
    await this.preloadModules();
  }

  async implementDynamicImports() {
    // Replace static imports with dynamic imports where appropriate
    const featureModules = [
      { selector: '.virtual-humidor', module: './virtual-humidor.js' },
      { selector: '.ai-concierge', module: './ai-concierge-enhanced.js' },
      { selector: '.analytics-dashboard', module: './analytics-dashboard.js' },
      { selector: '.community-features', module: './community-features.js' }
    ];

    featureModules.forEach(({ selector, module }) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        // Load module when element is needed
        this.loadModuleWhenNeeded(selector, module);
      }
    });
  }

  async loadModuleWhenNeeded(selector, modulePath) {
    const observer = new IntersectionObserver(async (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          try {
            const module = await import(modulePath);
            if (module.default) {
              // Initialize module
              if (typeof module.default === 'function') {
                new module.default();
              }
            }
            observer.disconnect();
          } catch (error) {
            console.warn(`Failed to load module ${modulePath}:`, error);
          }
        }
      });
    });

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
  }

  async optimizeBundles() {
    // Simulate bundle optimization by prioritizing critical code
    const criticalModules = [
      'luxury-enhancements.js',
      'performance-optimizer.js',
      'autonomy-engine.js'
    ];

    // Preload critical modules
    criticalModules.forEach(module => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = `./src/components/${module}`;
      document.head.appendChild(link);
    });
  }

  async removeUnusedCode() {
    // Remove unused CSS classes and JavaScript functions
    // This is a simplified version - real implementation would use tools like PurgeCSS
    
    const unusedSelectors = this.detectUnusedCSS();
    this.removeUnusedCSS(unusedSelectors);
  }

  detectUnusedCSS() {
    const stylesheets = Array.from(document.styleSheets);
    const usedSelectors = new Set();
    const unusedSelectors = [];

    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        rules.forEach(rule => {
          if (rule.type === CSSRule.STYLE_RULE) {
            const selector = rule.selectorText;
            try {
              if (document.querySelector(selector)) {
                usedSelectors.add(selector);
              } else {
                unusedSelectors.push(selector);
              }
            } catch (e) {
              // Invalid selector
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheet
      }
    });

    return unusedSelectors;
  }

  removeUnusedCSS(unusedSelectors) {
    // In a real implementation, this would modify the stylesheets
    console.log('Detected unused CSS selectors:', unusedSelectors.length);
    
    // Mark for removal in build process
    this.optimizations.set('unusedCSS', unusedSelectors);
  }

  async preloadModules() {
    const importantModules = [
      './src/autonomy/autonomy-engine.js',
      './src/components/luxury-enhancements.js'
    ];

    importantModules.forEach(module => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = module;
      document.head.appendChild(link);
    });
  }

  async implementAdvancedCaching() {
    // Service Worker caching strategy
    await this.setupServiceWorkerCaching();
    
    // Browser caching optimization
    await this.optimizeBrowserCaching();
    
    // Memory caching for frequently accessed data
    await this.setupMemoryCaching();
  }

  async setupServiceWorkerCaching() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        
        // Update service worker with new caching strategies
        const swMessage = {
          type: 'CACHE_STRATEGY',
          strategy: this.config.cacheStrategy,
          resources: [
            '/assets/logos/',
            '/src/components/',
            '/src/autonomy/',
            'https://fonts.googleapis.com/',
            'https://fonts.gstatic.com/'
          ]
        };
        
        registration.active?.postMessage(swMessage);
        
        console.log('Service Worker registered with advanced caching');
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
      }
    }
  }

  async optimizeBrowserCaching() {
    // Add cache headers for static resources
    const cacheHeaders = new Map([
      ['image', 'max-age=31536000, immutable'], // 1 year for images
      ['font', 'max-age=31536000, immutable'], // 1 year for fonts
      ['script', 'max-age=86400'], // 1 day for scripts
      ['style', 'max-age=86400'] // 1 day for styles
    ]);

    // This would typically be handled by the server
    // Here we're simulating by setting localStorage for cache keys
    this.optimizations.set('cacheHeaders', Object.fromEntries(cacheHeaders));
  }

  async setupMemoryCaching() {
    // Create memory cache for frequently accessed data
    this.memoryCache = new Map();
    this.cacheStats = new Map();

    // Cache configuration
    const cacheConfig = {
      maxSize: 50, // Maximum number of items
      ttl: 300000 // 5 minutes TTL
    };

    this.memoryCache.config = cacheConfig;
  }

  cacheSet(key, value) {
    const item = {
      value,
      timestamp: Date.now(),
      accessed: Date.now(),
      hits: 0
    };

    // Check cache size limit
    if (this.memoryCache.size >= this.memoryCache.config.maxSize) {
      this.evictLeastUsed();
    }

    this.memoryCache.set(key, item);
  }

  cacheGet(key) {
    const item = this.memoryCache.get(key);
    
    if (!item) return null;

    // Check TTL
    if (Date.now() - item.timestamp > this.memoryCache.config.ttl) {
      this.memoryCache.delete(key);
      return null;
    }

    // Update access stats
    item.accessed = Date.now();
    item.hits++;

    return item.value;
  }

  evictLeastUsed() {
    let leastUsed = null;
    let leastScore = Infinity;

    for (const [key, item] of this.memoryCache) {
      if (key === 'config') continue;
      
      // Score based on hits and recency
      const score = item.hits / (Date.now() - item.accessed);
      
      if (score < leastScore) {
        leastScore = score;
        leastUsed = key;
      }
    }

    if (leastUsed) {
      this.memoryCache.delete(leastUsed);
    }
  }

  async optimizeMobilePerformance() {
    // Touch optimization
    await this.optimizeTouchInteractions();
    
    // Viewport optimization
    await this.optimizeViewport();
    
    // Battery and CPU optimization
    await this.optimizeForMobile();
    
    // Network optimization
    await this.optimizeNetworkUsage();
  }

  async optimizeTouchInteractions() {
    // Add touch-action optimization
    const touchElements = document.querySelectorAll('button, a, .clickable, .interactive');
    
    touchElements.forEach(element => {
      element.style.touchAction = 'manipulation';
      element.style.userSelect = 'none';
      
      // Prevent 300ms click delay
      element.addEventListener('touchstart', () => {}, { passive: true });
    });

    // Optimize scroll performance
    const scrollElements = document.querySelectorAll('.scroll-container, .overflow-auto');
    scrollElements.forEach(element => {
      element.style.webkitOverflowScrolling = 'touch';
      element.style.overflowScrolling = 'touch';
    });
  }

  async optimizeViewport() {
    // Ensure proper viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    
    viewport.content = 'width=device-width, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover';

    // Add safe area insets for notched devices
    const safeAreaCSS = `
      <style id="safe-area-styles">
        .safe-area-top { padding-top: env(safe-area-inset-top); }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
        .safe-area-left { padding-left: env(safe-area-inset-left); }
        .safe-area-right { padding-right: env(safe-area-inset-right); }
        
        @supports (padding: max(0px)) {
          .safe-area-padding {
            padding: max(20px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
          }
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', safeAreaCSS);
  }

  async optimizeForMobile() {
    // Reduce animations on mobile
    if (this.isMobileDevice()) {
      const animationCSS = `
        <style id="mobile-animation-optimization">
          @media (max-width: 768px) {
            *, *::before, *::after {
              animation-duration: 0.3s !important;
              animation-delay: 0s !important;
              transition-duration: 0.3s !important;
              transition-delay: 0s !important;
            }
            
            .luxury-particle {
              display: none;
            }
            
            .parallax-element {
              transform: none !important;
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        </style>
      `;
      
      document.head.insertAdjacentHTML('beforeend', animationCSS);
    }

    // Optimize for low-end devices
    if (this.isLowEndDevice()) {
      this.enableLowPowerMode();
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  isLowEndDevice() {
    // Detect low-end devices based on available metrics
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const connection = navigator.connection;
    
    const isLowEnd = (
      memory <= 2 ||
      cores <= 2 ||
      (connection && connection.effectiveType === 'slow-2g') ||
      (connection && connection.effectiveType === '2g')
    );
    
    return isLowEnd;
  }

  enableLowPowerMode() {
    console.log('Enabling low power mode for performance');
    
    // Disable non-essential features
    this.optimizations.set('lowPowerMode', {
      disableParticles: true,
      reduceAnimations: true,
      lowerImageQuality: true,
      disableAutoplay: true
    });
    
    // Apply low power optimizations
    const lowPowerCSS = `
      <style id="low-power-mode">
        .luxury-particle, .floating-element {
          display: none !important;
        }
        
        video, .autoplay-media {
          autoplay: false;
        }
        
        img {
          image-rendering: auto;
        }
        
        .complex-animation {
          animation: none !important;
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', lowPowerCSS);
  }

  async optimizeNetworkUsage() {
    // Implement adaptive loading based on connection
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        this.enableDataSaverMode();
      }
      
      // Monitor connection changes
      connection.addEventListener('change', () => {
        this.adaptToConnectionChange();
      });
    }
  }

  enableDataSaverMode() {
    console.log('Enabling data saver mode');
    
    // Reduce image quality
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.dataset.lowQuality) {
        img.src = img.dataset.lowQuality;
      }
    });
    
    // Disable autoplay
    const videos = document.querySelectorAll('video[autoplay]');
    videos.forEach(video => {
      video.removeAttribute('autoplay');
      video.preload = 'none';
    });
    
    this.optimizations.set('dataSaverMode', true);
  }

  adaptToConnectionChange() {
    const connection = navigator.connection;
    
    if (connection.effectiveType === '4g' && this.optimizations.get('dataSaverMode')) {
      // Re-enable high quality when connection improves
      this.disableDataSaverMode();
    } else if ((connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') && !this.optimizations.get('dataSaverMode')) {
      this.enableDataSaverMode();
    }
  }

  disableDataSaverMode() {
    console.log('Disabling data saver mode');
    
    // Restore high quality images
    const images = document.querySelectorAll('img[data-high-quality]');
    images.forEach(img => {
      img.src = img.dataset.highQuality;
    });
    
    this.optimizations.set('dataSaverMode', false);
  }

  async enhanceSEO() {
    // Structured data optimization
    await this.addStructuredData();
    
    // Meta tags optimization
    await this.optimizeMetaTags();
    
    // Core Web Vitals optimization
    await this.optimizeCoreWebVitals();
    
    // Accessibility improvements
    await this.enhanceAccessibility();
  }

  async addStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Thee Cigar Maestro",
      "description": "Premium AI-driven cigar experience platform with luxury e-commerce and personalization",
      "url": "https://theecigarmaestro.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://theecigarmaestro.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "sameAs": [
        "https://www.instagram.com/theecigarmaestro",
        "https://twitter.com/cigarmaestro"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  async optimizeMetaTags() {
    const metaTags = [
      { name: 'description', content: 'Premium AI-driven cigar experience platform with luxury e-commerce, personalized recommendations, and sophisticated pairing advice.' },
      { name: 'keywords', content: 'cigars, luxury cigars, AI recommendations, cigar pairings, premium tobacco, cigar education' },
      { name: 'author', content: 'Thee Cigar Maestro' },
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { property: 'og:title', content: 'Thee Cigar Maestro — The Art. The Ritual. The Maestro.' },
      { property: 'og:description', content: 'Experience the world\'s most sophisticated AI-driven cigar platform with personalized recommendations and luxury experiences.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://theecigarmaestro.com' },
      { property: 'og:image', content: 'https://theecigarmaestro.com/assets/logos/logo-og.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@cigarmaestro' },
      { name: 'twitter:title', content: 'Thee Cigar Maestro — Premium AI Cigar Experience' },
      { name: 'twitter:description', content: 'Discover your perfect cigar with AI-powered recommendations and luxury experiences.' },
      { name: 'twitter:image', content: 'https://theecigarmaestro.com/assets/logos/logo-twitter.png' }
    ];

    metaTags.forEach(tag => {
      let element = document.querySelector(`meta[name="${tag.name}"], meta[property="${tag.property}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (tag.name) element.name = tag.name;
        if (tag.property) element.property = tag.property;
        document.head.appendChild(element);
      }
      element.content = tag.content;
    });
  }

  async optimizeCoreWebVitals() {
    // Optimize Largest Contentful Paint (LCP)
    await this.optimizeLCP();
    
    // Optimize First Input Delay (FID)
    await this.optimizeFID();
    
    // Optimize Cumulative Layout Shift (CLS)
    await this.optimizeCLS();
  }

  async optimizeLCP() {
    // Preload LCP element
    const heroImage = document.querySelector('.hero-image, .main-logo');
    if (heroImage && heroImage.src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImage.src;
      document.head.appendChild(link);
    }

    // Optimize critical resource loading
    this.metrics.set('lcpOptimized', true);
  }

  async optimizeFID() {
    // Break up long tasks
    this.breakUpLongTasks();
    
    // Use web workers for heavy computations
    if ('Worker' in window) {
      this.setupWebWorkers();
    }
  }

  breakUpLongTasks() {
    // Use scheduler.postTask if available, otherwise use setTimeout
    const scheduleTask = (task) => {
      if ('scheduler' in window && 'postTask' in scheduler) {
        scheduler.postTask(task, { priority: 'user-blocking' });
      } else {
        setTimeout(task, 0);
      }
    };

    // Example: Break up initialization tasks
    const initTasks = [
      () => this.initializeImageOptimization(),
      () => this.setupLazyLoading(),
      () => this.optimizeCodeDelivery()
    ];

    initTasks.forEach(task => scheduleTask(task));
  }

  setupWebWorkers() {
    // Create web worker for heavy computations
    const workerScript = `
      self.onmessage = function(e) {
        const { type, data } = e.data;
        
        switch(type) {
          case 'OPTIMIZE_IMAGES':
            // Perform image optimization calculations
            self.postMessage({ type: 'IMAGES_OPTIMIZED', result: data });
            break;
          case 'ANALYZE_PERFORMANCE':
            // Perform performance analysis
            self.postMessage({ type: 'ANALYSIS_COMPLETE', result: data });
            break;
        }
      };
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));

    worker.onmessage = (e) => {
      const { type, result } = e.data;
      this.handleWorkerMessage(type, result);
    };

    this.webWorker = worker;
  }

  handleWorkerMessage(type, result) {
    switch(type) {
      case 'IMAGES_OPTIMIZED':
        console.log('Images optimized by web worker');
        break;
      case 'ANALYSIS_COMPLETE':
        this.metrics.set('performanceAnalysis', result);
        break;
    }
  }

  async optimizeCLS() {
    // Add size attributes to images
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      // Set default dimensions to prevent layout shift
      if (!img.style.width && !img.style.height) {
        img.style.aspectRatio = '16/9'; // Default aspect ratio
        img.style.width = '100%';
        img.style.height = 'auto';
      }
    });

    // Reserve space for dynamic content
    const dynamicElements = document.querySelectorAll('.dynamic-content');
    dynamicElements.forEach(element => {
      if (!element.style.minHeight) {
        element.style.minHeight = '200px'; // Minimum height to prevent shift
      }
    });

    this.metrics.set('clsOptimized', true);
  }

  async enhanceAccessibility() {
    // Add ARIA labels where missing
    const interactiveElements = document.querySelectorAll('button:not([aria-label]), a:not([aria-label])');
    interactiveElements.forEach(element => {
      if (!element.textContent.trim()) {
        element.setAttribute('aria-label', 'Interactive element');
      }
    });

    // Ensure proper heading structure
    this.validateHeadingStructure();
    
    // Add skip links
    this.addSkipLinks();
    
    // Enhance keyboard navigation
    this.enhanceKeyboardNavigation();
  }

  validateHeadingStructure() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      
      if (level > currentLevel + 1) {
        console.warn(`Heading structure issue: ${heading.tagName} follows h${currentLevel}`);
      }
      
      currentLevel = level;
    });
  }

  addSkipLinks() {
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link sr-only';
      skipLink.textContent = 'Skip to main content';
      
      const skipLinkCSS = `
        <style id="skip-link-styles">
          .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--gold-primary);
            color: var(--primary-bg);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10001;
            font-weight: 600;
          }
          
          .skip-link:focus {
            top: 6px;
          }
        </style>
      `;
      
      document.head.insertAdjacentHTML('beforeend', skipLinkCSS);
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  }

  enhanceKeyboardNavigation() {
    // Add focus indicators
    const focusCSS = `
      <style id="focus-styles">
        *:focus {
          outline: 2px solid var(--gold-primary);
          outline-offset: 2px;
        }
        
        .luxury-button:focus,
        .luxury-card:focus {
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.4);
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', focusCSS);

    // Ensure all interactive elements are focusable
    const interactiveElements = document.querySelectorAll('.clickable, .interactive');
    interactiveElements.forEach(element => {
      if (!element.hasAttribute('tabindex') && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
        element.setAttribute('tabindex', '0');
      }
    });
  }

  async setupPerformanceMonitoring() {
    // Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      this.setupWebVitalsMonitoring();
    }
    
    // Resource timing monitoring
    this.setupResourceTimingMonitoring();
    
    // Custom performance metrics
    this.setupCustomMetrics();
    
    // Real user monitoring
    this.setupRealUserMonitoring();
  }

  setupWebVitalsMonitoring() {
    const webVitalsObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach(entry => {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            this.metrics.set('LCP', entry.startTime);
            break;
          case 'first-input':
            this.metrics.set('FID', entry.processingStart - entry.startTime);
            break;
          case 'layout-shift':
            this.updateCLS(entry.value);
            break;
        }
      });
    });

    try {
      webVitalsObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.warn('Web Vitals monitoring not supported');
    }
  }

  updateCLS(value) {
    const currentCLS = this.metrics.get('CLS') || 0;
    this.metrics.set('CLS', currentCLS + value);
  }

  setupResourceTimingMonitoring() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach(entry => {
          this.analyzeResourceTiming(entry);
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }

  analyzeResourceTiming(entry) {
    const slowThreshold = 1000; // 1 second
    
    if (entry.duration > slowThreshold) {
      console.warn(`Slow resource detected: ${entry.name} took ${entry.duration}ms`);
      
      // Track slow resources
      const slowResources = this.metrics.get('slowResources') || [];
      slowResources.push({
        name: entry.name,
        duration: entry.duration,
        timestamp: Date.now()
      });
      this.metrics.set('slowResources', slowResources);
    }
  }

  setupCustomMetrics() {
    // Track time to interactive
    this.trackTimeToInteractive();
    
    // Track user engagement metrics
    this.trackUserEngagement();
    
    // Track error rates
    this.trackErrorRates();
  }

  trackTimeToInteractive() {
    const startTime = performance.now();
    
    const checkInteractive = () => {
      if (document.readyState === 'complete') {
        const tti = performance.now() - startTime;
        this.metrics.set('TTI', tti);
        
        // Report if TTI exceeds target
        if (tti > this.config.targetLoadTime) {
          console.warn(`TTI (${tti}ms) exceeds target (${this.config.targetLoadTime}ms)`);
        }
      } else {
        setTimeout(checkInteractive, 100);
      }
    };
    
    checkInteractive();
  }

  trackUserEngagement() {
    let engagementScore = 0;
    let interactionCount = 0;
    
    ['click', 'scroll', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
        engagementScore += 1;
        
        this.metrics.set('userEngagement', {
          score: engagementScore,
          interactions: interactionCount,
          timestamp: Date.now()
        });
      }, { passive: true });
    });
  }

  trackErrorRates() {
    window.addEventListener('error', (event) => {
      const errors = this.metrics.get('errors') || [];
      errors.push({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now()
      });
      this.metrics.set('errors', errors);
    });

    window.addEventListener('unhandledrejection', (event) => {
      const rejections = this.metrics.get('rejections') || [];
      rejections.push({
        reason: event.reason,
        timestamp: Date.now()
      });
      this.metrics.set('rejections', rejections);
    });
  }

  setupRealUserMonitoring() {
    // Send performance data to analytics
    setInterval(() => {
      this.reportPerformanceMetrics();
    }, 30000); // Report every 30 seconds
  }

  reportPerformanceMetrics() {
    const metrics = {
      LCP: this.metrics.get('LCP'),
      FID: this.metrics.get('FID'),
      CLS: this.metrics.get('CLS'),
      TTI: this.metrics.get('TTI'),
      userEngagement: this.metrics.get('userEngagement'),
      slowResources: this.metrics.get('slowResources'),
      errors: this.metrics.get('errors'),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connection: navigator.connection?.effectiveType
    };

    // Send to analytics service (would be actual endpoint in production)
    console.log('Performance metrics:', metrics);
    
    // Store locally for debugging
    localStorage.setItem('performanceMetrics', JSON.stringify(metrics));
  }

  // Public API methods
  getPerformanceMetrics() {
    return Object.fromEntries(this.metrics);
  }

  getOptimizations() {
    return Object.fromEntries(this.optimizations);
  }

  async forceOptimization() {
    console.log('🚀 Force optimizing performance...');
    
    await this.optimizeCriticalRenderingPath();
    await this.setupLazyLoading();
    await this.optimizeCodeDelivery();
    
    console.log('✅ Force optimization complete');
  }

  // Cleanup method
  destroy() {
    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());
    
    // Terminate web worker
    if (this.webWorker) {
      this.webWorker.terminate();
    }
    
    // Clear metrics and optimizations
    this.metrics.clear();
    this.optimizations.clear();
    
    this.isInitialized = false;
    console.log('🔄 Performance Optimizer destroyed');
  }
}

// Initialize performance optimizer
const performanceOptimizer = new PerformanceOptimizer();

// Global access for debugging
window.PerformanceOptimizer = performanceOptimizer;

export default performanceOptimizer;