import { useApiV1SliderListList } from "@/lib/api"
import { Card, Skeleton } from "@/components/ui"
import { cn } from "@/lib/utils"

interface SliderCardsProps {
    className?: string
}

export const SliderCards = ({ className }: SliderCardsProps) => {
    const { data: sliders, isLoading, error } = useApiV1SliderListList()

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

    // Skeleton Card Component
    const SkeletonCard = () => (
        <div className="relative w-full mx-auto rounded-xl overflow-hidden  bg-transparent border-gray-700/50">
            {/* Image skeleton */}
            <Skeleton className="w-full h-48" />

            {/* Content skeleton */}
            <div className="absolute inset-0 bg-gradient-to-t bg-transparent " />
            <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Title skeleton */}
                <Skeleton className="h-5 w-3/4 mb-2" />
                {/* Description skeletons */}
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    )

    if (isLoading) {
        return (
            <div className={cn("grid grid-cols-1 w-full gap-4", className)}>
                {/* Show 3 skeleton cards while loading */}
                {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
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
                        <h3 className="text-white line-clamp-1 font-semibold mb-2 text-base">
                            {slider.title}
                        </h3>
                        <p className="text-gray-300 line-clamp-2 leading-relaxed text-sm">
                            {slider.description}
                        </p>
                    </div>
                </Card>
            ))}
        </div>
    )
}
