import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui"
import { useTranslation } from "react-i18next"
import { Spinner } from "@/components/ui"
import { useApiV1ManufacturerDetailRead } from "@/lib/api"
import type { OfferList as OfferListType } from "@/lib/api/model/offerList"

interface OfferDetailsDrawerProps {
    onClose: () => void
    selectedOffer: OfferListType | null
}

function OfferDetailsDrawer({ onClose, selectedOffer }: OfferDetailsDrawerProps) {
    const { t } = useTranslation()

    // Fetch manufacturer details when an offer is selected
    const { data: manufacturerDetail, isLoading: isLoadingDetail } = useApiV1ManufacturerDetailRead(
        selectedOffer?.manufacturer?.id || 0,
        {
            query: {
                enabled: !!selectedOffer?.manufacturer?.id
            }
        }
    )

    // Only open drawer when we have data or when loading is complete
    const isDrawerOpen = !!selectedOffer && (!isLoadingDetail || !!manufacturerDetail)

    return (
        <Drawer
            open={isDrawerOpen}
            onClose={onClose}
        >
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="w-full text-left text-xl">
                        {t('app.common.manufacturerDetails')}
                    </DrawerTitle>
                    <DrawerClose className="absolute right-4 top-4 text-white/60 hover:text-white">
                        ✕
                    </DrawerClose>
                </DrawerHeader>

                {selectedOffer && (
                    <div className="space-y-4 p-4 pt-0 overflow-y-auto">
                        {isLoadingDetail ? (
                            <div className="flex items-center justify-center py-8">
                                <Spinner />
                            </div>
                        ) : manufacturerDetail ? (
                            <div className="space-y-2">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-white text-lg font-bold">
                                            {manufacturerDetail.company_name}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-primary text-sm font-medium">
                                            {t('app.onlineB2B.offers.details.lotNumber')}:
                                        </span>
                                        <p className="text-white text-sm mt-1">
                                            {t('app.onlineB2B.offers.details.notAvailable')}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-primary text-sm font-medium">
                                            {t('app.onlineB2B.offers.details.minOrderQuantity')}:
                                        </span>
                                        <p className="text-white text-sm mt-1">
                                            {manufacturerDetail.min_order_quantity}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-primary text-sm font-medium">
                                            {t('app.onlineB2B.offers.details.phoneNumber')}:
                                        </span>
                                        <p className="text-white text-sm mt-1">
                                            {t('app.onlineB2B.offers.details.notAvailable')}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-primary text-sm font-medium">
                                            {t('app.onlineB2B.offers.details.website')}:
                                        </span>
                                        <p className="text-white text-sm mt-1">
                                            {manufacturerDetail.website || t('app.onlineB2B.offers.details.notAvailable')}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-primary text-sm font-medium">
                                            {t('app.onlineB2B.offers.details.officeAddress')}:
                                        </span>
                                        <p className="text-white text-sm mt-1">
                                            {manufacturerDetail.office_address}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-primary text-sm font-medium">
                                            {t('app.onlineB2B.offers.details.hasCrm')}:
                                        </span>
                                        <p className="text-white text-sm mt-1">
                                            {manufacturerDetail.has_crm
                                                ? t('app.onlineB2B.offers.details.yes')
                                                : t('app.onlineB2B.offers.details.no')
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-primary text-sm font-medium">
                                            {t('app.onlineB2B.offers.details.employeeCount')}:
                                        </span>
                                        <p className="text-white text-sm mt-1">
                                            {manufacturerDetail.employee_count}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-primary text-sm">
                                    {t('app.onlineB2B.offers.details.loadError')}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    )
}

export default OfferDetailsDrawer
