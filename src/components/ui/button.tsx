import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button-variants"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, shadow, loading = false, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(
                    buttonVariants({ variant, size, shadow, className }),
                    loading && "loading-background select-none cursor-not-allowed"
                )}
                ref={ref}
                data-loading={loading}
                disabled={loading || props.disabled}
                style={{
                    userSelect: loading ? 'none' : undefined,
                    WebkitUserSelect: loading ? 'none' : undefined,
                    MozUserSelect: loading ? 'none' : undefined,
                    msUserSelect: loading ? 'none' : undefined,
                }}
                {...props}
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <span className="opacity-70">{children}</span>
                    </div>
                ) : (
                    children
                )}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button }
