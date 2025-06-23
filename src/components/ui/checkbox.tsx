
import * as React from "react"
import { Checkbox as ChakraCheckbox } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const CheckboxComponent = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { 
    className?: string
    onCheckedChange?: (checked: boolean) => void
    checked?: boolean
  }
>(({ className, onCheckedChange, checked, ...props }, ref) => (
  <ChakraCheckbox
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    isChecked={checked}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    {...props}
  />
))
CheckboxComponent.displayName = "Checkbox"

export { CheckboxComponent as Checkbox }
