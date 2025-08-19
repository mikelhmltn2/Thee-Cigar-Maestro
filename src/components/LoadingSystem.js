/**
 * Comprehensive Loading System with Skeleton Screens and Progressive Loading
 * Provides better user experience during data and resource loading
 */

import errorHandler from '../utils/errorHandler.js';

class LoadingSystem {
  constructor() {
    this.loadingStates = new Map();
    this.skeletonTemplates = new Map();
    this.progressTrackers = new Map();
    this.loadingCallbacks = new Map();

    this.initializeSkeletonTemplates();
    this.setupIntersectionObserver();
  }

  initializeSkeletonTemplates() {
    // Define skeleton templates for different content types
    this.skeletonTemplates.set(
      'cigar-card',
      `
      <div class="skeleton-card">
        <div class="skeleton-header"></div>
        <div class="skeleton-content">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line medium"></div>
        </div>
      </div>
    `
    );

    this.skeletonTemplates.set(
      'cigar-list',
      `
      <div class="skeleton-list">
        ${Array(6).fill('<div class="skeleton-item"><div class="skeleton-circle"></div><div class="skeleton-text"><div class="skeleton-line"></div><div class="skeleton-line short"></div></div></div>').join('')}
      </div>
    `
    );

    this.skeletonTemplates.set(
      'dashboard-widget',
      `
      <div class="skeleton-widget">
        <div class="skeleton-title"></div>
        <div class="skeleton-chart"></div>
        <div class="skeleton-stats">
          <div class="skeleton-stat"></div>
          <div class="skeleton-stat"></div>
          <div class="skeleton-stat"></div>
        </div>
      </div>
    `
    );

    this.skeletonTemplates.set(
      '3d-scene',
      `
      <div class="skeleton-3d">
        <div class="skeleton-canvas">
          <div class="skeleton-loading-spinner"></div>
          <div class="skeleton-loading-text">Initializing 3D Scene...</div>
        </div>
      </div>
    `
    );
  }

