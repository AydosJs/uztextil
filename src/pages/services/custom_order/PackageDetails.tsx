import { useNavigate, useLocation } from "react-router-dom"
import { RadialEffect, UnderwaterHeader } from "@/components/ui"
import { useTelegramBackButton } from "@/lib/hooks"
import { useApiV1PackageDetailRead } from "@/lib/api"
import { Check } from "lucide-react"
import type { PackageList } from "@/lib/api/model"

function PackageDetails() {
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
        // Navigate to terms with package data
        navigate('/services/terms', {
            state: {
                service: location.state?.service,
                package: packageData
            }
        })
    }

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
                            {packageData.name}
                        </h1>
                    </div>
                    <div className="mb-6">
                        <div className="w-full h-[366px] rounded-[32px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] flex items-center justify-center animate-pulse">
                        </div>
                    </div>
                    <div className="flex-1 pb-8">
                        <div className="w-full h-[312px] rounded-[22px] border border-[#FFFFFF0A] bg-[#181B20] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] p-6 animate-pulse">
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
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
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
                            <p className="text-red-400 text-lg mb-4">Xatolik yuz berdi</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                            >
                                Qayta urinish
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // Use API data for features
    const features = packageDetail?.items || []

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
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
                        className="w-full h-[366px] rounded-[32px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] flex items-center justify-center overflow-hidden"
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
                    <div className="w-full h-[312px] rounded-[22px] border border-[#FFFFFF0A] bg-[#181B20] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] p-6">
                        {/* Card Header */}
                        <div className="mb-6">
                            <h2 className="text-white font-bold text-xl mb-2">
                                {(packageDetail?.type || packageData.type) === 'start' && 'Старт'}
                                {(packageDetail?.type || packageData.type) === 'growth' && 'Рост'}
                                {(packageDetail?.type || packageData.type) === 'export' && 'Экспорт'}
                            </h2>
                            <p className="text-[#ACADAF] text-sm">
                                {(packageDetail?.type || packageData.type) === 'start' && 'Базовый пакет'}
                                {(packageDetail?.type || packageData.type) === 'growth' && 'Пакет развития'}
                                {(packageDetail?.type || packageData.type) === 'export' && 'Экспортный пакет'}
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3 mb-6">
                            {features.length > 0 ? (
                                features.map((feature, index) => (
                                    <div key={feature.id || index} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <p
                                            className="text-white font-medium text-xs leading-[140%] tracking-[0px]"
                                            style={{
                                                fontFamily: 'Plus Jakarta Sans',
                                                fontWeight: 500,
                                                fontSize: '12px',
                                                lineHeight: '140%',
                                                letterSpacing: '0px',
                                                background: 'var(--light-dark-900100, #FFFFFF)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text'
                                            }}
                                        >
                                            {feature.name}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-[#ACADAF] text-sm">
                                    Ma'lumotlar yuklanmoqda...
                                </div>
                            )}
                        </div>

                        {/* Apply Button */}
                        <button
                            onClick={handleApply}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Ariza qoldirish
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PackageDetails
