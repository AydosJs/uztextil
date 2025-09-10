import type { LucideIcon } from "lucide-react"

interface OptionProps {
    text: string
    icon: LucideIcon
    onClick?: () => void
}

export function Option({ text, icon: Icon, onClick }: OptionProps) {
    return (
        <div
            className="w-full h-[57px] bg-[#1D1F24]/80 rounded-2xl border border-white/5 shadow-[0px_1px_0px_0px_rgba(255,255,255,0.08)_inset] flex items-center justify-between px-4 cursor-pointer hover:bg-[#1D1F24]/50 transition-colors relative overflow-hidden"
            onClick={onClick}
        >
            <span className="text-white font-semibold text-md">
                {text}
            </span>
            <div className="relative flex items-center justify-center pr-2">
                {/* Background SVG Effect */}
                <svg
                    width="71"
                    height="71"
                    viewBox="0 0 71 71"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute pointer-events-none"
                >
                    <path
                        opacity="0.16"
                        d="M1.10937 1.10937L69.8906 69.8906M69.8906 1.10937L1.10938 69.8906M24.4054 0V71M35.4986 0V71M46.5936 0V71M71 24.4064L0 24.4064M71 35.4996L0 35.4996M71 46.5945L0 46.5945M57.6875 35.5C57.6875 47.7538 47.7538 57.6875 35.5 57.6875C23.2462 57.6875 13.3125 47.7538 13.3125 35.5C13.3125 23.2462 23.2462 13.3125 35.5 13.3125C47.7538 13.3125 57.6875 23.2462 57.6875 35.5ZM46.5937 35.5C46.5937 41.6269 41.6269 46.5937 35.5 46.5937C29.3731 46.5937 24.4062 41.6269 24.4062 35.5C24.4062 29.3731 29.3731 24.4062 35.5 24.4062C41.6269 24.4062 46.5937 29.3731 46.5937 35.5Z"
                        stroke="url(#paint0_radial_58_2)"
                        strokeWidth="0.5"
                    />
                    <defs>
                        <radialGradient id="paint0_radial_58_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.5 35.5) rotate(90) scale(35.5)">
                            <stop stopColor="white" />
                            <stop offset="0.5" stopColor="white" stopOpacity="0.25" />
                            <stop offset="1" stopColor="white" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
                <Icon className="size-6 text-white relative z-10" />
            </div>
        </div>
    )
}
