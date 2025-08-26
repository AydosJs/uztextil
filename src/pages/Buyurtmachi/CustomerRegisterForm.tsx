import { Button } from "@/components/ui"
import { CustomInput } from "@/components/ui"
import { Label } from "@/components/ui"
import { RadioGroup, RadioGroupItem } from "@/components/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"

function CustomerRegisterForm() {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        companyName: '',
        experience: '',
        fullName: '',
        position: '',
        minOrder: '',
        productSegment: '',
        commercialOffer: '',
        productionAddress: '',
        officeAddress: '',
        website: '',
        qualityControl: '',
        crmSystem: '',
        geminiGerber: '',
        employeesCount: '',
        buildingOwnership: '',
        industrialZone: '',
        creditBurden: '',
        organizationStructure: '',
        equipmentInfo: '',
        phone: ''
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = () => {
        setIsLoading(true)
        // Simulate form submission
        setTimeout(() => {
            setIsLoading(false)
            // Handle form submission logic here
            console.log('Form data:', formData)
        }, 1000)
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col">
                {/* Header */}
                <div className="text-left space-y-4 mb-8">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.buyurtmachi.registerForm.header')}
                    </h1>
                </div>

                {/* Form */}
                <div className="flex-1 space-y-6 pb-8">
                    {/* Company Name */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.companyName.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.companyName.placeholder')}
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                        />
                    </div>

                    {/* Experience */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.experience.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.experience.placeholder')}
                            value={formData.experience}
                            onChange={(e) => handleInputChange('experience', e.target.value)}
                        />
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.fullName.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.fullName.placeholder')}
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.position.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.position.placeholder')}
                            value={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                    </div>

                    {/* Min Order */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.minOrder.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.minOrder.placeholder')}
                            value={formData.minOrder}
                            onChange={(e) => handleInputChange('minOrder', e.target.value)}
                        />
                    </div>

                    {/* Product Segment */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.productSegment.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.productSegment.placeholder')}
                            value={formData.productSegment}
                            onChange={(e) => handleInputChange('productSegment', e.target.value)}
                        />
                    </div>

                    {/* Commercial Offer */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.commercialOffer.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.commercialOffer.placeholder')}
                            value={formData.commercialOffer}
                            onChange={(e) => handleInputChange('commercialOffer', e.target.value)}
                        />
                    </div>

                    {/* Production Address */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.productionAddress.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.productionAddress.placeholder')}
                            value={formData.productionAddress}
                            onChange={(e) => handleInputChange('productionAddress', e.target.value)}
                        />
                    </div>

                    {/* Office Address */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.officeAddress.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.officeAddress.placeholder')}
                            value={formData.officeAddress}
                            onChange={(e) => handleInputChange('officeAddress', e.target.value)}
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

                    {/* Quality Control */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.qualityControl.label')}
                        </Label>
                        <Select value={formData.qualityControl} onValueChange={(value) => handleInputChange('qualityControl', value)}>
                            <SelectTrigger>
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
                        <Select value={formData.crmSystem} onValueChange={(value) => handleInputChange('crmSystem', value)}>
                            <SelectTrigger>
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
                        <Select value={formData.geminiGerber} onValueChange={(value) => handleInputChange('geminiGerber', value)}>
                            <SelectTrigger>
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
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.employeesCount.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.employeesCount.placeholder')}
                            value={formData.employeesCount}
                            onChange={(e) => handleInputChange('employeesCount', e.target.value)}
                        />
                    </div>

                    {/* Building Ownership */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.buildingOwnership.label')}
                        </Label>
                        <Select value={formData.buildingOwnership} onValueChange={(value) => handleInputChange('buildingOwnership', value)}>
                            <SelectTrigger>
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
                        <Select value={formData.industrialZone} onValueChange={(value) => handleInputChange('industrialZone', value)}>
                            <SelectTrigger>
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
                        <Select value={formData.creditBurden} onValueChange={(value) => handleInputChange('creditBurden', value)}>
                            <SelectTrigger>
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
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.organizationStructure.label')}
                        </Label>
                        <RadioGroup value={formData.organizationStructure} onValueChange={(value) => handleInputChange('organizationStructure', value)}>
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
                        <Label className="text-white text-sm font-medium">
                            {t('app.buyurtmachi.registerForm.equipmentInfo.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.buyurtmachi.registerForm.equipmentInfo.placeholder')}
                            value={formData.equipmentInfo}
                            onChange={(e) => handleInputChange('equipmentInfo', e.target.value)}
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
                </div>

                {/* Submit Button */}
                <div className="px-4 pb-8 mt-4">
                    <Button
                        loading={isLoading}
                        variant="default"
                        shadow="lg"
                        onClick={handleSubmit}
                        disabled={isLoading}
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
