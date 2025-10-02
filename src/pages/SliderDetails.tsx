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

    useTelegramBackButton(() => navigate(-1))

    // Find the specific slider by ID
    const slider = sliders?.find(s => s.id === Number(id))

    // Format date function
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return ""
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } catch {
            return dateString
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
                <div className="flex items-center p-4 border-b border-gray-800">
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
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
                <div className="flex items-center p-4 border-b border-gray-800">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="mr-3 p-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-semibold text-white">
                        {t('app.slider.details.title')}
                    </h1>
                </div>

                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">
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
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            {/* Header */}
            <div className="flex items-center border-gray-800 px-4 mb-4 mt-2">
                <div
                    onClick={() => navigate(-1)}
                    className="mr-3"
                >
                    <ChevronLeft className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-semibold text-white truncate">
                    {slider?.title || t('app.slider.details.title')}
                </h1>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 space-y-6 pb-8">
                {/* Image */}
                {slider.image && (
                    <div className="w-full h-64 rounded-2xl overflow-hidden bg-gray-800">
                        <img
                            src={slider.image}
                            alt={slider.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white leading-tight">
                        {slider.title}
                    </h2>

                    {/* Date */}
                    {slider.created_at && (
                        <p className="text-sm text-gray-400">
                            {t('app.slider.details.publishedOn')}: <span className="text-white">{formatDate(slider.created_at)}</span>
                        </p>
                    )}
                </div>

                {/* Description */}
                <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {slider.description}
                    </p>
                </div>

                {/* Submit Application Button */}
                <div className="pt-4">
                    <Button
                        variant="default"
                        shadow="lg"
                        className="w-full max-h-12 font-semibold"
                        onClick={() => {
                            // Navigate to application form or handle submission
                            navigate('/services')
                        }}
                    >
                        {t('app.common.submitApplication')}
                    </Button>
                </div>
            </div>
        </div>
    )
}
