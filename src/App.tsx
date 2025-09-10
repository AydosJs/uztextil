import { Button, RadialEffect, UnderwaterHeader } from "@/components/ui"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useTelegramBackButton } from "@/lib/hooks"
// import { TelegramUserDebug } from "@/components/TelegramUserDebug"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import { SliderCards } from "@/components/SliderCards"
import { showToast } from "@/lib/utils"
// import { DeviceTest } from "@/components/DeviceTest"

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

    const handleTestToast = () => {
        showToast.success("Test toast notification!")
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative">

            <UnderwaterHeader />
            <RadialEffect />

            <main className="w-full container min-w-full flex-1 flex flex-col relative">
                <div className="flex-1 flex flex-col mt-4 justify-center space-y-8 pb-26">
                    <SliderCards />
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 px-4 pt-2 pb-8 safe-area-pb bg-gradient-to-t from-black to-dark z-50 flex flex-col gap-2">
                <Button
                    className="max-w-[400px] mx-auto"
                    variant="outline"
                    shadow="lg"
                    onClick={handleTestToast}
                >
                    Test Toaster
                </Button>
                <Button
                    className="max-w-[400px] mx-auto"
                    variant="default"
                    shadow="lg"
                    onClick={handleButtonClick}
                >
                    {t('app.continue')}
                </Button>
            </div>
            {/* <DeviceTest /> */}
            {/* <TelegramUserDebug /> */}
        </div >
    )
}

export default App
