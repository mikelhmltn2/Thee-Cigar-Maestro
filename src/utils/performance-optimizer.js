/**
 * Performance Optimization Engine for Thee Cigar Maestro
 * Advanced caching, code splitting, and intelligent loading strategies
 * Target: <2.5s mobile load time
 * Part of Phase I Autonomous Upgrade
 */

class PerformanceOptimizer {
  constructor() {
    this.metrics = new Map();
    this.loadingStrategies = new Map();
    this.cacheManager = null;
    this.resourcePreloader = null;
    this.lazyLoadObserver = null;
    this.performanceMonitor = null;
    
    // Performance thresholds
    this.thresholds = {
      mobileLoadTime: 2500, // 2.5 seconds
      desktopLoadTime: 1500, // 1.5 seconds
      firstContentfulPaint: 1200,
      largestContentfulPaint: 2500,
      firstInputDelay: 100,
      cumulativeLayoutShift: 0.1
    };
    
    this.init();
  }

  /**
   * Initialize performance optimization system
   */
  async init() {
    try {
      await this.initializeCacheManager();
      await this.setupResourcePreloading();
      await this.configureLazyLoading();
      await this.setupCodeSplitting();
      await this.optimizeAssetDelivery();
      await this.enablePerformanceMonitoring();
      await this.setupServiceWorkerOptimization();
      
      console.info('⚡ Performance Optimization Engine initialized');
      this.logPerformanceMetrics();
      
    } catch (error) {
      console.error('❌ Performance optimization initialization failed:', error);
    }
  }

  /**
   * Initialize advanced cache management
   */
  async initializeCacheManager() {
    this.cacheManager = {
      strategies: new Map(),
      storage: new Map(),
      cleanup: new Set(),
      analytics: new Map()
    };

    // Cache strategies for different content types
    this.cacheManager.strategies.set('static-assets', {
      name: 'Static Assets Cache',
      strategy: 'cache-first',
      maxAge: 31536000, // 1 year
      patterns: [/\.(js|css|woff2?|png|jpg|jpeg|svg|ico)$/],
      compression: true,
      preload: true
    });

    this.cacheManager.strategies.set('api-data', {
      name: 'API Data Cache',
      strategy: 'network-first',
      maxAge: 300, // 5 minutes
      patterns: [/\/api\//, /\.json$/],
      compression: true,
      staleWhileRevalidate: true
    });

    this.cacheManager.strategies.set('cigar-data', {
      name: 'Cigar Database Cache',
      strategy: 'cache-first',
      maxAge: 86400, // 24 hours
      patterns: [/cigar-specs\.json$/, /pairings\.json$/],
      compression: true,
      backgroundSync: true
    });

    this.cacheManager.strategies.set('images', {
      name: 'Image Cache',
      strategy: 'cache-first',
      maxAge: 2592000, // 30 days
      patterns: [/\.(webp|avif|jpg|jpeg|png)$/],
      compression: true,
      responsive: true
    });

    // Implement intelligent cache warming
    this.warmupCriticalResources();
    
    console.info('📦 Advanced cache manager initialized');
  }

  /**
   * Setup intelligent resource preloading
   */
  async setupResourcePreloading() {
    this.resourcePreloader = {
      criticalResources: new Set(),
      predictiveResources: new Set(),
      userBehaviorPatterns: new Map(),
      preloadQueue: new Map()
    };

    // Critical resources that should be preloaded immediately
    const criticalResources = [
      { href: '/src/components/luxury-enhancements.js', as: 'script', type: 'module' },
      { href: '/style.css', as: 'style' },
      { href: '/cigar-specs.json', as: 'fetch', crossorigin: 'anonymous' },
      { href: '/assets/logos/logo-192.png', as: 'image' }
    ];

    // Add preload links for critical resources
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      Object.assign(link, resource);
      document.head.appendChild(link);
      this.resourcePreloader.criticalResources.add(resource.href);
    });

    // Setup predictive preloading based on user behavior
    this.setupPredictivePreloading();
    
