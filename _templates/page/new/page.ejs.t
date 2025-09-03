---
to: src/pages/<%= h.changeCase.pascalCase(name) %>.tsx
---
import { Button } from "@/components/ui"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useTelegramBackButton } from "@/lib/hooks"

function <%= h.changeCase.pascalCase(name) %>() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    // Configure back button behavior
    useTelegramBackButton({ navigateTo: "<%= backRoute || '/' %>" })

    const handleAction = () => {
        // Add your navigation logic here
        navigate("<%= nextRoute || '/' %>")
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col justify-between">
                <div className="flex px-3 flex-col items-center justify-center space-y-8">
                    {/* Page Header */}
                    <div className="text-left space-y-2">
                        <h1 className="text-white font-bold text-[27px] tracking-wide">
                            {t('<%= translationKey || `pages.${h.changeCase.camelCase(name)}.title` %>')}
                        </h1>
                        <p className="text-gray-300 max-w-md font-medium text-sm leading-relaxed">
                            {t('<%= translationDescKey || `pages.${h.changeCase.camelCase(name)}.description` %>')}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center">
                    {/* Add your main content here */}
                    <div className="text-center">
                        <p className="text-gray-300">Content goes here</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 pb-8 space-y-4">
                    <Button
                        variant="default"
                        shadow="lg"
                        onClick={handleAction}
                        className="w-full"
                    >
                        {t('<%= actionTextKey || `pages.${h.changeCase.camelCase(name)}.action` %>')}
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default <%= h.changeCase.pascalCase(name) %>
