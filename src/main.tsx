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
    if (!r) return;
    const checkForUpdate = () => r.update().catch(() => undefined);
    // Check every 15 min instead of hourly — users hit a fast loop
    // when we're shipping fixes and waiting an hour for the toast
    // to show is too long. Negligible cost.
    setInterval(checkForUpdate, 15 * 60 * 1000);
    // Also check whenever the tab becomes visible again. A user who
    // backgrounds the PWA for hours and reopens it would otherwise
    // sit on the stale cached bundle until the next 15-min tick.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkForUpdate();
    });
    // And on initial load. registerSW does this automatically but
    // belt-and-suspenders: a SW that was activated in a prior tab
    // can be skipped over here without the extra check.
    checkForUpdate();
  },
});

window.addEventListener('pwa-update-now', () => {
  updateSW(true);
});
