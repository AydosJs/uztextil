import { Button } from "@/components/ui"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useTelegramBackButton } from "@/lib/hooks"
import customerWelcomeSvg from "@/assets/customerWelcome.svg"

function ManufacturerWelcome() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    // Show back button that goes to choose department page
    useTelegramBackButton({ navigateTo: '/choose-department' })

    const handleGetStarted = () => {
        navigate("/manufacturer/register")
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full max-w-4xl mx-auto container min-w-full flex-1 flex flex-col justify-between">
                {/* Header */}
                <div className="text-left space-y-4 max-w-2xl mx-auto w-full">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.buyurtmachi.welcome.registration.title')}
                    </h1>
                    <p className="text-gray-300 text-sm font-medium">
                        {t('app.buyurtmachi.welcome.registration.description')}
                    </p>
                </div>

                {/* Manufacturer Welcome Image */}
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    <img
                        src={customerWelcomeSvg}
                        alt="Manufacturer Welcome"
                        className="max-w-2xl max-h-full object-contain"
                    />
                </div>

                {/* Action Button */}
                <div className="px-4 pb-8 max-w-2xl mx-auto w-full">
                    <Button
                        variant="default"
                        shadow="lg"
                        onClick={handleGetStarted}
                        className="w-full"
                    >
                        {t('app.buyurtmachi.welcome.registration.button')}
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default ManufacturerWelcome
