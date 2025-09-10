import { Button, UnderwaterHeader } from "@/components/ui"
import { CustomInput } from "@/components/ui"
import { Label } from "@/components/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router-dom"
import { useTelegramBackButton } from "@/lib/hooks"
import { useApiV1ApplicationCreateCreate } from "@/lib/api"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import type { ApplicationCreate } from "@/lib/api/model"
import { showToast } from "@/lib/utils"

function PlaceOrderForm() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { userInfo } = useTelegramUser()

    // Get service data from navigation state
    const service = location.state?.service

    const applicationCreateMutation = useApiV1ApplicationCreateCreate({
        mutation: {
            onSuccess: (data) => {
                showToast.success(t('app.common.application.accepted'))
                // Navigate to success page with application data
                navigate('/services/place-order/success', {
                    state: {
                        applicationData: data,
                        service: service
                    }
                })
            },
            onError: (error) => {
                console.error('Application creation failed:', error)
                showToast.error(t('app.common.error.applicationFailed'))
            }
        }
    })

    const [formData, setFormData] = useState({
        product_description: '',
        order_volume: '',
        production_delivery_time: '',
        special_requirements: '',
        budget_estimated_price: '',
        segment_category: '',
    })

    // Show back button that goes to services page
    useTelegramBackButton({ navigateTo: '/services' })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async () => {
        if (!userInfo?.user_id) {
            showToast.error(t('app.common.validation.userDataNotFound'))
            return
        }

        // Validate required fields
        const requiredFields = ['product_description', 'order_volume', 'production_delivery_time', 'budget_estimated_price', 'segment_category']
        const missingFields = requiredFields.filter(field => {
            const value = formData[field as keyof typeof formData]
            return !value || value.trim() === ''
        })

        if (missingFields.length > 0) {
            showToast.error(t('app.common.validation.fillRequiredFields'))
            return
        }

        try {
            const applicationData: ApplicationCreate = {
                ...formData,
                user: userInfo.user_id,
                service: service?.id || null,
                customer: userInfo.customer || null,
                manufacturer: userInfo.manufacturer || null
            }

            await applicationCreateMutation.mutateAsync({ data: applicationData })
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col">
                <UnderwaterHeader />

                {/* Header */}
                <div className="text-left space-y-1 mb-8 pt-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.placeOrder.title')}
                    </h1>
                    {service && (
                        <p className="text-[#ACADAF] text-sm">
                            {service.name}
                        </p>
                    )}
                </div>

                {/* Form */}
                <div className="flex-1 space-y-4 pb-8">
                    {/* Product Description */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.productDescription.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.productDescription.placeholder')}
                            value={formData.product_description}
                            onChange={(e) => handleInputChange('product_description', e.target.value)}
                            multiline
                            rows={4}
                        />
                    </div>

                    {/* Order Volume */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.orderVolume.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.orderVolume.placeholder')}
                            value={formData.order_volume}
                            onChange={(e) => handleInputChange('order_volume', e.target.value)}
                        />
                    </div>

                    {/* Production/Delivery Time */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.productionDeliveryTime.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.productionDeliveryTime.placeholder')}
                            value={formData.production_delivery_time}
                            onChange={(e) => handleInputChange('production_delivery_time', e.target.value)}
                        />
                    </div>

                    {/* Special Requirements */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.placeOrder.form.specialRequirements.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.specialRequirements.placeholder')}
                            value={formData.special_requirements}
                            onChange={(e) => handleInputChange('special_requirements', e.target.value)}
                            multiline
                            rows={3}
                        />
                    </div>

                    {/* Budget/Estimated Price */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.budgetEstimatedPrice.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.budgetEstimatedPrice.placeholder')}
                            value={formData.budget_estimated_price}
                            onChange={(e) => handleInputChange('budget_estimated_price', e.target.value)}
                        />
                    </div>

                    {/* Segment Category */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.segmentCategory.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.segmentCategory.placeholder')}
                            value={formData.segment_category}
                            onChange={(e) => handleInputChange('segment_category', e.target.value)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pb-4 safe-area-pb mt-4">
                    <Button
                        loading={applicationCreateMutation.isPending}
                        variant="default"
                        shadow="lg"
                        onClick={handleSubmit}
                        disabled={applicationCreateMutation.isPending}
                        className="w-full"
                    >
                        {t('app.placeOrder.form.submitButton')}
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default PlaceOrderForm
