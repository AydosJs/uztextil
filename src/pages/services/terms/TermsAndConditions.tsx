import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button, CustomCheckbox, UnderwaterHeader } from "@/components/ui"
import { showToast } from "@/lib/utils"
import { useTelegramBackButton } from "@/lib/hooks"
import { useApiV1AdditionalServicesApplyCreate } from "@/lib/api"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import type { AdditionalService, ManufacturerList } from "@/lib/api/model"

function TermsAndConditions() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isChecked, setIsChecked] = useState(false)
    const { userInfo } = useTelegramUser()

    // Get service and factory data from navigation state
    const service = location.state?.service as AdditionalService
    const factory = location.state?.factory as ManufacturerList

    // Show back button - go to factory selection if we have factory data, otherwise services
    useTelegramBackButton({
        navigateTo: factory ? '/services/factory-selection' : '/services'
    })

    // Initialize the mutation for creating application
    const createApplicationMutation = useApiV1AdditionalServicesApplyCreate()

    // If no service data, redirect back to services
    if (!service) {
        navigate('/services')
        return null
    }

    const handleSubmit = () => {
        if (!isChecked) {
            showToast.warning("Iltimos, shartlarni o'qib chiqing va tasdiqlang")
            return
        }

        // Check if we have user ID
        if (!userInfo?.user_id) {
            showToast.error("User ID not found")
            return
        }

        // Check if service has ID
        if (!service.id) {
            showToast.error("Service ID not found")
            return
        }

        // Create application data
        const applicationData = {
            service: service.id,
            user: userInfo.user_id,
            ...(factory && { factory: factory.id }) // Include factory ID if available
        }

        // Make API call
        createApplicationMutation.mutate(
            { data: applicationData },
            {
                onSuccess: (response) => {
                    showToast.success("Ariza muvaffaqiyatli yuborildi!")
                    console.log("Application created successfully:", response)
                    // Navigate back to services page
                    navigate('/services')
                },
                onError: (error) => {
                    console.error("Failed to create application:", error)
                    showToast.error("Ariza yuborishda xatolik yuz berdi")
                }
            }
        )
    }

    const handleCancel = () => {
        navigate(-1)
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col">
                {/* Header */}
                <UnderwaterHeader />

                <div className="flex items-center space-x-4 mb-6 pt-4">
                    <h1 className="text-white font-bold text-2xl tracking-wide">
                        {service.name}
                    </h1>
                </div>

                {factory && (
                    <div className="mb-4 px-4">
                        <p className="text-white/80 text-sm">
                            Tanlangan ishlab chiqaruvchi: <span className="font-semibold">{factory.company_name}</span>
                        </p>
                    </div>
                )}

                {/* Terms and Conditions Section */}
                <div className="flex-1 space-y-6 pb-8">
                    <div className="space-y-2">
                        <h2 className="text-white font-bold text-lg tracking-wide">
                            Коммерческое предложение
                        </h2>

                        <div className="space-y-4 text-white/64 text-sm leading-relaxed">
                            <p>
                                {service.description}
                            </p>
                        </div>

                        {/* Checkbox */}
                        {!service.is_apply && (
                            <div className="pt-4">
                                <CustomCheckbox
                                    label="Tanishib chiqdim"
                                    checked={isChecked}
                                    onCheckedChange={(checked) => setIsChecked(checked === true)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {service.is_apply ? (
                    <div className="text-center mb-5 px-10">
                        <p className="text-white text-sm font-bold mb-2">
                            Ariza allaqachon yuborilgan
                        </p>
                        <p className="text-white/64 text-xs">
                            Menejerlarimiz siz bilan bog'lanishadi
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-white text-sm font-bold mb-5 px-10">
                        Ariza qoldiring va menejerlarimiz siz bilan  tez orada bog'lanishadi
                    </p>
                )}

                {/* Bottom Buttons */}
                {!service.is_apply && (
                    <div className="px-6 pb-8 space-y-3">
                        <Button
                            variant="secondary"
                            shadow="lg"
                            onClick={handleCancel}
                            className="w-full"
                        >
                            Bekor qilish
                        </Button>

                        <Button
                            variant="default"
                            onClick={handleSubmit}
                            disabled={!isChecked || createApplicationMutation.isPending}
                            className="w-full"
                        >
                            {createApplicationMutation.isPending ? "Yuborilmoqda..." : "Ariza qoldirish"}
                        </Button>
                    </div>
                )}
            </main>
        </div>
    )
}

export default TermsAndConditions
