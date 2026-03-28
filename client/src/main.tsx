import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts';
import { dbService } from './db/db.ts';

// SPA redirect handling for GitHub Pages
const redirect = sessionStorage.redirect;
delete sessionStorage.redirect;
if (redirect && redirect !== location.href) {
  history.replaceState(null, '', redirect);
}

dbService.init()
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>,
    );
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    document.getElementById('root')!.innerHTML = 
      '<div style="padding: 20px; color: red;">Failed to initialize database. Please refresh the page.</div>';
  });
