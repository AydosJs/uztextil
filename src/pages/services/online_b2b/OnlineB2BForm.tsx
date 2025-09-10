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

function OnlineB2BForm() {
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
                navigate('/services/online-b2b/success', {
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
        segment: '',
        work_purpose: '',
        interested_factories: '',
        quantity_to_see: '',
        planned_stay_days: '',
        planned_arrival_dates: '',
        needs_tourist_program: '',
    })

    // Check if all required fields are filled
    const isFormValid = () => {
        const requiredFields = ['segment', 'work_purpose', 'interested_factories', 'quantity_to_see', 'planned_stay_days', 'planned_arrival_dates']
        return requiredFields.every(field => {
            const value = formData[field as keyof typeof formData]
            return value && value.trim() !== ''
        })
    }

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

        // Form validation is handled by button disabled state
        if (!isFormValid()) {
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
                <div className="text-left space-y-2 mb-8 pt-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.onlineB2B.title')}
                    </h1>
                    <p className="text-[#ACADAF] text-sm">
                        {t('app.onlineB2B.subtitle')}
                    </p>
                </div>

                {/* Form */}
                <div className="flex-1 space-y-4 pb-8">
                    {/* Segment */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.onlineB2B.form.segment.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.onlineB2B.form.segment.placeholder')}
                            value={formData.segment}
                            onChange={(e) => handleInputChange('segment', e.target.value)}
                        />
                    </div>

                    {/* Work Purpose */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.onlineB2B.form.workPurpose.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.onlineB2B.form.workPurpose.placeholder')}
                            value={formData.work_purpose}
                            onChange={(e) => handleInputChange('work_purpose', e.target.value)}
                            multiline
                            rows={4}
                        />
                    </div>

                    {/* Interested Factories */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.onlineB2B.form.interestedFactories.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.onlineB2B.form.interestedFactories.placeholder')}
                            value={formData.interested_factories}
                            onChange={(e) => handleInputChange('interested_factories', e.target.value)}
                            multiline
                            rows={3}
                        />
                    </div>

                    {/* Quantity to See */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.onlineB2B.form.quantityToSee.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.onlineB2B.form.quantityToSee.placeholder')}
                            value={formData.quantity_to_see}
                            onChange={(e) => handleInputChange('quantity_to_see', e.target.value)}
                        />
                    </div>

                    {/* Planned Stay Days */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.onlineB2B.form.plannedStayDays.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.onlineB2B.form.plannedStayDays.placeholder')}
                            value={formData.planned_stay_days}
                            onChange={(e) => handleInputChange('planned_stay_days', e.target.value)}
                        />
                    </div>

                    {/* Planned Arrival Dates */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.onlineB2B.form.plannedArrivalDates.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.onlineB2B.form.plannedArrivalDates.placeholder')}
                            value={formData.planned_arrival_dates}
                            onChange={(e) => handleInputChange('planned_arrival_dates', e.target.value)}
                        />
                    </div>

                    {/* Needs Tourist Program */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.onlineB2B.form.needsTouristProgram.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.onlineB2B.form.needsTouristProgram.placeholder')}
                            value={formData.needs_tourist_program}
                            onChange={(e) => handleInputChange('needs_tourist_program', e.target.value)}
                            multiline
                            rows={3}
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
                        disabled={applicationCreateMutation.isPending || !isFormValid()}
                        className="w-full"
                    >
                        {t('app.onlineB2B.form.submitButton')}
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default OnlineB2BForm
