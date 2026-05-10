/**
 * Minimal static-file server for Firebase App Hosting.
 *
 * App Hosting is built on Cloud Run; the container must bind to the PORT
 * env var. Vite produces a static SPA in dist/ — there's no Node server
 * by default, so the rollout fails with "container failed to start and
 * listen on the port" until we add this.
 *
 * Express's static handler covers everything fingerprinted (JS, CSS, PNG),
 * and the catch-all sends index.html so client-side routing works.
 */

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');
const port = Number(process.env.PORT) || 8080;

const app = express();

// Long-cache fingerprinted assets; never cache index.html so SW updates
// reach clients on next visit.
app.use(
  express.static(dist, {
    index: false,
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (filePath.endsWith('sw.js') || filePath.endsWith('workbox-')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (/\.(js|css|woff2|png|jpg|svg|ico)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);

// SPA fallback — everything not matched by static goes to the React app.
app.get('*', (_req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
