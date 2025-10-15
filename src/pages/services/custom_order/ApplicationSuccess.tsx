import { useNavigate, useLocation } from "react-router-dom"
import { RadialEffect, UnderwaterHeader, Button } from "@/components/ui"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTranslation } from "react-i18next"
import { CheckCircle } from "lucide-react"

function ApplicationSuccess() {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()

    // Get data from navigation state
    const packageData = location.state?.package

    // Show back button - navigate to services
    useTelegramBackButton({
        navigateTo: '/services'
    })

    const handleBack = () => {
        navigate('/services')
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden bg-background-primary">
            <UnderwaterHeader />
            <RadialEffect
                className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />

            <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                {/* Success Content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 px-4">
                    {/* Success Icon */}
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-status-success" />
                    </div>

                    {/* Success Message */}
                    <div className="space-y-4">
                        <h1 className="text-white font-bold text-2xl">
                            {t('app.customOrderApplication.success.title')}
                        </h1>
                        <p className="text-white/64 text-base leading-relaxed max-w-md">
                            {t('app.customOrderApplication.success.subtitle')}
                        </p>
                    </div>

                    {/* Package Info */}
                    {packageData && (
                        <div className="w-full max-w-md p-4 rounded-lg border border-[#FFFFFF0A] bg-background-primary">
                            <h3 className="text-white font-medium text-sm mb-2">
                                {t('app.customOrderApplication.success.selectedPackage')}
                            </h3>
                            <p className="text-white/80 text-sm">
                                {packageData.name}
                            </p>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="w-full max-w-md pt-4">
                        <Button
                            onClick={handleBack}
                            variant="secondary"
                            size="default"
                        >
                            {t('app.customOrderApplication.success.backButton')}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ApplicationSuccess
