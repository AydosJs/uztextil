import { RadialEffect } from "@/components/ui"
import { RefreshCcw } from "lucide-react"
import { ServiceCard } from "@/pages/customer/components"
import { useTelegramBackButton } from "@/lib/hooks"

interface ServiceCard {
    id: number
    title: string
    price: string
    icon: string
}

function AdditionalServices() {
    // Show back button that goes to customer register page
    useTelegramBackButton({ navigateTo: '/customer/register' })

    const services: ServiceCard[] = [
        {
            id: 1,
            title: "Video sharh",
            price: "$300",
            icon: "video"
        },
        {
            id: 2,
            title: "Sotuv menejerini taklif qilish",
            price: "$500",
            icon: "manager"
        },
        {
            id: 3,
            title: "ROPlarni o'qitish",
            price: "$500/Oyiga",
            icon: "training"
        }
    ]


    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
            <RadialEffect
                className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />
            <main className="w-full pt-2 container min-w-full flex-1 flex flex-col relative z-10">

                <div className="w-full mb-6 h-[263px] mx-auto rounded-[22px] border border-[#FFFFFF0A] bg-[#181B20] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] flex flex-col items-center justify-between p-4 relative overflow-hidden">
                    {/* Radial gradient effect */}
                    <div
                        className="absolute w-[512px] h-[512px] -top-[218px] -left-[276px] opacity-[0.08] pointer-events-none"
                        style={{
                            background: 'radial-gradient(50% 50% at 50% 50%, #FCE803 0%, rgba(252, 232, 3, 0) 100%)',
                            backdropFilter: 'blur(128px)',
                            WebkitBackdropFilter: 'blur(128px)'
                        }}
                    ></div>

                    {/* Text content */}
                    <div className="text-center space-y-1.5 mt-10">
                        <h2 className="text-white font-extrabold text-lg text-center">
                            Ma’lumotlar qabul qilindi
                        </h2>
                        <p className="text-[#ACADAF] font-normal text-xs text-center">
                            Moderator ma’lumotlaringizni ko’rib chiqmoqda
                        </p>
                    </div>



                    {/* Button at bottom */}
                    <button className=" bottom-4 flex flex-row items-center justify-center gap-2 w-full h-10 rounded-[12px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] text-white font-semibold text-xs">
                        Jarayonda
                        <RefreshCcw className="size-3" />
                    </button>
                </div>

                <h1 className="text-white mb-4.5 font-bold text-2xl tracking-wide">
                    Qo'shimcha xizmatlar
                </h1>
                <div className="flex-1 pb-8">
                    <div className="space-y-4">
                        {services.map((service) => (
                            <ServiceCard
                                key={service.id}
                                title={service.title}
                                price={service.price}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdditionalServices
