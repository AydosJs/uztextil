import { AudioWaveform } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

interface ServiceCardProps {
    title: string
    price: string
    icon?: React.ReactNode
    onClick?: () => void
    className?: string
}

function ServiceCard({ title, price, icon, onClick, className = "" }: ServiceCardProps) {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const handleClick = () => {
        if (onClick) {
            onClick()
        } else {
            // Default navigation to submit application
            navigate('/customer/submit-application', {
                state: { serviceTitle: title }
            })
        }
    }

    return (
        <div
            onClick={handleClick}
            className={`relative flex items-center px-6 w-full h-[108px] rounded-[22px] border border-border-primary bg-background-card shadow-card overflow-hidden cursor-pointer hover:bg-background-card-hover transition-colors ${className}`}
            style={{
                backdropFilter: 'blur(128px)',
                WebkitBackdropFilter: 'blur(128px)'
            }}
        >
            {/* Radial gradient effect for each card */}
            <div
                className="absolute w-[512px] h-[512px] -top-[202px] -left-[256px] opacity-[0.08] pointer-events-none"
                style={{
                    background: 'radial-gradient(50% 50% at 50% 50%, var(--color-brand-primary) 0%, rgba(252, 232, 3, 0) 100%)',
                    backdropFilter: 'blur(128px)',
                    WebkitBackdropFilter: 'blur(128px)'
                }}
            ></div>

            {/* Decorative SVG effect on the right */}
            <div className="absolute size-[111px] right-0 opacity-100 pointer-events-none">
                <svg viewBox="0 0 111 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.16" d="M1.73438 -0.265625L109.266 107.266M109.266 -0.265625L1.73438 107.266M38.1549 -2V109M55.4979 -2V109M72.8435 -2V109M111 36.1565L0 36.1565M111 53.4994L0 53.4994M111 70.8449L0 70.8449M90.1875 53.5C90.1875 72.6574 74.6574 88.1875 55.5 88.1875C36.3426 88.1875 20.8125 72.6574 20.8125 53.5C20.8125 34.3426 36.3426 18.8125 55.5 18.8125C74.6574 18.8125 90.1875 34.3426 90.1875 53.5ZM72.8438 53.5C72.8438 63.0787 65.0787 70.8438 55.5 70.8438C45.9213 70.8438 38.1563 63.0787 38.1563 53.5C38.1563 43.9213 45.9213 36.1563 55.5 36.1563C65.0787 36.1563 72.8438 43.9213 72.8438 53.5Z" stroke="url(#paint0_radial_141_8275)" strokeWidth="0.5" />
                    <defs>
                        <radialGradient id="paint0_radial_141_8275" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(55.5 53.5) rotate(90) scale(55.5)">
                            <stop stopColor="white" />
                            <stop offset="0.5" stopColor="white" stopOpacity="0.25" />
                            <stop offset="1" stopColor="white" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            <div className="space-y-1 w-full flex flex-row items-center justify-between">
                <div>
                    <h3 className="text-white font-extrabold text-base">
                        {title}
                    </h3>
                    <p className="text-text-secondary font-bold text-xs">
                        {t('app.common.price')}: {price}
                    </p>
                </div>

                <div className="mr-4">
                    {icon || <AudioWaveform className="size-8" />}
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>
    )
}

export default ServiceCard
