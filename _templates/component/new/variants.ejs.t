---
to: "<%= withVariants ? `src/components/ui/${name}-variants.ts` : null %>"
---
import { cva } from "class-variance-authority"

export const <%= h.changeCase.camelCase(name) %>Variants = cva(
  // Base styles
  "",
  {
    variants: {
      variant: {
        default: "",
        // Add more variants here
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
