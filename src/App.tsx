import { Button, RadialEffect } from "@/components/ui"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useTelegramBackButton } from "@/lib/hooks"
// import { TelegramUserDebug } from "@/components/TelegramUserDebug"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import { SliderCards } from "@/components/SliderCards"

function App() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { isRegistered } = useTelegramUser()

    useTelegramBackButton()

    const handleButtonClick = () => {
        if (isRegistered) {
            // If user is registered, navigate to services
            navigate("/services")
        } else {
            // If user is not registered, navigate to welcome
            navigate("/welcome")
        }
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">

            <RadialEffect />

            <main className="w-full container  min-w-full flex-1 flex flex-col justify-between">
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 px-4">
                    <SliderCards />
                </div>
                <div className="px-4  pb-8">
                    <Button
                        variant="default"
                        shadow="lg"
                        onClick={handleButtonClick}
                    >
                        {t('app.continue')}
                    </Button>
                </div>
            </main>
            {/* <TelegramUserDebug /> */}
        </div>
    )
}

export default App
