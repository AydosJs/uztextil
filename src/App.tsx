import { Button, RadialEffect, UnderwaterHeader } from "@/components/ui"
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
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative">

            <UnderwaterHeader />
            <RadialEffect />

            <main className="w-full container min-w-full flex-1 flex flex-col relative">
                <div className="flex-1 mt-4 flex flex-col items-center justify-center space-y-8 pb-20">
                    <SliderCards />
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 px-4 pt-2 pb-8 safe-area-pb bg-gradient-to-t from-black to-dark z-50 flex justify-center">
                <Button
                    className="max-w-[400px]"
                    variant="default"
                    shadow="lg"
                    onClick={handleButtonClick}
                >
                    {t('app.continue')}
                </Button>
            </div>
            {/* <TelegramUserDebug /> */}
        </div >
    )
}

export default App
