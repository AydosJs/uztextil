import { Button, UnderwaterHeader } from "@/components/ui"
import { CustomInput } from "@/components/ui"
import { Label } from "@/components/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useTelegramBackButton } from "@/lib/hooks"
import { useApiV1ApplicationCustomerCreateCreate } from "@/lib/api/api/api"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import type { CustomerCreate } from "@/lib/api/model"
import { showToast } from "@/lib/utils"

function CustomerRegisterForm() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { userInfo, updateUserInfo } = useTelegramUser()
    const customerCreateMutation = useApiV1ApplicationCustomerCreateCreate({
        mutation: {
            onSuccess: (data) => {
                console.log('Customer created successfully:', data)

                // Update user info with the new customer data
                if (userInfo && data) {
                    const updatedUserInfo = {
                        ...userInfo,
                        customer: data.id // Extract just the ID
                    };
                    updateUserInfo(updatedUserInfo);
                }

                showToast.success('Muvaffaqiyatli yaratildi!') // Success message
                navigate('/services')
            },
            onError: (error) => {
                console.error('Customer creation failed:', error)
                showToast.error('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.') // Error message
            }
        }
    })

    const [formData, setFormData] = useState({
        full_name: '',
        position: '',
        company_name: '',
        website: '',
        legal_address: '',
        marketplace_brand: '',
        annual_order_volume: '',
        segment: '',
        cooperation_terms: '',
        payment_terms: '',
        phone: '',
        total_orders: 0
    })

    // Show back button that goes to customer welcome page
    useTelegramBackButton({ navigateTo: '/customer' })

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async () => {
        if (!userInfo?.user_id) {
            console.error('User ID not available')
            showToast.error('Foydalanuvchi ma\'lumotlari topilmadi')
            return
        }

        try {
            const customerData: CustomerCreate = {
                ...formData,
                user: userInfo.user_id,
                total_orders: formData.total_orders || 0
            }

            await customerCreateMutation.mutateAsync({ data: customerData })
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col">
                <UnderwaterHeader />
                {/* Header */}
                <div className="text-left space-y-4 mb-8">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.buyurtmachi.registerForm.header')}
                    </h1>
                </div>

                {/* Form */}
                <div className="flex-1 space-y-6 pb-8">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.fullName.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.fullName.placeholder')}
                            value={formData.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                        />
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.position.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.position.placeholder')}
                            value={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.companyName.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.companyName.placeholder')}
                            value={formData.company_name}
                            onChange={(e) => handleInputChange('company_name', e.target.value)}
                        />
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.website.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.website.placeholder')}
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                        />
                    </div>

                    {/* Legal Address */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            Legal Address
                        </Label>
                        <CustomInput
                            placeholder="Enter legal address"
                            value={formData.legal_address}
                            onChange={(e) => handleInputChange('legal_address', e.target.value)}
                        />
                    </div>

                    {/* Marketplace Brand */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            Marketplace Brand
                        </Label>
                        <CustomInput
                            placeholder="Enter marketplace brand"
                            value={formData.marketplace_brand}
                            onChange={(e) => handleInputChange('marketplace_brand', e.target.value)}
                        />
                    </div>

                    {/* Annual Order Volume */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            Annual Order Volume
                        </Label>
                        <CustomInput
                            placeholder="Enter annual order volume"
                            value={formData.annual_order_volume}
                            onChange={(e) => handleInputChange('annual_order_volume', e.target.value)}
                        />
                    </div>

                    {/* Segment */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            Product Segment
                        </Label>
                        <CustomInput
                            placeholder="Enter product segment"
                            value={formData.segment}
                            onChange={(e) => handleInputChange('segment', e.target.value)}
                        />
                    </div>

                    {/* Cooperation Terms */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            Cooperation Terms
                        </Label>
                        <CustomInput
                            placeholder="Enter cooperation terms"
                            value={formData.cooperation_terms}
                            onChange={(e) => handleInputChange('cooperation_terms', e.target.value)}
                        />
                    </div>

                    {/* Payment Terms */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            Payment Terms
                        </Label>
                        <CustomInput
                            placeholder="Enter payment terms"
                            value={formData.payment_terms}
                            onChange={(e) => handleInputChange('payment_terms', e.target.value)}
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.phone.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.phone.placeholder')}
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                    </div>

                    {/* Total Orders */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            Total Orders (Optional)
                        </Label>
                        <CustomInput
                            placeholder="Enter total orders count"
                            type="number"
                            value={formData.total_orders.toString()}
                            onChange={(e) => handleInputChange('total_orders', parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="px-4 pb-8 mt-4">
                    <Button
                        loading={customerCreateMutation.isPending}
                        variant="default"
                        shadow="lg"
                        onClick={handleSubmit}
                        disabled={customerCreateMutation.isPending}
                        className="w-full"
                    >
                        {t('app.buyurtmachi.registerForm.submitButton')}
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default CustomerRegisterForm
