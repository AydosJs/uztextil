---
to: "<%= withVariants ? `src/components/ui/${name}.tsx` : null %>"
---
import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { <%= h.changeCase.camelCase(name) %>Variants } from "./<%= name %>-variants"

export interface <%= h.changeCase.pascalCase(name) %>Props
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof <%= h.changeCase.camelCase(name) %>Variants> {
    children?: React.ReactNode
}

const <%= h.changeCase.pascalCase(name) %> = React.forwardRef<HTMLDivElement, <%= h.changeCase.pascalCase(name) %>Props>(
    ({ className, variant, size, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(<%= h.changeCase.camelCase(name) %>Variants({ variant, size }), className)}
                {...props}
            >
                {children}
            </div>
        )
    }
)
<%= h.changeCase.pascalCase(name) %>.displayName = "<%= h.changeCase.pascalCase(name) %>"

export { <%= h.changeCase.pascalCase(name) %> }
