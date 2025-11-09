import { Option } from "@/components/ui"
import { UserRound, Factory, FileText } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import { customInstance } from "@/lib/api-client"
import type { TelegramUserInfo } from "@/types/telegram"
import departmentSvg from "@/assets/department.svg"

function ChooseDepartment() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { user } = useTelegramUser()

    // Show back button that goes to welcome page
    useTelegramBackButton({ navigateTo: '/welcome' })

    const handleDepartmentSelect = async (department: 'customer' | 'manufacturer') => {
        if (!user) {
            return
        }

        // Store department in localStorage immediately
        localStorage.setItem('user_department', department)

        try {
            // Always try to register/update user for the selected department
            // The API should handle if user is already registered
            const registerResponse = await customInstance<TelegramUserInfo>({
                url: '/api/v1/bot-user/register/',
                method: 'POST',
                data: {
                    telegram_id: user.telegram_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    phone_number: user.phone_number,
                    language_code: user.language_code,
                    is_bot: user.is_bot,
                    is_active: user.is_active,
                    created_at: user.created_at,
                    department: department
                }
            })


            // Check the response to see if user is already registered for this department
            const isAlreadyRegistered = (department === 'customer' && registerResponse.customer) ||
                (department === 'manufacturer' && registerResponse.manufacturer)

            if (isAlreadyRegistered) {
                // User is already registered for this department, go to services
                navigate("/services", { state: { department } })
            } else {
                // User was just registered for this department, go to welcome/register page
                navigate(`/${department}`, { state: { department } })
            }
        } catch {
            // On error, still navigate to the department page
            navigate(`/${department}`, { state: { department } })
        }
    }

    const handleCustomerSelect = () => {
        handleDepartmentSelect('customer')
    }

    const handleManufacturerSelect = () => {
        handleDepartmentSelect('manufacturer')
    }

    const handleApplicationSelect = () => {
        navigate('/application-form')
    }

    return (
        <div className="min-h-screen container min-w-full safe-area-pt w-full flex flex-col bg-background-primary">
            <main className="w-full max-w-4xl mx-auto min-w-full flex-1 flex flex-col justify-between">
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
                        background: 'radial-gradient(50% 50% at 50% 50%, var(--color-brand-primary) 0%, rgba(252, 232, 3, 0) 100%)',
                        backdropFilter: 'blur(128px)',
                        WebkitBackdropFilter: 'blur(128px)', // For Safari support
                        zIndex: -1, // Ensure it stays behind other content
                    }}
                />

                <div className="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto">
                    {/* Body Selection Header */}
                    <h1 className="text-white font-bold text-[27px] tracking-wide text-left">
                        {t('app.department.title')}
                    </h1>
                </div>

                {/* Department SVG Image */}
                <div className="absolute inset-0 opacity-20 mt-20 flex justify-center items-center">
                    <img
                        src={departmentSvg}
                        alt="Department"
                        className="max-w-2xl max-h-full object-contain"
                    />
                </div>

                {/* Information Text */}
                <div className="pb-8 w-full max-w-2xl mx-auto space-y-3">
                    <Option
                        text={t('app.department.manufacturer')}
                        icon={Factory}
                        onClick={handleCustomerSelect}
                    />
                    <Option
                        text={t('app.department.customer')}
                        icon={UserRound}
                        onClick={handleManufacturerSelect}
                    />
                    <Option
                        text={t('app.department.application')}
                        icon={FileText}
                        onClick={handleApplicationSelect}
                    />
                </div>
            </main>
        </div>
    )
}

export default ChooseDepartment
