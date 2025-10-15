import { Button, UnderwaterHeader } from "@/components/ui"
import { useLocation } from "react-router-dom"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTranslation } from "react-i18next"

function PlaceOrderSuccess() {
    const location = useLocation()
    const { t } = useTranslation()

    // Get application data from navigation state
    const applicationData = location.state?.applicationData
    const service = location.state?.service

    // Use the actual ID from the API response as the lot number
    const lotNumber = applicationData?.id ? `#${applicationData.id}` : '#4001'

    // Show back button that goes to services page
    useTelegramBackButton({ navigateTo: '/services' })

    const handleChannelClick = () => {
        // In a real app, this would open the Telegram channel
        // For now, we'll just show a message
        alert(t('app.common.channelComingSoon'))
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col">
                <UnderwaterHeader />

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                        <svg
                            className="w-10 h-10 text-status-success"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    {/* Success Message */}
                    <div className="text-center space-y-4 mb-8">
                        <h1 className="text-white font-bold text-2xl">
                            {t('app.placeOrder.success.title')}
                        </h1>

                        <div className="space-y-2">
                            <p className="text-text-secondary text-lg">
                                {t('app.placeOrder.success.lotNumber')} <span className="text-brand-primary font-bold">{lotNumber}</span>
                            </p>
                            <p className="text-text-secondary text-lg">
                                {t('app.placeOrder.success.searchInfo', { lotNumber })}
                            </p>
                        </div>

                        {service && (
                            <p className="text-text-secondary text-sm">
                                {t('app.common.service')}: {service.name}
                            </p>
                        )}
                    </div>

                    {/* Channel Button */}
                    <div className="w-full max-w-sm">
                        <Button
                            variant="default"
                            shadow="lg"
                            onClick={handleChannelClick}
                            className="w-full"
                        >
                            {t('app.placeOrder.success.channelButton')}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PlaceOrderSuccess
