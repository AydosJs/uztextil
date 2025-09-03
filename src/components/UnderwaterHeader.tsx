import { UnderwaterScene } from './UnderwaterScene'

export function UnderwaterHeader() {
    return (
        <header className="safe-area-pt fixed top-0 left-0 right-0 z-50 bg-background/80 border-b border-border backdrop-blur-sm">
            {/* 3D Underwater Scene */}
            <UnderwaterScene />
        </header>
    )
}