  setupIntersectionObserver() {
    // Lazy loading support
    this.lazyLoadObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const { loadingId } = element.dataset;

            if (loadingId) {
              this.triggerLazyLoad(loadingId, element);
            }
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );
  }

  // Main loading state management
  startLoading(id, options = {}) {
    const {
      element = null,
      type = 'default',
      message = 'Loading...',
      showProgress = false,
      showSkeleton = false,
      skeletonType = 'default',
    } = options;

    const loadingState = {
      id,
      element,
      type,
      message,
      showProgress,
      showSkeleton,
      skeletonType,
      startTime: Date.now(),
      progress: 0,
      isComplete: false,
    };

    this.loadingStates.set(id, loadingState);

    if (element) {
      this.renderLoadingUI(loadingState);
    }

    if (showProgress) {
      this.initializeProgressTracker(id);
    }

    return loadingState;
  }

  updateProgress(id, progress, message = null) {
    const loadingState = this.loadingStates.get(id);
    if (!loadingState) {
      console.warn(`Loading state ${id} not found`);
      return;
    }

    loadingState.progress = Math.min(100, Math.max(0, progress));
    if (message) {
      loadingState.message = message;
    }

    this.updateLoadingUI(loadingState);

    // Trigger progress callbacks
    const callbacks = this.loadingCallbacks.get(id);
    if (callbacks && callbacks.onProgress) {
      callbacks.onProgress(loadingState.progress, loadingState.message);
    }
  }

  finishLoading(id, success = true, message = null) {
    const loadingState = this.loadingStates.get(id);
    if (!loadingState) {
      console.warn(`Loading state ${id} not found`);
      return;
    }

    loadingState.isComplete = true;
    loadingState.success = success;
    loadingState.endTime = Date.now();
    loadingState.duration = loadingState.endTime - loadingState.startTime;

    if (message) {
      loadingState.message = message;
    }

    // Show completion message briefly before hiding
    this.showCompletionMessage(loadingState);

    // Clean up after delay
    setTimeout(
      () => {
        this.hideLoadingUI(loadingState);
        this.loadingStates.delete(id);
        this.progressTrackers.delete(id);
      },
      success ? 800 : 2000
    );

    // Trigger completion callbacks
    const callbacks = this.loadingCallbacks.get(id);
    if (callbacks) {
      if (success && callbacks.onSuccess) {
        callbacks.onSuccess(loadingState);
      } else if (!success && callbacks.onError) {
        callbacks.onError(loadingState);
      }
      this.loadingCallbacks.delete(id);
    }
  }

  renderLoadingUI(loadingState) {
    const { element, showSkeleton, skeletonType, showProgress, message } = loadingState;

    if (!element) {
      return;
    }

    // Store original content
    if (!element.dataset.originalContent) {
      element.dataset.originalContent = element.innerHTML;
    }

    if (showSkeleton) {
      this.renderSkeleton(element, skeletonType);
    } else {
      this.renderSpinner(element, message, showProgress);
    }

    element.classList.add('loading-active');
  }

  renderSkeleton(element, skeletonType) {
    const template = this.skeletonTemplates.get(skeletonType) || this.getDefaultSkeleton();

    element.innerHTML = `
      <div class="skeleton-container" data-skeleton-type="${skeletonType}">
        ${template}
      </div>
    `;

    // Add CSS if not already added
    this.ensureSkeletonCSS();
  }

  renderSpinner(element, message, showProgress) {
    const progressHTML = showProgress
      ? `
      <div class="loading-progress">
        <div class="loading-progress-bar">
          <div class="loading-progress-fill" style="width: 0%"></div>
        </div>
        <div class="loading-progress-text">0%</div>
      </div>
    `
      : '';

    element.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="loading-message">${message}</div>
        ${progressHTML}
      </div>
    `;

    this.ensureLoadingCSS();
  }

  updateLoadingUI(loadingState) {
    const { element, progress, message, showProgress } = loadingState;

    if (!element) {
      return;
    }

    const messageEl = element.querySelector('.loading-message');
    if (messageEl) {
      messageEl.textContent = message;
    }

    if (showProgress) {
      const progressFill = element.querySelector('.loading-progress-fill');
      const progressText = element.querySelector('.loading-progress-text');

      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }

      if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
      }
    }
  }

  showCompletionMessage(loadingState) {
    const { element, success, message } = loadingState;

    if (!element) {
      return;
    }

    const completionMessage = message || (success ? 'Loaded successfully!' : 'Loading failed');
    const iconClass = success ? 'success-icon' : 'error-icon';

    element.innerHTML = `
      <div class="loading-completion ${success ? 'success' : 'error'}">
        <div class="${iconClass}">
          ${success ? '✓' : '⚠'}
        </div>
        <div class="completion-message">${completionMessage}</div>
      </div>
    `;
  }

  hideLoadingUI(loadingState) {
    const { element } = loadingState;

    if (!element) {
      return;
    }

    // Restore original content
    const { originalContent } = element.dataset;
    if (originalContent) {
      element.innerHTML = originalContent;
      delete element.dataset.originalContent;
    }

    element.classList.remove('loading-active');
  }

  // Progress tracking utilities
  initializeProgressTracker(id) {
    this.progressTrackers.set(id, {
      total: 0,
      completed: 0,
      items: new Map(),
    });
  }

  addProgressItem(loadingId, itemId, weight = 1) {
    const tracker = this.progressTrackers.get(loadingId);
    if (!tracker) {
      return;
    }

    tracker.items.set(itemId, { weight, completed: false });
    tracker.total += weight;
  }

  completeProgressItem(loadingId, itemId) {
    const tracker = this.progressTrackers.get(loadingId);
    if (!tracker) {
      return;
    }

    const item = tracker.items.get(itemId);
    if (!item || item.completed) {
      return;
    }

    item.completed = true;
    tracker.completed += item.weight;

    const progress = (tracker.completed / tracker.total) * 100;
    this.updateProgress(loadingId, progress);
  }

  // Lazy loading
  enableLazyLoading(element, loadingId, loadFunction) {
    element.dataset.loadingId = loadingId;
    element.dataset.lazyLoad = 'true';

    this.loadingCallbacks.set(loadingId, {
      onLoad: loadFunction,
    });

    this.lazyLoadObserver.observe(element);
  }

  triggerLazyLoad(loadingId, element) {
    const callbacks = this.loadingCallbacks.get(loadingId);
    if (callbacks && callbacks.onLoad) {
      this.startLoading(loadingId, {
        element,
        message: 'Loading content...',
        showSkeleton: true,
        skeletonType: element.dataset.skeletonType || 'default',
      });

      callbacks
        .onLoad(element)
        .then(() => {
          this.finishLoading(loadingId, true);
        })
        .catch(error => {
          errorHandler.handleError({
            type: 'lazy_load',
            message: `Failed to lazy load content: ${error.message}`,
            error,
          });
          this.finishLoading(loadingId, false, 'Failed to load content');
        });
    }

    this.lazyLoadObserver.unobserve(element);
  }

  // Batch loading for multiple resources
  createBatchLoader(id, items, options = {}) {
    const {
      element = null,
      concurrent = 3,
      showProgress = true,
      onItemComplete = null,
      onBatchComplete = null,
    } = options;

    this.startLoading(id, {
      element,
      showProgress,
      message: `Loading ${items.length} items...`,
    });

    this.initializeProgressTracker(id);

    // Add all items to progress tracker
    items.forEach((item, index) => {
      this.addProgressItem(id, `item_${index}`, 1);
    });

    const loadPromises = [];
    const semaphore = new Semaphore(concurrent);

    items.forEach((item, index) => {
      const loadPromise = semaphore.acquire().then(async release => {
        try {
          const result = await item.loadFunction();

          if (onItemComplete) {
            onItemComplete(item, result, index);
          }

          this.completeProgressItem(id, `item_${index}`);
          return { success: true, result, item, index };
        } catch (_error) {
          errorHandler.handleError({
            type: 'batch_load_item',
            message: `Failed to load batch item ${index}: ${_error.message}`,
            error: _error,
          });

          this.completeProgressItem(id, `item_${index}`);
          return { success: false, error: _error, item, index };
        } finally {
          release();
        }
      });

      loadPromises.push(loadPromise);
    });

    Promise.allSettled(loadPromises).then(results => {
      const successful = results.filter(r => r.value?.success).length;
      const failed = results.length - successful;

      const success = failed === 0;
      const message = success
        ? `Successfully loaded ${successful} items`
        : `Loaded ${successful} items, ${failed} failed`;

      this.finishLoading(id, success, message);

      if (onBatchComplete) {
        onBatchComplete(results);
      }
    });

    return loadPromises;
  }

  // Utility methods
  setCallback(id, callbacks) {
    this.loadingCallbacks.set(id, callbacks);
  }

  isLoading(id) {
    const state = this.loadingStates.get(id);
    return state && !state.isComplete;
  }

  getLoadingState(id) {
    return this.loadingStates.get(id);
  }

  getDefaultSkeleton() {
    return `
      <div class="skeleton-default">
        <div class="skeleton-line"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line short"></div>
      </div>
    `;
  }

  ensureSkeletonCSS() {
    if (document.getElementById('skeleton-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'skeleton-styles';
    style.textContent = `
      .skeleton-container {
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }

      .skeleton-line,
      .skeleton-circle,
      .skeleton-header,
      .skeleton-title,
      .skeleton-chart,
      .skeleton-stat {
        background: linear-gradient(90deg, #2c2c2c 25%, #3c3c3c 50%, #2c2c2c 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
      }

      .skeleton-line {
        height: 1rem;
        margin: 0.5rem 0;
      }

      .skeleton-line.short { width: 60%; }
      .skeleton-line.medium { width: 80%; }

      .skeleton-circle {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }

      .skeleton-header {
        height: 2rem;
        margin-bottom: 1rem;
      }

      .skeleton-title {
        height: 1.5rem;
        width: 40%;
        margin-bottom: 1rem;
      }

      .skeleton-chart {
        height: 200px;
        margin: 1rem 0;
      }

      .skeleton-stat {
        height: 1rem;
        width: 80px;
        margin: 0.5rem;
      }

      .skeleton-card {
        padding: 1rem;
        border: 1px solid #444;
        border-radius: 8px;
        margin: 1rem 0;
      }

      .skeleton-item {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        gap: 1rem;
      }

      .skeleton-text {
        flex: 1;
      }

      .skeleton-stats {
        display: flex;
        gap: 1rem;
      }

      @keyframes skeleton-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      @keyframes skeleton-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `;

    document.head.appendChild(style);
  }

  ensureLoadingCSS() {
    if (document.getElementById('loading-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'loading-styles';
    style.textContent = `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
      }

      .loading-spinner {
        position: relative;
        width: 48px;
        height: 48px;
        margin-bottom: 1rem;
      }

      .spinner-ring {
        display: block;
        position: absolute;
        width: 40px;
        height: 40px;
        border: 4px solid transparent;
        border-top-color: #c69c6d;
        border-radius: 50%;
        animation: spinner-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      }

      .spinner-ring:nth-child(1) { animation-delay: -0.45s; }
      .spinner-ring:nth-child(2) { animation-delay: -0.3s; }
      .spinner-ring:nth-child(3) { animation-delay: -0.15s; }

      .loading-message {
        color: #f0e6d2;
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }

      .loading-progress {
        width: 200px;
        margin-top: 1rem;
      }

      .loading-progress-bar {
        width: 100%;
        height: 6px;
        background: #444;
        border-radius: 3px;
        overflow: hidden;
      }

      .loading-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #c69c6d, #dab785);
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      .loading-progress-text {
        text-align: center;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        color: #a67856;
      }

      .loading-completion {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
      }

      .success-icon,
      .error-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .success-icon { color: #28a745; }
      .error-icon { color: #dc3545; }

      .completion-message {
        font-size: 0.9rem;
      }

      .loading-completion.success .completion-message { color: #28a745; }
      .loading-completion.error .completion-message { color: #dc3545; }

      @keyframes spinner-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    document.head.appendChild(style);
  }
}

// Semaphore for controlling concurrent operations
class Semaphore {
  constructor(max) {
    this.max = max;
    this.current = 0;
    this.queue = [];
  }

  async acquire() {
    return new Promise(resolve => {
      const release = () => {
        this.current--;
        if (this.queue.length > 0) {
          const next = this.queue.shift();
          next();
        }
      };

      if (this.current < this.max) {
        this.current++;
        resolve(release);
      } else {
        this.queue.push(() => {
          this.current++;
          resolve(release);
        });
      }
    });
  }
}

// Create singleton instance
const loadingSystem = new LoadingSystem();

export default loadingSystem;
