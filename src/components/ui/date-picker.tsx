"use client"

import * as React from "react"
import { format } from "date-fns"
import { ru, uz } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslation } from "react-i18next"

interface DatePickerProps {
    value?: Date
    onChange?: (date: Date | undefined) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    fromYear?: number
    toYear?: number
    disabledDates?: (date: Date) => boolean
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Pick a date",
    disabled = false,
    className,
    fromYear = 1900,
    toYear = 2050,
    disabledDates
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const { i18n } = useTranslation()

    // Get the appropriate locale for date-fns
    const getLocale = () => {
        switch (i18n.language) {
            case 'uz':
                return uz
            case 'ru':
                return ru
            default:
                return ru // Default to Russian
        }
    }

    const locale = getLocale()

    const handleSelect = (date: Date | undefined) => {
        onChange?.(date)
        setOpen(false) // Close popover when date is selected
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!value}
                    className={cn(
                        // Match CustomInput styling
                        "w-full px-4 py-4 h-[52px] text-base font-normal leading-6 tracking-[0.15px]",
                        "rounded-[14px] border-[1.8px] bg-transparent transition-colors duration-200",
                        "focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
                        "justify-start text-left",
                        // Default state
                        "border-[rgba(255,255,255,0.58)] text-white hover:bg-transparent",
                        // Focused state  
                        "focus-visible:border-[rgb(252,232,3)]",
                        // Empty state
                        "data-[empty=true]:text-[#9FA0A1]",
                        className
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP", { locale }) : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[rgba(39,43,50,1)] border-gray-600" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={handleSelect}
                    captionLayout="dropdown"
                    initialFocus
                    locale={locale}
                    fromYear={fromYear}
                    toYear={toYear}
                    disabled={disabledDates}
                    className="bg-[rgba(39,43,50,1)] text-white"
                />
            </PopoverContent>
        </Popover>
    )
}
