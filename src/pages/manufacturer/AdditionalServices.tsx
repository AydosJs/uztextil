import { RadialEffect, Spinner } from "@/components/ui"
import { ServiceCard } from "@/pages/customer/components"
import { useApiV1AdditionalServicesListList } from "@/lib/api"
import { useTelegramBackButton } from "@/lib/hooks"

function AdditionalServices() {
    // Use the Telegram back button hook - will navigate back to previous page by default
    useTelegramBackButton()

    // Fetch additional services from API
    const { data: services, isLoading, error } = useApiV1AdditionalServicesListList()


    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
            <RadialEffect
                className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />
            <main className="w-full pt-2 container min-w-full flex-1 flex flex-col relative z-10">

                {/* <div className="w-full mb-6 h-[263px] mx-auto rounded-[22px] border border-[#FFFFFF0A] bg-[#181B20] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] flex flex-col items-center justify-between p-4 relative overflow-hidden">
                    <div
                        className="absolute w-[512px] h-[512px] -top-[218px] -left-[276px] opacity-[0.08] pointer-events-none"
                        style={{
                            background: 'radial-gradient(50% 50% at 50% 50%, #FCE803 0%, rgba(252, 232, 3, 0) 100%)',
                            backdropFilter: 'blur(128px)',
                            WebkitBackdropFilter: 'blur(128px)'
                        }}
                    ></div>

                    <div className="text-center space-y-1.5 mt-10">
                        <h2 className="text-white font-extrabold text-lg text-center">
                            Ma’lumotlar qabul qilindi
                        </h2>
                        <p className="text-[#ACADAF] font-normal text-xs text-center">
                            Moderator ma’lumotlaringizni ko’rib chiqmoqda
                        </p>
                    </div>

                    <button className=" bottom-4 flex flex-row items-center justify-center gap-2 w-full h-10 rounded-[12px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] text-white font-semibold text-xs">
                        Jarayonda
                        <RefreshCcw className="size-3" />
                    </button>
                </div> */}

                <h1 className="text-white mb-4.5 font-bold text-2xl tracking-wide">
                    Qo'shimcha xizmatlar
                </h1>
                <div className="flex-1 pb-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner className="w-8 h-8 text-white" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
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
                    ) : services && services.length > 0 ? (
                        <div className="space-y-4">
                            {services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    title={service.name}
                                    price={service.price}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-[#ACADAF] text-lg">Hozircha xizmatlar mavjud emas</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default AdditionalServices
