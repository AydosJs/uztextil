import { Button } from "@/components/ui"
import { useNavigate } from "react-router-dom"

function Welcome() {
    const navigate = useNavigate()

    const handleGetStarted = () => {
        // Navigate to the body selection page
        navigate("/boim-tanlash")
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col justify-between">
                <div className=" flex px-3 flex-col items-center justify-center space-y-8">
                    {/* Welcome Header */}
                    <div className="text-left space-y-2">
                        <h1 className="text-white font-bold text-[27px] tracking-wide">
                            Assalomu aleykum!
                        </h1>
                        <p className="text-gray-300 max-w-md font-medium text-sm leading-relaxed">
                            Sizni O'zbekistondagi tasdiqlangan, tekshirilgan tekstil fabrikalari bo'yicha 1-raqamli bot kutib oladi.
                        </p>
                    </div>
                </div>

                {/* WE CAN MAKE IT ABSOLUTE POSITION AND PUT IMAGE IN IT */}
                <div className="text-center w-full h-full">
                    Image
                </div>

                {/* Action Buttons */}
                <div className="px-4 pb-8 space-y-8">

                    <p className="text-gray-300 max-w-md font-medium text-center text-sm leading-relaxed">
                        Faqat oraliqsiz, ishonchli fabrikalar. Agar shartlar bajarilmasa, pulni qaytarib berish kafolati mavjud.
                    </p>

                    <Button
                        variant="default"
                        shadow="lg"
                        onClick={handleGetStarted}
                        className="w-full"
                    >
                        Ochish
                    </Button>
                </div>
            </main >
        </div >
    )
}

export default Welcome
