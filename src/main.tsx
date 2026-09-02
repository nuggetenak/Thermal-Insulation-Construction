import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

// HashRouter: GitHub Pages serves static files with no server-side rewrite,
// so path-based routes 404 on refresh or deep link.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
