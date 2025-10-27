import { useTranslation } from "react-i18next"
import { RadialEffect, Spinner } from "@/components/ui"
import { ServiceCard } from "@/pages/customer/components"
import { useApiV1ServiceListList } from "@/lib/api"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTelegramUser } from "@/hooks/useTelegramUser"

function AdditionalServices() {
    const { t } = useTranslation()
    const { user } = useTelegramUser()

    // Show back button that goes to manufacturer register page
    useTelegramBackButton({ navigateTo: '/manufacturer/register' })

    // Fetch additional services from API
    const { data: services, isLoading, error } = useApiV1ServiceListList(
        {
            search: 'manufacturer'
        },
        {
            query: {
                enabled: !!user?.telegram_id
            }
        }
    )


    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden bg-background-primary">
            <RadialEffect
                className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />
            <main className="w-full pt-2 container min-w-full flex-1 flex flex-col relative z-10">

                {/* <div className="w-full mb-6 h-[263px] mx-auto rounded-[22px] border border-border-primary bg-[#181B20] shadow-card flex flex-col items-center justify-between p-4 relative overflow-hidden">
                    <div
                        className="absolute w-[512px] h-[512px] -top-[218px] -left-[276px] opacity-[0.08] pointer-events-none"
                        style={{
                            background: 'radial-gradient(50% 50% at 50% 50%, var(--color-brand-primary) 0%, rgba(252, 232, 3, 0) 100%)',
                            backdropFilter: 'blur(128px)',
                            WebkitBackdropFilter: 'blur(128px)'
                        }}
                    ></div>

                    <div className="text-center space-y-1.5 mt-10">
                        <h2 className="text-white font-extrabold text-lg text-center">
                            Ma’lumotlar qabul qilindi
                        </h2>
                        <p className="text-text-secondary font-normal text-xs text-center">
                            Moderator ma’lumotlaringizni ko’rib chiqmoqda
                        </p>
                    </div>

                    <button className=" bottom-4 flex flex-row items-center justify-center gap-2 w-full h-10 rounded-[12px] border border-border-primary bg-background-card shadow-card text-white font-semibold text-xs">
                        Jarayonda
                        <RefreshCcw className="size-3" />
                    </button>
                </div> */}

                <h1 className="text-white mb-4.5 font-bold text-2xl tracking-wide">
                    {t('app.xizmatlar.additionalServices')}
                </h1>
                <div className="flex-1 pb-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner className="w-8 h-8 text-white" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
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
                    ) : services && services.results && services.results.length > 0 ? (
                        <div className="space-y-4">
                            {services.results.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    title={service.name}
                                    price={service.price ? `$${service.price}` : t('app.common.priceNotSet')}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-text-secondary text-lg">{t('app.common.noServicesAvailable')}</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default AdditionalServices
