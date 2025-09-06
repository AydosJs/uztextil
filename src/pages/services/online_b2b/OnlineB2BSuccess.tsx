import { UnderwaterHeader } from "@/components/ui"
import { useTelegramBackButton } from "@/lib/hooks"
import { useTranslation } from "react-i18next"

function OnlineB2BSuccess() {
    const { t } = useTranslation()

    useTelegramBackButton({ navigateTo: '/services' })

    // Static offers data
    const offers = [
        {
            id: 1,
            title: "Toshkent Tekstil Fabrikasi",
            description: "Premium mato ishlab chiqarish",
            price: "$500",
            status: "active",
            meetingDate: "2024-01-15",
            meetingTime: "14:00"
        },
        {
            id: 2,
            title: "Samarqand Textile Group",
            description: "Keng assortiment mato mahsulotlari",
            price: "$350",
            status: "pending",
            meetingDate: "2024-01-18",
            meetingTime: "10:00"
        }
    ]

    const handleOfferClick = (offer: typeof offers[0]) => {
        // Handle offer selection
        alert(`Taklif tanlandi: ${offer.title}`)
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col">
                <UnderwaterHeader />

                {/* Header */}
                <div className="text-left space-y-4 mb-8 pt-4">
                    <h1 className="text-white font-bold text-[32px] tracking-wide">
                        {t('app.onlineB2B.success.header')}
                    </h1>
                    <p className="text-[#ACADAF] text-sm">
                        {t('app.onlineB2B.success.subtitle')}
                    </p>
                </div>

                {/* Offers List */}
                <div className="flex-1 pb-8">
                    <div className="space-y-4">
                        <h2 className="text-white font-bold text-lg mb-4">
                            {t('app.onlineB2B.success.offersTitle')}
                        </h2>

                        {offers.map((offer) => (
                            <div
                                key={offer.id}
                                onClick={() => handleOfferClick(offer)}
                                className="relative flex flex-col px-6 py-4 w-full rounded-[22px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] overflow-hidden cursor-pointer hover:bg-[#FFFFFF08] transition-colors"
                                style={{
                                    backdropFilter: 'blur(128px)',
                                    WebkitBackdropFilter: 'blur(128px)'
                                }}
                            >
                                {/* Offer Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-white font-extrabold text-base">
                                        {offer.title}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[#FCE803] font-bold text-sm">
                                            {offer.price}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${offer.status === 'active'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {offer.status === 'active' ? 'Faol' : 'Kutilmoqda'}
                                        </span>
                                    </div>
                                </div>

                                {/* Offer Description */}
                                <p className="text-[#ACADAF] text-sm mb-3">
                                    {offer.description}
                                </p>

                                {/* Meeting Info */}
                                <div className="flex items-center justify-between text-xs text-[#ACADAF]">
                                    <div className="flex items-center space-x-4">
                                        <span>📅 {offer.meetingDate}</span>
                                        <span>🕐 {offer.meetingTime}</span>
                                    </div>
                                    <span className="text-[#FCE803]">Tanlash</span>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default OnlineB2BSuccess
