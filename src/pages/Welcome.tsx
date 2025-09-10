import { Button } from "@/components/ui"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useTelegramBackButton } from "@/lib/hooks"

function Welcome() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    // Welcome page should show back button that goes back one step (close behavior)
    useTelegramBackButton({ navigateTo: "/" })

    const handleGetStarted = () => {
        // Navigate to the body selection page
        navigate("/choose-department")
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full flex flex-col">
            <main className="w-full max-w-4xl mx-auto min-w-full flex-1 flex flex-col justify-between">
                <div className=" flex px-3 flex-col items-center justify-center space-y-8">
                    {/* Welcome Header */}
                    <div className="text-left space-y-2 max-w-2xl">
                        <h1 className="text-white font-bold text-3xl tracking-wide">
                            {t('app.welcome.greeting')}
                        </h1>
                        <p className="text-gray-300 max-w-md font-medium text-sm leading-relaxed">
                            {t('app.welcome.description')}
                        </p>
                    </div>
                </div>

                {/* Logo in the center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img
                        src="/images/LOGO.png"
                        alt="Logo"
                        className="w-full max-w-2xl h-auto object-contain"
                    />
                </div>

                {/* Action Buttons */}
                <div className="px-4 pb-8 space-y-8 max-w-2xl mx-auto w-full">

                    <p className="text-gray-300 mx-auto max-w-md font-medium text-center text-sm leading-relaxed">
                        {t('app.welcome.guarantee')}
                    </p>

                    <Button
                        variant="default"
                        shadow="lg"
                        onClick={handleGetStarted}
                        className="w-full"
                    >
                        {t('app.welcome.getStarted')}
                    </Button>
                </div>
            </main >
        </div >
    )
}

export default Welcome
