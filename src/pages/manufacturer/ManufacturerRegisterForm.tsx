import { Button } from "@/components/ui"
import { CustomInput } from "@/components/ui"
import { Label } from "@/components/ui"
import { RadioGroup, RadioGroupItem } from "@/components/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"
import { FileUploader } from "@/components/ui"
import { UnderwaterHeader } from "@/components/ui"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useApiV1ApplicationManufacturCreateCreate } from "@/lib/api"
import type { ManufacturerCreate } from "@/lib/api"
import { showToast } from "@/lib/utils"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTelegramUser } from "@/hooks/useTelegramUser"

// Zod schema for form validation
const manufacturerRegisterSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    experience: z.string().min(1, "Experience is required"),
    fullName: z.string().min(1, "Full name is required"),
    position: z.string().min(1, "Position is required"),
    minOrder: z.string().min(1, "Min order quantity is required"),
    productSegment: z.string().min(1, "Product segment is required"),
    commercialOffer: z.string().min(1, "Commercial offer is required"),
    productionAddress: z.string().min(1, "Production address is required"),
    officeAddress: z.string().min(1, "Office address is required"),
    website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
    qualityControl: z.enum(["yes", "no"]).optional(),
    crmSystem: z.enum(["yes", "no"]).optional(),
    geminiGerber: z.enum(["yes", "no"]).optional(),
    employeesCount: z.string().min(1, "Employees count is required"),
    buildingOwnership: z.enum(["own", "rented"]).optional(),
    industrialZone: z.enum(["yes", "no"]).optional(),
    creditBurden: z.enum(["yes", "no"]).optional(),
    organizationStructure: z.enum(["director", "manager", "marketer"]).optional(),
    equipmentInfo: z.string().min(1, "Equipment info is required"),
    phone: z.string().regex(/^\+?[0-9\s\-()]+$/, "Please enter a valid phone number").optional().or(z.literal("")),
    files: z.array(z.instanceof(File)).optional()
})

type ManufacturerRegisterFormData = z.infer<typeof manufacturerRegisterSchema>

