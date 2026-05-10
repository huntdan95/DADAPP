import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { registerSW } from 'virtual:pwa-register';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// PWA service-worker registration. The virtual module is a no-op in dev
// (we set devOptions.enabled = false) and emits a real SW in production.
const updateSW = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new Event('pwa-need-refresh'));
  },
  onRegistered(r) {
    // Hourly check for newer SW while the tab stays open.
    if (r) {
      setInterval(
        () => {
          r.update().catch(() => undefined);
        },
        60 * 60 * 1000
      );
    }
  },
});

window.addEventListener('pwa-update-now', () => {
  updateSW(true);
});
