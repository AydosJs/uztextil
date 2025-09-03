import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initSDK } from './utils/telegramSDK'
import { TelegramUserProvider } from './contexts/TelegramUserContext'
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
import TermsAndConditions from './pages/services/TermsAndConditions.tsx'
import { Toaster } from 'sonner'
import { setSafeAreaCSSProperties, waitForSafeAreaValues } from './utils/safeAreaUtils.ts'
import { initEruda } from './utils/eruda.ts'
import { GlobalAuthGuard } from '@/components/GlobalAuthGuard'

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

// Initialize app
async function initializeApp() {
  // Initialize Eruda for mobile debugging (development only)
  await initEruda();

  // Initialize the Telegram Mini Apps SDK
  await initSDK();

  // Wait for safe area values to be available
  await waitForSafeAreaValues();

  // Set safe area CSS properties
  setSafeAreaCSSProperties();

  // Render the app
  const root = document.getElementById('root');
  createRoot(root!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TelegramUserProvider>
          <BrowserRouter>
            <GlobalAuthGuard>
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
                <Route path="/services/terms" element={<TermsAndConditions />} />
                <Route path="/dev" element={<Dev />} />
              </Routes>
            </GlobalAuthGuard>
          </BrowserRouter>
        </TelegramUserProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

// Start the initialization process
initializeApp();
