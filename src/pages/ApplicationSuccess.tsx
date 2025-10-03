import { Button, UnderwaterHeader } from "@/components/ui"
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router-dom"
import { useTelegramBackButton } from "@/lib/hooks"
import { CheckCircle, ArrowLeft } from "lucide-react"

function ApplicationSuccess() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    // Get application ID from navigation state
    const applicationId = (location.state as { applicationId?: number })?.applicationId

    // Show back button that goes to choose department page
    useTelegramBackButton({ navigateTo: '/choose-department' })

    const handleBackToServices = () => {
        navigate('/choose-department')
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full max-w-4xl mx-auto container min-w-full flex-1 flex flex-col">
                <UnderwaterHeader />

                {/* Success Content */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto w-full px-4">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>

                    {/* Success Message */}
                    <div className="text-center space-y-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {t('app.applicationForm.success.title')}
                        </h1>
                        <p className="text-white/70 text-sm leading-relaxed">
                            {t('app.applicationForm.success.subtitle')}
                        </p>
                    </div>

                    {/* Application ID if available */}
                    {applicationId && (
                        <div className="bg-white/10 rounded-lg p-4 w-full">
                            <p className="text-white/70 text-sm text-center">
                                {t('app.common.applicationId')}: {applicationId}
                            </p>
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <div className="px-4 pb-8 mt-4 max-w-2xl mx-auto w-full">
                    <Button
                        variant="default"
                        shadow="lg"
                        onClick={handleBackToServices}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('app.common.goBack')}
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default ApplicationSuccess
