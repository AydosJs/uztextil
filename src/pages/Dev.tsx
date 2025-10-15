import { CustomInput } from "../components/ui/custom-input"
import { CustomCheckbox } from "../components/ui/custom-checkbox"
import { getSafeAreaValues, waitForSafeAreaValues, isSDKReady } from "../utils/safeAreaUtils"
import { initSDK } from "../utils/telegramSDK"
import { toggleEruda, destroyEruda } from "../utils/eruda"
import { useState, useEffect } from "react"

function Dev() {
  const [safeAreaValues, setSafeAreaValues] = useState({ top: 0, bottom: 0 });
  const [isSDKReadyState, setIsSDKReadyState] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // First initialize the Telegram SDK
        await initSDK();

        // Then wait for safe area values to be available
        const values = await waitForSafeAreaValues();
        setSafeAreaValues(values);
        setIsSDKReadyState(true);
      } catch (error) {
        console.warn('Failed to initialize app:', error);
        // Fallback to immediate check
        const fallbackValues = getSafeAreaValues();
        setSafeAreaValues(fallbackValues);
        setIsSDKReadyState(isSDKReady());
      }
    };

    initializeApp();
  }, []);

  return (
    <div className="min-h-screen min-w-full w-full dark bg-background-primary">
      <header className="border w-full min-w-full  safe-area-pt h-full block">
        header
      </header>

      <main className="w-full min-w-full h-full block container p-8 space-y-8">
        <h1 className="text-2xl font-bold">shadcn/ui Components Examples</h1>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Development Tools</h2>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Top Safe Area:</span>
                  <span className="font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">{safeAreaValues.top}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Bottom Safe Area:</span>
                  <span className="font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">{safeAreaValues.bottom}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">SDK Status:</span>
                  <span className={`font-mono px-2 py-1 rounded ${isSDKReadyState ? 'bg-green-200 dark:bg-green-700' : 'bg-red-200 dark:bg-red-700'}`}>
                    {isSDKReadyState ? 'Ready' : 'Loading...'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-md font-medium mb-3">Mobile Debugging (Eruda)</h3>
                <div className="flex gap-2">
                  <button
                    onClick={toggleEruda}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Toggle Console
                  </button>
                  <button
                    onClick={destroyEruda}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Destroy Eruda
                  </button>
                </div>
                <p className="text-sm text-text-muted dark:text-text-secondary mt-2">
                  Use these buttons to control the mobile debugging console. Only available in development mode.
                  <br />
                  <span className="font-mono text-xs">Keyboard shortcut: Ctrl/Cmd + Shift + E</span>
                </p>
              </div>
            </div>
          </div>

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
              <CustomCheckbox label="Enable notifications" />
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

export default Dev