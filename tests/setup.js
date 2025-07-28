import { vi } from 'vitest';

// Mock THREE.js for testing environment
global.THREE = {
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    setPixelRatio: vi.fn(),
    domElement: document.createElement('canvas')
  })),
  SphereGeometry: vi.fn(),
  MeshBasicMaterial: vi.fn(),
  Mesh: vi.fn(),
  Color: vi.fn(),
  Vector2: vi.fn(),
  Raycaster: vi.fn(),
  OrbitControls: vi.fn()
};

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock MediaRecorder API
global.MediaRecorder = vi.fn(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  ondataavailable: null,
  onstop: null
}));

// Mock navigator APIs
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn(() => Promise.resolve({
      getTracks: vi.fn(() => [{ stop: vi.fn() }])
    }))
  },
  writable: true
});

// Mock localStorage with actual storage functionality
const createStorageMock = () => {
  const storage = new Map();
  return {
    getItem: vi.fn((key) => storage.get(key) || null),
    setItem: vi.fn((key, value) => {
      storage.set(key, value);
    }),
    removeItem: vi.fn((key) => {
      storage.delete(key);
    }),
    clear: vi.fn(() => {
      storage.clear();
    }),
    get length() {
      return storage.size;
    },
    key: vi.fn((index) => {
      const keys = Array.from(storage.keys());
      return keys[index] || null;
    })
  };
};

// Set up both global and window scopes for compatibility
const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

global.localStorage = localStorageMock;
global.sessionStorage = sessionStorageMock;

// Also create window object with storage for the test environment
global.window = {
  localStorage: localStorageMock,
  sessionStorage: sessionStorageMock,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  location: {
    href: 'http://localhost:3000',
    protocol: 'http:',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: ''
  }
};

// Mock IndexedDB
global.indexedDB = {
  open: vi.fn(() => ({
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null,
    result: null
  })),
  deleteDatabase: vi.fn()
};

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Setup DOM environment is now handled above with global.window

// Mock performance API
global.performance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn()
};

console.info('Test environment setup complete');