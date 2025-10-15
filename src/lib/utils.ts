import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
import { CircleCheck, XCircle, AlertTriangle, Info } from "lucide-react"
import React from "react"
import { getSafeAreaValues } from "@/utils/safeAreaUtils"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const getToastStyle = (baseStyle: React.CSSProperties) => {
    const { top } = getSafeAreaValues()
    const marginTop = top > 0 ? top + 36 : 8 // Add 36px if safe area exists, 8px if not
    return {
        ...baseStyle,
        marginTop: `${marginTop}px`,
    }
}

export const showToast = {
    success: (message: string) => toast.success(message, {
        position: 'top-center',
        icon: React.createElement(CircleCheck, { className: "text-black mr-3!" }),
        style: getToastStyle({
            background: 'var(--color-status-success)',
            color: '#000000',
            border: '1px solid var(--color-status-success)',
            borderRadius: '8px',
        }),
    }),
    error: (message: string) => toast.error(message, {
        position: 'top-center',
        icon: React.createElement(XCircle, { className: "text-black mr-3" }),
        style: getToastStyle({
            background: 'var(--color-status-error)',
            color: '#000000',
            border: '1px solid var(--color-status-error)',
            borderRadius: '8px',
        }),
    }),
    warning: (message: string) => toast.warning(message, {
        position: 'top-center',
        icon: React.createElement(AlertTriangle, { className: "text-black mr-3" }),
        style: getToastStyle({
            background: 'var(--color-status-warning)',
            color: '#000000',
            border: '1px solid var(--color-status-warning)',
            borderRadius: '8px',
        }),
    }),
    info: (message: string) => toast.info(message, {
        position: 'top-center',
        icon: React.createElement(Info, { className: "text-black mr-3" }),
        style: getToastStyle({
            background: 'var(--color-status-info)',
            color: '#000000',
            border: '1px solid var(--color-status-info)',
            borderRadius: '8px',
        }),
    }),
}
