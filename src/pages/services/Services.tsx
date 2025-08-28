import { useTranslation } from "react-i18next"
import { RadialEffect, Spinner } from "@/components/ui"
import { useApiV1AdditionalServicesListList } from "@/lib/api"

function Services() {
    const { t } = useTranslation()

    // Fetch additional services from API
    const { data: services, isLoading, error } = useApiV1AdditionalServicesListList()

    const renderIcon = (iconType: string) => {
        switch (iconType) {
            case 'order':
                return (
                    <svg width="113" height="95" viewBox="0 0 113 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <foreignObject x="-34" y="-33" width="184.777" height="160.778">
                            <div style={{ backdropFilter: 'blur(32px)', clipPath: 'url(#bgblur_1_27_18419_clip_path)', height: '100%', width: '100%' }}></div>
                        </foreignObject>
                        <g filter="url(#filter0_ddi_27_18419)" data-figma-bg-blur-radius="64">
                            <g clipPath="url(#clip0_27_18419)">
                                <rect width="32.7798" height="32.7798" rx="4" transform="matrix(0.866044 -0.499967 0.866044 0.499967 30 47.3889)" fill="#FCE803" />
                                <g clipPath="url(#clip2_27_18419)">
                                    <path d="M48.5903 50.9244H55.939M48.5903 47.3891H59.6133M65.7371 46.682V52.3385M65.7371 52.3385L69.4114 50.2173M65.7371 52.3385L62.0628 50.2173M48.5903 43.8538H63.2876" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </g>
                            <rect x="0.866044" width="31.7798" height="31.7798" rx="3.5" transform="matrix(0.866044 -0.499967 0.866044 0.499967 30.116 47.8219)" stroke="#101318" strokeOpacity="0.16" />
                        </g>
                        <defs>
                            <filter id="filter0_ddi_27_18419" x="-34" y="-33" width="184.777" height="160.778" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset />
                                <feGaussianBlur stdDeviation="16" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.988235 0 0 0 0 0.909804 0 0 0 0 0.0117647 0 0 0 0.5 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_27_18419" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="6" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.988235 0 0 0 0 0.909804 0 0 0 0 0.0117647 0 0 0 0.48 0" />
                                <feBlend mode="normal" in2="effect1_dropShadow_27_18419" result="effect2_dropShadow_27_18419" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_27_18419" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="-1" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                                <feBlend mode="normal" in2="shape" result="effect3_innerShadow_27_18419" />
                            </filter>
                            <clipPath id="bgblur_1_27_18419_clip_path" transform="translate(34 33)">
                                <rect width="32.7798" height="32.7798" rx="4" transform="matrix(0.866044 -0.499967 0.866044 0.499967 30 47.3889)" />
                            </clipPath>
                            <clipPath id="clip0_27_18419">
                                <rect width="32.7798" height="32.7798" rx="4" transform="matrix(0.866044 -0.499967 0.866044 0.499967 30 47.3889)" fill="white" />
                            </clipPath>
                            <clipPath id="clip2_27_18419">
                                <rect width="24" height="24" fill="white" transform="matrix(1.22477 0 0 0.707061 43.6914 38.9043)" />
                            </clipPath>
                        </defs>
                    </svg>
                )
            default:
                return null
        }
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
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
                        <Spinner className="w-8 h-8 text-white" />
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
                    <div className="text-left space-y-4 mb-8 px-4 pt-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {t('app.xizmatlar.title') || 'Xizmatlar'}
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

    // Show services or empty state
    const hasServices = services && services.length > 0

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
            <RadialEffect
                className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />

            <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                {/* Header */}
                <div className="text-left space-y-4 mb-8 px-4 pt-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.xizmatlar.title') || 'Xizmatlar'}
                    </h1>
                </div>

                {/* Services Grid */}
                <div className="flex-1 px-4 pb-8">
                    {!hasServices ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-[#ACADAF] text-lg">Hozircha xizmatlar mavjud emas</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-9">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="relative w-full h-[108px] rounded-[22px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] overflow-hidden"
                                    style={{
                                        backdropFilter: 'blur(128px)',
                                        WebkitBackdropFilter: 'blur(128px)'
                                    }}
                                >
                                    {/* Service Icon */}
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        {renderIcon('order')}
                                    </div>

                                    {/* Service Content */}
                                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 space-y-1">
                                        <h3 className="text-white font-extrabold text-base leading-[140%] tracking-[0px] font-['Plus_Jakarta_Sans']">
                                            {service.name}
                                        </h3>
                                        <p className="text-[#ACADAF] font-normal text-[9px] leading-[140%] tracking-[0px] font-['Plus_Jakarta_Sans']">
                                            {service.description || 'Tavsif mavjud emas'}
                                        </p>
                                        {service.price && (
                                            <p className="text-[#FCE803] font-semibold text-[11px] leading-[140%] tracking-[0px] font-['Plus_Jakarta_Sans']">
                                                Narx: {service.price}
                                            </p>
                                        )}
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

export default Services
