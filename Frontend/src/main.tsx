import './styles/index.css';
import './global-error-listener';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { router } from './routes/app-router';
// import { RouterProvider } from 'react-router-dom';
import { store } from './store';
import { Provider as ReduxProvider } from 'react-redux';
import { Toaster } from 'sonner';
// import { HelmetProvider } from 'react-helmet-async';
import App from './app';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <>
          <App />
          <Toaster position="bottom-center" richColors
          />
        </>

      </ReduxProvider>
    </ErrorBoundary>

  </StrictMode>
);
