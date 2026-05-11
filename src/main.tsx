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
//
// Strategy: combined with `skipWaiting: true` + `clientsClaim: true` in
// the Workbox config, a new SW activates immediately on install and
// claims this page. The browser then fires `controllerchange`, which we
// listen for and silently reload the page. On iOS Safari PWAs this is
// the only reliable way to get the user onto the new bundle without
// asking them to fully quit and re-open the home-screen icon.
//
// We still show the "New version" toast as a courtesy when there's a
// pending SW we couldn't auto-apply (e.g. browsers that block silent
// reloads), but in practice most users won't see it — the page just
// quietly reloads to the latest bundle within ~1s of the new SW
// finishing precache.
let reloadingForUpdate = false;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadingForUpdate) return;
    reloadingForUpdate = true;
    window.location.reload();
  });
}

const updateSW = registerSW({
  onNeedRefresh() {
    // Belt-and-suspenders for browsers where controllerchange doesn't
    // fire (Firefox in some configs). Show the toast so the user can
    // tap Reload manually.
    window.dispatchEvent(new Event('pwa-need-refresh'));
  },
  onRegistered(r) {
    if (!r) return;
    const checkForUpdate = () => r.update().catch(() => undefined);
    // Check every 5 min — faster loop than the previous 15 min so a
    // mid-day deploy lands on dad's phone before the trip ends.
    // Negligible bandwidth/cost (HEAD-ish request to the SW URL).
    setInterval(checkForUpdate, 5 * 60 * 1000);
    // Also check whenever the tab becomes visible again. A user who
    // backgrounds the PWA for hours and reopens it would otherwise
    // sit on the stale cached bundle until the next 5-min tick.
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
