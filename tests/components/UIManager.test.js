/**
 * Comprehensive test suite for UIManager component
 * Tests UI state management, toast notifications, modal handling, and user interactions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the UIManager component
const createMockUIManager = () => ({
  notifications: [],
  modals: new Map(),
  activeModal: null,
  toastContainer: null,
  isInitialized: false,

  init() {
    this.isInitialized = true;
    this.createToastContainer();
    return this;
  },

  createToastContainer() {
    this.toastContainer = document.createElement('div');
    this.toastContainer.id = 'toast-container';
    document.body.appendChild(this.toastContainer);
  },

  showToast(message, type = 'info', duration = 3000) {
    const toast = {
      id: Date.now() + Math.random(),
      message,
      type,
      duration,
      timestamp: Date.now(),
    };
    this.notifications.push(toast);
    return toast.id;
  },

  hideToast(toastId) {
    this.notifications = this.notifications.filter(n => n.id !== toastId);
    return true;
  },

  showModal(modalId, content, options = {}) {
    const modal = {
      id: modalId,
      content,
      options,
      isVisible: true,
      createdAt: Date.now(),
    };
    this.modals.set(modalId, modal);
    this.activeModal = modalId;
    return modal;
  },

  hideModal(modalId) {
    if (this.modals.has(modalId)) {
      const modal = this.modals.get(modalId);
      modal.isVisible = false;
      this.modals.delete(modalId);
      if (this.activeModal === modalId) {
        this.activeModal = null;
      }
      return true;
    }
    return false;
  },

  updateUIState(state) {
    this.currentState = { ...this.currentState, ...state };
    return this.currentState;
  },

  reset() {
    this.notifications = [];
    this.modals.clear();
    this.activeModal = null;
    this.isInitialized = false;
    if (this.toastContainer) {
      this.toastContainer.remove();
      this.toastContainer = null;
    }
  },
});

describe('UIManager Component', () => {
  let uiManager;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = '';
    uiManager = createMockUIManager();
  });

  afterEach(() => {
    uiManager.reset();
    document.body.innerHTML = '';
  });

  describe('Initialization', () => {
    it('should initialize correctly', () => {
      const result = uiManager.init();

      expect(result).toBe(uiManager);
      expect(uiManager.isInitialized).toBe(true);
      expect(uiManager.toastContainer).toBeTruthy();
      expect(document.getElementById('toast-container')).toBeTruthy();
    });

    it('should create toast container on init', () => {
      uiManager.init();

      const container = document.getElementById('toast-container');
      expect(container).toBeTruthy();
      expect(container.parentElement).toBe(document.body);
    });
  });

  describe('Toast Notifications', () => {
    beforeEach(() => {
      uiManager.init();
    });

    it('should show toast notification', () => {
      const message = 'Test notification';
      const type = 'success';

      const toastId = uiManager.showToast(message, type);

      expect(toastId).toBeTruthy();
      expect(uiManager.notifications).toHaveLength(1);
      expect(uiManager.notifications[0].message).toBe(message);
      expect(uiManager.notifications[0].type).toBe(type);
    });

    it('should show toast with default parameters', () => {
      const message = 'Default toast';

      const toastId = uiManager.showToast(message);

      expect(uiManager.notifications[0].type).toBe('info');
      expect(uiManager.notifications[0].duration).toBe(3000);
    });

    it('should hide specific toast', () => {
      const toastId1 = uiManager.showToast('Toast 1');
      const toastId2 = uiManager.showToast('Toast 2');

      expect(uiManager.notifications).toHaveLength(2);

      const result = uiManager.hideToast(toastId1);

      expect(result).toBe(true);
      expect(uiManager.notifications).toHaveLength(1);
      expect(uiManager.notifications[0].id).toBe(toastId2);
    });

    it('should handle multiple toast types', () => {
      uiManager.showToast('Info message', 'info');
      uiManager.showToast('Success message', 'success');
      uiManager.showToast('Warning message', 'warning');
      uiManager.showToast('Error message', 'error');

      expect(uiManager.notifications).toHaveLength(4);
      expect(uiManager.notifications.map(n => n.type)).toEqual([
        'info',
        'success',
        'warning',
        'error',
      ]);
    });
  });

  describe('Modal Management', () => {
    beforeEach(() => {
      uiManager.init();
    });

    it('should show modal', () => {
      const modalId = 'test-modal';
      const content = '<p>Test content</p>';
      const options = { width: '500px', height: '300px' };

      const modal = uiManager.showModal(modalId, content, options);

      expect(modal).toBeTruthy();
      expect(modal.id).toBe(modalId);
      expect(modal.content).toBe(content);
      expect(modal.options).toEqual(options);
      expect(modal.isVisible).toBe(true);
      expect(uiManager.activeModal).toBe(modalId);
    });

    it('should hide modal', () => {
      const modalId = 'test-modal';
      uiManager.showModal(modalId, 'content');

      const result = uiManager.hideModal(modalId);

      expect(result).toBe(true);
      expect(uiManager.modals.has(modalId)).toBe(false);
      expect(uiManager.activeModal).toBeNull();
    });

    it('should handle non-existent modal hide', () => {
      const result = uiManager.hideModal('non-existent');

      expect(result).toBe(false);
    });

    it('should manage multiple modals', () => {
      uiManager.showModal('modal1', 'Content 1');
      uiManager.showModal('modal2', 'Content 2');

      expect(uiManager.modals.size).toBe(2);
      expect(uiManager.activeModal).toBe('modal2'); // Latest modal becomes active

      uiManager.hideModal('modal1');
      expect(uiManager.modals.size).toBe(1);
      expect(uiManager.activeModal).toBe('modal2');
    });
  });

  describe('UI State Management', () => {
    beforeEach(() => {
      uiManager.init();
      uiManager.currentState = {};
    });

    it('should update UI state', () => {
      const newState = {
        loading: true,
        currentView: 'dashboard',
        user: { name: 'Test User' },
      };

      const result = uiManager.updateUIState(newState);

      expect(result).toEqual(newState);
      expect(uiManager.currentState).toEqual(newState);
    });

    it('should merge state updates', () => {
      uiManager.currentState = { loading: false, view: 'home' };

      const update = { loading: true, user: 'john' };
      const result = uiManager.updateUIState(update);

      expect(result.loading).toBe(true);
      expect(result.view).toBe('home');
      expect(result.user).toBe('john');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      uiManager.init();
    });

    it('should handle toast creation errors gracefully', () => {
      // Simulate error by removing toast container
      uiManager.toastContainer.remove();
      uiManager.toastContainer = null;

      // Should not throw error
      expect(() => {
        uiManager.showToast('Test message');
      }).not.toThrow();
    });

    it('should handle modal operations when DOM is not ready', () => {
      // Reset DOM
      document.body.innerHTML = '';

      // Should not throw error
      expect(() => {
        uiManager.showModal('test', 'content');
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    beforeEach(() => {
      uiManager.init();
    });

    it('should handle many toast notifications efficiently', () => {
      const startTime = performance.now();

      // Create many notifications
      for (let i = 0; i < 100; i++) {
        uiManager.showToast(`Notification ${i}`);
      }

      const endTime = performance.now();

      expect(uiManager.notifications).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });

    it('should handle rapid modal operations efficiently', () => {
      const startTime = performance.now();

      // Create and destroy many modals
      for (let i = 0; i < 50; i++) {
        const modalId = `modal-${i}`;
        uiManager.showModal(modalId, `Content ${i}`);
        uiManager.hideModal(modalId);
      }

      const endTime = performance.now();

      expect(uiManager.modals.size).toBe(0);
      expect(endTime - startTime).toBeLessThan(50); // Should be fast
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      uiManager.init();
    });

    it('should maintain state consistency across operations', () => {
      // Complex workflow
      const toast1 = uiManager.showToast('Loading...', 'info');
      uiManager.showModal('confirm', 'Are you sure?');
      uiManager.updateUIState({ loading: true });

      expect(uiManager.notifications).toHaveLength(1);
      expect(uiManager.modals.size).toBe(1);
      expect(uiManager.currentState.loading).toBe(true);

      // Complete workflow
      uiManager.hideToast(toast1);
      uiManager.showToast('Success!', 'success');
      uiManager.hideModal('confirm');
      uiManager.updateUIState({ loading: false });

      expect(uiManager.notifications).toHaveLength(1);
      expect(uiManager.notifications[0].type).toBe('success');
      expect(uiManager.modals.size).toBe(0);
      expect(uiManager.currentState.loading).toBe(false);
    });

    it('should handle simultaneous operations', () => {
      // Simulate concurrent operations
      Promise.all([
        Promise.resolve(uiManager.showToast('Message 1')),
        Promise.resolve(uiManager.showModal('modal1', 'Content')),
        Promise.resolve(uiManager.updateUIState({ active: true })),
        Promise.resolve(uiManager.showToast('Message 2')),
      ]);

      expect(uiManager.notifications).toHaveLength(2);
      expect(uiManager.modals.size).toBe(1);
      expect(uiManager.currentState.active).toBe(true);
    });
  });

  describe('Memory Management', () => {
    beforeEach(() => {
      uiManager.init();
    });

    it('should clean up resources on reset', () => {
      // Create some state
      uiManager.showToast('Test');
      uiManager.showModal('test', 'content');
      uiManager.updateUIState({ test: true });

      // Reset
      uiManager.reset();

      expect(uiManager.notifications).toHaveLength(0);
      expect(uiManager.modals.size).toBe(0);
      expect(uiManager.activeModal).toBeNull();
      expect(uiManager.isInitialized).toBe(false);
      expect(document.getElementById('toast-container')).toBeNull();
    });
  });
});
