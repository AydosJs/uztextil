import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
import CustomerWelcome from './pages/customer/CustomerWelcome.tsx'
import CustomerRegisterForm from './pages/customer/CustomerRegisterForm.tsx'
import CustomerAdditionalServices from './pages/customer/AdditionalServices.tsx'
import ManufacturerAdditionalServices from './pages/manufacturer/AdditionalServices.tsx'
import SubmitApplication from './pages/customer/SubmitApplication.tsx'
import ManufacturerWelcome from './pages/manufacturer/ManufacturerWelcome.tsx'
import ManufacturerRegisterForm from './pages/manufacturer/ManufacturerRegisterForm.tsx'
import Services from './pages/services/Services.tsx'
import { Toaster } from 'sonner'
import { setSafeAreaCSSProperties, waitForSafeAreaValues } from './utils/safeAreaUtils.ts'

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Initialize app with proper loading state
async function initializeApp() {
  try {
    // Show loading state
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="
          display: flex; 
          justify-content: center; 
          align-items: center; 
          height: 100vh; 
          background: #101017; 
          color: white; 
          font-family: system-ui, -apple-system, sans-serif;
          flex-direction: column;
          gap: 16px;
        ">
          <div style="
            width: 40px; 
            height: 40px; 
            border: 3px solid #ffffff20; 
            border-top: 3px solid #ffffff; 
            border-radius: 50%; 
            animation: spin 1s linear infinite;
          "></div>
          <div>Initializing Telegram Mini App...</div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
    }

    // Initialize the Telegram Mini Apps SDK
    console.log('Initializing Telegram SDK...');
    await initSDK();
    console.log('Telegram SDK initialized successfully');

    // Wait for safe area values to be available
    console.log('Waiting for safe area values...');
    await waitForSafeAreaValues();
    console.log('Safe area values received');

    // Set safe area CSS properties
    console.log('Setting safe area CSS properties...');
    setSafeAreaCSSProperties();
    console.log('Safe area CSS properties set successfully');

    // Render the app
    console.log('Rendering app...');
    createRoot(root!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Toaster />
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/choose-department" element={<ChooseDepartment />} />

              {/* Customer Routes */}
              <Route path="/customer">
                <Route index element={<CustomerWelcome />} />
                <Route path="welcome" element={<CustomerWelcome />} />
                <Route path="register" element={<CustomerRegisterForm />} />
                <Route path="additional-services" element={<CustomerAdditionalServices />} />
                <Route path="submit-application" element={<SubmitApplication />} />
              </Route>

              {/* Manufacturer Routes */}
              <Route path="/manufacturer">
                <Route index element={<ManufacturerWelcome />} />
                <Route path="welcome" element={<ManufacturerWelcome />} />
                <Route path="register" element={<ManufacturerRegisterForm />} />
                <Route path="additional-services" element={<ManufacturerAdditionalServices />} />
              </Route>

              <Route path="/services" element={<Services />} />
              <Route path="/dev" element={<Dev />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>,
    );
    console.log('App rendered successfully');

  } catch (error) {
    console.error('Failed to initialize app:', error);
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="
          display: flex; 
          justify-content: center; 
          align-items: center; 
          height: 100vh; 
          background: #101017; 
          color: #ef4444; 
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <h2>Initialization Failed</h2>
            <p>Failed to initialize Telegram Mini App</p>
            <p style="font-size: 14px; color: #9ca3af; margin-top: 16px;">
              ${error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <button onclick="location.reload()" style="
              margin-top: 16px;
              padding: 8px 16px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
            ">Retry</button>
          </div>
        </div>
      `;
    }
  }
}

// Start the initialization process
initializeApp();
