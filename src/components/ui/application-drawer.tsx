import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { showToast } from "@/lib/utils"

interface ApplicationDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: ApplicationFormData) => void
}

interface ApplicationFormData {
    fullName: string
    position: string
    companyName: string
}

export function ApplicationDrawer({ open, onOpenChange, onSubmit }: ApplicationDrawerProps) {
    const { t } = useTranslation()
    const [formData, setFormData] = useState<ApplicationFormData>({
        fullName: '',
        position: '',
        companyName: ''
    })

    const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const isFormValid = () => {
        return formData.fullName.trim() !== '' &&
            formData.position.trim() !== '' &&
            formData.companyName.trim() !== ''
    }

    const handleSubmit = () => {
        if (!isFormValid()) {
            showToast.warning(t('app.applicationDrawer.validation.fillAllFields'))
            return
        }

        onSubmit(formData)
        setFormData({
            fullName: '',
            position: '',
            companyName: ''
        })
        onOpenChange(false)
    }

    const handleClose = () => {
        setFormData({
            fullName: '',
            position: '',
            companyName: ''
        })
        onOpenChange(false)
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
            <DrawerContent className="h-auto max-h-[96vh] flex flex-col">
                <DrawerHeader className="border-none">
                    <div className="flex items-center justify-between">
                        <DrawerTitle className="text-white text-2xl">
                            {t('app.applicationDrawer.title')}
                        </DrawerTitle>
                        <Button
                            onClick={handleClose}
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10"
                        >
                            <X className="size-6" />
                        </Button>
                    </div>
                </DrawerHeader>

                <div className="px-4 space-y-6 overflow-y-auto flex-1">
                    {/* F.I.SH */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.applicationDrawer.form.fullName.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.applicationDrawer.form.fullName.placeholder')}
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                    </div>

                    {/* Lavozimi */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.applicationDrawer.form.position.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.applicationDrawer.form.position.placeholder')}
                            value={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                    </div>

                    {/* Kompaniya nomi */}
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium" required>
                            {t('app.applicationDrawer.form.companyName.label')}
                        </Label>
                        <CustomInput
                            placeholder={t('app.applicationDrawer.form.companyName.placeholder')}
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2 safe-area-pb">
                        <Button
                            onClick={handleSubmit}
                            disabled={!isFormValid()}
                            className="flex-1 bg-[#FCE803] text-black hover:bg-[#FCE803]/90 font-semibold"
                        >
                            {t('app.applicationDrawer.form.submitButton')}
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
