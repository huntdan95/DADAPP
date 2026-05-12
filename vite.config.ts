import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon-180x180.png',
        'fish.svg',
        'pwa-icon.svg',
      ],
      manifest: {
        name: "Fishing Dad's Co-Pilot",
        short_name: 'Fishing Dad',
        description:
          'Pre-trip conditions, on-the-water logging, and pattern recognition for the spots you actually fish.',
        theme_color: '#0a0e0a',
        background_color: '#0a0e0a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the app shell + bundles.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Bumped from the 2 MiB default — the main bundle has grown past
        // 2 MB now that the waterbodies database (1200+ entries) ships in
        // the app. Without this, the precache silently skips the bundle
        // and the PWA loads stale code offline.
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        // App-shell route → /index.html for client routing fallback.
        navigateFallback: '/index.html',
        // New SW takes over immediately on install. Without this iOS
        // PWAs stay on the old SW until every tab is closed, which on
        // a home-screen install means "until the user force-quits the
        // app" — and the user typically never does that, so they sit
        // on the stale bundle for weeks. Combined with clientsClaim,
        // the next page load picks up the new bundle automatically.
        skipWaiting: true,
        clientsClaim: true,
        // Don't intercept Firebase OAuth + Firestore long-poll endpoints.
        navigateFallbackDenylist: [
          /^\/__\/auth\//,
          /^\/api\//,
          /firestore\.googleapis\.com/,
        ],
        runtimeCaching: [
          // Open-Meteo weather — network-first, stale-while-revalidate fallback.
          {
            urlPattern:
              /^https:\/\/(api|archive-api)\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'open-meteo',
              networkTimeoutSeconds: 4,
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60,        // 1 hour
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // USGS water services — same strategy.
          {
            urlPattern: /^https:\/\/waterservices\.usgs\.gov\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'usgs-water',
              networkTimeoutSeconds: 4,
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // OSM / Esri / OpenTopo tiles — cache-first, long TTL.
          {
            urlPattern:
              /^https:\/\/.*\.(tile\.openstreetmap|tile\.opentopomap|arcgisonline)\.(org|com)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Firebase Storage photos — cache-first, longer TTL.
          {
            urlPattern:
              /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'storage-photos',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 14, // 14 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,                        // turn off SW in dev — only in build/preview
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split the heavy deps so they don't bloat the main chunk.
          'firebase-app': [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/storage',
            'firebase/functions',
          ],
          leaflet: ['leaflet', 'react-leaflet'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
