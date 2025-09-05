import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/useIsMobile"

interface UnderwaterHeaderProps {
    className?: string
    children?: React.ReactNode
}

export function UnderwaterHeader({ className, children }: UnderwaterHeaderProps) {
    const isMobile = useIsMobile()

    // Don't render on desktop
    if (!isMobile) {
        return null
    }

    return (
        <header className={cn(
            "safe-area-pt fixed top-0 left-0 right-0 z-50 bg-background/80 border-b border-border backdrop-blur-sm",
            className
        )}>
            <div className="absolute rounded-full left-1/2 -translate-x-1/2 bottom-2.5 h-[30px] bg-foreground/10 w-[120px] overflow-hidden shadow-lg border border-white/20">
                {/* Underwater bubbles floating from bottom to top */}
                <div className="absolute bottom-0 left-3 w-1 h-1 bg-white/50 rounded-full animate-bubble-float-1"></div>
                <div className="absolute bottom-0 right-4 w-0.5 h-0.5 bg-white/40 rounded-full animate-bubble-float-2"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-0.5 bg-white/60 rounded-full animate-bubble-float-3"></div>
                <div className="absolute bottom-0 left-6 w-0.5 h-0.5 bg-white/30 rounded-full animate-bubble-float-4"></div>
                <div className="absolute bottom-0 right-2 w-1 h-1 bg-white/50 rounded-full animate-bubble-float-5"></div>
            </div>
            {children}
        </header>
    )
}
