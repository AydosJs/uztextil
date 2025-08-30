import { Option } from "@/components/ui"
import { UserRound, Factory } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

function ChooseDepartment() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    // Use the Telegram back button hook - will navigate back to previous page by default

    const handleCustomerSelect = () => {
        navigate("/customer")
    }

    const handleManufacturerSelect = () => {
        navigate("/manufacturer")
    }

    return (
        <div className="min-h-screen  min-w-full safe-area-pt container w-full flex flex-col">
            <main className="w-full min-w-full flex-1 flex flex-col justify-between">
                <div className=" flex px-4 flex-col items-center justify-center space-y-8">
                    {/* Body Selection Header */}
                    <h1 className="text-white font-bold text-[27px] tracking-wide">
                        {t('app.department.title')}
                    </h1>
                </div>

                {/* WE CAN MAKE IT ABSOLUTE POSITION AND PUT IMAGE IN IT */}
                <div className="text-center w-full h-full">
                    Image
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
