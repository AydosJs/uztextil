import { useState } from "react"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"
import type { ManufacturerList } from "@/lib/api/model"

interface FilterDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    manufacturers: ManufacturerList[]
    onFilterChange: (filteredManufacturers: ManufacturerList[]) => void
}

interface FilterOptions {
    searchTerm: string
    sortBy: 'name' | 'company' | 'position'
    sortOrder: 'asc' | 'desc'
}

export function FilterDrawer({
    open,
    onOpenChange,
    manufacturers,
    onFilterChange
}: FilterDrawerProps) {
    const [filters, setFilters] = useState<FilterOptions>({
        searchTerm: '',
        sortBy: 'name',
        sortOrder: 'asc'
    })

    const applyFilters = () => {
        let filtered = [...manufacturers]

        // Apply search filter
        if (filters.searchTerm.trim()) {
            const searchLower = filters.searchTerm.toLowerCase()
            filtered = filtered.filter(manufacturer =>
                manufacturer.full_name.toLowerCase().includes(searchLower) ||
                manufacturer.company_name.toLowerCase().includes(searchLower) ||
                manufacturer.position.toLowerCase().includes(searchLower)
            )
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = ''
            let bValue = ''

            switch (filters.sortBy) {
                case 'name':
                    aValue = a.full_name
                    bValue = b.full_name
                    break
                case 'company':
                    aValue = a.company_name
                    bValue = b.company_name
                    break
                case 'position':
                    aValue = a.position
                    bValue = b.position
                    break
            }

            if (filters.sortOrder === 'asc') {
                return aValue.localeCompare(bValue)
            } else {
                return bValue.localeCompare(aValue)
            }
        })

        onFilterChange(filtered)
        onOpenChange(false)
    }

    const resetFilters = () => {
        setFilters({
            searchTerm: '',
            sortBy: 'name',
            sortOrder: 'asc'
        })
        onFilterChange(manufacturers)
        onOpenChange(false)
    }

    const handleFilterChange = (key: keyof FilterOptions, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
            <DrawerContent className="max-h-[80vh]">
                <DrawerHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-white" />
                            <DrawerTitle>Filter va tartiblash</DrawerTitle>
                        </div>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="sm" className="p-2">
                                <X className="w-4 h-4" />
                            </Button>
                        </DrawerClose>
                    </div>
                    <DrawerDescription>
                        Fabrikalarni qidirish va tartiblash imkoniyatlari
                    </DrawerDescription>
                </DrawerHeader>

                <div className="px-4 space-y-6">
                    {/* Search Input */}
                    <div className="space-y-2">
                        <label className="text-white font-medium text-sm">
                            Qidirish
                        </label>
                        <input
                            type="text"
                            value={filters.searchTerm}
                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                            placeholder="Fabrika nomi, kompaniya yoki lavozim bo'yicha qidiring..."
                            className="w-full px-3 py-2 bg-[#FFFFFF05] border border-[#FFFFFF0A] rounded-lg text-white placeholder-[#ACADAF] focus:outline-none focus:ring-2 focus:ring-[#FCE803] focus:border-transparent"
                        />
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                        <label className="text-white font-medium text-sm">
                            Tartiblash
                        </label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])}
                            className="w-full px-3 py-2 bg-[#FFFFFF05] border border-[#FFFFFF0A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FCE803] focus:border-transparent"
                        >
                            <option value="name">Ism bo'yicha</option>
                            <option value="company">Kompaniya bo'yicha</option>
                            <option value="position">Lavozim bo'yicha</option>
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div className="space-y-2">
                        <label className="text-white font-medium text-sm">
                            Tartib
                        </label>
                        <select
                            value={filters.sortOrder}
                            onChange={(e) => handleFilterChange('sortOrder', e.target.value as FilterOptions['sortOrder'])}
                            className="w-full px-3 py-2 bg-[#FFFFFF05] border border-[#FFFFFF0A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FCE803] focus:border-transparent"
                        >
                            <option value="asc">O'sish bo'yicha (A-Z)</option>
                            <option value="desc">Kamayish bo'yicha (Z-A)</option>
                        </select>
                    </div>
                </div>

                <DrawerFooter>
                    <div className="flex gap-3">
                        <Button
                            onClick={resetFilters}
                            variant="outline"
                            className="flex-1 bg-transparent border-[#FFFFFF0A] text-white hover:bg-white/10"
                        >
                            Tozalash
                        </Button>
                        <Button
                            onClick={applyFilters}
                            className="flex-1 bg-[#FCE803] text-black hover:bg-[#FCE803]/90 font-semibold"
                        >
                            Qo'llash
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
