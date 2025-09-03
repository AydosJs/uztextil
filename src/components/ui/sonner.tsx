import { Toaster as Sonner } from "sonner"
import { useEffect, useState } from "react"
import { getSafeAreaValues } from "@/utils/safeAreaUtils"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const [safeAreaTop, setSafeAreaTop] = useState(0)

    useEffect(() => {
        // Get initial safe area values
        const { top } = getSafeAreaValues()
        setSafeAreaTop(top)

        // Set up interval to check for safe area changes
        const interval = setInterval(() => {
            const { top: currentTop } = getSafeAreaValues()
            if (currentTop !== safeAreaTop) {
                setSafeAreaTop(currentTop)
            }
        }, 100)

        return () => clearInterval(interval)
    }, [safeAreaTop])

    return (
        <Sonner
            theme="light"
            className="toaster group"
            style={{
                top: `${safeAreaTop + 48}px`, // Add 20px margin from safe area
            }}
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-gray-600",
                    actionButton:
                        "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
                    cancelButton:
                        "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
