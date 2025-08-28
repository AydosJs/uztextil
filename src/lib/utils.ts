import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
import { CircleCheck, XCircle, AlertTriangle, Info } from "lucide-react"
import React from "react"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const showToast = {
    success: (message: string) => toast.success(message, {
        position: 'top-center',
        icon: React.createElement(CircleCheck, { className: "text-black mr-3!" }),
        style: {
            background: '#33D90E',
            color: '#000000',
            border: '1px solid #24850F',
            borderRadius: '8px',
        },
    }),
    error: (message: string) => toast.error(message, {
        position: 'top-center',
        icon: React.createElement(XCircle, { className: "text-black mr-3" }),
        style: {
            background: '#ef4444',
            color: '#000000',
            border: '1px solid #dc2626',
            borderRadius: '8px',
        },
    }),
    warning: (message: string) => toast.warning(message, {
        position: 'top-center',
        icon: React.createElement(AlertTriangle, { className: "text-black mr-3" }),
        style: {
            background: '#f59e0b',
            color: '#000000',
            border: '1px solid #d97706',
            borderRadius: '8px',
        },
    }),
    info: (message: string) => toast.info(message, {
        position: 'top-center',
        icon: React.createElement(Info, { className: "text-black mr-3" }),
        style: {
            background: '#3b82f6',
            color: '#000000',
            border: '1px solid #2563eb',
            borderRadius: '8px',
        },
    }),
}
