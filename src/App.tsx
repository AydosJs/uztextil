import { Button, Card, RadialEffect } from "@/components/ui"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function App() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleButtonClick = () => {
        setIsLoading(true)
        // Simulate some async operation
        setTimeout(() => {
            setIsLoading(false)
            // Navigate to welcome page after loading
            navigate("/welcome")
        }, 3000)
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <RadialEffect />
            <main className="w-full container  min-w-full flex-1 flex flex-col justify-between">
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 ">
                    <Card />
                    <Card />
                </div>
                <div className="px-4  pb-8">
                    <Button
                        loading={isLoading}
                        variant="default"
                        shadow="lg"
                        onClick={handleButtonClick}
                        disabled={isLoading}
                    >
                        Davom etish
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default App
