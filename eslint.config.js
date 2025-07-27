import js from '@eslint/js';
import html from 'eslint-plugin-html';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**', '*.min.js']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        THREE: 'readonly',
        __APP_VERSION__: 'readonly',
        __BUILD_TIME__: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Image: 'readonly',
        Audio: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        location: 'readonly',
        performance: 'readonly',
        PerformanceObserver: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        Blob: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        MutationObserver: 'readonly',
        IntersectionObserver: 'readonly',
        indexedDB: 'readonly',
        Storage: 'readonly',
        DOMException: 'readonly',
        gtag: 'readonly',
        dataLayer: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-alert': 'warn',
      'no-debugger': 'error',
      'no-unreachable': 'error',
      'consistent-return': 'error',
      'array-callback-return': 'error',
      'no-loop-func': 'error',
      'prefer-promise-reject-errors': 'error',
      'no-throw-literal': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-constructor': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'yoda': ['error', 'never'],
      'spaced-comment': ['error', 'always'],
      'camelcase': ['error', { properties: 'never' }],
      'new-cap': ['error', { newIsCap: true, capIsNew: false }],
      'no-array-constructor': 'error',
      'no-new-object': 'error',
      'no-new-wrappers': 'error',
      'radix': 'error',
      'no-redeclare': 'error',
      'no-shadow': 'error',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'for-direction': 'error',
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'warn',
      'no-promise-executor-return': 'error',
      'require-atomic-updates': 'warn'
    }
  },
  {
    files: ['**/*.html'],
    plugins: {
      html
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off'
    }
  },
  {
    files: ['service-worker.js', '**/sw.js', '**/workbox-*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        self: 'readonly',
        caches: 'readonly',
        clients: 'readonly',
        importScripts: 'readonly',
        location: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        FetchEvent: 'readonly',
        registration: 'readonly',
        define: 'readonly',
        _: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'error'
    }
  },
  {
    files: ['**/src/utils/errorHandler.js', 'src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
        Buffer: 'readonly'
      }
    }
  },
  {
    files: ['validate-data.js', 'integration-test.js', 'vite.config.js', 'vitest.config.js', '**/server.js', 'optimize-assets.js', 'scripts/**/*.js', 'backend-api/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly'
      }
    },
    rules: {
      'no-console': 'off'
    }
  },
  {
    files: ['**/ai-recommendation-engine.js', '**/analytics-integration.js', '**/auth-system.js', '**/local-storage-manager.js', '**/ui-enhancements.js', '**/advanced-search.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        THREE: 'readonly',
        gtag: 'readonly',
        dataLayer: 'readonly',
        module: 'readonly',
        exports: 'readonly'
      }
    },
    rules: {
      'no-console': 'off'
    }
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        global: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        vitest: 'readonly',
        Storage: 'readonly',
        DOMException: 'readonly',
        performance: 'readonly',
        window: 'readonly',
        document: 'readonly'
      }
    },
    rules: {
      'no-console': 'off'
    }
  },
  prettier
];