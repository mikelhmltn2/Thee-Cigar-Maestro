// Maintainability: Centralized configuration
const CONFIG = {
  apiEndpoint: 'https://theecigarmaestro.com/api/gpt', // Use environment variable in production
  autocompleteEndpoint: 'https://theecigarmaestro.com/api/autocomplete', // New endpoint for autocomplete
  debounceDelay: 300,
  maxHistoryItems: 5,
  rateLimitDelay: 1000,
  maxInputLength: 100,
  fetchTimeout: 10000, // 10 seconds
  i18n: {
    en: {
      searchPlaceholder: 'e.g., Padron 1964 Anniversary Maduro',
      searchButton: 'Search',
      searching: 'Searching...',
      noResults: 'No results found for "{query}".',
      error: 'An error occurred while searching.',
      offline: 'No internet connection.',
      rateLimit: 'Too many requests. Please wait.',
      serverError: 'Server error. Please try again later.',
      clearHistory: 'Clear History',
      recentSearches: 'Recent Searches'
    }
    // Add more languages as needed
  }
};
