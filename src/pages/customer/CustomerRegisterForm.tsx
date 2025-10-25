import { Button, UnderwaterHeader } from "@/components/ui"
import { CustomInput } from "@/components/ui"
import { Label } from "@/components/ui"
import { MultiSelectCombobox } from "@/components/ui"
import type { MultiSelectOption } from "@/components/ui"
import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router-dom"
import { useTelegramBackButton } from "@/lib/hooks"
import { useApiV1CustomerCreateCreate, useApiV1SegmentListList } from "@/lib/api"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import type { CustomerCreate } from "@/lib/api/model"
import { showToast } from "@/lib/utils"

function CustomerRegisterForm() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { userInfo, updateUserInfo } = useTelegramUser()

    // Get department from navigation state
    const department = (location.state as { department?: 'customer' | 'manufacturer' })?.department || 'customer'

    const customerCreateMutation = useApiV1CustomerCreateCreate({
        mutation: {
            onSuccess: (data) => {
                // Update user info with the new customer data
                if (userInfo && data) {
                    const updatedUserInfo = {
                        ...userInfo,
                        customer: data.id // Extract just the ID
                    };
                    updateUserInfo(updatedUserInfo);
                }

                showToast.success(t('app.common.success.created'))
                navigate('/services', { state: { department } })
            },
            onError: () => {
                showToast.error(t('app.common.error.customerFailed'))
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
        annual_order_volume: '', // Hidden field - required by API
        segment: [] as number[],
        cooperation_terms: '', // Hidden field - required by API
        payment_terms: '',
        phone: '',
        total_orders: 0
    })

    // Fetch segments list
    const { data: segmentsData, isLoading: segmentsLoading } = useApiV1SegmentListList()

    // Transform segments data for MultiSelectCombobox
    const segmentOptions: MultiSelectOption[] = useMemo(() => {
        if (!segmentsData) return []
        return segmentsData.map(segment => ({
            id: segment.id || 0,
            label: segment.title,
            value: segment.id?.toString() || '0'
        }))
    }, [segmentsData])

    // Show back button that goes to customer welcome page
    useTelegramBackButton({ navigateTo: '/customer' })

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSegmentChange = (selectedIds: (number | string)[]) => {
        setFormData(prev => ({
            ...prev,
            segment: selectedIds.map(id => typeof id === 'string' ? parseInt(id) : id)
        }))
    }

    // Check if all required fields are filled
    const isFormValid = useMemo(() => {
        const requiredFields = [
            'full_name',
            'position',
            'company_name',
            'legal_address',
            'marketplace_brand',
            'payment_terms'
        ]

        // Check if all required string fields are filled
        const allStringFieldsFilled = requiredFields.every(field => {
            const value = formData[field as keyof typeof formData]
            return typeof value === 'string' && value.trim().length > 0
        })

        // Check if segment array has at least one item
        const segmentSelected = formData.segment.length > 0

        return allStringFieldsFilled && segmentSelected
    }, [formData])

    const handleSubmit = async () => {
        if (!userInfo?.user_id) {
            showToast.error(t('app.common.validation.userDataNotFound'))
            return
        }

        try {
            const customerData: CustomerCreate = {
                ...formData,
                user: userInfo.user_id,
                total_orders: formData.total_orders || 0
            }

            await customerCreateMutation.mutateAsync({ data: customerData })
        } catch {
            // Error handling is done in the mutation onError callback
        }
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col bg-background-primary">
            <main className="w-full max-w-4xl mx-auto container min-w-full flex-1 flex flex-col">
                <UnderwaterHeader />
                {/* Header */}
                <div className="text-left space-y-4 mb-8 max-w-2xl mx-auto w-full">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.buyurtmachi.registerForm.header')}
                    </h1>
                </div>

                {/* Form */}
                <div className="flex-1 space-y-6 pb-8 max-w-2xl mx-auto w-full">
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
                            {t('app.buyurtmachi.registerForm.legalAddress.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.legalAddress.placeholder')}
                            value={formData.legal_address}
                            onChange={(e) => handleInputChange('legal_address', e.target.value)}
                        />
                    </div>

                    {/* Marketplace Brand */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.marketplaceBrand.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.marketplaceBrand.placeholder')}
                            value={formData.marketplace_brand}
                            onChange={(e) => handleInputChange('marketplace_brand', e.target.value)}
                        />
                    </div>


                    {/* Segments */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.segments.label')}
                        </Label>
                        <MultiSelectCombobox
                            options={segmentOptions}
                            value={formData.segment}
                            onChange={handleSegmentChange}
                            placeholder={t('app.buyurtmachi.registerForm.segments.placeholder')}
                            emptyText={t('app.common.noSegmentsAvailable')}
                            loadingText={t('app.common.loading')}
                            isLoading={segmentsLoading}
                        />
                    </div>


                    {/* Payment Terms */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.paymentTerms.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.paymentTerms.placeholder')}
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
                            type="tel"
                            placeholder={t('app.buyurtmachi.registerForm.phone.placeholder')}
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                    </div>

                    {/* Total Orders */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.totalOrders.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.totalOrders.placeholder')}
                            type="number"
                            value={formData.total_orders.toString()}
                            onChange={(e) => handleInputChange('total_orders', parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="px-4 pb-8 mt-4 max-w-2xl mx-auto w-full">
                    <Button
                        loading={customerCreateMutation.isPending}
                        variant="default"
                        shadow="lg"
                        onClick={handleSubmit}
                        disabled={customerCreateMutation.isPending || !isFormValid}
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
