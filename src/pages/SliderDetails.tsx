import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useApiV1SliderListList } from "@/lib/api"
import { Button, Skeleton } from "@/components/ui"
import { useTelegramBackButton } from "@/lib/hooks"
import { ChevronLeft } from "lucide-react"

export default function SliderDetails() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { data: sliders, isLoading, error } = useApiV1SliderListList()

    useTelegramBackButton({ onBack: () => navigate(-1) })

    // Find the specific slider by ID
    const slider = sliders?.results?.find(s => s.id === Number(id))


    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col bg-background-primary">
                <div className="flex items-center p-4 border-b border-border-primary">
                    <Skeleton className="w-6 h-6 mr-3" />
                    <Skeleton className="h-6 w-32" />
                </div>

                <div className="flex-1 p-4 space-y-6">
                    {/* Image skeleton */}
                    <Skeleton className="w-full h-64 rounded-2xl" />

                    {/* Title skeleton */}
                    <Skeleton className="h-8 w-3/4" />

                    {/* Date skeleton */}
                    <Skeleton className="h-5 w-32" />

                    {/* Description skeletons */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            </div>
        )
    }

    if (error || !slider) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col bg-background-primary">
                <div className="flex items-center p-4 border-b border-border-primary">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="mr-3 p-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-semibold text-text-primary">
                        {t('app.slider.details.title')}
                    </h1>
                </div>

                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-text-secondary mb-4">
                            {t('slider.details.notFound')}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            {t('common.goBack')}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen min-w-full bg-background-primary safe-area-pt w-full dark flex flex-col">
            {/* Header */}
            {/* <div className="flex items-center border-border-primary px-4 mb-4 mt-2">
                <div
                    onClick={() => navigate(-1)}
                    className="mr-3"
                >
                    <ChevronLeft className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-semibold text-text-primary truncate">
                    {slider?.title || t('app.slider.details.title')}
                </h1>
            </div> */}

            {/* Content - flex-1 to take available space */}
            <div className="flex-1 flex flex-col p-4">
                {/* Scrollable content */}
                <div className="flex-1 space-y-6 overflow-y-auto">
                    {/* Image */}
                    {slider.image && (
                        <div className="w-full h-64 rounded-2xl overflow-hidden bg-background-secondary">
                            <img
                                src={slider.image}
                                alt={slider.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-text-primary leading-tight">
                            {slider.title}
                        </h2>

                        {/* Date
                        {slider.created_at && (
                            <p className="text-sm text-text-secondary">
                                {t('app.slider.details.publishedOn')}: <span className="text-text-primary">{formatDate(slider.created_at)}</span>
                            </p>
                        )} */}
                    </div>

                    {/* Description */}
                    <div className="prose prose-invert max-w-none">
                        <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                            {slider.description}
                        </p>
                    </div>
                </div>

                {/* Submit Application Button - Fixed at bottom */}
                <div className="pt-4 pb-safe-area-b">
                    <Button
                        variant="default"
                        shadow="lg"
                        className="w-full max-h-12 font-semibold mb-4"
                        onClick={() => {
                            // Navigate to application form or handle submission
                            navigate('/application-form')
                        }}
                    >
                        {t('app.common.submitApplication')}
                    </Button>
                </div>
            </div>
        </div>
    )
}
