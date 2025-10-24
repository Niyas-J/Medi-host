import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global error handler for better debugging
window.addEventListener('error', (event) => {
  console.error('🔴 Global Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🔴 Unhandled Promise Rejection:', event.reason);
});

// Log app initialization
console.log('🚀 Medi-Host App Starting...');
console.log('📱 Environment:', import.meta.env.MODE);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

