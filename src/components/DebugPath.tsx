import { useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface DebugPathProps {
    className?: string
}

export const DebugPath: React.FC<DebugPathProps> = ({ className }) => {
    const location = useLocation()
    const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString())

    // Only show in development
    if (import.meta.env.PROD) {
        return null
    }

    // Update timestamp when path changes
    useEffect(() => {
        setTimestamp(new Date().toLocaleTimeString())
    }, [location.pathname])

    return (
        <div className={cn(
            "fixed top-0 left-0 right-0 z-[9999] bg-background-secondary/95 backdrop-blur-sm border-b border-border-primary px-4 py-2 text-xs font-mono",
            className
        )}>
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-text-secondary">📍</span>
                    <span className="text-text-primary font-medium">Path:</span>
                    <span className="text-brand-primary font-semibold">{location.pathname}</span>
                    {location.search && (
                        <>
                            <span className="text-text-secondary">?</span>
                            <span className="text-text-tertiary">{location.search}</span>
                        </>
                    )}
                    {location.hash && (
                        <>
                            <span className="text-text-secondary">#</span>
                            <span className="text-text-tertiary">{location.hash}</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                    <span>🕐 {timestamp}</span>
                    <span>•</span>
                    <span>🔧 DEV</span>
                </div>
            </div>
        </div>
    )
}
