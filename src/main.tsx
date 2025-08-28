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
import AdditionalServices from './pages/customer/AdditionalServices.tsx'
import SubmitApplication from './pages/customer/SubmitApplication.tsx'
import ManufacturerWelcome from './pages/manufacturer/ManufacturerWelcome.tsx'
import ManufacturerRegisterForm from './pages/manufacturer/ManufacturerRegisterForm.tsx'
import Services from './pages/services/Services.tsx'
import { Toaster } from 'sonner'

// Initialize the Telegram Mini Apps SDK properly
initSDK().then((result) => {
  console.log('Telegram SDK initialized:', result);
}).catch((error) => {
  console.error('Failed to initialize Telegram SDK:', error);
});

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

createRoot(document.getElementById('root')!).render(
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
            <Route path="additional-services" element={<AdditionalServices />} />
            <Route path="submit-application" element={<SubmitApplication />} />
          </Route>

          {/* Manufacturer Routes */}
          <Route path="/manufacturer">
            <Route index element={<ManufacturerWelcome />} />
            <Route path="welcome" element={<ManufacturerWelcome />} />
            <Route path="register" element={<ManufacturerRegisterForm />} />
          </Route>

          <Route path="/services" element={<Services />} />
          <Route path="/dev" element={<Dev />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
