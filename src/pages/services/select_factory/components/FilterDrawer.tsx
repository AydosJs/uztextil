import { useState, useEffect } from "react"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { Search } from "lucide-react"

interface FilterDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onFilterChange: (filters: FilterOptions) => void
    currentFilters: FilterOptions
}

interface FilterOptions {
    search: string
    product_segment: string
    min_order_quantity: string
}

export function FilterDrawer({
    open,
    onOpenChange,
    onFilterChange,
    currentFilters
}: FilterDrawerProps) {
    const [filters, setFilters] = useState<FilterOptions>(currentFilters)

    // Update local state when currentFilters change
    useEffect(() => {
        setFilters(currentFilters)
    }, [currentFilters])

    const applyFilters = () => {
        // Pass the filter values to the parent component
        // The actual filtering will be handled by the API call with these parameters
        onFilterChange(filters)
        onOpenChange(false)
    }

    const resetFilters = () => {
        const resetFilters = {
            search: '',
            product_segment: '',
            min_order_quantity: ''
        }
        setFilters(resetFilters)
        onFilterChange(resetFilters)
        onOpenChange(false)
    }

    const handleFilterChange = (key: keyof FilterOptions, value: string) => {
        // For min_order_quantity, only allow numbers
        if (key === 'min_order_quantity') {
            // Remove any non-numeric characters except empty string
            const numericValue = value === '' ? '' : value.replace(/[^0-9]/g, '')
            setFilters(prev => ({ ...prev, [key]: numericValue }))
        } else {
            setFilters(prev => ({ ...prev, [key]: value }))
        }
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
            <DrawerContent className="min-h-[90vh] max-h-[96vh] flex flex-col">
                <DrawerHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <DrawerTitle className="text-white text-2xl">Fabrika tanlash</DrawerTitle>
                        </div>
                    </div>
                </DrawerHeader>

                <div className="px-4 space-y-6 overflow-y-auto flex-1">
                    {/* Search Input */}
                    <CustomInput
                        label="Qidirish"
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Fabrika nomi, kompaniya yoki lavozim bo'yicha qidiring..."
                    />

                    {/* Product Segment */}
                    <CustomInput
                        label="Mahsulot segmenti"
                        type="text"
                        value={filters.product_segment}
                        onChange={(e) => handleFilterChange('product_segment', e.target.value)}
                        placeholder="Mahsulot segmentini kiriting..."
                    />

                    <CustomInput
                        label="Minimal buyurtma miqdori"
                        type="number"
                        inputMode="numeric"
                        value={filters.min_order_quantity}
                        onChange={(e) => handleFilterChange('min_order_quantity', e.target.value)}
                        placeholder="Minimal buyurtma miqdorini kiriting..."
                    />

                    <div className="flex flex-col gap-2 safe-area-pb">
                        <Button
                            onClick={resetFilters}
                            variant="outline"
                            className="flex-1 bg-transparent border-[#FFFFFF0A] text-white hover:bg-white/10"
                        >
                            Tozalash
                        </Button>
                        <Button
                            onClick={applyFilters}
                            className="flex-1 bg-[#FCE803] text-black hover:bg-[#FCE803]/90 font-semibold flex items-center justify-center gap-2"
                        >
                            <Search className="size-5" />
                            Qidirish
                        </Button>
                    </div>
                </div>

            </DrawerContent>
        </Drawer>
    )
}
