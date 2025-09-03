import { useApiV1SlidersList } from "@/lib/api/api/api"
import { Card } from "@/components/ui"
import { Spinner } from "@/components/ui"
import { cn } from "@/lib/utils"

interface SliderCardsProps {
    className?: string
}

export const SliderCards = ({ className }: SliderCardsProps) => {
    const { data: sliders, isLoading, error } = useApiV1SlidersList()

    // URL validation function
    const isValidUrl = (url: string | undefined): boolean => {
        if (!url) return false
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Spinner />
            </div>
        )
    }

    if (error || !sliders) {
        return null // Don't show anything if there's an error or no data
    }

    // Filter out sliders that don't have valid image URLs or are not active
    const validSliders = sliders.filter(slider =>
        slider.is_active &&
        isValidUrl(slider.image)
    )

    if (validSliders.length === 0) {
        return null // Don't show anything if no valid sliders
    }

    return (
        <div className={cn("grid grid-cols-1 w-full gap-4", className)}>
            {validSliders.map((slider) => (
                <Card
                    key={slider.id}
                    image={slider.image}
                    imageAlt={slider.title}
                    className="w-full mx-auto"
                >
                    <div className="flex flex-col justify-end h-full">
                        <h3 className="text-white font-semibold mb-2 text-base">
                            {slider.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-xs">
                            {slider.description}
                        </p>
                    </div>
                </Card>
            ))}
        </div>
    )
}
