import { Option } from "@/components/ui"
import { UserRound, Factory } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useTelegramBackButton } from "@/lib/hooks"
import departmentSvg from "@/assets/department.svg"

function ChooseDepartment() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    // Show back button that goes to welcome page
    useTelegramBackButton({ navigateTo: '/welcome' })

    const handleCustomerSelect = () => {
        navigate("/customer")
    }

    const handleManufacturerSelect = () => {
        navigate("/manufacturer")
    }

    return (
        <div className="min-h-screen container  min-w-full safe-area-pt  w-full flex flex-col">
            <main className="w-full min-w-full flex-1 flex flex-col justify-between">
                {/* <UnderwaterHeader /> */}


                <div
                    className={`fixed pointer-events-none`}
                    style={{
                        width: '512px',
                        height: '512px',
                        top: '73px',
                        left: '-248px', // Half of 294px (147px) so only half is visible
                        transform: 'translateY(-50%)', // Center vertically
                        opacity: 0.08,
                        background: 'radial-gradient(50% 50% at 50% 50%, #FCE803 0%, rgba(252, 232, 3, 0) 100%)',
                        backdropFilter: 'blur(128px)',
                        WebkitBackdropFilter: 'blur(128px)', // For Safari support
                        zIndex: -1, // Ensure it stays behind other content
                    }}
                />

                <div className="flex flex-col items-center justify-center space-y-8">
                    {/* Body Selection Header */}
                    <h1 className="text-white font-bold text-[27px] tracking-wide">
                        {t('app.department.title')}
                    </h1>
                </div>

                {/* Department SVG Image */}
                <div className="absolute inset-0 mt-20 flex justify-center items-center">
                    <img
                        src={departmentSvg}
                        alt="Department"
                        className="max-w-full max-h-full object-contain"
                    />
                </div>

                {/* Information Text */}
                <div className="pb-8 w-full space-y-3">
                    <Option
                        text={t('app.department.customer')}
                        icon={UserRound}
                        onClick={handleCustomerSelect}
                    />
                    <Option
                        text={t('app.department.manufacturer')}
                        icon={Factory}
                        onClick={handleManufacturerSelect}
                    />
                </div>
            </main >
        </div >
    )
}

export default ChooseDepartment
