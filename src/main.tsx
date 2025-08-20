import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSDK } from './utils/telegramSDK'
import './index.css'
import App from './App.tsx'

// Initialize the Telegram Mini Apps SDK properly
initSDK().then((result) => {
  console.log('Telegram SDK initialized:', result);
}).catch((error) => {
  console.error('Failed to initialize Telegram SDK:', error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
