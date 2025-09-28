import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface MultiSelectOption {
    id: number | string
    label: string
    value?: string
}

interface MultiSelectComboboxProps {
    options: MultiSelectOption[]
    value: (number | string)[]
    onChange: (value: (number | string)[]) => void
    placeholder?: string
    emptyText?: string
    loadingText?: string
    isLoading?: boolean
    className?: string
    disabled?: boolean
    error?: string
    maxDisplayCount?: number
}

export const MultiSelectCombobox = React.forwardRef<
    HTMLDivElement,
    MultiSelectComboboxProps
>(({
    options,
    value,
    onChange,
    placeholder = "Select options...",
    emptyText = "No options available",
    loadingText = "Loading...",
    isLoading = false,
    className,
    disabled = false,
    error,
    maxDisplayCount = 3,
    ...props
}, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Filter options based on search term
    const filteredOptions = React.useMemo(() => {
        if (!searchTerm) return options
        return options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [options, searchTerm])

    // Get selected options for display
    const selectedOptions = React.useMemo(() => {
        return options.filter(option => value.includes(option.id))
    }, [options, value])

    // Handle option selection
    const handleOptionToggle = (optionId: number | string) => {
        const newValue = value.includes(optionId)
            ? value.filter(id => id !== optionId)
            : [...value, optionId]
        onChange(newValue)
    }

    // Handle removing a selected option
    const handleRemoveOption = (optionId: number | string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onChange(value.filter(id => id !== optionId))
    }

    // Handle clear all
    const handleClearAll = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onChange([])
    }

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])


    return (
        <div ref={ref} className={cn("relative w-full", className)} {...props}>
            {/* Trigger */}
            <div
                className={cn(
                    "flex h-[52px] min-h-[48px] w-full items-center justify-between rounded-[14px] border-[1.8px] bg-transparent px-4 py-2 text-white cursor-pointer transition-colors duration-200",
                    // Default state
                    "border-[rgba(255,255,255,0.58)]",
                    // Focused state
                    isOpen && "border-[rgb(252,232,3)]",
                    // Error state
                    error && "border-red-500",
                    // Disabled state
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="flex-1 flex items-center gap-2 min-w-0">
                    {selectedOptions.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                            {selectedOptions.slice(0, maxDisplayCount).map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center gap-1 bg-[rgb(252,232,3)] text-black px-2 py-1 rounded-md text-xs font-medium"
                                >
                                    <span className="truncate max-w-[100px]">{option.label}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemoveOption(option.id, e)}
                                        className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {selectedOptions.length > maxDisplayCount && (
                                <span className="text-white/60 text-sm">
                                    +{selectedOptions.length - maxDisplayCount} more
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-gray-400 truncate">{placeholder}</span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {selectedOptions.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="text-white/60 hover:text-white transition-colors p-1"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 opacity-50 transition-transform duration-200",
                            isOpen && "rotate-180"
                        )}
                    />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={cn(
                        "absolute z-50 w-full mt-1 overflow-hidden rounded-[12px] border bg-[rgba(24,27,32,1)] border-gray-700 text-white shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
                    )}
                >
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-700">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search options..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-0 outline-none text-white placeholder:text-gray-400 text-sm"
                        />
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-3 text-center text-white/60 text-sm">
                                {loadingText}
                            </div>
                        ) : filteredOptions.length === 0 ? (
                            <div className="p-3 text-center text-white/60 text-sm">
                                {emptyText}
                            </div>
                        ) : (
                            filteredOptions.map((option) => {
                                const isSelected = value.includes(option.id)
                                return (
                                    <div
                                        key={option.id}
                                        className={cn(
                                            "relative flex w-full cursor-pointer select-none items-center py-2 pl-3 pr-8 text-sm hover:bg-gray-700 transition-colors",
                                            isSelected && "bg-gray-700/50"
                                        )}
                                        onClick={() => handleOptionToggle(option.id)}
                                    >
                                        <span className="flex-1">{option.label}</span>
                                        {isSelected && (
                                            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                                <Check className="h-4 w-4 text-[rgb(252,232,3)]" />
                                            </span>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* Footer with selection count */}
                    {selectedOptions.length > 0 && (
                        <div className="p-2 border-t border-gray-700 bg-gray-800/50">
                            <div className="flex items-center justify-between text-xs text-white/60">
                                <span>{selectedOptions.length} selected</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                    className="h-6 px-2 text-xs text-white/60 hover:text-white"
                                >
                                    Clear all
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
})

MultiSelectCombobox.displayName = "MultiSelectCombobox"
