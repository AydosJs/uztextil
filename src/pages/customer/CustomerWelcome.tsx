import { Button } from "@/components/ui"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

function CustomerWelcome() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const handleGetStarted = () => {
        navigate("/customer/register")
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col justify-between">
                <div className="flex px-3 flex-col items-center justify-center space-y-8">
                    {/* Welcome Header */}
                    <div className="text-left space-y-2">
                        <h1 className="text-white font-bold text-[27px] tracking-wide">
                            {t('app.buyurtmachi.welcome.title')}
                        </h1>
                        <p className="text-gray-300 max-w-md font-medium text-sm leading-relaxed">
                            {t('app.buyurtmachi.welcome.description')}
                        </p>
                    </div>
                </div>

                {/* Steps */}
                <div className="flex-1 flex flex-col justify-center space-y-6 px-4">
                    image
                </div>

                {/* Action Buttons */}
                <div className="px-4 pb-8 space-y-4">
                    <Button
                        variant="default"
                        shadow="lg"
                        onClick={handleGetStarted}
                        className="w-full"
                    >
                        {t('app.buyurtmachi.welcome.getStarted')}
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default CustomerWelcome
