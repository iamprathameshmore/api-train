import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { RouterProvider } from "react-router-dom"
import { store } from "./store"
import AppRouter from "./routes/app-router"
import "./styles/index.css"
import "./global-error-listener.ts"

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// PWA Install Prompt
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install prompt to user
  const installPrompt = document.createElement('div');
  installPrompt.className = 'pwa-install-prompt';
  installPrompt.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium">Install API Train</p>
        <p class="text-sm opacity-90">Add to home screen for quick access</p>
      </div>
      <div class="flex gap-2">
        <button id="install-btn" class="px-4 py-2 bg-white text-black rounded text-sm font-medium">Install</button>
        <button id="dismiss-btn" class="px-4 py-2 text-white opacity-80 text-sm">Dismiss</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(installPrompt);
  
  document.getElementById('install-btn')?.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      document.body.removeChild(installPrompt);
    });
  });
  
  document.getElementById('dismiss-btn')?.addEventListener('click', () => {
    document.body.removeChild(installPrompt);
  });
});

// Responsive utilities
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Set viewport height on load and resize
window.addEventListener('load', setViewportHeight);
window.addEventListener('resize', setViewportHeight);

// Touch feedback utility
document.addEventListener('touchstart', () => {}, { passive: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={AppRouter} />
    </Provider>
  </React.StrictMode>,
)
