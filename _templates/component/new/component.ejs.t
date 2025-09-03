---
to: src/components/ui/<%= name %>.tsx
---
import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface <%= h.changeCase.pascalCase(name) %>Props
    extends React.HTMLAttributes<HTMLDivElement> {
    // Add your props here
    children?: React.ReactNode
}

const <%= h.changeCase.pascalCase(name) %> = React.forwardRef<HTMLDivElement, <%= h.changeCase.pascalCase(name) %>Props>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    // Add your default styles here
                    "",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
<%= h.changeCase.pascalCase(name) %>.displayName = "<%= h.changeCase.pascalCase(name) %>"

export { <%= h.changeCase.pascalCase(name) %> }
