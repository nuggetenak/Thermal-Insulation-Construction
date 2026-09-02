import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
import { getPrefs, applyTheme } from './reader';

// Applied before first paint so a dark-mode reader never gets a white flash.
const prefs = getPrefs();
applyTheme(prefs.theme);
document.documentElement.classList.toggle('no-furigana', !prefs.furigana);

// Offline support. The service worker is registered only in production; in dev
// it would serve stale bundles and cost an hour working out why.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Offline is an enhancement. Failing to register must never break the site.
    });
  });
}

// HashRouter: GitHub Pages serves static files with no server-side rewrite,
// so path-based routes 404 on refresh or deep link.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