    console.info('🚀 Intelligent resource preloading configured');
  }

  /**
   * Setup predictive preloading based on user behavior
   */
  setupPredictivePreloading() {
    // Track user interactions for predictive loading
    const interactionEvents = ['mouseenter', 'touchstart', 'focus'];
    
    interactionEvents.forEach(event => {
      document.addEventListener(event, (e) => {
        this.handlePredictivePreload(e);
      }, { passive: true });
    });

    // Intersection observer for viewport-based preloading
    const preloadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.preloadNearbyResources(entry.target);
          }
        });
      },
      { rootMargin: '200px' }
    );

    // Observe navigation elements for predictive preloading
    document.querySelectorAll('a, button[data-preload]').forEach(element => {
      preloadObserver.observe(element);
    });
  }

  /**
   * Handle predictive preloading based on user interaction
   */
  handlePredictivePreload(event) {
    const target = event.target.closest('a, button');
    if (!target) return;

    const href = target.href || target.dataset.href;
    if (href && !this.resourcePreloader.preloadQueue.has(href)) {
      // Delay preload to avoid interference with current interaction
      setTimeout(() => {
        this.preloadResource(href);
      }, 100);
    }
  }

  /**
   * Preload nearby resources based on viewport proximity
   */
  preloadNearbyResources(element) {
    const section = element.closest('[data-section]');
    if (!section) return;

    const sectionType = section.dataset.section;
    const relatedResources = this.getRelatedResources(sectionType);
    
    relatedResources.forEach(resource => {
      this.preloadResource(resource);
    });
  }

  /**
   * Get related resources for a section
   */
  getRelatedResources(sectionType) {
    const resourceMap = {
      'flavorverse': ['/virtual-humidor.js', '/flavorverse_nodes.json'],
      'education': ['/education.json', '/cigar-specs.json'],
      'pairings': ['/pairings.json', '/pairing.html'],
      'ai-concierge': ['/ai-concierge.js', '/gpt.js']
    };

    return resourceMap[sectionType] || [];
  }

  /**
   * Preload a specific resource
   */
  preloadResource(href) {
    if (this.resourcePreloader.preloadQueue.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    
    this.resourcePreloader.preloadQueue.set(href, Date.now());
    
    // Remove preload link after a timeout to clean up DOM
    setTimeout(() => {
      link.remove();
    }, 30000);
  }

  /**
   * Configure intelligent lazy loading
   */
  configureLazyLoading() {
    // Enhanced intersection observer for lazy loading
    this.lazyLoadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadLazyResource(entry.target);
            this.lazyLoadObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    // Setup lazy loading for images
    this.setupLazyImages();
    
    // Setup lazy loading for scripts
    this.setupLazyScripts();
    
    // Setup lazy loading for iframes
    this.setupLazyIframes();

    console.info('🔄 Intelligent lazy loading configured');
  }

  /**
   * Setup lazy image loading with responsive images
   */
  setupLazyImages() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    images.forEach(img => {
      // Convert to responsive image if needed
      this.makeImageResponsive(img);
      
      // Add to lazy load observer
      this.lazyLoadObserver.observe(img);
    });

    // Setup lazy loading for background images
    const bgImages = document.querySelectorAll('[data-bg-src]');
    bgImages.forEach(element => {
      this.lazyLoadObserver.observe(element);
    });
  }

  /**
   * Make image responsive with optimized formats
   */
  makeImageResponsive(img) {
    const src = img.dataset.src || img.src;
    if (!src) return;

    // Create picture element for responsive images
    const picture = document.createElement('picture');
    
    // Add WebP source for modern browsers
    const webpSource = document.createElement('source');
    webpSource.type = 'image/webp';
    webpSource.srcset = this.generateResponsiveSrcset(src, 'webp');
    picture.appendChild(webpSource);

    // Add AVIF source for ultra-modern browsers
    const avifSource = document.createElement('source');
    avifSource.type = 'image/avif';
    avifSource.srcset = this.generateResponsiveSrcset(src, 'avif');
    picture.appendChild(avifSource);

    // Keep original as fallback
    img.srcset = this.generateResponsiveSrcset(src);
    picture.appendChild(img);

    // Replace in DOM if not already in a picture element
    if (img.parentNode.tagName !== 'PICTURE') {
      img.parentNode.replaceChild(picture, img);
    }
  }

  /**
   * Generate responsive srcset for different screen sizes
   */
  generateResponsiveSrcset(src, format = 'original') {
    const sizes = [400, 800, 1200, 1600];
    const baseName = src.replace(/\.[^.]+$/, '');
    const extension = format === 'original' ? src.split('.').pop() : format;

    return sizes
      .map(size => `${baseName}_${size}w.${extension} ${size}w`)
      .join(', ');
  }

  /**
   * Setup lazy script loading
   */
  setupLazyScripts() {
    const lazyScripts = document.querySelectorAll('script[data-lazy]');
    
    lazyScripts.forEach(script => {
      this.lazyLoadObserver.observe(script);
    });
  }

  /**
   * Setup lazy iframe loading
   */
  setupLazyIframes() {
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    
    lazyIframes.forEach(iframe => {
      this.lazyLoadObserver.observe(iframe);
    });
  }

  /**
   * Load lazy resource when it enters viewport
   */
  loadLazyResource(element) {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case 'img':
        this.loadLazyImage(element);
        break;
      case 'script':
        this.loadLazyScript(element);
        break;
      case 'iframe':
        this.loadLazyIframe(element);
        break;
      default:
        this.loadLazyBackground(element);
    }
  }

  /**
   * Load lazy image
   */
  loadLazyImage(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute('data-srcset');
    }

    // Add fade-in animation
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    img.onload = () => {
      img.style.opacity = '1';
    };
  }

  /**
   * Load lazy script
   */
  loadLazyScript(script) {
    const newScript = document.createElement('script');
    newScript.src = script.dataset.src || script.src;
    newScript.type = script.type || 'text/javascript';
    
    if (script.dataset.module !== undefined) {
      newScript.type = 'module';
    }

    script.parentNode.replaceChild(newScript, script);
  }

  /**
   * Load lazy iframe
   */
  loadLazyIframe(iframe) {
    iframe.src = iframe.dataset.src;
    iframe.removeAttribute('data-src');
  }

  /**
   * Load lazy background image
   */
  loadLazyBackground(element) {
    if (element.dataset.bgSrc) {
      element.style.backgroundImage = `url(${element.dataset.bgSrc})`;
      element.removeAttribute('data-bg-src');
    }
  }

  /**
   * Setup advanced code splitting
   */
  async setupCodeSplitting() {
    // Dynamic import strategies for different features
    this.loadingStrategies.set('flavorverse', () => import('/virtual-humidor.js'));
    this.loadingStrategies.set('ai-concierge', () => import('/ai-concierge.js'));
    this.loadingStrategies.set('analytics', () => import('/analytics-dashboard.js'));
    this.loadingStrategies.set('community', () => import('/community-features.js'));

    // Setup intersection-based code splitting
    this.setupIntersectionBasedLoading();
    
    // Setup interaction-based code splitting
    this.setupInteractionBasedLoading();

    console.info('📦 Advanced code splitting configured');
  }

  /**
   * Setup intersection-based code splitting
   */
  setupIntersectionBasedLoading() {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadSectionCode(entry.target);
          }
        });
      },
      { rootMargin: '200px' }
    );

    // Observe sections that require specific code
    document.querySelectorAll('[data-requires]').forEach(section => {
      sectionObserver.observe(section);
    });
  }

  /**
   * Setup interaction-based code splitting
   */
  setupInteractionBasedLoading() {
    // Load code when user interacts with specific elements
    document.addEventListener('click', (e) => {
      const element = e.target.closest('[data-load-module]');
      if (element) {
        this.loadModuleOnDemand(element.dataset.loadModule);
      }
    });

    // Preload on hover for better UX
    document.addEventListener('mouseenter', (e) => {
      const element = e.target.closest('[data-preload-module]');
      if (element) {
        this.preloadModule(element.dataset.preloadModule);
      }
    }, { passive: true });
  }

  /**
   * Load section-specific code
   */
  loadSectionCode(section) {
    const requires = section.dataset.requires;
    if (!requires) return;

    const modules = requires.split(',').map(m => m.trim());
    
    modules.forEach(moduleName => {
      this.loadModuleOnDemand(moduleName);
    });
  }

  /**
   * Load module on demand
   */
  async loadModuleOnDemand(moduleName) {
    if (!this.loadingStrategies.has(moduleName)) return;

    try {
      const startTime = performance.now();
      const module = await this.loadingStrategies.get(moduleName)();
      const loadTime = performance.now() - startTime;

      console.info(`📦 Module '${moduleName}' loaded in ${loadTime.toFixed(2)}ms`);
      
      // Track loading performance
      this.metrics.set(`module-${moduleName}`, {
        loadTime,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error(`❌ Failed to load module '${moduleName}':`, error);
    }
  }

  /**
   * Preload module for better UX
   */
  async preloadModule(moduleName) {
    if (!this.loadingStrategies.has(moduleName)) return;

    // Use link rel="modulepreload" for ES modules
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = this.getModulePath(moduleName);
    document.head.appendChild(link);
  }

  /**
   * Get module path for preloading
   */
  getModulePath(moduleName) {
    const moduleMap = {
      'flavorverse': '/virtual-humidor.js',
      'ai-concierge': '/ai-concierge.js',
      'analytics': '/analytics-dashboard.js',
      'community': '/community-features.js'
    };

    return moduleMap[moduleName] || `/${moduleName}.js`;
  }

  /**
   * Optimize asset delivery
   */
  async optimizeAssetDelivery() {
    // Setup resource hints for external resources
    this.addResourceHints();
    
    // Optimize font loading
    this.optimizeFontLoading();
    
    // Setup image optimization
    this.setupImageOptimization();
    
    // Configure compression
    this.configureCompression();

    console.info('🎯 Asset delivery optimization configured');
  }

  /**
   * Add resource hints for better performance
   */
  addResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.assign(link, hint);
      document.head.appendChild(link);
    });
  }

  /**
   * Optimize font loading
   */
  optimizeFontLoading() {
    // Preload critical fonts
    const criticalFonts = [
      { href: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2', type: 'font/woff2' },
      { href: 'https://fonts.gstatic.com/s/sourceserifpro/v15/6xKydSBYKcSV-LCoeQqfX1RYOo3ik4zwlxdu3cOWxw.woff2', type: 'font/woff2' }
    ];

    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = font.href;
      link.type = font.type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Add font-display: swap to existing font faces
    this.addFontDisplaySwap();
  }

  /**
   * Add font-display: swap to improve font loading performance
   */
  addFontDisplaySwap() {
    const fontDisplayCSS = `
      <style>
        @font-face {
          font-family: 'Playfair Display';
          font-display: swap;
        }
        @font-face {
          font-family: 'Source Serif Pro';
          font-display: swap;
        }
        @font-face {
          font-family: 'Crimson Text';
          font-display: swap;
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', fontDisplayCSS);
  }

  /**
   * Setup image optimization
   */
  setupImageOptimization() {
    // Implement progressive JPEG loading
    document.querySelectorAll('img').forEach(img => {
      this.optimizeImageLoading(img);
    });

    // Setup WebP/AVIF fallback system
    this.setupModernImageFormats();
  }

  /**
   * Optimize individual image loading
   */
  optimizeImageLoading(img) {
    // Add decoding="async" for better performance
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }

    // Add loading="lazy" for non-critical images
    if (!img.hasAttribute('loading') && !this.isCriticalImage(img)) {
      img.setAttribute('loading', 'lazy');
    }
  }

  /**
   * Check if image is critical (above the fold)
   */
  isCriticalImage(img) {
    const rect = img.getBoundingClientRect();
    return rect.top < window.innerHeight;
  }

  /**
   * Setup modern image format support
   */
  setupModernImageFormats() {
    // Check browser support for modern formats
    const formatSupport = {
      webp: this.supportsWebP(),
      avif: this.supportsAVIF()
    };

    // Apply format-specific optimizations
    if (formatSupport.webp || formatSupport.avif) {
      this.enableModernImageDelivery(formatSupport);
    }
  }

  /**
   * Check WebP support
   */
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Check AVIF support
   */
  supportsAVIF() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      return false;
    }
  }

  /**
   * Enable modern image delivery
   */
  enableModernImageDelivery(formatSupport) {
    // Add format support indicators to document
    if (formatSupport.webp) {
      document.documentElement.classList.add('webp-support');
    }
    if (formatSupport.avif) {
      document.documentElement.classList.add('avif-support');
    }

    console.info('🖼️ Modern image format support enabled:', formatSupport);
  }

  /**
   * Enable performance monitoring
   */
  enablePerformanceMonitoring() {
    this.performanceMonitor = {
      metrics: new Map(),
      observers: new Set(),
      reports: []
    };

    // Setup Performance Observer
    this.setupPerformanceObserver();
    
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
    
    // Setup real-time performance tracking
    this.setupRealTimeTracking();

    console.info('📊 Performance monitoring enabled');
  }

  /**
   * Setup Performance Observer for detailed metrics
   */
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Observe navigation timing
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.metrics.set('navigation', entry);
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.analyzeResourcePerformance(entry);
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.metrics.set(entry.name, entry);
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    }
  }

  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals() {
    // First Contentful Paint (FCP)
    this.measureFCP();
    
    // Largest Contentful Paint (LCP)
    this.measureLCP();
    
    // First Input Delay (FID)
    this.measureFID();
    
    // Cumulative Layout Shift (CLS)
    this.measureCLS();
  }

  /**
   * Measure First Contentful Paint
   */
  measureFCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        this.metrics.set('fcp', fcp.startTime);
        this.evaluateMetric('fcp', fcp.startTime, this.thresholds.firstContentfulPaint);
      }
    }).observe({ entryTypes: ['paint'] });
  }

  /**
   * Measure Largest Contentful Paint
   */
  measureLCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.metrics.set('lcp', lastEntry.startTime);
        this.evaluateMetric('lcp', lastEntry.startTime, this.thresholds.largestContentfulPaint);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  /**
   * Measure First Input Delay
   */
  measureFID() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        this.metrics.set('fid', entry.processingStart - entry.startTime);
        this.evaluateMetric('fid', entry.processingStart - entry.startTime, this.thresholds.firstInputDelay);
      });
    }).observe({ entryTypes: ['first-input'] });
  }

  /**
   * Measure Cumulative Layout Shift
   */
  measureCLS() {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.set('cls', clsValue);
      this.evaluateMetric('cls', clsValue, this.thresholds.cumulativeLayoutShift);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Evaluate metric against threshold
   */
  evaluateMetric(metricName, value, threshold) {
    const isGood = value <= threshold;
    const status = isGood ? 'good' : 'needs-improvement';
    
    console.info(`📊 ${metricName.toUpperCase()}: ${value.toFixed(2)}ms (${status})`);
    
    if (!isGood) {
      this.suggestOptimization(metricName, value, threshold);
    }
  }

  /**
   * Suggest optimizations for poor metrics
   */
  suggestOptimization(metricName, value, threshold) {
    const suggestions = {
      fcp: ['Optimize font loading', 'Reduce render-blocking resources', 'Improve server response time'],
      lcp: ['Optimize images', 'Preload key resources', 'Reduce server response time'],
      fid: ['Minimize JavaScript execution time', 'Remove unused polyfills', 'Break up long tasks'],
      cls: ['Include size attributes on images', 'Reserve space for ads', 'Avoid inserting content above existing content']
    };

    console.warn(`⚠️ ${metricName.toUpperCase()} optimization needed:`, suggestions[metricName]);
  }

  /**
   * Setup real-time performance tracking
   */
  setupRealTimeTracking() {
    // Track page load completion
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.measurePageLoadComplete();
      }, 0);
    });

    // Track user interactions
    ['click', 'scroll', 'keypress'].forEach(event => {
      document.addEventListener(event, () => {
        this.trackInteractionPerformance();
      }, { once: true, passive: true });
    });
  }

  /**
   * Measure complete page load performance
   */
  measurePageLoadComplete() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.set('pageLoad', loadTime);
      
      const isMobile = window.innerWidth <= 768;
      const threshold = isMobile ? this.thresholds.mobileLoadTime : this.thresholds.desktopLoadTime;
      
      this.evaluateMetric('pageLoad', loadTime, threshold);
    }
  }

  /**
   * Track interaction performance
   */
  trackInteractionPerformance() {
    const interactionStart = performance.now();
    
    requestAnimationFrame(() => {
      const interactionTime = performance.now() - interactionStart;
      this.metrics.set('lastInteraction', interactionTime);
      
      if (interactionTime > 16) { // 60fps threshold
        console.warn(`⚠️ Slow interaction detected: ${interactionTime.toFixed(2)}ms`);
      }
    });
  }

  /**
   * Analyze resource performance
   */
  analyzeResourcePerformance(entry) {
    const resourceType = this.getResourceType(entry.name);
    const loadTime = entry.responseEnd - entry.fetchStart;
    
    if (!this.metrics.has(`resource-${resourceType}`)) {
      this.metrics.set(`resource-${resourceType}`, []);
    }
    
    this.metrics.get(`resource-${resourceType}`).push({
      name: entry.name,
      loadTime,
      size: entry.transferSize,
      cached: entry.transferSize === 0 && entry.decodedBodySize > 0
    });

    // Log slow resources
    if (loadTime > 1000) {
      console.warn(`🐌 Slow resource: ${entry.name} (${loadTime.toFixed(2)}ms)`);
    }
  }

  /**
   * Get resource type from URL
   */
  getResourceType(url) {
    if (url.match(/\.(js|mjs)$/)) return 'script';
    if (url.match(/\.css$/)) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    if (url.match(/\.json$/)) return 'data';
    return 'other';
  }

  /**
   * Setup service worker optimization
   */
  async setupServiceWorkerOptimization() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.info('🔧 Service worker registered for performance optimization');
        
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          console.info('🔄 Service worker update available');
        });
        
      } catch (error) {
        console.error('❌ Service worker registration failed:', error);
      }
    }
  }

  /**
   * Warm up critical resources
   */
  warmupCriticalResources() {
    const criticalResources = [
      '/cigar-specs.json',
      '/pairings.json',
      '/style.css'
    ];

    criticalResources.forEach(resource => {
      fetch(resource, { method: 'HEAD' }).catch(() => {
        // Ignore errors in warmup
      });
    });
  }

  /**
   * Log current performance metrics
   */
  logPerformanceMetrics() {
    setTimeout(() => {
      console.group('📊 Performance Metrics Summary');
      
      this.metrics.forEach((value, key) => {
        if (typeof value === 'number') {
          console.info(`${key}: ${value.toFixed(2)}ms`);
        }
      });
      
      console.groupEnd();
    }, 2000);
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    return {
      metrics: Object.fromEntries(this.metrics),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connection: navigator.connection?.effectiveType || 'unknown'
    };
  }

  /**
   * Clean up performance optimizer
   */
  destroy() {
    // Disconnect observers
    if (this.lazyLoadObserver) {
      this.lazyLoadObserver.disconnect();
    }
    
    // Clear metrics
    this.metrics.clear();
    this.loadingStrategies.clear();
    
    console.info('⚡ Performance optimizer cleaned up');
  }
}

// Auto-initialize performance optimizer
const performanceOptimizer = new PerformanceOptimizer();
window.PerformanceOptimizer = performanceOptimizer;

export default performanceOptimizer;