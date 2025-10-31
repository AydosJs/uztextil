import { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { RadialEffect, UnderwaterHeader, PaymentAlert } from "@/components/ui"
import { useApiV1ManufacturerListList, useApiV1ManufacturerDetailRead, useApiV1ContactSettingsContactSettingsList, useApiV1CategoryListList } from "@/lib/api"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import { ChevronLeft, Search } from "lucide-react"
import { ManufacturerDetailDrawer, FilterDrawer, CategorySelection, ManufacturerList as ManufacturerListComponent } from "./components"
import { useTranslation } from "react-i18next"
import { checkPaymentStatus } from "@/lib/api/paymentApi"
import type { AdditionalService, ManufacturerList } from "@/lib/api/model"
import { TELEGRAM_CONFIG } from "@/lib/config"

interface FilterOptions {
    search: string
    category: number | null
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
        category: null,
        product_segment: [],
        min_order_quantity: ''
    })

    // Show back button that goes to services page
    useTelegramBackButton({ navigateTo: '/services' })

    // Get service data from navigation state
    const service = location.state?.service as AdditionalService

    const handlePaymentSuccess = useCallback(async () => {
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
            handlePaymentSuccess()
        }
    }, [location.search, selectedManufacturer, handlePaymentSuccess])

    // Prepare API parameters - this will be reactive to filters changes
    const apiParams = {
        search: filters.search.trim() || undefined,
        category: filters.category !== null ? filters.category.toString() : undefined,
        product_segment: filters.product_segment.length > 0 ? filters.product_segment.join(',') : undefined,
        min_order_quantity: filters.min_order_quantity.trim() || undefined
    }


    // Fetch contact settings to get phone number
    const { data: contactSettings } = useApiV1ContactSettingsContactSettingsList()

    // Fetch categories list
    const { data: categoriesData, isLoading: categoriesLoading } = useApiV1CategoryListList()

    // Fetch manufacturer list with filters - this will refetch when apiParams change
    // Only fetch when a category is selected
    const { data: manufacturers, isLoading, error } = useApiV1ManufacturerListList(
        filters.category !== null ? apiParams : undefined,
        {
            query: {
                enabled: filters.category !== null
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
        }
    }, [isLoadingDetails, detailError])

    // If no service data, redirect back to services
    if (!service) {
        navigate('/services')
        return null
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
        // If clicking the same category, deselect it (return to category view)
        // Otherwise, select the new category (show list view)
        setFilters(prev => ({
            ...prev,
            category: prev.category === categoryId ? null : categoryId
        }))
    }

    const handleClearCategory = () => {
        setFilters(prev => ({
            ...prev,
            category: null
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

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden bg-background-primary">
            <UnderwaterHeader />
            <RadialEffect
                className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />

            <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pt-4">
                    <div className="flex items-center flex-1">
                        {filters.category !== null && (
                            <button
                                onClick={handleClearCategory}
                                className="mr-3 p-2 rounded-lg hover:bg-background-card-hover transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                        )}
                        <h1 className="text-white font-bold text-2xl tracking-wide">
                            {filters.category !== null ?
                                categoriesData?.results?.find(c => c.id === filters.category)?.title || t('app.filterDrawer.title')
                                : t('app.filterDrawer.title')
                            }
                        </h1>
                    </div>
                    {filters.category !== null && (
                        <button
                            onClick={() => setFilterDrawerOpen(true)}
                            className="p-2 rounded-lg bg-background-card border border-border-primary hover:bg-background-card-hover transition-colors"
                        >
                            <Search className="w-5 h-5 text-white" />
                        </button>
                    )}
                </div>

                {/* Category Selection - Show only when no category is selected */}
                {filters.category === null && (
                    <CategorySelection
                        isLoading={categoriesLoading}
                        categoriesData={categoriesData}
                        selectedCategoryId={filters.category}
                        onCategoryToggle={handleCategoryToggle}
                    />
                )}

                {/* Manufacturers List - Show only when category is selected */}
                {filters.category !== null && (
                    <ManufacturerListComponent
                        isLoading={isLoading}
                        manufacturers={manufacturers}
                        isCheckingPayment={isCheckingPayment}
                        onFactorySelect={handleFactorySelect}
                        contactSettings={contactSettings}
                    />
                )}

                {/* Empty state when no category is selected and no categories are available */}
                {filters.category === null && !categoriesLoading && (!categoriesData?.results || categoriesData.results.length === 0) && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-text-secondary text-lg">{t('app.categorySelection.selectCategoriesPrompt')}</p>
                        </div>
                    </div>
                )}
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
                redirectUrl={`https://t.me/${TELEGRAM_CONFIG.BOT_USERNAME}`}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
            />
        </div>
    )
}

export default FactorySelection
