import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// base: './' rend le build portable (Netlify, GitHub Pages, ouverture locale de dist).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Adhkār — Invocations du matin et du soir',
        short_name: 'Adhkār',
        description:
          'Invocations du matin et du soir, disponibles hors ligne, en français et en arabe.',
        theme_color: '#0d6e62',
        background_color: '#f4efe4',
        display: 'standalone',
        lang: 'fr',
        start_url: './',
        scope: './',
        orientation: 'any',
        categories: ['lifestyle', 'education'],
      },
      workbox: {
        // Évite un chargement asynchrone de Workbox qui raterait l'événement install.
        inlineWorkboxRuntime: true,
        globPatterns: ['**/*.{js,css,html,ico,svg,woff,woff2,png,mp3,json,webp}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.pathname.includes('/audio/') && url.pathname.endsWith('.mp3'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'adhkar-audio',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
      pwaAssets: {
        disabled: false,
        config: false,
        preset: 'minimal-2023',
        image: 'public/favicon.svg',
      },
    }),
  ],
  base: './',
})
