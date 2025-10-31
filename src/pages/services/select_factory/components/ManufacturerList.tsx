import { ChevronRight } from "lucide-react"
import { Spinner } from "@/components/ui"
import { useTranslation } from "react-i18next"
import type { ApiV1ManufacturerListList200, ApiV1ContactSettingsContactSettingsList200, ManufacturerList } from "@/lib/api/model"

interface ManufacturerListProps {
    isLoading: boolean
    manufacturers?: ApiV1ManufacturerListList200
    isCheckingPayment: boolean
    onFactorySelect: (factory: ManufacturerList) => void
    contactSettings?: ApiV1ContactSettingsContactSettingsList200
}

export function ManufacturerList({
    isLoading,
    manufacturers,
    isCheckingPayment,
    onFactorySelect,
    contactSettings
}: ManufacturerListProps) {
    const { t } = useTranslation()

    const hasManufacturers = manufacturers?.results && manufacturers.results.length > 0

    return (
        <div className="flex-1 flex flex-col">
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Spinner className="w-8 h-8 text-white mb-4 mx-auto" />
                        <p className="text-text-secondary text-lg">{t('app.common.loading')}</p>
                    </div>
                </div>
            ) : !hasManufacturers ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-text-secondary text-lg">{t('app.common.noManufacturersAvailable')}</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {manufacturers!.results.map((factory) => (
                        <div
                            key={factory.id}
                            className="w-full rounded-[16px] border border-border-primary bg-background-card shadow-card overflow-hidden"
                        >
                            {/* Main Factory Section */}
                            <div
                                onClick={() => !isCheckingPayment && onFactorySelect(factory)}
                                className={`relative flex items-center justify-between min-h-[82px] py-2.5 px-3.5 flex-row ${isCheckingPayment ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            >
                                {/* Factory Logo */}
                                <div className="w-12 h-12 rounded-lg bg-brand-primary/13 flex items-center justify-center mr-4 flex-shrink-0">
                                    {factory.logo ? (
                                        <img
                                            src={factory.logo}
                                            alt={`${factory.company_name} logo`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                                            <span className="text-brand-primary font-bold text-lg">
                                                {factory.company_name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Factory Content */}
                                <div className="space-y-1 flex-1">
                                    <h3 className="text-white font-extrabold">
                                        {factory.full_name}
                                    </h3>
                                    <p className="text-text-secondary font-normal text-sm pr-10">
                                        {factory.company_name}
                                    </p>
                                </div>

                                {/* Right Arrow Button */}
                                <div className="w-[27px] mr-5 h-[27px] rounded-[4px] bg-brand-primary flex items-center justify-center shadow-brand">
                                    {isCheckingPayment ? (
                                        <Spinner className="w-4 h-4 text-black" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-black" />
                                    )}
                                </div>

                                {/* Decorative SVG Pattern */}
                                <div className="absolute -right-2 -top-3">
                                    <svg width="111" height="108" viewBox="0 0 111 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.16" d="M1.73438 -0.265625L109.266 107.266M109.266 -0.265625L1.73438 107.266M38.1549 -2V109M55.4979 -2V109M72.8435 -2V109M111 36.1565L0 36.1565M111 53.4994L0 53.4994M111 70.8449L0 70.8449M90.1875 53.5C90.1875 72.6574 74.6574 88.1875 55.5 88.1875C36.3426 88.1875 20.8125 72.6574 20.8125 53.5C20.8125 34.3426 36.3426 18.8125 55.5 18.8125C74.6574 18.8125 90.1875 34.3426 90.1875 53.5ZM72.8438 53.5C72.8438 63.0787 65.0787 70.8438 55.5 70.8438C45.9213 70.8438 38.1563 63.0787 38.1563 53.5C38.1563 43.9213 45.9213 36.1563 55.5 36.1563C65.0787 36.1563 72.8438 43.9213 72.8438 53.5Z" stroke="url(#paint0_radial_27_18405)" strokeWidth="0.5" />
                                        <defs>
                                            <radialGradient id="paint0_radial_27_18405" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(55.5 53.5) rotate(90) scale(55.5)">
                                                <stop stopColor="white" />
                                                <stop offset="0.5" stopColor="white" stopOpacity="0.25" />
                                                <stop offset="1" stopColor="white" stopOpacity="0" />
                                            </radialGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            {contactSettings?.results && contactSettings.results.length > 0 && (
                                <div className="border-t border-border-primary/50 px-3.5 py-1.5 bg-background-card/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <p className="text-white font-medium text-xs">
                                                {contactSettings.results[0].name}:
                                            </p>
                                            <p className="text-brand-primary font-medium text-xs">
                                                {contactSettings.results[0].phone_number}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

