import { Button, UnderwaterHeader, DatePicker } from "@/components/ui"
import { CustomInput, SingleFileUploader } from "@/components/ui"
import { Label } from "@/components/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router-dom"
import { useTelegramBackButton } from "@/lib/hooks"
import { customInstance } from "@/lib/api-client"
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

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        looking_for_production: '', // Ищу производство
        manufacturer_requirements: '', // Требование к производителю
        order_volume: '', // Объём заказа
        passing_price: '', // Проходная цена
        sample_photo: null as File | null, // Фото образца
        execution_terms: null as Date | null, // Сроки исполнения
        payment_terms: '', // Условия оплаты
        telegram_whatsapp_number: '', // Номер в телеграм, вацап
        name_and_position: '', // Имя и должность
    })

    // Check if all required fields are filled
    const isFormValid = () => {
        const requiredFields = ['looking_for_production', 'manufacturer_requirements', 'order_volume', 'passing_price', 'execution_terms', 'payment_terms', 'telegram_whatsapp_number', 'name_and_position']
        return requiredFields.every(field => {
            const value = formData[field as keyof typeof formData]
            if (field === 'execution_terms') {
                return value !== null && value !== undefined
            }
            return value && value.toString().trim() !== ''
        })
    }

    // Show back button that goes to services page
    useTelegramBackButton({ navigateTo: '/services' })

    const handleInputChange = (field: string, value: string | Date | null | File) => {
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

        // Form validation is handled by button disabled state
        if (!isFormValid()) {
            return
        }

        setIsSubmitting(true)

        try {
            // Create FormData for file upload
            const formDataToSend = new FormData()

            // Add all form fields except sample_photo
            formDataToSend.append('looking_for_production', formData.looking_for_production)
            formDataToSend.append('manufacturer_requirements', formData.manufacturer_requirements)
            formDataToSend.append('order_volume', formData.order_volume)
            formDataToSend.append('passing_price', formData.passing_price)
            formDataToSend.append('payment_terms', formData.payment_terms)
            formDataToSend.append('telegram_whatsapp_number', formData.telegram_whatsapp_number)
            formDataToSend.append('name_and_position', formData.name_and_position)

            // Add execution terms if available
            if (formData.execution_terms) {
                formDataToSend.append('execution_terms', formData.execution_terms.toISOString())
            }

            // Add user and service data
            formDataToSend.append('user', userInfo.user_id.toString())
            if (service?.id) {
                formDataToSend.append('service', service.id.toString())
            }
            if (userInfo.customer) {
                formDataToSend.append('customer', userInfo.customer.toString())
            }
            if (userInfo.manufacturer) {
                formDataToSend.append('manufacturer', userInfo.manufacturer.toString())
            }

            // Add image file if available
            if (formData.sample_photo) {
                formDataToSend.append('sample_photo', formData.sample_photo)
            }

            // Use custom API call for FormData upload
            const response = await customInstance<ApplicationCreate>({
                url: '/api/v1/application/create/',
                method: 'POST',
                data: formDataToSend,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            // Trigger success callback manually
            showToast.success(t('app.common.application.accepted'))
            navigate('/services/place-order/success', {
                state: {
                    applicationData: response,
                    service: service
                }
            })
        } catch (error) {
            console.error('Form submission error:', error)
            showToast.error(t('app.common.error.applicationFailed'))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col bg-background-primary">
            <main className="w-full container min-w-full flex-1 flex flex-col">
                <UnderwaterHeader />

                {/* Header */}
                <div className="text-left space-y-1 mb-8 pt-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.placeOrder.title')}
                    </h1>
                    {service && (
                        <p className="text-text-secondary text-sm">
                            {service.name}
                        </p>
                    )}
                </div>

                {/* Form */}
                <div className="flex-1 space-y-4 pb-8">
                    {/* Looking for Production */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.lookingForProduction.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.lookingForProduction.placeholder')}
                            value={formData.looking_for_production}
                            onChange={(e) => handleInputChange('looking_for_production', e.target.value)}
                            multiline
                            rows={3}
                        />
                    </div>

                    {/* Manufacturer Requirements */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.manufacturerRequirements.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.manufacturerRequirements.placeholder')}
                            value={formData.manufacturer_requirements}
                            onChange={(e) => handleInputChange('manufacturer_requirements', e.target.value)}
                            multiline
                            rows={3}
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

                    {/* Passing Price */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.passingPrice.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.passingPrice.placeholder')}
                            value={formData.passing_price}
                            onChange={(e) => handleInputChange('passing_price', e.target.value)}
                        />
                    </div>

                    {/* Sample Photo */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.placeOrder.form.samplePhoto.label')}
                        </Label>
                        <SingleFileUploader
                            onFileChange={(file) => handleInputChange('sample_photo', file)}
                            accept="image/*"
                        />
                    </div>

                    {/* Execution Terms (Date Picker) */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.executionTerms.label')}
                        </Label>
                        <DatePicker
                            value={formData.execution_terms || undefined}
                            onChange={(date) => handleInputChange('execution_terms', date || null)}
                            placeholder={t('app.placeOrder.form.executionTerms.placeholder')}
                            fromYear={new Date().getFullYear()}
                            toYear={new Date().getFullYear() + 5}
                        />
                    </div>

                    {/* Payment Terms */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.paymentTerms.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.paymentTerms.placeholder')}
                            value={formData.payment_terms}
                            onChange={(e) => handleInputChange('payment_terms', e.target.value)}
                        />
                    </div>

                    {/* Telegram/WhatsApp Number */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.telegramWhatsappNumber.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.telegramWhatsappNumber.placeholder')}
                            value={formData.telegram_whatsapp_number}
                            onChange={(e) => handleInputChange('telegram_whatsapp_number', e.target.value)}
                        />
                    </div>

                    {/* Name and Position */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.placeOrder.form.nameAndPosition.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.placeOrder.form.nameAndPosition.placeholder')}
                            value={formData.name_and_position}
                            onChange={(e) => handleInputChange('name_and_position', e.target.value)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pb-4 safe-area-pb mt-4">
                    <Button
                        loading={isSubmitting}
                        variant="default"
                        shadow="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isFormValid()}
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
