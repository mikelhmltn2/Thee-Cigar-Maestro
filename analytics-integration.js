/* global console, window, document, fetch, Event, CustomEvent */

// Analytics Integration System
// Handles Google Analytics, custom events, and performance monitoring

class AnalyticsManager {
  constructor() {
    this.isInitialized = false;
    this.sessionId = this.generateSessionId();
    this.startTime = performance.now();
    this.events = [];
    this.errors = [];
    this.performanceMetrics = {};
    this.userProperties = {};
    
    this.init();
  }

  /**
   * Initialize all analytics services
   */
  async init() {
    try {
      await this.initializeGA4();
      this.initializeCoreWebVitals();
      this.initializeErrorTracking();
      this.initializePerformanceMonitoring();
      this.initializeUserBehaviorTracking();
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('📊 Analytics Manager initialized successfully');
      
      // Track initialization
      this.trackEvent('analytics_initialized', {
        session_id: this.sessionId,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Analytics initialization failed:', error);
      this.trackError('analytics_init_failed', error);
    }
  }

  /**
   * Initialize Google Analytics 4
   */
  async initializeGA4() {
    // Check if GA4 is already loaded
    if (window.gtag) {
      console.log('✅ Google Analytics already loaded');
      return;
    }

    // GA4 Measurement ID (replace with your actual ID)
    const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual ID
    
    try {
      // Load GA4 script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(){dataLayer.push(arguments);};
      
      gtag('js', new Date());
      gtag('config', GA4_MEASUREMENT_ID, {
        page_title: 'Thee Cigar Maestro',
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: 'cigar_type',
          custom_parameter_2: 'user_engagement_level'
        }
      });

      console.log('✅ Google Analytics 4 initialized');
    } catch (error) {
      console.error('❌ GA4 initialization failed:', error);
    }
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  initializeCoreWebVitals() {
    try {
      // Import web-vitals library dynamically
      this.loadWebVitalsLibrary().then(() => {
        if (window.webVitals) {
          const { getCLS, getFID, getFCP, getLCP, getTTFB } = window.webVitals;
          
          // Track Core Web Vitals
          getCLS(this.sendToAnalytics.bind(this));
          getFID(this.sendToAnalytics.bind(this));
          getFCP(this.sendToAnalytics.bind(this));
          getLCP(this.sendToAnalytics.bind(this));
          getTTFB(this.sendToAnalytics.bind(this));
          
          console.log('✅ Core Web Vitals monitoring initialized');
        }
      });
    } catch (error) {
      console.error('❌ Core Web Vitals initialization failed:', error);
    }
  }

  /**
   * Load Web Vitals library
   */
  async loadWebVitalsLibrary() {
    if (window.webVitals) {return;}
    
    try {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
      script.onload = () => {
        console.log('✅ Web Vitals library loaded');
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('❌ Failed to load Web Vitals library:', error);
    }
  }

  /**
   * Send Core Web Vitals data to analytics
   */
  sendToAnalytics({name, delta, value, id}) {
    this.performanceMetrics[name] = { delta, value, id };
    
    // Send to GA4
    if (window.gtag) {
      gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: id,
        value: Math.round(name === 'CLS' ? delta * 1000 : delta),
        non_interaction: true
      });
    }
    
    // Store locally for detailed analysis
    this.trackEvent('core_web_vital', {
      metric_name: name,
      value,
      delta,
      id,
      timestamp: new Date().toISOString()
    });
    
    console.log(`📊 Core Web Vital - ${name}:`, { delta, value, id });
  }

  /**
   * Initialize comprehensive error tracking
   */
  initializeErrorTracking() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('promise_rejection', {
        reason: event.reason,
        stack: event.reason?.stack || 'No stack trace available'
      });
    });

    // Service Worker errors
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('error', (event) => {
        this.trackError('service_worker_error', {
          message: event.message || 'Service Worker error'
        });
      });
    }

    console.log('✅ Error tracking initialized');
  }

  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          this.trackPerformanceMetrics(perfData);
        }
      }, 100);
    });

    // Monitor resource loading
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          this.trackResourcePerformance(entry);
        }
      });
    }).observe({entryTypes: ['resource']});

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.trackLongTask(entry);
          });
        }).observe({entryTypes: ['longtask']});
      } catch (error) {
        console.warn('Long task monitoring not supported:', error);
      }
    }

    console.log('✅ Performance monitoring initialized');
  }

  /**
   * Track page load performance metrics
   */
  trackPerformanceMetrics(perfData) {
    const metrics = {
      dns_lookup: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcp_connection: perfData.connectEnd - perfData.connectStart,
      tls_negotiation: perfData.secureConnectionStart ? perfData.connectEnd - perfData.secureConnectionStart : 0,
      request_time: perfData.responseStart - perfData.requestStart,
      response_time: perfData.responseEnd - perfData.responseStart,
      dom_processing: perfData.domContentLoadedEventStart - perfData.responseEnd,
      dom_complete: perfData.domComplete - perfData.domContentLoadedEventStart,
      page_load_time: perfData.loadEventEnd - perfData.navigationStart,
      first_byte: perfData.responseStart - perfData.navigationStart
    };

    this.performanceMetrics.pageLoad = metrics;
    
    // Track significant metrics
    if (window.gtag) {
      gtag('event', 'page_load_performance', {
        event_category: 'Performance',
        page_load_time: Math.round(metrics.page_load_time),
        first_byte: Math.round(metrics.first_byte),
        non_interaction: true
      });
    }

    this.trackEvent('page_performance', metrics);
    console.log('📊 Page performance metrics tracked:', metrics);
  }

  /**
   * Track resource loading performance
   */
  trackResourcePerformance(entry) {
    // Only track significant resources
    if (entry.transferSize < 1000) {return;} // Skip small resources
    
    const resourceData = {
      name: entry.name,
      type: this.getResourceType(entry.name),
      size: entry.transferSize,
      duration: entry.duration,
      start_time: entry.startTime
    };

    // Track slow resources
    if (entry.duration > 1000) { // Resources taking > 1 second
      this.trackEvent('slow_resource', resourceData);
      
      if (window.gtag) {
        gtag('event', 'slow_resource_load', {
          event_category: 'Performance',
          event_label: resourceData.type,
          value: Math.round(entry.duration),
          non_interaction: true
        });
      }
    }
  }

  /**
   * Track long tasks that block the main thread
   */
  trackLongTask(entry) {
    const taskData = {
      duration: entry.duration,
      start_time: entry.startTime,
      attribution: entry.attribution?.[0]?.name || 'unknown'
    };

    this.trackEvent('long_task', taskData);
    
    if (window.gtag) {
      gtag('event', 'long_task_detected', {
        event_category: 'Performance',
        value: Math.round(entry.duration),
        non_interaction: true
      });
    }

    console.warn('⚠️ Long task detected:', taskData);
  }

  /**
   * Initialize user behavior tracking
   */
  initializeUserBehaviorTracking() {
    // Track user engagement
    let engagementScore = 0;
    let lastActivity = Date.now();

    // Mouse movement tracking (throttled)
    let mouseMoveTimeout;
    document.addEventListener('mousemove', () => {
      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => {
        lastActivity = Date.now();
        engagementScore += 1;
      }, 100);
    });

    // Click tracking
    document.addEventListener('click', (event) => {
      lastActivity = Date.now();
      engagementScore += 5;
      
      this.trackEvent('user_click', {
        element: event.target.tagName,
        classes: event.target.className,
        id: event.target.id,
        x: event.clientX,
        y: event.clientY
      });
    });

    // Scroll tracking (throttled)
    let scrollTimeout;
    let maxScroll = 0;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          engagementScore += 2;
          
          // Track milestone scrolls
          if (scrollPercent >= 25 && scrollPercent < 50) {
            this.trackEvent('scroll_milestone', { percent: 25 });
          } else if (scrollPercent >= 50 && scrollPercent < 75) {
            this.trackEvent('scroll_milestone', { percent: 50 });
          } else if (scrollPercent >= 75) {
            this.trackEvent('scroll_milestone', { percent: 75 });
          }
        }
      }, 100);
    });

    // Track session engagement periodically
    setInterval(() => {
      const timeIdle = Date.now() - lastActivity;
      if (timeIdle < 30000) { // Active within last 30 seconds
        this.updateEngagement(engagementScore);
      }
    }, 30000);

    console.log('✅ User behavior tracking initialized');
  }

  /**
   * Track custom events
   */
  trackEvent(eventName, eventData = {}) {
    const enrichedData = {
      ...eventData,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      user_agent: navigator.userAgent
    };

    this.events.push({
      name: eventName,
      data: enrichedData
    });

    // Send to GA4
    if (window.gtag) {
      gtag('event', eventName, enrichedData);
    }

    // Store in local storage for offline analysis
    if (window.storageManager) {
      window.storageManager.trackFeatureUsage(`analytics_${eventName}`);
    }

    console.log(`📊 Event tracked: ${eventName}`, enrichedData);
  }

  /**
   * Track errors with context
   */
  trackError(errorType, errorData) {
    const errorInfo = {
      type: errorType,
      data: errorData,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      user_agent: navigator.userAgent
    };

    this.errors.push(errorInfo);

    // Send to GA4
    if (window.gtag) {
      gtag('event', 'exception', {
        description: `${errorType}: ${errorData.message || JSON.stringify(errorData)}`,
        fatal: false
      });
    }

    console.error('🚨 Error tracked:', errorInfo);
  }

  /**
   * Update user engagement score
   */
  updateEngagement(score) {
    this.userProperties.engagement_score = score;
    
    if (window.gtag) {
      gtag('config', 'G-XXXXXXXXXX', {
        user_properties: {
          engagement_level: score > 100 ? 'high' : score > 50 ? 'medium' : 'low'
        }
      });
    }
  }

  /**
   * Get resource type from URL
   */
  getResourceType(url) {
    if (url.includes('.js')) {return 'javascript';}
    if (url.includes('.css')) {return 'stylesheet';}
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif') || url.includes('.webp')) {return 'image';}
    if (url.includes('.json')) {return 'data';}
    if (url.includes('.html')) {return 'document';}
    return 'other';
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    // Use cryptographically secure random values for session ID
    const array = new Uint32Array(3);
    window.crypto.getRandomValues(array);
    const randomPart = Array.from(array).map(num => num.toString(36)).join('');
    return `session_${Date.now()}_${randomPart}`;
  }

  /**
   * Setup additional event listeners
   */
  setupEventListeners() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('page_visibility_change', {
        visibility_state: document.visibilityState
      });
    });

    // Track orientation changes
    window.addEventListener('orientationchange', () => {
      this.trackEvent('orientation_change', {
        orientation: window.orientation
      });
    });

    // Track online/offline status
    window.addEventListener('online', () => {
      this.trackEvent('connection_change', { status: 'online' });
    });

    window.addEventListener('offline', () => {
      this.trackEvent('connection_change', { status: 'offline' });
    });
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    return {
      session_id: this.sessionId,
      session_duration: performance.now() - this.startTime,
      events_tracked: this.events.length,
      errors_tracked: this.errors.length,
      performance_metrics: this.performanceMetrics,
      user_properties: this.userProperties
    };
  }

  /**
   * Export analytics data
   */
  exportAnalyticsData() {
    return {
      session: this.getAnalyticsSummary(),
      events: this.events,
      errors: this.errors,
      exported_at: new Date().toISOString()
    };
  }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.analyticsManager = new AnalyticsManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnalyticsManager;
}