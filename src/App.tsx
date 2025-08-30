import { Button, Card, RadialEffect } from "@/components/ui"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useTelegramBackButton } from "@/lib/hooks"

function App() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    // Show back button that goes back one step
    useTelegramBackButton()

    const handleButtonClick = () => {
        navigate("/welcome")
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <RadialEffect />
            <main className="w-full container  min-w-full flex-1 flex flex-col justify-between">
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 ">
                    <Card
                        image="https://images.pexels.com/photos/17096028/pexels-photo-17096028.jpeg"
                        imageAlt="Textile manufacturing"
                    />
                    <Card
                        image="https://images.pexels.com/photos/12179403/pexels-photo-12179403.jpeg"
                        imageAlt="Fabric production"
                    />
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
        </div>
    )
}

export default App
