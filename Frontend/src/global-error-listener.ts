window.onerror = function (message, source, lineno, colno, error) {
    console.error("⛔ Global Error:", message, error);
  };
  
  window.onunhandledrejection = function (event) {
    console.error("⛔ Unhandled Rejection:", event.reason);
  };
  