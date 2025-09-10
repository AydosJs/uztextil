import type { OfferList as OfferListType } from "@/lib/api/model/offerList"
import { useTranslation } from "react-i18next"
import { useApiV1OfferUpdateUpdate } from "@/lib/api"
import { useState } from "react"
import { showToast } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"

interface OfferCardProps {
    offer: OfferListType
    onOfferSelect?: (offer: OfferListType) => void
    userId?: number
}

function OfferCard({ offer, onOfferSelect, userId }: OfferCardProps) {
    const { t } = useTranslation()
    const [isUpdating, setIsUpdating] = useState(false)
    const queryClient = useQueryClient()

    const offerUpdateMutation = useApiV1OfferUpdateUpdate({
        mutation: {
            onSuccess: () => {
                showToast.success(t('app.onlineB2B.offers.status.updated'))
                setIsUpdating(false)
                // Invalidate the offer list query to refresh the data
                queryClient.invalidateQueries({
                    queryKey: ['/api/v1/offer/list/']
                })
            },
            onError: (error) => {
                console.error('Offer update failed:', error)
                showToast.error(t('app.onlineB2B.offers.status.updateError'))
                setIsUpdating(false)
            }
        }
    })

    const handleOfferClick = () => {
        // Always show details drawer when card is clicked
        onOfferSelect?.(offer)
    }

    const handleStatusClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation() // Prevent card click when clicking status
        if (offer.status !== 'chosen') {
            // If not selected, update status to selected
            handleStatusUpdate()
        }
        // Don't open drawer when clicking status button
    }

    const handleStatusUpdate = async () => {
        if (!offer.id || !userId || !offer.service) {
            console.log('Missing required fields', { offerId: offer.id, userId, service: offer.service })
            return
        }

        setIsUpdating(true)
        try {
            await offerUpdateMutation.mutateAsync({
                id: offer.id,
                data: {
                    status: 'chosen',
                    user: userId,
                    service: offer.service
                }
            })
        } catch (error) {
            console.error('Status update error:', error)
        }
    }

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'chosen':
                return 'bg-green-500/20 text-green-400'
            case 'not_chosen':
                return 'bg-yellow-500/20 text-yellow-400'
            default:
                return 'bg-gray-500/20 text-gray-400'
        }
    }

    const getStatusText = (status?: string) => {
        switch (status) {
            case 'chosen':
                return t('app.onlineB2B.offers.status.selected')
            case 'not_chosen':
                return t('app.onlineB2B.offers.status.select')
            default:
                return t('app.onlineB2B.offers.status.select')
        }
    }

    return (
        <div className="relative flex flex-col px-6 py-4 w-full rounded-[22px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] overflow-hidden hover:bg-[#FFFFFF08] transition-colors"
            style={{
                backdropFilter: 'blur(128px)',
                WebkitBackdropFilter: 'blur(128px)'
            }}
        >
            {/* Offer Header */}
            <div className="flex items-center justify-between mb-2">
                <div
                    onClick={handleOfferClick}
                    className="flex-1 cursor-pointer"
                >
                    <h3 className="text-white font-extrabold text-base">
                        {offer.manufacturer?.company_name || t('app.onlineB2B.offers.unknownCompany')}
                    </h3>
                    <p className="text-[#ACADAF] text-xs">
                        {t('app.common.viewMoreDetails')}
                    </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                    {isUpdating ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            {t('app.onlineB2B.offers.status.updating')}
                        </span>
                    ) : (
                        <button
                            onClick={handleStatusClick}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)} hover:opacity-80 transition-opacity`}
                        >
                            {getStatusText(offer.status)}
                        </button>
                    )}
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
    )
}

export default OfferCard
