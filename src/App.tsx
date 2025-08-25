import {Button, Card} from "@/components/ui"

function App() {
    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full container border min-w-full flex-1 flex flex-col justify-between">
                <div className="space-y-8 border h-full">
                    <Card/>
                    <Card/>
                </div>
                <div className="px-4 border">
                    <Button loading={true} variant="default" shadow="lg">Davom etish</Button>
                </div>
            </main>
        </div>
    )
}

export default App
