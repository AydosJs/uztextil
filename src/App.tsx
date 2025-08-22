import { Button } from "./components/ui/button"

function App() {
  return (
    <div className="min-h-screen min-w-full w-full ">
      <header className=" border w-full safe-area-pt min-w-full h-full block">
        header
      </header>

      <main className="w-full min-w-full h-full block container p-8 space-y-4">
        <h1 className="text-2xl font-bold ">shadcn/ui Button Examples</h1>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Shadow Examples</h2>
            <div className="space-x-2">
              <Button variant="default" shadow="lg">Davom etish</Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border w-full safe-area-pb min-w-full h-full block">
        footer
      </footer>
    </div>
  )
}

export default App
