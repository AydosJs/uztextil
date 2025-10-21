import { useState, useEffect } from "react"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox"
import type { MultiSelectOption } from "@/components/ui/multi-select-combobox"
import { Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useApiV1SegmentListList } from "@/lib/api"

interface FilterDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onFilterChange: (filters: FilterOptions) => void
    currentFilters: FilterOptions
}

interface FilterOptions {
    search: string
    product_segment: number[]
    min_order_quantity: string
}

export function FilterDrawer({
    open,
    onOpenChange,
    onFilterChange,
    currentFilters
}: FilterDrawerProps) {
    const { t } = useTranslation()
    const [filters, setFilters] = useState<FilterOptions>(currentFilters)

    // Fetch segments list
    const { data: segmentsData, isLoading: segmentsLoading } = useApiV1SegmentListList()

    // Transform segments data for MultiSelectCombobox
    const segmentOptions: MultiSelectOption[] = segmentsData?.map(segment => ({
        id: segment.id || 0,
        label: segment.title || '',
        value: segment.id?.toString() || '0'
    })) || []

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
            product_segment: [],
            min_order_quantity: ''
        }
        setFilters(resetFilters)
        onFilterChange(resetFilters)
        onOpenChange(false)
    }

    // Check if there are any active filters
    const hasActiveFilters = filters.search || filters.product_segment.length > 0 || filters.min_order_quantity

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

    const handleSegmentChange = (selectedIds: (number | string)[]) => {
        const numberIds = selectedIds.map(id => typeof id === 'string' ? parseInt(id) : id)
        setFilters(prev => ({ ...prev, product_segment: numberIds }))
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
            <DrawerContent className="h-auto min-h-[88vh]  max-h-[94vh] flex flex-col">
                <DrawerHeader className="border-none">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <DrawerTitle className="text-white text-2xl">{t('app.filterDrawer.title')}</DrawerTitle>
                        </div>
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10"
                        >
                            <X className="size-6" />
                        </Button>
                    </div>
                </DrawerHeader>

                <div className="px-4 space-y-6 overflow-y-auto flex-1">
                    {/* Search Input */}
                    <CustomInput
                        label={t('app.filterDrawer.search.label')}
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder={t('app.filterDrawer.search.placeholder')}
                    />

                    {/* Product Segment */}
                    <div className="space-y-2">
                        <label className="block text-base font-normal leading-6 tracking-[0.15px] text-text-tertiary">
                            {t('app.filterDrawer.productSegment.label')}
                        </label>
                        <MultiSelectCombobox
                            options={segmentOptions}
                            value={filters.product_segment}
                            onChange={handleSegmentChange}
                            placeholder={t('app.filterDrawer.productSegment.placeholder')}
                            emptyText={t('app.common.noSegmentsAvailable')}
                            loadingText={t('app.common.loading')}
                            isLoading={segmentsLoading}
                        />
                    </div>

                    <CustomInput
                        label={t('app.filterDrawer.minOrderQuantity.label')}
                        type="number"
                        inputMode="numeric"
                        value={filters.min_order_quantity}
                        onChange={(e) => handleFilterChange('min_order_quantity', e.target.value)}
                        placeholder={t('app.filterDrawer.minOrderQuantity.placeholder')}
                    />

                    <div className="flex flex-col gap-2 safe-area-pb">
                        {hasActiveFilters && (
                            <Button
                                onClick={resetFilters}
                                variant="outline"
                                className="flex-1 bg-transparent border-border-primary text-white hover:bg-white/10"
                            >
                                {t('app.filterDrawer.buttons.reset')}
                            </Button>
                        )}
                        <Button
                            onClick={applyFilters}
                            className="flex-1 bg-brand-primary text-black hover:bg-brand-primary/90 font-semibold flex items-center justify-center gap-2"
                        >
                            <Search className="size-5" />
                            {t('app.filterDrawer.buttons.search')}
                        </Button>
                    </div>
                </div>

            </DrawerContent>
        </Drawer>
    )
}
