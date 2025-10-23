import { useNavigate, useLocation } from "react-router-dom"
import { RadialEffect, UnderwaterHeader, Button } from "@/components/ui"
import { useTelegramBackButton } from "@/lib/hooks"
import { useApiV1PackageDetailRead } from "@/lib/api"
import { CircleCheckBig } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { PackageList } from "@/lib/api/model"
import { TELEGRAM_CONFIG } from "@/lib/config"

function PackageDetails() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    // Get package data from navigation state
    const packageData = location.state?.package as PackageList

    // Show back button - navigate to package selection
    useTelegramBackButton({
        navigateTo: '/services/custom-order'
    })

    // Fetch package details from API
    const { data: packageDetail, isLoading, error } = useApiV1PackageDetailRead(
        packageData?.id || 0,
        {
            query: {
                enabled: !!packageData?.id
            }
        }
    )

    // If no package data, redirect back
    if (!packageData?.id) {
        navigate('/services/custom-order')
        return null
    }

    const handleApply = () => {
        // Navigate to application form with package data
        navigate('/services/custom-order/application', {
            state: {
                service: location.state?.service,
                package: packageData
            }
        })
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden bg-background-primary">
                <UnderwaterHeader />
                <RadialEffect
                    className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
                />
                <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                    <div className="text-left space-y-4 mb-8 pt-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {packageData.name}
                        </h1>
                    </div>
                    <div className="mb-6">
                        <div className="w-full h-[366px] rounded-[32px] border border-border-primary bg-background-card shadow-card flex items-center justify-center animate-pulse">
                        </div>
                    </div>
                    <div className="flex-1 pb-8">
                        <div className="w-full h-[312px] rounded-[22px] border border-border-primary bg-background-primary shadow-card p-6 animate-pulse">
                            <div className="space-y-4">
                                <div className="h-6 bg-white/20 rounded w-24"></div>
                                <div className="h-4 bg-white/10 rounded w-32"></div>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 bg-white/20 rounded-full"></div>
                                            <div className="h-3 bg-white/10 rounded w-32"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
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
                    <div className="text-left space-y-4 mb-8 pt-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {packageData.name}
                        </h1>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-status-error text-lg mb-4">{t('app.packageSelection.error.message')}</p>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="secondary"
                                size="secondary"
                            >
                                {t('app.packageSelection.error.retryButton')}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // Use API data for features
    const features = packageDetail?.items || []

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden bg-background-primary">
            <UnderwaterHeader />

            <RadialEffect
                className="!w-full !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />

            <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                {/* Header */}
                <div className="text-left space-y-4 mb-8 pt-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {packageDetail?.name || packageData.name}
                    </h1>
                </div>

                {/* Banner */}
                <div className=" mb-6">
                    <div
                        className="w-full h-[366px] rounded-[32px] border border-border-primary bg-background-card shadow-card flex items-center justify-center overflow-hidden"
                        style={{
                            backdropFilter: 'blur(128px)',
                            WebkitBackdropFilter: 'blur(128px)'
                        }}
                    >
                        {packageDetail?.banner ? (
                            <img
                                src={packageDetail.banner}
                                alt={packageDetail.name}
                                className="w-full h-full object-cover rounded-[32px]"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                                <div className="text-white text-4xl font-bold">
                                    {(packageDetail?.name || packageData.name)?.charAt(0) || 'P'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Card */}
                <div className="flex-1 pb-8">
                    <div className="w-full rounded-[22px] border border-border-primary bg-background-primary shadow-card p-6 relative">
                        {/* Manager Contact Button - Top Right */}
                        <button
                            onClick={() => {
                                // Redirect to Telegram username from environment
                                window.open(`https://t.me/${TELEGRAM_CONFIG.MANAGER_USERNAME}`, '_blank')
                            }}
                            className="absolute top-6 right-6 w-fit py-1 px-3 rounded-full border border-border-secondary bg-transparent flex items-center justify-center gap-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_570_8483)">
                                    <path d="M13.4583 6.95833C13.4583 4.21992 11.2384 2 8.5 2C5.76159 2 3.54167 4.21992 3.54167 6.95833M11.3333 9.4375V10.8542C11.3333 11.1833 11.3333 11.3479 11.3606 11.4847C11.4723 12.0467 11.9117 12.4862 12.4737 12.598C12.6105 12.6252 12.775 12.6252 13.1042 12.6252C13.4333 12.6252 13.5979 12.6252 13.7347 12.598C14.2967 12.4862 14.7359 12.0467 14.8477 11.4847C14.8749 11.3479 14.875 11.1833 14.875 10.8542V9.4375C14.875 9.10837 14.8749 8.94349 14.8477 8.80664C14.7359 8.24466 14.2967 7.80567 13.7347 7.69389C13.5979 7.66667 13.4333 7.66667 13.1042 7.66667C12.775 7.66667 12.6105 7.66667 12.4737 7.69389C11.9117 7.80567 11.4723 8.24466 11.3606 8.80664C11.3333 8.94349 11.3333 9.10837 11.3333 9.4375ZM5.66667 9.4375V10.8542C5.66667 11.1833 5.66656 11.3479 5.63934 11.4847C5.52756 12.0467 5.08833 12.4862 4.52635 12.598C4.3895 12.6252 4.22499 12.6252 3.89586 12.6252C3.56674 12.6252 3.40217 12.6252 3.26532 12.598C2.70334 12.4862 2.26401 12.0467 2.15222 11.4847C2.125 11.3479 2.125 11.1833 2.125 10.8542V9.4375C2.125 9.10837 2.125 8.94349 2.15222 8.80664C2.26401 8.24466 2.70334 7.80567 3.26532 7.69389C3.40217 7.66667 3.56673 7.66667 3.89586 7.66667C4.225 7.66667 4.3895 7.66667 4.52635 7.69389C5.08833 7.80567 5.52756 8.24466 5.63934 8.80664C5.66656 8.94349 5.66667 9.10837 5.66667 9.4375Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_570_8483">
                                        <rect width="17" height="13" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            {t('app.common.writeToManager')}
                        </button>

                        {/* Card Header */}
                        <div className="mb-6">
                            <h2 className="text-white font-bold text-xl mb-2">
                                {packageDetail?.name || packageData.name}
                            </h2>
                            <p className="text-text-secondary text-sm">
                                {packageDetail?.name || packageData.name}
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3 mb-6">
                            {features.length > 0 ? (
                                features.map((feature, index) => (
                                    <div key={feature.id || index} className="flex items-center gap-3">
                                        <CircleCheckBig className="size-4 min-size-6 min-w-4 text-primary" />
                                        <p
                                            className="text-sm font-medium"
                                        >
                                            {feature.name}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-text-secondary text-sm">
                                    {t('app.common.loadingData')}
                                </div>
                            )}
                        </div>

                        {/* Apply Button */}
                        <Button
                            shadow={'sm'}
                            onClick={handleApply}
                            variant="default"
                            size="default"
                            className="mt-4 font-semibold"
                        >
                            {t('app.common.submitApplication')}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PackageDetails
