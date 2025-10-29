import { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { RadialEffect, Spinner, UnderwaterHeader, PaymentAlert } from "@/components/ui"
import { useApiV1ManufacturerListList, useApiV1ManufacturerDetailRead, useApiV1ContactSettingsContactSettingsList, useApiV1CategoryListList } from "@/lib/api"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import { ChevronRight, Search } from "lucide-react"
import { ManufacturerDetailDrawer, FilterDrawer } from "./components"
import { useTranslation } from "react-i18next"
import { checkPaymentStatus } from "@/lib/api/paymentApi"
import type { AdditionalService, ManufacturerList } from "@/lib/api/model"

interface FilterOptions {
    search: string
    category: number[]
    product_segment: number[]
    min_order_quantity: string
}

function FactorySelection() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { userInfo } = useTelegramUser()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
    const [selectedManufacturer, setSelectedManufacturer] = useState<ManufacturerList | null>(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)
    const [isCheckingPayment, setIsCheckingPayment] = useState(false)
    const [paymentAlertOpen, setPaymentAlertOpen] = useState(false)
    const [paymentAlertType, setPaymentAlertType] = useState<'notPaid' | 'error'>('notPaid')
    const [filters, setFilters] = useState<FilterOptions>({
        search: '',
        category: [],
        product_segment: [],
        min_order_quantity: ''
    })

    // Show back button that goes to services page
    useTelegramBackButton({ navigateTo: '/services' })

    // Get service data from navigation state
    const service = location.state?.service as AdditionalService

    const handlePaymentSuccess = useCallback(async (transactionId: string) => {
        console.log('Payment successful:', transactionId)
        setPaymentAlertOpen(false)

        // Check payment status to confirm it was successful
        if (selectedManufacturer && userInfo?.user_id && service?.id) {
            try {
                const paymentResponse = await checkPaymentStatus({
                    bot_user_id: userInfo.user_id,
                    service_id: service.id
                })

                if (paymentResponse.success) {
                    // Payment confirmed, proceed to show details
                    setDrawerOpen(true)
                    setIsLoadingDetails(true)
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
    }, [selectedManufacturer, userInfo?.user_id, service?.id])

    // Check for payment success in URL parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        if (urlParams.get('payment') === 'success' && selectedManufacturer) {
            // Payment was successful, verify and proceed
            handlePaymentSuccess('url_redirect')
        }
    }, [location.search, selectedManufacturer, handlePaymentSuccess])

    // Prepare API parameters - this will be reactive to filters changes
    const apiParams = {
        search: filters.search.trim() || undefined,
        category: filters.category.length > 0 ? filters.category.join(',') : undefined,
        product_segment: filters.product_segment.length > 0 ? filters.product_segment.join(',') : undefined,
        min_order_quantity: filters.min_order_quantity.trim() || undefined
    }


    // Fetch contact settings to get phone number
    const { data: contactSettings } = useApiV1ContactSettingsContactSettingsList()

    // Fetch categories list
    const { data: categoriesData, isLoading: categoriesLoading } = useApiV1CategoryListList()

    // Fetch manufacturer list with filters - this will refetch when apiParams change
    // Only fetch when at least one category is selected
    const { data: manufacturers, isLoading, error } = useApiV1ManufacturerListList(
        filters.category.length > 0 ? apiParams : undefined,
        {
            query: {
                enabled: filters.category.length > 0
            }
        }
    )

    // Fetch manufacturer details when a manufacturer is selected
    const { data: manufacturerDetail, isLoading: isDetailLoading, error: detailError } = useApiV1ManufacturerDetailRead(
        selectedManufacturer?.id || 0,
        {
            query: {
                enabled: !!selectedManufacturer?.id && isLoadingDetails
            }
        }
    )

    // Mark loading as complete when details are loaded
    useEffect(() => {
        if (isLoadingDetails && !isDetailLoading && manufacturerDetail && !detailError) {
            setIsLoadingDetails(false)
        }
    }, [isLoadingDetails, isDetailLoading, manufacturerDetail, detailError])

    // Handle error when loading details fails
    useEffect(() => {
        if (isLoadingDetails && detailError) {
            setIsLoadingDetails(false)
            // You can add error handling here, like showing a toast or error message
            console.error('Failed to load manufacturer details:', detailError)
        }
    }, [isLoadingDetails, detailError])

    // If no service data, redirect back to services
    if (!service) {
        navigate('/services')
        return null
    }

    // Show loading state only for initial page load (when categories are loading)
    if (categoriesLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden bg-background-primary">
                <UnderwaterHeader />
                <RadialEffect
                    className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
                />
                <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                    <div className="text-left space-y-4 mb-8 px-4 pt-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {service.name}
                        </h1>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <Spinner className="w-8 h-8 text-white" />
                    </div>
                </main>
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden bg-background-primary">
                <UnderwaterHeader />
                <RadialEffect
                    className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
                />
                <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                    <div className="text-left space-y-4 mb-8 px-4 pt-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {service.name}
                        </h1>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-status-error text-lg mb-4">{t('app.manufacturerDetail.error.message')}</p>
                            {/* <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                            >
                                {t('app.manufacturerDetail.error.retryButton')}
                            </button> */}
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    const handleFactorySelect = async (factory: ManufacturerList) => {
        if (!userInfo?.user_id || !service?.id) {
            console.error('Missing user ID or service ID')
            return
        }

        setSelectedManufacturer(factory)
        setIsCheckingPayment(true)

        try {
            console.log('Checking payment status for user:', userInfo.user_id, 'service:', service.id)
            const paymentResponse = await checkPaymentStatus({
                bot_user_id: userInfo.user_id,
                service_id: service.id
            })

            console.log('Payment check response:', paymentResponse)

            if (paymentResponse.success) {
                // Payment is successful, proceed to show details
                console.log('Payment confirmed, opening details drawer')
                setPaymentAlertOpen(false) // Close payment alert if it was open
                setDrawerOpen(true)
                setIsLoadingDetails(true)
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

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters)
    }

    const handleCategoryToggle = (categoryId: number) => {
        setFilters(prev => ({
            ...prev,
            category: prev.category.includes(categoryId)
                ? prev.category.filter(id => id !== categoryId)
                : [...prev.category, categoryId]
        }))
    }

    const handlePaymentAlertClose = () => {
        setPaymentAlertOpen(false)
        // Don't clear selectedManufacturer here as it might be needed for retry
    }

    const handlePaymentRetry = async () => {
        if (!selectedManufacturer || !userInfo?.user_id || !service?.id) return

        setPaymentAlertOpen(false)
        await handleFactorySelect(selectedManufacturer)
    }

    const handlePaymentError = (error: string) => {
        console.error('Payment failed:', error)
        // Could show a toast notification or update UI state
    }

    // Show manufacturers or empty state
    const hasManufacturers = manufacturers?.results && manufacturers.results.length > 0

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden bg-background-primary">
            <UnderwaterHeader />
            <RadialEffect
                className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />

            <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pt-4">
                    <h1 className="text-white font-bold text-2xl tracking-wide">
                        {t('app.filterDrawer.title')}
                    </h1>
                    {filters.category.length > 0 && (
                        <button
                            onClick={() => setFilterDrawerOpen(true)}
                            className="p-2 rounded-lg bg-background-card border border-border-primary hover:bg-background-card-hover transition-colors"
                        >
                            <Search className="w-5 h-5 text-white" />
                        </button>
                    )}
                </div>

                {/* Category Selection */}
                <div className="mb-8">
                    {categoriesLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Spinner className="w-6 h-6 text-white" />
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {categoriesData?.results?.map((category) => {
                                const isSelected = filters.category.includes(category.id || 0)
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryToggle(category.id || 0)}
                                        className={`px-4 py-4 rounded-lg border transition-all duration-200 ${isSelected
                                            ? 'bg-brand-primary text-black border-brand-primary shadow-brand'
                                            : 'bg-background-card text-white border-border-primary hover:bg-background-card-hover'
                                            }`}
                                    >
                                        {category.title}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Manufacturers List */}
                <div className="flex-1">
                    {filters.category.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-text-secondary text-lg">{t('app.categorySelection.selectCategoriesPrompt')}</p>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <Spinner className="w-8 h-8 text-white mb-4" />
                                <p className="text-text-secondary text-lg">{t('app.common.loading')}</p>
                            </div>
                        </div>
                    ) : !hasManufacturers ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-text-secondary text-lg">{t('app.common.noManufacturersAvailable')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {manufacturers.results.map((factory) => (
                                <div
                                    key={factory.id}
                                    className="w-full rounded-[16px] border border-border-primary bg-background-card shadow-card overflow-hidden"
                                >
                                    {/* Main Factory Section */}
                                    <div
                                        onClick={() => !isCheckingPayment && handleFactorySelect(factory)}
                                        className={`relative flex items-center justify-between min-h-[82px] py-2.5 px-3.5 flex-row ${isCheckingPayment ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    >
                                        {/* Factory Logo */}
                                        <div className="w-12 h-12 rounded-lg bg-brand-primary/13 flex items-center justify-center mr-4 flex-shrink-0">
                                            {factory.logo ? (
                                                <img
                                                    src={factory.logo}
                                                    alt={`${factory.company_name} logo`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-brand-primary font-bold text-lg">
                                                        {factory.company_name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Factory Content */}
                                        <div className="space-y-1 flex-1">
                                            <h3 className="text-white font-extrabold">
                                                {factory.full_name}
                                            </h3>
                                            <p className="text-text-secondary font-normal text-sm pr-10">
                                                {factory.company_name}
                                            </p>
                                        </div>

                                        {/* Right Arrow Button */}
                                        <div className="w-[27px]  mr-5 h-[27px] rounded-[4px] bg-brand-primary flex items-center justify-center shadow-brand">
                                            {isCheckingPayment ? (
                                                <Spinner className="w-4 h-4 text-black" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-black" />
                                            )}
                                        </div>

                                        <div className="absolute -right-2 -top-3">
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

                                    {/* Contact Information Section */}
                                    {contactSettings?.results && contactSettings.results.length > 0 && (
                                        <div className="border-t border-border-primary/50 px-3.5 py-1.5 bg-background-card/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-white font-medium text-xs">
                                                        {contactSettings.results[0].name}:
                                                    </p>
                                                    <p className="text-brand-primary font-medium text-xs">
                                                        {contactSettings.results[0].phone_number}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Manufacturer Detail Drawer */}
            <ManufacturerDetailDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                manufacturer={selectedManufacturer}
                manufacturerDetail={manufacturerDetail}
                isLoading={isDetailLoading}
                error={detailError as Error | null | undefined}
            />

            {/* Filter Drawer */}
            <FilterDrawer
                open={filterDrawerOpen}
                onOpenChange={setFilterDrawerOpen}
                onFilterChange={handleFilterChange}
                currentFilters={filters}
            />

            {/* Payment Alert */}
            <PaymentAlert
                isOpen={paymentAlertOpen}
                onClose={handlePaymentAlertClose}
                type={paymentAlertType}
                onRetry={paymentAlertType === 'error' ? handlePaymentRetry : undefined}
                price={service?.price_sum ? parseFloat(service.price_sum) : (service?.price ? parseFloat(service.price) : undefined)}
                currency="UZS"
                additionalService={service?.id}
                reference={`SERVICE-${service?.id}-${Date.now()}`}
                redirectUrl={`https://t.me/`}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
            />
        </div>
    )
}

export default FactorySelection
