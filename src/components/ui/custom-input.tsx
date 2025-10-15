import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { Input } from "./input"

interface CustomInputProps extends React.ComponentProps<"input"> {
  label?: string
  id?: string
  error?: string
  multiline?: boolean
  rows?: number
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, label, id, error, multiline, rows = 3, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const inputId = id || React.useId()

    const inputClasses = cn(
      // Remove default shadcn styles and apply custom styles
      "w-full px-4 py-4 text-base font-normal leading-6 tracking-[0.15px]",
      "rounded-[14px] border-[1.8px] bg-transparent transition-colors duration-200",
      "focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
      // Default state
      "border-border-primary text-current",
      // Focused state
      "focus-visible:border-brand-primary",
      // Error state
      error && "border-red-500",
      multiline ? "min-h-[80px] resize-none" : "h-[52px]",
      className
    )

    return (
      <div className="w-full">
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              "block mb-2 text-base font-normal leading-6 tracking-[0.15px] transition-colors duration-200",
              isFocused ? "text-brand-primary" : "text-text-tertiary"
            )}
          >
            {label}
          </Label>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            rows={rows}
            className={inputClasses}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e as any)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e as any)
            }}
            {...(props as any)}
          />
        ) : (
          <Input
            ref={ref}
            id={inputId}
            className={inputClasses}
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
        )}

      </div>
    )
  }
)

CustomInput.displayName = "CustomInput"

export { CustomInput }