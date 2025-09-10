import { UnderwaterHeader } from "@/components/ui"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui"
import { CheckCircle } from "lucide-react"

function OnlineB2BSuccess() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    useTelegramBackButton({ navigateTo: '/services' })

    // Get application data from navigation state
    const applicationData = location.state?.applicationData

    const handleViewOffers = () => {
        navigate('/services/online-b2b/offers', {
            state: { applicationData }
        })
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col">
                <UnderwaterHeader />

                {/* Header */}
                <div className="text-left space-y-4 mb-8 pt-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.onlineB2B.success.header')}
                    </h1>
                    <p className="text-[#ACADAF] text-sm">
                        {t('app.onlineB2B.success.subtitle')}
                    </p>
                </div>

                {/* Success Content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 pb-8">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-white font-bold text-xl">
                            {t('app.onlineB2B.success.applicationSubmitted')}
                        </h2>
                        <p className="text-[#ACADAF] text-sm max-w-md">
                            {t('app.onlineB2B.success.applicationDescription')}
                        </p>
                    </div>

                    <div className="w-full max-w-md">
                        <Button
                            onClick={handleViewOffers}
                            variant="default"
                            shadow="lg"
                            className="w-full"
                        >
                            {t('app.onlineB2B.success.viewOffers')}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default OnlineB2BSuccess
