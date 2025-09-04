import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, Button, Spinner } from "@/components/ui"
import { useApiV1ApplicationManufacturerDetailRead } from "@/lib/api"
import type { AdditionalService, ManufacturerList } from "@/lib/api/model"

interface ManufacturerDetailDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    service: AdditionalService
    manufacturer: ManufacturerList | null
}

export function ManufacturerDetailDrawer({
    open,
    onOpenChange,
    manufacturer
}: ManufacturerDetailDrawerProps) {

    // Fetch manufacturer details
    const { data: manufacturerDetail, isLoading, error } = useApiV1ApplicationManufacturerDetailRead(
        manufacturer?.id || 0,
        {
            query: {
                enabled: !!manufacturer?.id && open
            }
        }
    )

    const handleClose = () => {
        onOpenChange(false)
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[96vh]">
                <DrawerHeader className="border-b border-[#FFFFFF0A] pb-2">
                    <DrawerTitle className="text-white text-left text-xl font-bold">
                        {manufacturer?.company_name}
                    </DrawerTitle>
                    <DrawerDescription className="text-white/64 text-left">
                        {manufacturer?.full_name} - {manufacturer?.position}
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
                            <p className="text-red-400 text-lg mb-4">Xatolik yuz berdi</p>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="secondary"
                                className="px-4 py-2"
                            >
                                Qayta urinish
                            </Button>
                        </div>
                    ) : manufacturerDetail ? (
                        <div className="space-y-6">
                            {/* Company Information */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg">Kompaniya ma'lumotlari</h3>

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
                                            background: 'radial-gradient(50% 50% at 50% 50%, #FCE803 0%, rgba(252, 232, 3, 0) 100%)',
                                            backdropFilter: 'blur(128px)',
                                            WebkitBackdropFilter: 'blur(128px)', // For Safari support
                                            zIndex: -1, // Ensure it stays behind other content
                                        }}
                                    />

                                    <div>
                                        <p className="text-white/64 text-sm">Kompaniya nomi</p>
                                        <p className="text-white font-medium">{manufacturerDetail.company_name}</p>
                                    </div>

                                    <div>
                                        <p className="text-white/64 text-sm">To'liq ism</p>
                                        <p className="text-white font-medium">{manufacturerDetail.full_name}</p>
                                    </div>

                                    <div>
                                        <p className="text-white/64 text-sm">Lavozim</p>
                                        <p className="text-white font-medium">{manufacturerDetail.position}</p>
                                    </div>

                                    <div>
                                        <p className="text-white/64 text-sm">Mahsulot segmenti</p>
                                        <p className="text-white font-medium">{manufacturerDetail.product_segment}</p>
                                    </div>

                                    <div>
                                        <p className="text-white/64 text-sm">Minimal buyurtma miqdori</p>
                                        <p className="text-white font-medium">{manufacturerDetail.min_order_quantity}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg">Aloqa ma'lumotlari</h3>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-white/64 text-sm">Ishlab chiqarish manzili</p>
                                        <p className="text-white font-medium">{manufacturerDetail.production_address}</p>
                                    </div>

                                    <div>
                                        <p className="text-white/64 text-sm">Ofis manzili</p>
                                        <p className="text-white font-medium">{manufacturerDetail.office_address}</p>
                                    </div>

                                    {manufacturerDetail.phone && (
                                        <div>
                                            <p className="text-white/64 text-sm">Telefon</p>
                                            <p className="text-white font-medium">{manufacturerDetail.phone}</p>
                                        </div>
                                    )}

                                    {manufacturerDetail.website && (
                                        <div>
                                            <p className="text-white/64 text-sm">Veb-sayt</p>
                                            <p className="text-white font-medium">{manufacturerDetail.website}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Business Information */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg">Biznes ma'lumotlari</h3>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-white/64 text-sm">Bozor tajribasi</p>
                                        <p className="text-white font-medium">{manufacturerDetail.market_experience}</p>
                                    </div>

                                    <div>
                                        <p className="text-white/64 text-sm">Xodimlar soni</p>
                                        <p className="text-white font-medium">{manufacturerDetail.employee_count}</p>
                                    </div>

                                    <div>
                                        <p className="text-white/64 text-sm">Tashkilot tuzilmasi</p>
                                        <p className="text-white font-medium">{manufacturerDetail.organization_structure}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Commercial Offer */}
                            {manufacturerDetail.commercial_offer_text && (
                                <div className="space-y-4">
                                    <h3 className="text-white font-bold text-lg">Savdo taklifi</h3>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <p className="text-white/80 text-sm leading-relaxed">
                                            {manufacturerDetail.commercial_offer_text}
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : null}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
