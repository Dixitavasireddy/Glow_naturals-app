import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: vi.fn(function(key) { return this.store[key] || null; }),
  setItem: vi.fn(function(key, value) { this.store[key] = value; }),
  removeItem: vi.fn(function(key) { delete this.store[key]; }),
  clear: vi.fn(function() { this.store = {}; }),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  store: {},
  getItem: vi.fn(function(key) { return this.store[key] || null; }),
  setItem: vi.fn(function(key, value) { this.store[key] = value; }),
  removeItem: vi.fn(function(key) { delete this.store[key]; }),
  clear: vi.fn(function() { this.store = {}; }),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock scrollTo
window.scrollTo = vi.fn();

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.store = {};
  sessionStorageMock.store = {};
});
