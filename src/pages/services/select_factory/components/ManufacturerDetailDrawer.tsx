import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, Button, Spinner } from "@/components/ui"
import type { ManufacturerList, ManufacturerDetail } from "@/lib/api/model"
import { useTranslation } from "react-i18next"

interface ManufacturerDetailDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    manufacturer: ManufacturerList | null
    manufacturerDetail?: ManufacturerDetail | null
    isLoading?: boolean
    error?: Error | null
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
            <DrawerContent className="max-h-[99vh]!">
                <DrawerHeader className="border-b border-border-primary pb-2">
                    <DrawerTitle className="text-white text-left text-xl font-bold">
                        {manufacturer?.company_name}
                    </DrawerTitle>
                    <DrawerDescription className="text-white/64 text-left">
                        {manufacturer?.full_name}
                    </DrawerDescription>
                    <DrawerClose onClick={handleClose} className="text-white/64 hover:text-white" />
                </DrawerHeader>

                <div className="px-4 pb-10 pt-6 space-y-6 overflow-y-auto max-h-[99vh]">
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
                            {/* Company Logo */}
                            <div className="flex justify-center">
                                <div className="w-32 h-32 rounded-2xl bg-brand-primary/13 flex items-center justify-center">
                                    {manufacturerDetail.logo ? (
                                        <img
                                            src={manufacturerDetail.logo}
                                            alt={`${manufacturerDetail.company_name} logo`}
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-brand-primary/20 rounded-xl flex items-center justify-center">
                                            <span className="text-brand-primary font-bold text-4xl">
                                                {manufacturerDetail.company_name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Company Information */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg">{t('app.manufacturerDetail.companyInfo.title')}</h3>

                                <div className="space-y-4 relative">
                                    {/* Background gradient effect */}
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

                                    {/* Company Name */}
                                    <div className="space-y-1">
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.companyInfo.companyName')}</p>
                                        <p className="text-white font-semibold text-lg">{manufacturerDetail.company_name}</p>
                                    </div>

                                    {/* Full Name */}
                                    <div className="space-y-1">
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.companyInfo.fullName')}</p>
                                        <p className="text-white font-medium">{manufacturerDetail.full_name}</p>
                                    </div>

                                    {/* Minimum Order Quantity */}
                                    <div className="space-y-1">
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.companyInfo.minOrderQuantity')}</p>
                                        <p className="text-white font-medium text-lg">{manufacturerDetail.min_order_quantity}</p>
                                    </div>

                                    {/* Product Segments */}
                                    <div className="space-y-3">
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.companyInfo.productSegments')}</p>
                                        {manufacturerDetail.product_segment && manufacturerDetail.product_segment.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {manufacturerDetail.product_segment.map(segment => (
                                                    <span key={segment.id} className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                                                        {segment.title}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-text-tertiary text-sm">{t('app.manufacturerDetail.companyInfo.noSegments')}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border-primary my-6"></div>

                            {/* Company Images */}
                            {manufacturerDetail.images && manufacturerDetail.images.length > 0 && (
                                <>
                                    <div className="space-y-4">
                                        <h3 className="text-white font-bold text-lg">{t('app.manufacturerDetail.companyImages.title')}</h3>

                                        <div className="grid grid-cols-2 gap-3">
                                            {manufacturerDetail.images.map((image, index) => (
                                                <div key={image.id || index} className="aspect-square rounded-lg overflow-hidden bg-brand-primary/13">
                                                    {image.image ? (
                                                        <img
                                                            src={image.image}
                                                            alt={`${manufacturerDetail.company_name} image ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-brand-primary/50 text-sm">No image</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-border-primary my-6"></div>
                                </>
                            )}

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg">{t('app.manufacturerDetail.contactInfo.title')}</h3>

                                <div className="space-y-4">
                                    {/* Office Address */}
                                    <div className="space-y-1">
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.contactInfo.officeAddress')}</p>
                                        <p className="text-white font-medium">{manufacturerDetail.office_address}</p>
                                    </div>

                                    {/* Website */}
                                    {manufacturerDetail.website && (
                                        <div className="space-y-1">
                                            <p className="text-white/64 text-sm">{t('app.manufacturerDetail.contactInfo.website')}</p>
                                            <a
                                                href={manufacturerDetail.website.startsWith('http') ? manufacturerDetail.website : `https://${manufacturerDetail.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-brand-primary hover:text-brand-primary/80 font-medium underline"
                                            >
                                                {manufacturerDetail.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border-primary my-6"></div>

                            {/* Business Information */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg">{t('app.manufacturerDetail.businessInfo.title')}</h3>

                                <div className="space-y-4">
                                    {/* Employee Count */}
                                    <div className="space-y-1">
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.businessInfo.employeeCount')}</p>
                                        <p className="text-white font-semibold text-lg">{manufacturerDetail.employee_count.toLocaleString()}</p>
                                    </div>

                                    {/* CRM System */}
                                    <div className="space-y-1">
                                        <p className="text-white/64 text-sm">{t('app.manufacturerDetail.businessInfo.crmSystem')}</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${manufacturerDetail.has_crm ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <p className="text-white font-medium">
                                                {manufacturerDetail.has_crm ? t('app.manufacturerDetail.businessInfo.available') : t('app.manufacturerDetail.businessInfo.notAvailable')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border-primary my-6"></div>

                            {/* Certificates */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg">{t('app.manufacturerDetail.certificates.title')}</h3>

                                <div className="space-y-6">
                                    {manufacturerDetail.sertificates && manufacturerDetail.sertificates.length > 0 ? (
                                        manufacturerDetail.sertificates.map((certificate, index) => (
                                            <div key={certificate.id || index} className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-white font-medium">{t('app.manufacturerDetail.certificates.certificate')} #{index + 1}</h4>
                                                    {certificate.certificate && (
                                                        <a
                                                            href={certificate.certificate}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-brand-primary hover:text-brand-primary/80 text-sm font-medium underline"
                                                        >
                                                            {t('app.manufacturerDetail.certificates.certificate')}
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {certificate.certificate_received_date && (
                                                        <div className="space-y-1">
                                                            <p className="text-white/64 text-sm">{t('app.manufacturerDetail.certificates.receivedDate')}</p>
                                                            <p className="text-white font-medium">
                                                                {new Date(certificate.certificate_received_date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {certificate.certificate_expiration_date && (
                                                        <div className="space-y-1">
                                                            <p className="text-white/64 text-sm">{t('app.manufacturerDetail.certificates.expirationDate')}</p>
                                                            <p className="text-white font-medium">
                                                                {new Date(certificate.certificate_expiration_date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-text-tertiary text-sm">{t('app.manufacturerDetail.certificates.noCertificates')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ) : null}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
