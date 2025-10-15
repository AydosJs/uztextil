import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "./label"

interface CustomCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  id?: string
}

const CustomCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CustomCheckboxProps
>(({ className, label, id, ...props }, ref) => {
  const checkboxId = id || React.useId()

  return (
    <div className="flex items-center space-x-3">
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          "w-[22px] h-[22px] rounded-[6px] border-2 border-brand-primary bg-transparent",
          "flex items-center justify-center shrink-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary",
          "transition-colors duration-200",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-black")}
        >
          <Check className="h-3 w-3 font-bold stroke-[3]" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <Label
          htmlFor={checkboxId}
          className={cn(
            "text-base font-bold leading-[22px] tracking-[0%] cursor-pointer",
            "select-none"
          )}
        >
          {label}
        </Label>
      )}
    </div>
  )
})

CustomCheckbox.displayName = "CustomCheckbox"

export { CustomCheckbox }