import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button, CustomCheckbox } from "@/components/ui"
import { showToast } from "@/lib/utils"

function SubmitApplication() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isChecked, setIsChecked] = useState(false)

    // Get service title from location state or use default
    const serviceTitle = location.state?.serviceTitle || "Video sharh xizmati"

    const handleBack = () => {
        navigate(-1)
    }

    const handleSubmit = () => {
        if (!isChecked) {
            showToast.warning("Iltimos, shartlarni o'qib chiqing va tasdiqlang")
            return
        }
        // Handle application submission logic here
        console.log("Application submitted for:", serviceTitle)
        // Navigate to success page or show success message
    }

    const handleCancel = () => {
        navigate(-1)
    }

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col">
            <main className="w-full container min-w-full flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6 pt-4">
                    <button
                        onClick={handleBack}
                        className="p-2 rounded-lg bg-[#FFFFFF05] border border-[#FFFFFF0A] hover:bg-[#FFFFFF0A] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-white font-bold text-2xl tracking-wide">
                        {serviceTitle}
                    </h1>
                </div>

                {/* Terms and Conditions Section */}
                <div className="flex-1 space-y-6 pb-8">
                    <div className="space-y-3">
                        <h2 className="text-white font-bold text-lg tracking-wide">
                            Коммерческое предложение
                        </h2>

                        <div className="space-y-4 text-white/64 text-sm leading-relaxed">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>

                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>

                            <p>
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                            </p>

                            <p>
                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                            </p>

                            <p>
                                Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
                            </p>
                        </div>

                        {/* Checkbox */}
                        <div className="pt-4">
                            <CustomCheckbox
                                label="Tanishib chiqdim"
                                checked={isChecked}
                                onCheckedChange={(checked) => setIsChecked(checked === true)}
                            />
                        </div>
                    </div>
                </div>

                <p className="text-center text-white text-lg font-bold mb-5 px-12">
                    Ariza qoldiring va menejerlarimiz siz bilan  tez orada bog’lanishadi
                </p>
                {/* Bottom Buttons */}
                <div className="px-6 pb-8 space-y-3">

                    <Button
                        variant="secondary"
                        shadow="lg"
                        onClick={handleCancel}
                        className="w-full"
                    >
                        Bekor qilish
                    </Button>

                    <Button
                        variant="default"
                        onClick={handleSubmit}
                        disabled={!isChecked}
                        className="w-full"
                    >
                        Ariza qoldirish
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default SubmitApplication
