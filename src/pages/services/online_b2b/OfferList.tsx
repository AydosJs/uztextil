import { UnderwaterHeader } from "@/components/ui"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTranslation } from "react-i18next"
import { Spinner } from "@/components/ui"
import { OfferCard, OfferDetailsDrawer } from "./components"
import { useLocation } from "react-router-dom"
import { useApiV1OfferListList } from "@/lib/api"
import { useMemo, useState } from "react"
import type { OfferList as OfferListType } from "@/lib/api/model/offerList"

function OfferListPage() {
    const { t } = useTranslation()
    const location = useLocation()
    const [selectedOffer, setSelectedOffer] = useState<OfferListType | null>(null)

    useTelegramBackButton({ navigateTo: '/services' })

    // Get application data from navigation state
    const applicationData = location.state?.applicationData

    const handleOfferSelect = (offer: OfferListType) => {
        setSelectedOffer(offer)
        // Don't open drawer immediately - let OfferDetailsDrawer handle it after API loads
    }

    const handleDrawerClose = () => {
        setSelectedOffer(null)
    }

    // Build query parameters for the API call
    const queryParams = useMemo(() => {
        const params = new URLSearchParams()

        // Add application parameters if available
        if (applicationData?.id) {
            params.append('application_id', applicationData.id.toString())
        }
        if (applicationData?.service) {
            params.append('service_id', applicationData.service.toString())
        }
        if (applicationData?.user) {
            params.append('user_id', applicationData.user.toString())
        }

        return params.toString()
    }, [applicationData])

    // Use Orval-generated API with custom options to include query parameters
    const { data: offers, isLoading, error } = useApiV1OfferListList({
        query: {
            enabled: !!applicationData?.id // Only run query if we have application data
        },
        request: {
            // Override the URL to include query parameters
            url: `/api/v1/offer/list/?${queryParams}`,
        }
    })

    console.log(offers, "offers")

    // Show error if no application data
    if (!applicationData?.id) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
                <main className="w-full container min-w-full flex-1 flex flex-col">
                    <UnderwaterHeader />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-400 text-lg mb-4">
                                {t('app.onlineB2B.offers.noApplicationData')}
                            </p>
                            <p className="text-[#ACADAF] text-sm">
                                {t('app.onlineB2B.offers.noApplicationDataDescription')}
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
                <main className="w-full container min-w-full flex-1 flex flex-col">
                    <UnderwaterHeader />
                    <div className="flex-1 flex items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                </main>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
                <main className="w-full container min-w-full flex-1 flex flex-col">
                    <UnderwaterHeader />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-400 text-lg mb-4">
                                {t('app.onlineB2B.offers.error')}
                            </p>
                            <p className="text-[#ACADAF] text-sm">
                                {t('app.onlineB2B.offers.errorDescription')}
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col">
                <UnderwaterHeader />

                {/* Header */}
                <div className="text-left space-y-4 mb-8 pt-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.onlineB2B.offers.title')}
                    </h1>
                    <p className="text-[#ACADAF] text-sm">
                        {t('app.onlineB2B.offers.subtitle')}
                    </p>
                </div>

                {/* Offers List */}
                <div className="flex-1 pb-8">
                    {offers && offers.length > 0 ? (
                        <div className="space-y-4">
                            {offers.map((offer) => (
                                <OfferCard
                                    key={offer.id}
                                    offer={offer}
                                    onOfferSelect={handleOfferSelect}
                                    userId={applicationData?.user}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-[#ACADAF] text-lg mb-2">
                                    {t('app.onlineB2B.offers.noOffers')}
                                </p>
                                <p className="text-[#ACADAF] text-sm">
                                    {t('app.onlineB2B.offers.noOffersDescription')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Offer Details Drawer */}
            <OfferDetailsDrawer
                onClose={handleDrawerClose}
                selectedOffer={selectedOffer}
            />
        </div>
    )
}

export default OfferListPage