function ManufacturerRegisterForm() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { userInfo, updateUserInfo } = useTelegramUser()

    // Show back button that goes to manufacturer welcome page
    useTelegramBackButton({ navigateTo: '/manufacturer' })

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch
    } = useForm<ManufacturerRegisterFormData>({
        resolver: zodResolver(manufacturerRegisterSchema),
        mode: "onBlur",
        reValidateMode: "onBlur",
        criteriaMode: "firstError",
        delayError: 100
    })

    // Only watch specific fields that need to trigger re-renders
    const qualityControl = watch('qualityControl')
    const crmSystem = watch('crmSystem')
    const geminiGerber = watch('geminiGerber')
    const buildingOwnership = watch('buildingOwnership')
    const industrialZone = watch('industrialZone')
    const creditBurden = watch('creditBurden')
    const organizationStructure = watch('organizationStructure')

    // API mutation hook
    const manufacturerCreateMutation = useApiV1ApplicationManufacturCreateCreate({
        mutation: {
            onSuccess: (data) => {
                console.log('Manufacturer created successfully:', data)

                // Update user info with the new manufacturer data
                if (userInfo && data) {
                    const updatedUserInfo = {
                        ...userInfo,
                        manufacturer: data.id // Extract just the ID
                    };
                    updateUserInfo(updatedUserInfo);
                }

                showToast.success('Muvaffaqiyatli yaratildi!') // Success message
                navigate('/services')
            },
            onError: (error) => {
                console.error('Manufacturer creation failed:', error)
                showToast.error('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.') // Error message
            }
        }
    })

    const onSubmit = useCallback(async (data: ManufacturerRegisterFormData) => {
        try {
            // Transform form data to API format
            const apiData: ManufacturerCreate = {
                company_name: data.companyName,
                market_experience: data.experience,
                full_name: data.fullName || '',
                position: data.position || '',
                min_order_quantity: data.minOrder || '',
                product_segment: data.productSegment || '',
                commercial_offer_text: data.commercialOffer || '',
                production_address: data.productionAddress || '',
                office_address: data.officeAddress || '',
                website: data.website || null,
                has_quality_control: data.qualityControl === 'yes',
                has_crm: data.crmSystem === 'yes',
                has_erp: false, // Not in form, default to false
                has_gemini_gerber: data.geminiGerber === 'yes',
                employee_count: parseInt(data.employeesCount || '0') || 0,
                owns_building: data.buildingOwnership === 'own',
                has_power_issues: data.industrialZone === 'yes',
                has_credit_load: data.creditBurden === 'yes',
                organization_structure: data.organizationStructure || '',
                equipment_info: data.equipmentInfo || '',
                phone: data.phone || null,
                user: userInfo?.user_id || 0 // Use user_id from bot-user/register API response
            }

            // Call the API
            await manufacturerCreateMutation.mutateAsync({ data: apiData })
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }, [manufacturerCreateMutation, userInfo?.user_id])

    const handleSelectChange = useCallback((field: keyof ManufacturerRegisterFormData, value: string) => {
        setValue(field, value as ManufacturerRegisterFormData[keyof ManufacturerRegisterFormData], { shouldValidate: false })
    }, [setValue])

    const handleRadioChange = useCallback((field: keyof ManufacturerRegisterFormData, value: string) => {
        setValue(field, value as ManufacturerRegisterFormData[keyof ManufacturerRegisterFormData], { shouldValidate: false })
    }, [setValue])

    const handleFileChange = useCallback((files: File[]) => {
        setValue('files', files, { shouldValidate: false })
    }, [setValue])

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">

            <UnderwaterHeader />


            <main className="w-full container min-w-full flex-1 flex flex-col">
                {/* Header */}
                <div className="text-left space-y-4 mb-8">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.buyurtmachi.registerForm.header')}
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6 pb-8">
                    {/* Company Name */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.companyName.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.companyName.placeholder')}
                            error={errors.companyName?.message}
                            {...register('companyName')}
                        />
                    </div>

                    {/* Experience */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.experience.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.experience.placeholder')}
                            error={errors.experience?.message}
                            {...register('experience')}
                        />
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.fullName.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.fullName.placeholder')}
                            error={errors.fullName?.message}
                            {...register('fullName')}
                        />
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.position.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.position.placeholder')}
                            error={errors.position?.message}
                            {...register('position')}
                        />
                    </div>

                    {/* Min Order */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.minOrder.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.minOrder.placeholder')}
                            error={errors.minOrder?.message}
                            {...register('minOrder')}
                        />
                    </div>

                    {/* Product Segment */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.productSegment.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.productSegment.placeholder')}
                            error={errors.productSegment?.message}
                            {...register('productSegment')}
                        />
                    </div>

                    {/* Commercial Offer */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.commercialOffer.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.commercialOffer.placeholder')}
                            error={errors.commercialOffer?.message}
                            {...register('commercialOffer')}
                        />
                    </div>

                    {/* Production Address */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.productionAddress.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.productionAddress.placeholder')}
                            error={errors.productionAddress?.message}
                            {...register('productionAddress')}
                        />
                    </div>

                    {/* Office Address */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.officeAddress.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.officeAddress.placeholder')}
                            error={errors.officeAddress?.message}
                            {...register('officeAddress')}
                        />
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.website.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.website.placeholder')}
                            error={errors.website?.message}
                            {...register('website')}
                        />
                    </div>

                    {/* Quality Control */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.qualityControl.label')}
                        </Label>
                        <Select
                            value={qualityControl || ''}
                            onValueChange={(value) => handleSelectChange('qualityControl', value)}
                        >
                            <SelectTrigger error={errors.qualityControl?.message}>
                                <SelectValue placeholder="Tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">{t('app.buyurtmachi.registerForm.qualityControl.options.yes')}</SelectItem>
                                <SelectItem value="no">{t('app.buyurtmachi.registerForm.qualityControl.options.no')}</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* CRM System */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.crmSystem.label')}
                        </Label>
                        <Select
                            value={crmSystem || ''}
                            onValueChange={(value) => handleSelectChange('crmSystem', value)}
                        >
                            <SelectTrigger error={errors.crmSystem?.message}>
                                <SelectValue placeholder="Tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">{t('app.buyurtmachi.registerForm.crmSystem.options.yes')}</SelectItem>
                                <SelectItem value="no">{t('app.buyurtmachi.registerForm.crmSystem.options.no')}</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Gemini/Gerber */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.geminiGerber.label')}
                        </Label>
                        <Select
                            value={geminiGerber || ''}
                            onValueChange={(value) => handleSelectChange('geminiGerber', value)}
                        >
                            <SelectTrigger error={errors.geminiGerber?.message}>
                                <SelectValue placeholder="Tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">{t('app.buyurtmachi.registerForm.geminiGerber.options.yes')}</SelectItem>
                                <SelectItem value="no">{t('app.buyurtmachi.registerForm.geminiGerber.options.no')}</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Employees Count */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.employeesCount.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.employeesCount.placeholder')}
                            error={errors.employeesCount?.message}
                            {...register('employeesCount')}
                        />
                    </div>

                    {/* Building Ownership */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.buildingOwnership.label')}
                        </Label>
                        <Select
                            value={buildingOwnership || ''}
                            onValueChange={(value) => handleSelectChange('buildingOwnership', value)}
                        >
                            <SelectTrigger error={errors.buildingOwnership?.message}>
                                <SelectValue placeholder="Tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="own">{t('app.buyurtmachi.registerForm.buildingOwnership.options.own')}</SelectItem>
                                <SelectItem value="rented">{t('app.buyurtmachi.registerForm.buildingOwnership.options.rented')}</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Industrial Zone */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.industrialZone.label')}
                        </Label>
                        <Select
                            value={industrialZone || ''}
                            onValueChange={(value) => handleSelectChange('industrialZone', value)}
                        >
                            <SelectTrigger error={errors.industrialZone?.message}>
                                <SelectValue placeholder="Tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">{t('app.buyurtmachi.registerForm.industrialZone.options.yes')}</SelectItem>
                                <SelectItem value="no">{t('app.buyurtmachi.registerForm.industrialZone.options.no')}</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Credit Burden */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.creditBurden.label')}
                        </Label>
                        <Select
                            value={creditBurden || ''}
                            onValueChange={(value) => handleSelectChange('creditBurden', value)}
                        >
                            <SelectTrigger error={errors.creditBurden?.message}>
                                <SelectValue placeholder="Tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">{t('app.buyurtmachi.registerForm.creditBurden.options.yes')}</SelectItem>
                                <SelectItem value="no">{t('app.buyurtmachi.registerForm.creditBurden.options.no')}</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Organization Structure */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.organizationStructure.label')}
                        </Label>
                        <RadioGroup
                            value={organizationStructure || ''}
                            onValueChange={(value) => handleRadioChange('organizationStructure', value)}
                        >
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="director" id="director" />
                                <Label htmlFor="director" className="text-white text-sm font-medium">
                                    {t('app.buyurtmachi.registerForm.organizationStructure.options.director')}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="manager" id="manager" />
                                <Label htmlFor="manager" className="text-white text-sm font-medium">
                                    {t('app.buyurtmachi.registerForm.organizationStructure.options.manager')}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="marketer" id="marketer" />
                                <Label htmlFor="marketer" className="text-white text-sm font-medium">
                                    {t('app.buyurtmachi.registerForm.organizationStructure.options.marketer')}
                                </Label>
                            </div>
                        </RadioGroup>

                    </div>

                    {/* Equipment Info */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.equipmentInfo.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.equipmentInfo.placeholder')}
                            error={errors.equipmentInfo?.message}
                            {...register('equipmentInfo')}
                        />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <FileUploader
                            label={t('app.buyurtmachi.registerForm.fileUpload.label')}
                            onFileChange={handleFileChange}
                        />

                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.phone.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.phone.placeholder')}
                            error={errors.phone?.message}
                            {...register('phone')}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="px-4 pb-8 mt-4">
                        <Button
                            type="submit"
                            loading={manufacturerCreateMutation.isPending}
                            variant="default"
                            shadow="lg"
                            disabled={manufacturerCreateMutation.isPending || !isValid}
                            className="w-full"
                        >
                            {t('app.buyurtmachi.registerForm.submitButton')}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default ManufacturerRegisterForm
