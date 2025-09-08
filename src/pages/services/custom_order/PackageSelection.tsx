import { useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { RadialEffect, UnderwaterHeader } from "@/components/ui"
import { useApiV1PackageListList } from "@/lib/api"
import type { PackageList } from "@/lib/api/model"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTelegramUser } from "@/hooks/useTelegramUser"

function PackageSelection() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { user, userType } = useTelegramUser()

    // Get service data from navigation state
    const service = location.state?.service

    // Show back button - navigate to services page
    useTelegramBackButton({
        navigateTo: '/services'
    })

    // Fetch packages from API
    const { data: packages, isLoading, error } = useApiV1PackageListList(
        {
            ordering: 'order'
        },
        {
            query: {
                enabled: !!user?.telegram_id && !!userType
            }
        }
    )

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
                <UnderwaterHeader />
                <RadialEffect
                    className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
                />
                <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                    <div className="text-left space-y-4 mb-8 pt-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {t('app.packageSelection.title')}
                        </h1>
                    </div>
                    <div className="flex-1 pb-8">
                        <div className="space-y-9">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="relative flex items-center justify-between px-6 pr-3 flex-row w-full h-[108px] rounded-[22px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] overflow-hidden animate-pulse"
                                    style={{
                                        backdropFilter: 'blur(128px)',
                                        WebkitBackdropFilter: 'blur(128px)'
                                    }}
                                >
                                    <div className="space-y-2">
                                        <div className="h-4 bg-white/20 rounded w-32"></div>
                                        <div className="h-3 bg-white/10 rounded w-24"></div>
                                    </div>
                                    <div className="h-6 bg-white/20 rounded w-24"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
                <RadialEffect
                    className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
                />
                <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                    <div className="text-left space-y-4 mb-8 pt-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {t('app.packageSelection.title')}
                        </h1>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-400 text-lg mb-4">{t('app.packageSelection.error.message')}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                            >
                                {t('app.packageSelection.error.retryButton')}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // Show packages or empty state
    const hasPackages = packages && packages.length > 0

    const handlePackageClick = (packageItem: PackageList) => {
        // Navigate to package details page
        navigate('/services/custom-order/details', {
            state: {
                service,
                package: packageItem
            }
        })
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
            <UnderwaterHeader />

            <RadialEffect
                className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />

            <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                {/* Header */}
                <div className="text-left space-y-4 mb-8 pt-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.packageSelection.title')}
                    </h1>
                </div>

                {/* Packages Grid */}
                <div className="flex-1 pb-8">
                    {!hasPackages ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-[#ACADAF] text-lg">{t('app.packageSelection.empty.message')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-9">
                            {packages.map((packageItem) => (
                                <div
                                    key={packageItem.id}
                                    onClick={() => handlePackageClick(packageItem)}
                                    className="relative flex items-center justify-between px-6 pr-3 flex-row w-full py-5 rounded-[22px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] overflow-hidden cursor-pointer"
                                    style={{
                                        backdropFilter: 'blur(128px)',
                                        WebkitBackdropFilter: 'blur(128px)'
                                    }}
                                >
                                    {/* Package Content */}
                                    <div className="space-y-1">
                                        <h3 className=" font-semibold text-xl text-white bg-gradient-to-r from-white to-white bg-clip-text">
                                            {packageItem.name}
                                        </h3>
                                        <p className="text-[#ACADAF] font-normal text-xs">
                                            {packageItem.name}
                                        </p>
                                    </div>

                                    {/* To'liq ma'lumot text */}
                                    <div className="flex items-center justify-center  rounded-full gap-2 px-3 py-1 bg-[#37393EB2] opacity-100">
                                        <p className=" text-xs font-semibold  text-white opacity-100 whitespace-nowrap">
                                            {t('app.packageSelection.fullInfo')}
                                        </p>
                                    </div>

                                    <div className="absolute right-2 -top-2">
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
        </div>
    )
}

export default PackageSelection
