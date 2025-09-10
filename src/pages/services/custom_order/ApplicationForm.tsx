import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { RadialEffect, UnderwaterHeader, Button, CustomInput, Label } from "@/components/ui"
import { useTelegramBackButton } from "@/lib/hooks"
import { useApiV1ApplicationCreateCreate } from "@/lib/api"
import { useTranslation } from "react-i18next"
import type { PackageList, AdditionalService } from "@/lib/api/model"

function ApplicationForm() {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()

    // Get data from navigation state
    const service = location.state?.service as AdditionalService
    const packageData = location.state?.package as PackageList

    // Form state
    const [formData, setFormData] = useState({
        work_purpose: '',
        interested_factories: '',
        quantity_to_see: '',
        planned_stay_days: '',
        planned_arrival_dates: '',
        needs_tourist_program: ''
    })

    // Check if all required fields are filled
    const isFormValid = () => {
        const requiredFields = ['work_purpose', 'interested_factories', 'quantity_to_see', 'planned_stay_days', 'planned_arrival_dates']
        return requiredFields.every(field => {
            const value = formData[field as keyof typeof formData]
            return value && value.trim() !== ''
        })
    }

    // API mutation
    const createApplicationMutation = useApiV1ApplicationCreateCreate({
        mutation: {
            onSuccess: () => {
                navigate('/services/custom-order/success', {
                    state: { service, package: packageData }
                })
            },
            onError: (error) => {
                console.error('Application creation failed:', error)
            }
        }
    })

    // Show back button - navigate to package details
    useTelegramBackButton({
        navigateTo: '/services/custom-order'
    })

    // If no package data, redirect back
    if (!packageData?.id) {
        navigate('/services/custom-order')
        return null
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Form validation is handled by button disabled state
        if (!isFormValid()) {
            return
        }

        const applicationData = {
            ...formData,
            service: service?.id,
            package: packageData.id
        }

        createApplicationMutation.mutate({
            data: applicationData
        })
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
            <UnderwaterHeader />
            <RadialEffect
                className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />

            <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                {/* Header */}
                <div className="text-left space-y-4 mb-8 pt-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.customOrderApplication.title')}
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 pb-8 space-y-6">
                    <div className="space-y-6">
                        {/* Work Purpose */}
                        <div className="space-y-2">
                            <Label className="text-white text-sm font-medium" required>
                                {t('app.customOrderApplication.form.workPurpose.label')}
                            </Label>
                            <CustomInput
                                value={formData.work_purpose}
                                onChange={(e) => handleInputChange('work_purpose', e.target.value)}
                                placeholder={t('app.customOrderApplication.form.workPurpose.placeholder')}
                                multiline
                                rows={4}
                            />
                        </div>

                        {/* Interested Factories */}
                        <div className="space-y-2">
                            <Label className="text-white text-sm font-medium" required>
                                {t('app.customOrderApplication.form.interestedFactories.label')}
                            </Label>
                            <CustomInput
                                value={formData.interested_factories}
                                onChange={(e) => handleInputChange('interested_factories', e.target.value)}
                                placeholder={t('app.customOrderApplication.form.interestedFactories.placeholder')}
                                multiline
                                rows={4}
                            />
                        </div>

                        {/* Quantity to See */}
                        <div className="space-y-2">
                            <Label className="text-white text-sm font-medium" required>
                                {t('app.customOrderApplication.form.quantityToSee.label')}
                            </Label>
                            <CustomInput
                                value={formData.quantity_to_see}
                                onChange={(e) => handleInputChange('quantity_to_see', e.target.value)}
                                placeholder={t('app.customOrderApplication.form.quantityToSee.placeholder')}
                            />
                        </div>

                        {/* Planned Stay Days */}
                        <div className="space-y-2">
                            <Label className="text-white text-sm font-medium" required>
                                {t('app.customOrderApplication.form.plannedStayDays.label')}
                            </Label>
                            <CustomInput
                                value={formData.planned_stay_days}
                                onChange={(e) => handleInputChange('planned_stay_days', e.target.value)}
                                placeholder={t('app.customOrderApplication.form.plannedStayDays.placeholder')}
                            />
                        </div>

                        {/* Planned Arrival Dates */}
                        <div className="space-y-2">
                            <Label className="text-white text-sm font-medium" required>
                                {t('app.customOrderApplication.form.plannedArrivalDates.label')}
                            </Label>
                            <CustomInput
                                value={formData.planned_arrival_dates}
                                onChange={(e) => handleInputChange('planned_arrival_dates', e.target.value)}
                                placeholder={t('app.customOrderApplication.form.plannedArrivalDates.placeholder')}
                            />
                        </div>

                        {/* Needs Tourist Program */}
                        <div className="space-y-2">
                            <Label className="text-white text-sm font-medium">
                                {t('app.customOrderApplication.form.needsTouristProgram.label')}
                            </Label>
                            <CustomInput
                                value={formData.needs_tourist_program}
                                onChange={(e) => handleInputChange('needs_tourist_program', e.target.value)}
                                placeholder={t('app.customOrderApplication.form.needsTouristProgram.placeholder')}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            variant="default"
                            size="default"
                            shadow={'sm'}
                            loading={createApplicationMutation.isPending}
                            disabled={createApplicationMutation.isPending || !isFormValid()}
                        >
                            {t('app.customOrderApplication.form.submitButton')}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default ApplicationForm

