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
import SliderDetails from './pages/SliderDetails.tsx'
import ChooseDepartment from './pages/ChooseDepartment.tsx'
import CustomerWelcome from './pages/customer/CustomerWelcome.tsx'
import CustomerRegisterForm from './pages/customer/CustomerRegisterForm.tsx'
import ManufacturerWelcome from './pages/manufacturer/ManufacturerWelcome.tsx'
import ManufacturerRegisterForm from './pages/manufacturer/ManufacturerRegisterForm.tsx'
import Services from './pages/services/Services.tsx'
import { TermsAndConditions } from './pages/services/terms'
import { FactorySelection } from './pages/services/select_factory'
import { PlaceOrderForm, PlaceOrderSuccess } from './pages/services/place_order'
import { OnlineB2BForm, OnlineB2BSuccess, OfferList } from './pages/services/online_b2b'
import { PackageSelection, PackageDetails, ApplicationForm, ApplicationSuccess } from './pages/services/custom_order'
import ApplicationFormPage from './pages/ApplicationForm.tsx'
import ApplicationSuccessPage from './pages/ApplicationSuccess.tsx'
import LocalizationEditor from './pages/LocalizationEditor.tsx'
import { Toaster } from 'sonner'
import { setSafeAreaCSSProperties, waitForSafeAreaValues } from './utils/safeAreaUtils.ts'
// import { initEruda } from './utils/eruda.ts'
import { ServicesRouteGuard, RegistrationRouteGuard } from './components/RouteGuards'
import { ScrollToTop } from './components/ScrollToTop'
// import { DebugPath } from './components/DebugPath'
import { initEruda } from './utils/eruda.ts'
import { RouteLogger } from './components/RouteLogger'

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

  // Initialize the Telegram Mini Apps SDK (only in Telegram environment)
  await initSDK();

  // Wait for safe area values to be available (handles both Telegram and web)
  await waitForSafeAreaValues();

  // Set safe area CSS properties (works for both environments)
  setSafeAreaCSSProperties();

  // Render the app
  const root = document.getElementById('root');
  createRoot(root!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TelegramUserProvider>
          <BrowserRouter>
            <ScrollToTop />
            <RouteLogger />
            {/* <DebugPath /> */}
            <Toaster />
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/slider/:id" element={<SliderDetails />} />
              <Route path="/choose-department" element={
                // <ChooseDepartmentGuard>
                <ChooseDepartment />
                // </ChooseDepartmentGuard>
              } />

              {/* Customer Routes */}
              <Route path="/customer">
                <Route index element={
                  <RegistrationRouteGuard allowedUserType="customer">
                    <CustomerWelcome />
                  </RegistrationRouteGuard>
                } />
                <Route path="welcome" element={
                  <RegistrationRouteGuard allowedUserType="customer">
                    <CustomerWelcome />
                  </RegistrationRouteGuard>
                } />
                <Route path="register" element={
                  <RegistrationRouteGuard allowedUserType="customer">
                    <CustomerRegisterForm />
                  </RegistrationRouteGuard>
                } />
              </Route>

              {/* Manufacturer Routes */}
              <Route path="/manufacturer">
                <Route index element={
                  <RegistrationRouteGuard allowedUserType="manufacturer">
                    <ManufacturerWelcome />
                  </RegistrationRouteGuard>
                } />
                <Route path="welcome" element={
                  <RegistrationRouteGuard allowedUserType="manufacturer">
                    <ManufacturerWelcome />
                  </RegistrationRouteGuard>
                } />
                <Route path="register" element={
                  <RegistrationRouteGuard allowedUserType="manufacturer">
                    <ManufacturerRegisterForm />
                  </RegistrationRouteGuard>
                } />
              </Route>

              {/* Services Routes - Only accessible if registered */}
              <Route path="/services" element={
                <ServicesRouteGuard>
                  <Services />
                </ServicesRouteGuard>
              } />
              <Route path="/services/terms" element={
                <ServicesRouteGuard>
                  <TermsAndConditions />
                </ServicesRouteGuard>
              } />
              <Route path="/services/factory-selection" element={
                <ServicesRouteGuard>
                  <FactorySelection />
                </ServicesRouteGuard>
              } />
              <Route path="/services/place-order" element={
                <ServicesRouteGuard>
                  <PlaceOrderForm />
                </ServicesRouteGuard>
              } />
              <Route path="/services/place-order/success" element={
                <ServicesRouteGuard>
                  <PlaceOrderSuccess />
                </ServicesRouteGuard>
              } />
              <Route path="/services/online-b2b" element={
                <ServicesRouteGuard>
                  <OnlineB2BForm />
                </ServicesRouteGuard>
              } />
              <Route path="/services/online-b2b/success" element={
                <ServicesRouteGuard>
                  <OnlineB2BSuccess />
                </ServicesRouteGuard>
              } />
              <Route path="/services/online-b2b/offers" element={
                <ServicesRouteGuard>
                  <OfferList />
                </ServicesRouteGuard>
              } />
              <Route path="/services/custom-order" element={
                <ServicesRouteGuard>
                  <PackageSelection />
                </ServicesRouteGuard>
              } />
              <Route path="/services/custom-order/details" element={
                <ServicesRouteGuard>
                  <PackageDetails />
                </ServicesRouteGuard>
              } />
              <Route path="/services/custom-order/application" element={
                <ServicesRouteGuard>
                  <ApplicationForm />
                </ServicesRouteGuard>
              } />
              <Route path="/services/custom-order/success" element={
                <ServicesRouteGuard>
                  <ApplicationSuccess />
                </ServicesRouteGuard>
              } />

              {/* Application Form Routes */}
              <Route path="/application-form" element={<ApplicationFormPage />} />
              <Route path="/application-success" element={<ApplicationSuccessPage />} />

              <Route path="/dev" element={<Dev />} />
              <Route path="/localization-editor" element={<LocalizationEditor />} />
            </Routes>
          </BrowserRouter>
        </TelegramUserProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

// Start the initialization process
initializeApp();
