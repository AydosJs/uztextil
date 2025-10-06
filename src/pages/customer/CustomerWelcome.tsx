import { Button } from "@/components/ui"
import { useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useTelegramBackButton } from "@/lib/hooks"
import customerWelcomeSvg from "@/assets/customerWelcome.svg"

function CustomerWelcome() {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()

    // Get department from navigation state
    const department = (location.state as { department?: 'customer' | 'manufacturer' })?.department || 'customer'

    // Show back button that goes to choose department page
    useTelegramBackButton({ navigateTo: '/choose-department' })

    const handleGetStarted = () => {
        navigate("/customer/register", { state: { department } })
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full flex flex-col">
            <main className="w-full max-w-4xl mx-auto container min-w-full flex-1 flex flex-col justify-between">

                <div className="flex px-3 flex-col items-center justify-center space-y-8">
                    {/* Welcome Header */}
                    <div className="text-left space-y-2 max-w-2xl">
                        <h1 className="text-white font-bold text-[27px] tracking-wide">
                            {t('app.buyurtmachi.welcome.title')}
                        </h1>
                        <p className="text-gray-300 max-w-md font-medium text-sm leading-relaxed">
                            {t('app.buyurtmachi.welcome.description')}
                        </p>
                    </div>
                </div>

                {/* Customer Welcome Image */}
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    <img
                        src={customerWelcomeSvg}
                        alt="Customer Welcome"
                        className="max-w-2xl max-h-full object-contain"
                    />
                </div>

                {/* Action Buttons */}
                <div className="px-4 pb-8 space-y-4 max-w-2xl mx-auto w-full">
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
