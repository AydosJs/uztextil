import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox"
import type { MultiSelectOption } from "@/components/ui/multi-select-combobox"
import { Card } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useApiV1SegmentListList } from "@/lib/api"
import { cn } from "@/lib/utils"

interface FilterModalProps {
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

export function FilterModal({
    open,
    onOpenChange,
    onFilterChange,
    currentFilters
}: FilterModalProps) {
    const { t } = useTranslation()
    const [filters, setFilters] = useState<FilterOptions>(currentFilters)

    // Fetch segments list
    const { data: segmentsData, isLoading: segmentsLoading } = useApiV1SegmentListList()

    // Transform segments data for MultiSelectCombobox
    const segmentOptions: MultiSelectOption[] = segmentsData?.results?.map(segment => ({
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

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Modal Content */}
            <Card className={cn(
                "relative w-full max-w-md max-h-[90vh] overflow-hidden",
                "bg-background-primary border-border-primary",
                "animate-in fade-in-0 zoom-in-95 duration-200"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-primary">
                    <h2 className="text-text-primary text-2xl font-semibold">
                        {t('app.filterDrawer.title')}
                    </h2>
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="ghost"
                        size="icon"
                        className="text-text-primary hover:bg-text-primary/10"
                    >
                        <X className="size-6" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
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
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border-primary space-y-2">
                    {hasActiveFilters && (
                        <Button
                            onClick={resetFilters}
                            variant="outline"
                            className="w-full bg-transparent border-border-primary text-text-primary hover:bg-text-primary/10"
                        >
                            {t('app.filterDrawer.buttons.reset')}
                        </Button>
                    )}
                    <Button
                        onClick={applyFilters}
                        className="w-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90 font-semibold flex items-center justify-center gap-2"
                    >
                        <Search className="size-5" />
                        {t('app.filterDrawer.buttons.search')}
                    </Button>
                </div>
            </Card>
        </div>
    )
}
