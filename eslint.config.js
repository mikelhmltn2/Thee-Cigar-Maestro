import js from '@eslint/js';

export default [
  {
    ignores: ['**/node_modules/**', '.next/**', 'dist/**', 'coverage/**', 'build/**'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        FileReader: 'readonly',
        Blob: 'readonly',

        // Web APIs
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        indexedDB: 'readonly',
        MediaRecorder: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        PerformanceObserver: 'readonly',
        MutationObserver: 'readonly',
        performance: 'readonly',
        location: 'readonly',
        Notification: 'readonly',
        SpeechSynthesisUtterance: 'readonly',
        XMLHttpRequest: 'readonly',
        Image: 'readonly',
        CSSRule: 'readonly',
        Worker: 'readonly',
        trustedTypes: 'readonly',
        scheduler: 'readonly',

        // Timer functions
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',

        // Network/Fetch APIs
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',

        // Event APIs
        Event: 'readonly',
        CustomEvent: 'readonly',
        FetchEvent: 'readonly',

        // Data/encoding
        atob: 'readonly',
        btoa: 'readonly',

        // Misc browser APIs
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',

        // Three.js globals
        THREE: 'readonly',

        // Analytics globals
        gtag: 'readonly',
        dataLayer: 'readonly',

        // Storage APIs
        Storage: 'readonly',
        DOMException: 'readonly',

        // Node.js globals (for backend and scripts)
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      // Relax some strict rules for development
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info'],
        },
      ],
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'consistent-return': 'warn',
      eqeqeq: ['error', 'always'],
      radix: 'error',
      'require-atomic-updates': 'warn',
      'no-await-in-loop': 'warn',
      'no-promise-executor-return': 'error',
      'no-shadow': 'warn',

      // Allow undefined error variables in catch blocks
      'no-undef': [
        'error',
        {
          typeof: false,
        },
      ],
    },
  },
  {
    // Service Worker specific configuration
    files: ['**/service-worker.js', '**/sw.js', '**/workbox-*.js', 'sw-*.js'],
    languageOptions: {
      globals: {
        // Service Worker globals
        self: 'readonly',
        caches: 'readonly',
        clients: 'readonly',
        importScripts: 'readonly',
        registration: 'readonly',
        skipWaiting: 'readonly',

        // Web APIs in SW context
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        FetchEvent: 'readonly',
        ExtendableEvent: 'readonly',
        InstallEvent: 'readonly',
        ActivateEvent: 'readonly',
        location: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',

        // Build tool globals
        define: 'readonly',
        _: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    // Backend-specific configuration
    files: ['backend-api/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      globals: {
        // Node.js specific globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',

        // Node.js timer functions
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      'no-promise-executor-return': 'off',
      radix: 'off',
      'no-await-in-loop': 'off',
    },
  },
  {
    // Test-specific configuration
    files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        // Vitest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',

        // Test environment globals
        Storage: 'readonly',
        DOMException: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: {
      // Relax rules for tests
      'no-console': 'off',
      'no-unused-vars': 'off',
      'no-promise-executor-return': 'off',
    },
  },
  {
    // Build output files (ignore ESLint for these)
    files: ['dist/**/*.js'],
    rules: {
      // Disable all rules for build output
      'no-undef': 'off',
      'no-unused-vars': 'off',
      eqeqeq: 'off',
      'no-promise-executor-return': 'off',
      radix: 'off',
    },
  },
  {
    // Configuration files
    files: ['*.config.js', 'vite.config.js', 'vitest.config.js'],
    rules: {
      'no-console': 'off',
    },
  },
];
