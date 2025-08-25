import { cva } from "class-variance-authority"

export const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 active:ring-2 active:ring-primary/50 data-[loading=true]:loading-background data-[loading=true]:pointer-events-none font-plus-jakarta-sans font-extrabold text-base leading-[22px] tracking-[0%]",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] text-white hover:bg-[rgba(255,255,255,0.04)] [box-shadow:0px_1px_0px_0px_rgba(255,255,255,0.08)_inset]",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-14 w-full px-6 py-4 gap-2 rounded-[48px]",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
                secondary: "min-h-10 w-[266px] px-6 py-2 rounded-[100px]",
            },
            shadow: {
                none: "",
                sm: "[box-shadow:0px_4px_64px_0px_rgba(252,232,3,0.32)]",
                lg: "[box-shadow:0px_4px_128px_0px_rgba(252,232,3,0.32)]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            shadow: "none",
        },
    }
)
