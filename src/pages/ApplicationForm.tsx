import { Button, UnderwaterHeader } from "@/components/ui"
import { CustomInput } from "@/components/ui"
import { Label } from "@/components/ui"
import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useTelegramBackButton } from "@/lib/hooks"
import { useApiV1ApplicationCreateCreate } from "@/lib/api"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import type { ApplicationCreate } from "@/lib/api/model"
import { showToast } from "@/lib/utils"

function ApplicationForm() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { userInfo } = useTelegramUser()

    // Show back button that goes to choose department page
    useTelegramBackButton({ navigateTo: '/choose-department' })

    const applicationCreateMutation = useApiV1ApplicationCreateCreate({
        mutation: {
            onSuccess: (data) => {
                console.log('Application created successfully:', data)
                showToast.success(t('app.applicationForm.success.title'))
                navigate('/application-success', { state: { applicationId: data.id } })
            },
            onError: (error) => {
                console.error('Application creation failed:', error)
                showToast.error(t('app.common.error.applicationSubmitFailed'))
            }
        }
    })

    const [formData, setFormData] = useState({
        full_name: '',
        company_name: '',
        additional_notes: '',
        contact_phone: ''
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Check if all required fields are filled
    const isFormValid = useMemo(() => {
        const requiredFields = ['full_name', 'company_name', 'contact_phone']
        return requiredFields.every(field => {
            const value = formData[field as keyof typeof formData]
            return typeof value === 'string' && value.trim().length > 0
        })
    }, [formData])

    const handleSubmit = async () => {
        if (!userInfo?.user_id) {
            console.error('User ID not available')
            showToast.error(t('app.common.validation.userDataNotFound'))
            return
        }

        try {
            const applicationData: ApplicationCreate = {
                ...formData,
                user: userInfo.user_id
            }

            await applicationCreateMutation.mutateAsync({ data: applicationData })
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col bg-background-primary">
            <main className="w-full max-w-4xl mx-auto container min-w-full flex-1 flex flex-col">
                <UnderwaterHeader />

                {/* Header */}
                <div className="text-left space-y-4 mb-8 max-w-2xl mx-auto w-full">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.applicationForm.title')}
                    </h1>
                    <p className="text-white/70 text-sm">
                        {t('app.applicationForm.subtitle')}
                    </p>
                </div>

                {/* Form */}
                <div className="flex-1 space-y-6 pb-8 max-w-2xl mx-auto w-full">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.applicationForm.form.fullName.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.applicationForm.form.fullName.placeholder')}
                            value={formData.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                        />
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.applicationForm.form.companyName.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.applicationForm.form.companyName.placeholder')}
                            value={formData.company_name}
                            onChange={(e) => handleInputChange('company_name', e.target.value)}
                        />
                    </div>

                    {/* Contact Phone */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.applicationForm.form.contactPhone.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.applicationForm.form.contactPhone.placeholder')}
                            value={formData.contact_phone}
                            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                        />
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.applicationForm.form.additionalNotes.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.applicationForm.form.additionalNotes.placeholder')}
                            value={formData.additional_notes}
                            onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="px-4 pb-8 mt-4 max-w-2xl mx-auto w-full">
                    <Button
                        loading={applicationCreateMutation.isPending}
                        variant="default"
                        shadow="lg"
                        onClick={handleSubmit}
                        disabled={applicationCreateMutation.isPending || !isFormValid}
                        className="w-full"
                    >
                        {t('app.applicationForm.form.submitButton')}
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default ApplicationForm
