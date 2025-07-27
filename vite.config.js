import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}`;
              }
            }
          },
          {
            urlPattern: /^https:\/\/theecigarmaestro\.vercel\.app\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo.png'],
      manifest: {
        name: 'Thee Cigar Maestro',
        short_name: 'CigarMaestro',
        description: 'Sophisticated cigar experience with 3D visualization and AI assistance',
        theme_color: '#c69c6d',
        background_color: '#121212',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['lifestyle', 'education', 'entertainment'],
        screenshots: [
          {
            src: 'screenshot-wide.png',
            type: 'image/png',
            sizes: '1280x720',
            form_factor: 'wide'
          },
          {
            src: 'screenshot-narrow.png',
            type: 'image/png',
            sizes: '750x1334',
            form_factor: 'narrow'
          }
        ]
      }
    })
  ],
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: 'index.html',
        dashboard: 'dashboard.html',
        ritual: 'flavorverse_ritual_trail_interface.html'
      },
      output: {
        manualChunks: {
          three: ['three'],
          'three-controls': ['three/examples/jsm/controls/OrbitControls.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'cross-origin',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  preview: {
    port: 3001,
    cors: true
  },
  optimizeDeps: {
    include: ['three', 'three/examples/jsm/controls/OrbitControls.js']
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});