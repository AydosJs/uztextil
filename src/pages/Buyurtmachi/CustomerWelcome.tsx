import { Button } from "@/components/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import CustomerRegisterForm from "./CustomerRegisterForm"

function CustomerWelcome() {
    const [isLoading, setIsLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const { t } = useTranslation()

    const handleGetStarted = () => {
        setIsLoading(true)
        // Simulate some async operation
        setTimeout(() => {
            setIsLoading(false)
            setShowForm(true)
        }, 1000)
    }

    if (showForm) {
        return <CustomerRegisterForm />
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col justify-between">
                {/* Header */}
                <div className="text-left space-y-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.buyurtmachi.welcome.registration.title')}
                    </h1>
                    <p className="text-gray-300 text-sm font-medium">
                        {t('app.buyurtmachi.welcome.registration.description')}
                    </p>
                </div>

                <div>
                </div>

                {/* Action Button */}
                <div className="px-4 pb-8">
                    <Button
                        loading={isLoading}
                        variant="default"
                        shadow="lg"
                        onClick={handleGetStarted}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {t('app.buyurtmachi.welcome.registration.button')}
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default CustomerWelcome
