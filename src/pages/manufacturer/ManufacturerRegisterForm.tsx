import { Button } from "@/components/ui"
import { CustomInput } from "@/components/ui"
import { Label } from "@/components/ui"
import { RadioGroup, RadioGroupItem } from "@/components/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"
import { CertificateUploader } from "@/components/ui"
import { SingleFileUploader, CompanyImageUploader } from "@/components/ui"
import { UnderwaterHeader } from "@/components/ui"
import { MultiSelectCombobox } from "@/components/ui"
import type { MultiSelectOption } from "@/components/ui"
import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { customInstance } from "@/lib/api-client"
import { showToast } from "@/lib/utils"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTelegramUser } from "@/hooks/useTelegramUser"

// Zod schema for form validation
const manufacturerRegisterSchema = z.object({
    companyName: z.string().min(1, ""),
    logo: z.any().optional(), // Logo file - optional for now
    companyImageIds: z.array(z.number()).optional(), // Company image IDs - optional array of numbers
    experience: z.string().min(1, ""),
    fullName: z.string().min(1, ""),
    addition_fio: z.string().min(1, ""),
    position: z.string().min(1, ""),
    minOrder: z.string().min(1, ""),
    productSegment: z.array(z.number()).min(1, ""),
    commercialOfferText: z.string().min(1, ""),
    commercialOffer: z.any().optional(), // Commercial offer PDF file - optional
    productionAddress: z.string().min(1, ""),
    officeAddress: z.string().min(1, ""),
    website: z.string().min(1, ""),
    qualityControl: z.enum(["yes", "no"]),
    crmSystem: z.enum(["yes", "no"]),
    geminiGerber: z.enum(["yes", "no"]),
    employeesCount: z.string().min(1, ""),
    buildingOwnership: z.enum(["own", "rented"]),
    industrialZone: z.enum(["yes", "no"]),
    creditBurden: z.enum(["yes", "no"]),
    organizationStructure: z.enum(["director", "manager", "marketer"]),
    equipmentInfo: z.string().min(1, ""),
    phone: z.string().regex(/^\+?[0-9\s\-()]+$/, "").min(1, ""),
    certificateIds: z.array(z.number()).min(1, ""),
    // New required fields
    inn: z.string().min(1, ""),
    companyRating: z.string().min(1, ""),
    annualExportTurnover: z.string().min(1, ""),
    exportCountries: z.string().min(1, ""),
    workedBrands: z.string().min(1, ""),
    category: z.array(z.number()).optional()
})

type ManufacturerRegisterFormData = z.infer<typeof manufacturerRegisterSchema>

