import { Spinner } from "./spinner"
import { useTranslation } from "react-i18next"

interface GlobalLoadingProps {
    message?: string
    className?: string
}

export function GlobalLoading({
    message,
    className
}: GlobalLoadingProps) {
    const { t } = useTranslation()

    return (
        <div className={`min-h-screen min-w-full bg-background-primary safe-area-pt w-full dark flex flex-col items-center justify-center ${className || ''}`}>
            <Spinner size="lg" />
            <p className="mt-4 text-white">{message || t('app.common.loading')}</p>
        </div>
    )
}
