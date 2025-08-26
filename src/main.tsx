import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { initSDK } from './utils/telegramSDK'
import '@fontsource/plus-jakarta-sans/200.css'
import '@fontsource/plus-jakarta-sans/300.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'
import './index.css'
import './i18n'
import App from './App.tsx'
import Dev from './pages/Dev.tsx'
import Welcome from './pages/Welcome.tsx'
import ChooseDepartment from './pages/ChooseDepartment.tsx'
import CustomerWelcome from './pages/Buyurtmachi/CustomerWelcome.tsx'

// Initialize the Telegram Mini Apps SDK properly
initSDK().then((result) => {
  console.log('Telegram SDK initialized:', result);
}).catch((error) => {
  console.error('Failed to initialize Telegram SDK:', error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/choose-department" element={<ChooseDepartment />} />
        <Route path="/customer/welcome" element={<CustomerWelcome />} />
        <Route path="/dev" element={<Dev />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
