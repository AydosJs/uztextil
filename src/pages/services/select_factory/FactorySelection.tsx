import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { RadialEffect, Spinner, UnderwaterHeader } from "@/components/ui"
import { useApiV1ManufacturerListList } from "@/lib/api"
import { useTelegramBackButton } from "@/lib/hooks"
import { ChevronRight, Filter } from "lucide-react"
import { ManufacturerDetailDrawer, FilterDrawer } from "./components"
import type { AdditionalService, ManufacturerList } from "@/lib/api/model"

interface FilterOptions {
    search: string
    product_segment: string
    min_order_quantity: string
}

function FactorySelection() {
    const navigate = useNavigate()
    const location = useLocation()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
    const [selectedManufacturer, setSelectedManufacturer] = useState<ManufacturerList | null>(null)
    const [filters, setFilters] = useState<FilterOptions>({
        search: '',
        product_segment: '',
        min_order_quantity: ''
    })

    // Show back button that goes to services page
    useTelegramBackButton({ navigateTo: '/services' })

    // Get service data from navigation state
    const service = location.state?.service as AdditionalService

    // Prepare API parameters - this will be reactive to filters changes
    const apiParams = {
        search: filters.search.trim() || undefined,
        product_segment: filters.product_segment.trim() || undefined,
        min_order_quantity: filters.min_order_quantity.trim() || undefined
    }


    // Fetch manufacturer list with filters - this will refetch when apiParams change
    const { data: manufacturers, isLoading, error } = useApiV1ManufacturerListList(apiParams)

    // If no service data, redirect back to services
    if (!service) {
        navigate('/services')
        return null
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
                <UnderwaterHeader />
                <RadialEffect
                    className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
                />
                <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                    <div className="text-left space-y-4 mb-8 px-4 pt-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {service.name}
                        </h1>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <Spinner className="w-8 h-8 text-white" />
                    </div>
                </main>
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
                <UnderwaterHeader />
                <RadialEffect
                    className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
                />
                <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                    <div className="text-left space-y-4 mb-8 px-4 pt-4">
                        <h1 className="text-white font-bold text-[32px] tracking-wide">
                            {service.name}
                        </h1>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-400 text-lg mb-4">Xatolik yuz berdi</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                            >
                                Qayta urinish
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    const handleFactorySelect = (factory: ManufacturerList) => {
        setSelectedManufacturer(factory)
        setDrawerOpen(true)
    }

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters)
    }

    // Show manufacturers or empty state
    const hasManufacturers = manufacturers && manufacturers.length > 0

    return (
        <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col relative overflow-hidden">
            <UnderwaterHeader />
            <RadialEffect
                className="!w-[512px] !h-[512px] !-top-[202px] !-left-[256px] !opacity-[0.08]"
            />

            <main className="w-full container min-w-full flex-1 flex flex-col relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pt-4">
                    <h1 className="text-white font-bold text-2xl tracking-wide">
                        Fabrika tanlash
                    </h1>
                    <button
                        onClick={() => setFilterDrawerOpen(true)}
                        className="p-2 rounded-lg bg-[#FFFFFF05] border border-[#FFFFFF0A] hover:bg-[#FFFFFF10] transition-colors"
                    >
                        <Filter className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Manufacturers List */}
                <div className="flex-1">
                    {!hasManufacturers ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-[#ACADAF] text-lg">Hozircha ishlab chiqaruvchilar mavjud emas</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {manufacturers.map((factory) => (
                                <div
                                    key={factory.id}
                                    onClick={() => handleFactorySelect(factory)}
                                    className="relative flex items-center justify-between min-h-[82px] py-2.5 px-3.5 flex-row w-full rounded-[16px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] overflow-hidden cursor-pointer"
                                    style={{
                                        backdropFilter: 'blur(128px)',
                                        WebkitBackdropFilter: 'blur(128px)'
                                    }}
                                >
                                    {/* Factory Content */}
                                    <div className="space-y-1 flex-1">
                                        <h3 className="text-white font-extrabold">
                                            {factory.full_name}
                                        </h3>
                                        <p className="text-[#ACADAF] font-normal text-sm">
                                            {factory.company_name} - {factory.product_segment}
                                        </p>
                                    </div>

                                    {/* Right Arrow Button */}
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[27px] h-[27px] rounded-[4px] bg-[#FCE803] flex items-center justify-center shadow-[0px_2px_20px_-4px_#FCE803]">
                                        <ChevronRight className="w-4 h-4 text-black" />
                                    </div>

                                    <div className="absolute -right-2 -top-3">
                                        <svg width="111" height="108" viewBox="0 0 111 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.16" d="M1.73438 -0.265625L109.266 107.266M109.266 -0.265625L1.73438 107.266M38.1549 -2V109M55.4979 -2V109M72.8435 -2V109M111 36.1565L0 36.1565M111 53.4994L0 53.4994M111 70.8449L0 70.8449M90.1875 53.5C90.1875 72.6574 74.6574 88.1875 55.5 88.1875C36.3426 88.1875 20.8125 72.6574 20.8125 53.5C20.8125 34.3426 36.3426 18.8125 55.5 18.8125C74.6574 18.8125 90.1875 34.3426 90.1875 53.5ZM72.8438 53.5C72.8438 63.0787 65.0787 70.8438 55.5 70.8438C45.9213 70.8438 38.1563 63.0787 38.1563 53.5C38.1563 43.9213 45.9213 36.1563 55.5 36.1563C65.0787 36.1563 72.8438 43.9213 72.8438 53.5Z" stroke="url(#paint0_radial_27_18405)" strokeWidth="0.5" />
                                            <defs>
                                                <radialGradient id="paint0_radial_27_18405" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(55.5 53.5) rotate(90) scale(55.5)">
                                                    <stop stop-color="white" />
                                                    <stop offset="0.5" stop-color="white" stop-opacity="0.25" />
                                                    <stop offset="1" stop-color="white" stop-opacity="0" />
                                                </radialGradient>
                                            </defs>
                                        </svg>
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Manufacturer Detail Drawer */}
            <ManufacturerDetailDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                service={service}
                manufacturer={selectedManufacturer}
            />

            {/* Filter Drawer */}
            <FilterDrawer
                open={filterDrawerOpen}
                onOpenChange={setFilterDrawerOpen}
                onFilterChange={handleFilterChange}
                currentFilters={filters}
            />
        </div>
    )
}

export default FactorySelection
