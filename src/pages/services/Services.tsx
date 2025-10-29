import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import { RadialEffect, UnderwaterHeader, PaymentAlert, Spinner } from "@/components/ui"
import { useApiV1ServiceListList } from "@/lib/api"
import type { AdditionalService } from "@/lib/api/model"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import { ServiceCardShimmer } from "./components"
import { checkPaymentStatus } from "@/lib/api/paymentApi"
import { TELEGRAM_CONFIG } from "@/lib/config"

function Services() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { userInfo, userType } = useTelegramUser()
    const [department, setDepartment] = useState<'customer' | 'manufacturer' | null>(null)
    const [isCheckingPayment, setIsCheckingPayment] = useState(false)
    const [paymentAlertOpen, setPaymentAlertOpen] = useState(false)
    const [paymentAlertType, setPaymentAlertType] = useState<'notPaid' | 'error'>('notPaid')
    const [selectedService, setSelectedService] = useState<AdditionalService | null>(null)
    const [clickedServiceId, setClickedServiceId] = useState<number | null>(null)

    // Initialize department from localStorage, navigation state, or userType
    useEffect(() => {
        // First, try to get from localStorage
        const storedDepartment = localStorage.getItem('user_department') as 'customer' | 'manufacturer' | null

        // Then try navigation state
        const navigationDepartment = (location.state as { department?: 'customer' | 'manufacturer' })?.department

        // Finally fallback to userType
        const finalDepartment = storedDepartment || navigationDepartment || userType

        if (finalDepartment) {
            setDepartment(finalDepartment)
            // Store in localStorage for future use
            localStorage.setItem('user_department', finalDepartment)
        }
    }, [location.state, userType])

    // Show back button - navigate to choose department (always allow this)
    useTelegramBackButton({
        navigateTo: '/choose-department',
        onBack: () => {
            console.log('Back button clicked, navigating to choose-department')
            navigate('/choose-department')
        }
    })

    const navigateToService = useCallback((service: AdditionalService) => {
        // Route to different pages based on service option
        switch (service.option) {
            case 'video_review':
            case 'invite_manager':
            case 'training_reps':
                // These options go to terms and conditions page
                navigate('/services/terms', { state: { service } })
                break
            case 'place_order':
                // This option goes to place order form
                navigate('/services/place-order', { state: { service } })
                break
            case 'online_b2b':
                // This option goes to online B2B form
                navigate('/services/online-b2b', { state: { service } })
                break
            case 'custom_order':
                // This option goes to package selection
                navigate('/services/custom-order', { state: { service } })
                break
            case 'select_factory':
                // This option goes to factory selection
                navigate('/services/factory-selection', { state: { service } })
                break
            default:
                // Default fallback to terms and conditions
                navigate('/services/terms', { state: { service } })
                break
        }
    }, [navigate])

    const handlePaymentSuccess = useCallback(async (transactionId: string) => {
        console.log('Payment successful:', transactionId)
        setPaymentAlertOpen(false)

        // Check payment status to confirm it was successful
        if (selectedService && userInfo?.user_id && selectedService.id) {
            try {
                const paymentResponse = await checkPaymentStatus({
                    bot_user_id: userInfo.user_id,
                    service_id: selectedService.id
                })

                if (paymentResponse.success) {
                    // Payment confirmed, proceed to navigate to service page
                    navigateToService(selectedService)
                } else {
                    // Payment not confirmed, show error
                    setPaymentAlertType('error')
                    setPaymentAlertOpen(true)
                }
            } catch (error) {
                console.error('Payment verification failed:', error)
                setPaymentAlertType('error')
                setPaymentAlertOpen(true)
            }
        }
    }, [selectedService, userInfo?.user_id, navigateToService])

    const handlePaymentError = (error: string) => {
        console.error('Payment failed:', error)
        setPaymentAlertType('error')
        setPaymentAlertOpen(true)
    }

    const handlePaymentAlertClose = () => {
        setPaymentAlertOpen(false)
        setSelectedService(null)
        setClickedServiceId(null)
    }

    const handlePaymentRetry = async () => {
        if (!selectedService || !userInfo?.user_id) return

        setPaymentAlertOpen(false)
        await handleServiceClickWithPayment(selectedService)
    }

    const handleServiceClickWithPayment = async (service: AdditionalService) => {
        if (!userInfo?.user_id) {
            console.error('Missing user ID')
            return
        }

        setSelectedService(service)
        setClickedServiceId(service.id || null)
        setIsCheckingPayment(true)

        try {
            console.log('Checking payment status for user:', userInfo.user_id, 'service:', service.id)
            const paymentResponse = await checkPaymentStatus({
                bot_user_id: userInfo.user_id,
                service_id: service.id || 0
            })

            console.log('Payment check response:', paymentResponse)

            if (paymentResponse.success) {
                // Payment is successful, proceed to navigate
                console.log('Payment confirmed, navigating to service')
                setPaymentAlertOpen(false) // Close payment alert if it was open
                navigateToService(service)
            } else {
                // Payment not made, show alert
                console.log('Payment not confirmed, showing payment alert')
                setPaymentAlertType('notPaid')
                setPaymentAlertOpen(true)
            }
        } catch (error) {
            console.error('Payment check failed:', error)
            setPaymentAlertType('error')
            setPaymentAlertOpen(true)
        } finally {
            setIsCheckingPayment(false)
        }
    }

    // Fetch additional services from API
    const { data: allServices, isLoading, error } = useApiV1ServiceListList(
        undefined, // No parameters needed for this API
        {
            query: {
                enabled: !!userInfo?.user_id && !!department
            }
        }
    )

    // Filter services by department on the client side
    const services = allServices?.results?.filter(service => {
        if (!service.type) return true // Show services without type
        return service.type === department
    }) || []

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden bg-background-primary">
                <UnderwaterHeader />
                <RadialEffect
                    className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
                />
                <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                    <div className="text-left space-y-4 mb-8 px-4 pt-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {t('app.xizmatlar.title') || 'Xizmatlar'}
                        </h1>
                    </div>
                    <div className="flex-1 pb-8">
                        <ServiceCardShimmer count={3} />
                    </div>
                </main>
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden bg-background-primary">
                <RadialEffect
                    className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
                />
                <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                    <div className="text-left space-y-4 mb-8 px-4 pt-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {t('app.xizmatlar.title') || 'Xizmatlar'}
                        </h1>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-status-error text-lg mb-4">{t('app.packageSelection.error.message')}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                            >
                                {t('app.packageSelection.error.retryButton')}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // Show services or empty state
    const hasServices = services && services.length > 0

    return (
        <div className="min-h-screen min-w-full bg-background-primary safe-area-pt w-full dark flex flex-col relative overflow-hidden">
            <UnderwaterHeader />

            <RadialEffect
                className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />

            <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                {/* Header */}
                <div className="text-left space-y-4 mb-8 px-4 pt-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.xizmatlar.title')}
                    </h1>
                </div>

                {/* Services Grid */}
                <div className="flex-1 pb-8">
                    {!hasServices ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-text-secondary text-lg">{t('common.noServicesAvailable')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-9">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => !isCheckingPayment && handleServiceClickWithPayment(service)}
                                    className={`relative flex items-center justify-between px-6 pr-3 flex-row w-full h-[108px] rounded-[22px] border border-border-primary bg-background-card shadow-card overflow-hidden ${isCheckingPayment ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    style={{
                                        backdropFilter: 'blur(128px)',
                                        WebkitBackdropFilter: 'blur(128px)'
                                    }}
                                >
                                    {service.id}

                                    {/* Service Content */}
                                    <div className=" space-y-1">
                                        <h3 className="text-white font-extrabold text-base">
                                            {service.name}
                                        </h3>
                                        {(service.option === 'select_factory' || service.option === 'online_b2b' || service.option === 'custom_order') && service.description && (
                                            <p className="text-text-secondary font-normal text-xs">
                                                {service.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Service Price or Loading Spinner */}
                                    {isCheckingPayment && clickedServiceId === service.id ? (
                                        <div className="min-w-[110px] flex items-center justify-center">
                                            <Spinner className="w-5 h-5 text-brand-primary" />
                                        </div>
                                    ) : (
                                        service.price !== undefined && service.option !== 'custom_order' && (
                                            String(service.price) === '0' || String(service.price) === '0.00' ? (
                                                <p className="text-brand-primary font-bold min-w-[110px] text-sm text-center">
                                                    Бесплатно
                                                </p>
                                            ) : (
                                                <p className="text-brand-primary font-bold min-w-[110px] text-lg text-center">
                                                    ${service.price}
                                                </p>
                                            )
                                        )
                                    )}

                                    <div className="absolute right-2 top-0">
                                        <svg width="111" height="108" viewBox="0 0 111 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.16" d="M1.73438 -0.265625L109.266 107.266M109.266 -0.265625L1.73438 107.266M38.1549 -2V109M55.4979 -2V109M72.8435 -2V109M111 36.1565L0 36.1565M111 53.4994L0 53.4994M111 70.8449L0 70.8449M90.1875 53.5C90.1875 72.6574 74.6574 88.1875 55.5 88.1875C36.3426 88.1875 20.8125 72.6574 20.8125 53.5C20.8125 34.3426 36.3426 18.8125 55.5 18.8125C74.6574 18.8125 90.1875 34.3426 90.1875 53.5ZM72.8438 53.5C72.8438 63.0787 65.0787 70.8438 55.5 70.8438C45.9213 70.8438 38.1563 63.0787 38.1563 53.5C38.1563 43.9213 45.9213 36.1563 55.5 36.1563C65.0787 36.1563 72.8438 43.9213 72.8438 53.5Z" stroke="url(#paint0_radial_27_18405)" strokeWidth="0.5" />
                                            <defs>
                                                <radialGradient id="paint0_radial_27_18405" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(55.5 53.5) rotate(90) scale(55.5)">
                                                    <stop stopColor="white" />
                                                    <stop offset="0.5" stopColor="white" stopOpacity="0.25" />
                                                    <stop offset="1" stopColor="white" stopOpacity="0" />
                                                </radialGradient>
                                            </defs>
                                        </svg>
                                    </div>


                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Payment Alert */}
            <PaymentAlert
                isOpen={paymentAlertOpen}
                onClose={handlePaymentAlertClose}
                type={paymentAlertType}
                onRetry={paymentAlertType === 'error' ? handlePaymentRetry : undefined}
                price={selectedService?.price_sum ? parseFloat(selectedService.price_sum) : (selectedService?.price ? parseFloat(selectedService.price) : undefined)}
                currency="UZS"
                additionalService={selectedService?.id}
                reference={`SERVICE-${selectedService?.id}-${Date.now()}`}
                redirectUrl={`https://t.me/${TELEGRAM_CONFIG.BOT_USERNAME}`}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
            />
        </div>
    )
}

export default Services
