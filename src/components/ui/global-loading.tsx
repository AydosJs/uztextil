import { Spinner } from "./spinner"

interface GlobalLoadingProps {
    message?: string
    className?: string
}

export function GlobalLoading({
    message = "Loading...",
    className
}: GlobalLoadingProps) {
    return (
        <div className={`min-h-screen min-w-full safe-area-pt w-full dark flex flex-col items-center justify-center ${className || ''}`}>
            <Spinner size="lg" />
            <p className="mt-4 text-white">{message}</p>
        </div>
    )
}
