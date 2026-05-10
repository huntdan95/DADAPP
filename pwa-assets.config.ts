import {
  defineConfig,
  minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config';

/**
 * Generates the PWA PNG icon set from the SVG source files in /public.
 * Run via `npx pwa-assets-generator` — the output goes to /public.
 *
 * Source files:
 *   pwa-icon.svg          → favicon, apple-touch-icon, transparent variants
 *   pwa-icon-maskable.svg → maskable variants (safe-zone padding for adaptive icons)
 */
export default defineConfig({
  preset,
  images: ['public/pwa-icon.svg'],
});
