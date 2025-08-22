import { Button } from "./components/ui/button"
import { CustomInput } from "./components/ui/custom-input"
import { CustomCheckbox } from "./components/ui/custom-checkbox"

function App() {
  return (
    <div className="min-h-screen min-w-full w-full ">
      <header className=" border w-full safe-area-pt min-w-full h-full block">
        header
      </header>

      <main className="w-full min-w-full h-full block container p-8 space-y-8">
        <h1 className="text-2xl font-bold ">shadcn/ui Components Examples</h1>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Custom Input Examples</h2>
            <div className="space-y-4">
              <CustomInput 
                label="Email Address"
                placeholder="Enter your email"
                type="email"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Custom Checkbox Examples</h2>
            <div className="space-y-4">
              <CustomCheckbox label="I agree to the terms and conditions" />
              <CustomCheckbox label="Subscribe to newsletter" />
              <CustomCheckbox label="Remember me" />
              <CustomCheckbox label="Enable notifications" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Button Examples</h2>
            <div className="space-y-4">
              <Button variant="default" shadow="lg">Davom etish</Button>
              <Button variant="secondary">Secondary Button</Button>
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
