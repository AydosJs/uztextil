import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, Button, Spinner } from "@/components/ui"
import type { ManufacturerList, ManufacturerDetail } from "@/lib/api/model"
import { useTranslation } from "react-i18next"

interface ManufacturerDetailDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    manufacturer: ManufacturerList | null
    manufacturerDetail?: ManufacturerDetail | null
    isLoading?: boolean
    error?: any
}

export function ManufacturerDetailDrawer({
    open,
    onOpenChange,
    manufacturer,
    manufacturerDetail,
    isLoading = false,
    error
}: ManufacturerDetailDrawerProps) {
    const { t } = useTranslation()

    const handleClose = () => {
        onOpenChange(false)
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[96vh]">
                <DrawerHeader className="border-b border-border-primary pb-2">
                    <DrawerTitle className="text-white text-left text-xl font-bold">
                        {manufacturer?.company_name}
                    </DrawerTitle>
                    <DrawerDescription className="text-white/64 text-left">
                        {manufacturer?.full_name} - {manufacturer?.product_segment}
                    </DrawerDescription>
                    <DrawerClose onClick={handleClose} className="text-white/64 hover:text-white" />
                </DrawerHeader>

                <div className="px-4 pb-6 pt-6 space-y-6 overflow-y-auto max-h-[96vh]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Spinner className="w-8 h-8 text-white" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-status-error text-lg mb-4">{t('app.manufacturerDetail.error.message')}</p>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="secondary"
                                className="px-4 py-2"
                            >
                                {t('app.manufacturerDetail.error.retryButton')}
                            </Button>
                        </div>
                    ) : manufacturerDetail ? (
                        <div className="space-y-6">
                            {/* Company Information */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg">{t('app.manufacturerDetail.companyInfo.title')}</h3>

                                <div className="space-y-3 overflow-y-auto">

                                    <div
                                        className={`fixed pointer-events-none`}
                                        style={{
                                            width: '512px',
                                            height: '512px',
                                            top: '73px',
                                            left: '-248px', // Half of 294px (147px) so only half is visible
                                            transform: 'translateY(-50%)', // Center vertically
                                            opacity: 0.08,
                                            background: 'radial-gradient(50% 50% at 50% 50%, var(--color-brand-primary) 0%, rgba(252, 232, 3, 0) 100%)',
                                            backdropFilter: 'blur(128px)',
                                            WebkitBackdropFilter: 'blur(128px)', // For Safari support
                                            zIndex: -1, // Ensure it stays behind other content
                                        }}
                                    />

                                    <div>
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.companyInfo.companyName')}</p>
                                        <p className="text-white font-medium">{manufacturerDetail.company_name}</p>
                                    </div>

                                    <div>
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.companyInfo.fullName')}</p>
                                        <p className="text-white font-medium">{manufacturerDetail.full_name}</p>
                                    </div>


                                    <div>
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.companyInfo.minOrderQuantity')}</p>
                                        <p className="text-white font-medium">{manufacturerDetail.min_order_quantity}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg">{t('app.manufacturerDetail.contactInfo.title')}</h3>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.contactInfo.officeAddress')}</p>
                                        <p className="text-white font-medium">{manufacturerDetail.office_address}</p>
                                    </div>

                                    {manufacturerDetail.website && (
                                        <div>
                                            <p className="text-white/64 text-sm">{t('app.manufacturerDetail.contactInfo.website')}</p>
                                            <p className="text-white font-medium">{manufacturerDetail.website}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Business Information */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg">{t('app.manufacturerDetail.businessInfo.title')}</h3>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.businessInfo.employeeCount')}</p>
                                        <p className="text-white font-medium">{manufacturerDetail.employee_count}</p>
                                    </div>

                                    <div>
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.businessInfo.crmSystem')}</p>
                                        <p className="text-white font-medium">{manufacturerDetail.has_crm ? t('app.manufacturerDetail.businessInfo.available') : t('app.manufacturerDetail.businessInfo.notAvailable')}</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    ) : null}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
