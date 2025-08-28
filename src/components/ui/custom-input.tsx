import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { Input } from "./input"

interface CustomInputProps extends React.ComponentProps<"input"> {
  label?: string
  id?: string
  error?: string
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, label, id, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const inputId = id || React.useId()

    return (
      <div className="w-full">
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              "block mb-2 text-base font-normal leading-6 tracking-[0.15px] transition-colors duration-200",
              isFocused ? "text-[rgb(252,232,3)]" : "text-[#9FA0A1]"
            )}
          >
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            // Remove default shadcn styles and apply custom styles
            "w-full h-[52px] px-4 py-4 text-base font-normal leading-6 tracking-[0.15px]",
            "rounded-[14px] border-[1.8px] bg-transparent transition-colors duration-200",
            "focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
            // Default state
            "border-[rgba(255,255,255,0.58)] text-current",
            // Focused state
            "focus-visible:border-[rgb(252,232,3)]",
            // Error state
            error && "border-red-500",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />

      </div>
    )
  }
)

CustomInput.displayName = "CustomInput"

export { CustomInput }