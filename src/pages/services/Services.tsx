import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { RadialEffect, Spinner } from "@/components/ui"
import { useApiV1AdditionalServicesListList } from "@/lib/api"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTelegramUser } from "@/hooks/useTelegramUser"

function Services() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { user } = useTelegramUser()

    // Show back button - need to determine where this page comes from
    useTelegramBackButton({ navigateTo: '/choose-department' })

    // Fetch additional services from API using telegram_id
    const { data: services, isLoading, error } = useApiV1AdditionalServicesListList(
        user?.telegram_id?.toString() || '',
        {
            query: {
                enabled: !!user?.telegram_id
            }
        }
    )

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

    const handleServiceClick = (service: any) => {
        navigate('/services/terms', { state: { service } })
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
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
                                <p className="text-[#ACADAF] text-lg">Hozircha xizmatlar mavjud emas</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-9">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => handleServiceClick(service)}
                                    className="relative flex items-center justify-between px-6 flex-row w-full h-[108px] rounded-[22px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] overflow-hidden cursor-pointer"
                                    style={{
                                        backdropFilter: 'blur(128px)',
                                        WebkitBackdropFilter: 'blur(128px)'
                                    }}
                                >

                                    {/* Service Content */}
                                    <div className=" space-y-1">
                                        <h3 className="text-white font-extrabold text-base">
                                            {service.name}
                                        </h3>
                                        {/* <p className="text-[#ACADAF] font-normal text-[9px]">
                                            {service.description}
                                        </p> */}
                                    </div>

                                    {/* Service Icon */}
                                    {service.price && (
                                        <p className="text-[#FCE803] font-bold text-lg text-center">
                                            ${service.price}
                                        </p>
                                    )}

                                    <div className="absolute right-2 top-0">
                                        <svg width="111" height="108" viewBox="0 0 111 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.16" d="M1.73438 -0.265625L109.266 107.266M109.266 -0.265625L1.73438 107.266M38.1549 -2V109M55.4979 -2V109M72.8435 -2V109M111 36.1565L0 36.1565M111 53.4994L0 53.4994M111 70.8449L0 70.8449M90.1875 53.5C90.1875 72.6574 74.6574 88.1875 55.5 88.1875C36.3426 88.1875 20.8125 72.6574 20.8125 53.5C20.8125 34.3426 36.3426 18.8125 55.5 18.8125C74.6574 18.8125 90.1875 34.3426 90.1875 53.5ZM72.8438 53.5C72.8438 63.0787 65.0787 70.8438 55.5 70.8438C45.9213 70.8438 38.1563 63.0787 38.1563 53.5C38.1563 43.9213 45.9213 36.1563 55.5 36.1563C65.0787 36.1563 72.8438 43.9213 72.8438 53.5Z" stroke="url(#paint0_radial_27_18405)" strokeWidth="0.5" />
                                            <defs>
                                                <radialGradient id="paint0_radial_27_18405" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(55.5 53.5) rotate(90) scale(55.5)">
                                                    <stop stop-color="white" />
                                                    <stop offset="0.5" stop-color="white" stop-opacity="0.25" />
                                                    <stop offset="1" stop-color="white" stop-opacity="0" />
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

export default Services