function ManufacturerRegisterForm() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { userInfo, updateUserInfo } = useTelegramUser()

    // Log current path to console
    console.log('📍 Current Path:', location.pathname)

    // Get department from navigation state
    const department = (location.state as { department?: 'customer' | 'manufacturer' })?.department || 'manufacturer'

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
        mode: "onSubmit",
        reValidateMode: "onChange",
        criteriaMode: "firstError",
        delayError: 100,
        defaultValues: {
            companyImageIds: []
        }
    })

    // Only watch specific fields that need to trigger re-renders
    const qualityControl = watch('qualityControl')
    const crmSystem = watch('crmSystem')
    const geminiGerber = watch('geminiGerber')
    const buildingOwnership = watch('buildingOwnership')
    const industrialZone = watch('industrialZone')
    const creditBurden = watch('creditBurden')
    const organizationStructure = watch('organizationStructure')
    const productSegment = watch('productSegment')
    const category = watch('category')
    // const companyImages = watch('companyImages') // Uncomment if needed for debugging


    // State for categories
    const [categoriesData, setCategoriesData] = React.useState<{ results: Array<{ id?: number; title: string }> } | null>(null)
    const [categoriesLoading, setCategoriesLoading] = React.useState(false)

    // State for filtered segments
    const [filteredSegments, setFilteredSegments] = React.useState<MultiSelectOption[]>([])
    const [segmentsLoading, setSegmentsLoading] = React.useState(false)

    // Fetch categories on component mount
    React.useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true)
            try {
                const data = await customInstance({
                    url: '/api/v1/category/list/',
                    method: 'GET',
                }) as { results: Array<{ id?: number; title: string }> }
                setCategoriesData(data)
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setCategoriesLoading(false)
            }
        }
        fetchCategories()
    }, [])

    // Function to fetch segments filtered by category
    const fetchSegmentsByCategory = useCallback(async (categoryIds: number[]) => {
        if (categoryIds.length === 0) {
            setFilteredSegments([])
            return
        }

        setSegmentsLoading(true)
        try {
            // Try to fetch segments with category filter
            // If the API doesn't support category filtering yet, this will fall back to showing all segments
            const response = await customInstance({
                url: '/api/v1/segment/list/',
                method: 'GET',
                params: {
                    // Add category filter if supported by backend
                    category: categoryIds.join(','),
                    // Fallback parameters
                    limit: 1000 // Get all segments if no category filter
                }
            }) as { results: Array<{ id?: number; title: string }> }

            if (response?.results) {
                const segments = response.results.map(segment => ({
                    id: segment.id || 0,
                    label: segment.title,
                    value: segment.id?.toString() || '0'
                }))
                setFilteredSegments(segments)
            } else {
                setFilteredSegments([])
            }
        } catch (error) {
            console.error('Error fetching segments by category:', error)
            setFilteredSegments([])
        } finally {
            setSegmentsLoading(false)
        }
    }, [])

    // Transform segments data for MultiSelectCombobox
    const segmentOptions: MultiSelectOption[] = useMemo(() => {
        return filteredSegments
    }, [filteredSegments])

    // Transform categories data for MultiSelectCombobox
    const categoryOptions: MultiSelectOption[] = useMemo(() => {
        if (!categoriesData || !categoriesData.results) return []
        return categoriesData.results.map((category) => ({
            id: category.id || 0,
            label: category.title,
            value: category.id?.toString() || '0'
        }))
    }, [categoriesData])

    // State for API call
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const onSubmit = useCallback(async (data: ManufacturerRegisterFormData) => {
        if (isSubmitting) return

        setIsSubmitting(true)
        try {
            // Create FormData for file upload
            const formData = new FormData()

            // Add all form fields
            formData.append('company_name', data.companyName)
            formData.append('market_experience', data.experience)
            formData.append('full_name', data.fullName || '')
            formData.append('addition_fio', data.addition_fio || '')
            formData.append('position', data.position || '')
            formData.append('min_order_quantity', data.minOrder || '')
            formData.append('commercial_offer_text', data.commercialOfferText || '')
            formData.append('production_address', data.productionAddress || '')
            formData.append('office_address', data.officeAddress || '')
            formData.append('website', data.website || '')
            formData.append('has_quality_control', data.qualityControl === 'yes' ? 'true' : 'false')
            formData.append('has_crm', data.crmSystem === 'yes' ? 'true' : 'false')
            formData.append('has_erp', 'false')
            formData.append('has_gemini_gerber', data.geminiGerber === 'yes' ? 'true' : 'false')
            formData.append('employee_count', (parseInt(data.employeesCount || '0') || 0).toString())
            formData.append('owns_building', data.buildingOwnership === 'own' ? 'true' : 'false')
            formData.append('has_power_issues', data.industrialZone === 'yes' ? 'true' : 'false')
            formData.append('is_located_zone', data.industrialZone === 'yes' ? 'true' : 'false')
            formData.append('has_credit_load', data.creditBurden === 'yes' ? 'true' : 'false')
            formData.append('organization_structure', data.organizationStructure || '')
            formData.append('equipment_info', data.equipmentInfo || '')
            formData.append('phone', data.phone || '')
            formData.append('user', (userInfo?.user_id || 0).toString())

            // Add new required fields
            formData.append('inn', data.inn || '')
            formData.append('company_rating', data.companyRating || '')
            formData.append('annual_export_turnover', data.annualExportTurnover || '')
            formData.append('export_countries', data.exportCountries || '')
            formData.append('worked_brands', data.workedBrands || '')

            // Add product segments as array
            if (data.productSegment && data.productSegment.length > 0) {
                data.productSegment.forEach(segmentId => {
                    formData.append('product_segment', segmentId.toString())
                })
            }

            // Add certificate IDs as array
            if (data.certificateIds && data.certificateIds.length > 0) {
                data.certificateIds.forEach(certId => {
                    formData.append('sertificates', certId.toString())
                })
            }

            // Add company image IDs as array
            if (data.companyImageIds && data.companyImageIds.length > 0) {
                data.companyImageIds.forEach(imageId => {
                    formData.append('images', imageId.toString())
                })
            }

            // Add category IDs as array
            if (data.category && data.category.length > 0) {
                data.category.forEach(categoryId => {
                    formData.append('category', categoryId.toString())
                })
            }

            // Add logo file if present
            if (data.logo && data.logo instanceof File) {
                formData.append('logo', data.logo)
                console.log('Logo file added to FormData:', data.logo.name, data.logo.size, data.logo.type)
            } else {
                console.log('No logo file or invalid file:', data.logo)
            }

            // Add commercial offer PDF file if present
            if (data.commercialOffer && data.commercialOffer instanceof File) {
                formData.append('commercial_offer', data.commercialOffer)
                console.log('Commercial offer PDF added to FormData:', data.commercialOffer.name, data.commercialOffer.size, data.commercialOffer.type)
            } else {
                console.log('No commercial offer PDF file or invalid file:', data.commercialOffer)
            }

            // Call the API with FormData using customInstance
            const response = await customInstance({
                url: '/api/v1/manufacturer/create/',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            // Update user info with the new manufacturer data
            if (userInfo && response && typeof response === 'object' && response !== null && 'id' in response) {
                const updatedUserInfo = {
                    ...userInfo,
                    manufacturer: (response as { id: number }).id // Extract just the ID
                };
                updateUserInfo(updatedUserInfo);
            }

            showToast.success(t('app.common.success.created'))
            navigate('/services', { state: { department } })
        } catch (error) {
            console.error('Form submission error:', error)
            showToast.error(t('app.common.error.manufacturerFailed') + error)
        } finally {
            setIsSubmitting(false)
        }
    }, [isSubmitting, userInfo, updateUserInfo, t, navigate, department])

    const handleSelectChange = useCallback((field: keyof ManufacturerRegisterFormData, value: string | number) => {
        setValue(field, value as ManufacturerRegisterFormData[keyof ManufacturerRegisterFormData], { shouldValidate: false })
    }, [setValue])

    const handleSegmentChange = useCallback((selectedIds: (number | string)[]) => {
        const numberIds = selectedIds.map(id => typeof id === 'string' ? parseInt(id) : id)
        setValue('productSegment', numberIds, { shouldValidate: false })
    }, [setValue])

    const handleCategoryChange = useCallback((selectedIds: (number | string)[]) => {
        const numberIds = selectedIds.map(id => typeof id === 'string' ? parseInt(id) : id)
        setValue('category', numberIds, { shouldValidate: false })

        // Clear segments when category changes
        setValue('productSegment', [], { shouldValidate: false })

        // Fetch segments filtered by selected categories
        fetchSegmentsByCategory(numberIds)
    }, [setValue, fetchSegmentsByCategory])

    const handleRadioChange = useCallback((field: keyof ManufacturerRegisterFormData, value: string) => {
        setValue(field, value as ManufacturerRegisterFormData[keyof ManufacturerRegisterFormData], { shouldValidate: false })
    }, [setValue])

    const handleCertificateIdsChange = useCallback((certificateIds: number[]) => {
        setValue('certificateIds', certificateIds, { shouldValidate: false })
    }, [setValue])

    return (
        <div className="min-h-screen bg-background-primary min-w-full safe-area-pt w-full dark flex flex-col">

            <UnderwaterHeader />


            <main className="w-full max-w-4xl mx-auto container min-w-full flex-1 flex flex-col">
                {/* Header */}
                <div className="text-left space-y-4 mb-8 max-w-2xl mx-auto w-full">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.buyurtmachi.registerForm.header')}
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6 pb-8 max-w-2xl mx-auto w-full">
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

                    {/* INN */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.inn.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.inn.placeholder')}
                            error={errors.inn?.message}
                            {...register('inn')}
                        />
                    </div>
                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.logo.label')}
                        </Label>
                        <SingleFileUploader
                            label=""
                            onFileChange={(file) => {
                                setValue('logo', file, { shouldValidate: false, shouldDirty: false })
                            }}
                            accept="image/*"
                        />
                    </div>

                    {/* Company Images Upload */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.companyImages.label')}
                        </Label>
                        <CompanyImageUploader
                            label=""
                            onImageIdsChange={(imageIds) => {
                                setValue('companyImageIds', imageIds, { shouldValidate: false, shouldDirty: false })
                            }}
                        />
                        {errors.companyImageIds && (
                            <p className="text-red-500 text-sm mt-1">
                                {String(errors.companyImageIds.message)}
                            </p>
                        )}
                    </div>

                    {/* Company Rating */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.companyRating.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.companyRating.placeholder')}
                            error={errors.companyRating?.message}
                            {...register('companyRating')}
                        />
                    </div>

                    {/* Annual Export Turnover */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.annualExportTurnover.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.annualExportTurnover.placeholder')}
                            error={errors.annualExportTurnover?.message}
                            {...register('annualExportTurnover')}
                        />
                    </div>

                    {/* Export Countries */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.exportCountries.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.exportCountries.placeholder')}
                            error={errors.exportCountries?.message}
                            {...register('exportCountries')}
                        />
                    </div>

                    {/* Worked Brands */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.workedBrands.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.workedBrands.placeholder')}
                            error={errors.workedBrands?.message}
                            {...register('workedBrands')}
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

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.phone.label')}
                        </Label>
                        <CustomInput
                            type="tel"
                            placeholder={t('app.buyurtmachi.registerForm.phone.placeholder')}
                            error={errors.phone?.message}
                            {...register('phone')}
                        />
                    </div>

                    {/* Addition FIO */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.addition_fio.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.addition_fio.placeholder')}
                            error={errors.addition_fio?.message}
                            {...register('addition_fio')}
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



                    {/* -------------------- */}



                    {/* Experience */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.experience.label')}
                        </Label>
                        <CustomInput
                            type="number"
                            placeholder={t('app.buyurtmachi.registerForm.experience.placeholder')}
                            error={errors.experience?.message}
                            {...register('experience')}
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

                    {/* Category */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.category.label')}
                        </Label>
                        <MultiSelectCombobox
                            options={categoryOptions}
                            value={category || []}
                            onChange={handleCategoryChange}
                            placeholder={t('app.buyurtmachi.registerForm.category.placeholder')}
                            emptyText={t('app.common.noCategoriesAvailable')}
                            loadingText={t('app.common.loading')}
                            isLoading={categoriesLoading}
                            error={errors.category?.message}
                        />
                    </div>

                    {/* Product Segment */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.segments.label')}
                        </Label>
                        {(!category || category.length === 0) && (
                            <p className="text-yellow-300 text-xs">
                                {t('app.buyurtmachi.registerForm.segments.selectCategoryFirst')}
                            </p>
                        )}
                        <MultiSelectCombobox
                            options={segmentOptions}
                            value={productSegment || []}
                            onChange={handleSegmentChange}
                            placeholder={
                                !category || category.length === 0
                                    ? t('app.buyurtmachi.registerForm.segments.selectCategoryFirst')
                                    : t('app.buyurtmachi.registerForm.segments.placeholder')
                            }
                            emptyText={t('app.common.noSegmentsAvailable')}
                            loadingText={t('app.common.loading')}
                            isLoading={segmentsLoading}
                            disabled={!category || category.length === 0}
                            error={errors.productSegment?.message}
                        />
                    </div>


                    {/* Commercial Offer Text */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.commercialOfferText.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.commercialOfferText.placeholder')}
                            error={errors.commercialOfferText?.message}
                            {...register('commercialOfferText')}
                        />
                    </div>

                    {/* Commercial Offer PDF */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.commercialOffer.label')}
                        </Label>
                        <SingleFileUploader
                            label=""
                            onFileChange={(file) => {
                                setValue('commercialOffer', file, { shouldValidate: false, shouldDirty: false })
                            }}
                            accept="application/pdf"
                        />
                        {errors.commercialOffer && (
                            <p className="text-red-500 text-sm mt-1">
                                {String(errors.commercialOffer.message)}
                            </p>
                        )}
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
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.website.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.website.placeholder')}
                            {...register('website')}
                        />
                    </div>

                    {/* Quality Control */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.qualityControl.label')}
                        </Label>
                        <Select
                            value={qualityControl || undefined}
                            onValueChange={(value) => handleSelectChange('qualityControl', value)}
                        >
                            <SelectTrigger error={errors.qualityControl?.message}>
                                <SelectValue placeholder={t('app.buyurtmachi.select.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">{t('app.buyurtmachi.registerForm.qualityControl.options.yes')}</SelectItem>
                                <SelectItem value="no">{t('app.buyurtmachi.registerForm.qualityControl.options.no')}</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* CRM System */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.crmSystem.label')}
                        </Label>
                        <Select
                            value={crmSystem || undefined}
                            onValueChange={(value) => handleSelectChange('crmSystem', value)}
                        >
                            <SelectTrigger error={errors.crmSystem?.message}>
                                <SelectValue placeholder={t('app.buyurtmachi.select.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">{t('app.buyurtmachi.registerForm.crmSystem.options.yes')}</SelectItem>
                                <SelectItem value="no">{t('app.buyurtmachi.registerForm.crmSystem.options.no')}</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Gemini/Gerber */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.geminiGerber.label')}
                        </Label>
                        <Select
                            value={geminiGerber || undefined}
                            onValueChange={(value) => handleSelectChange('geminiGerber', value)}
                        >
                            <SelectTrigger error={errors.geminiGerber?.message}>
                                <SelectValue placeholder={t('app.buyurtmachi.select.placeholder')} />
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
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.buildingOwnership.label')}
                        </Label>
                        <Select
                            value={buildingOwnership || undefined}
                            onValueChange={(value) => handleSelectChange('buildingOwnership', value)}
                        >
                            <SelectTrigger error={errors.buildingOwnership?.message}>
                                <SelectValue placeholder={t('app.buyurtmachi.select.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="own">{t('app.buyurtmachi.registerForm.buildingOwnership.options.own')}</SelectItem>
                                <SelectItem value="rented">{t('app.buyurtmachi.registerForm.buildingOwnership.options.rented')}</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Industrial Zone */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.industrialZone.label')}
                        </Label>
                        <Select
                            value={industrialZone || undefined}
                            onValueChange={(value) => handleSelectChange('industrialZone', value)}
                        >
                            <SelectTrigger error={errors.industrialZone?.message}>
                                <SelectValue placeholder={t('app.buyurtmachi.select.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">{t('app.buyurtmachi.registerForm.industrialZone.options.yes')}</SelectItem>
                                <SelectItem value="no">{t('app.buyurtmachi.registerForm.industrialZone.options.no')}</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Credit Burden */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.buyurtmachi.registerForm.creditBurden.label')}
                        </Label>
                        <Select
                            value={creditBurden || undefined}
                            onValueChange={(value) => handleSelectChange('creditBurden', value)}
                        >
                            <SelectTrigger error={errors.creditBurden?.message}>
                                <SelectValue placeholder={t('app.buyurtmachi.select.placeholder')} />
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

                    {/* Certificate Upload */}
                    <div className="space-y-2">
                        <CertificateUploader
                            label={t('app.buyurtmachi.registerForm.certificates.title')}
                            onCertificateIdsChange={handleCertificateIdsChange}
                        />
                    </div>




                    {/* Submit Button */}
                    <div className="px-4 pb-8 mt-4 max-w-2xl mx-auto w-full">
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            variant="default"
                            shadow="lg"
                            disabled={isSubmitting || !isValid}
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
