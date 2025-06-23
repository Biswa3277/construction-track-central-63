
import * as React from "react"
import { Switch as ChakraSwitch } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const SwitchComponent = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { 
    className?: string
    onCheckedChange?: (checked: boolean) => void
    checked?: boolean
  }
>(({ className, onCheckedChange, checked, onChange, ...props }, ref) => (
  <ChakraSwitch
    ref={ref}
    className={cn(
      "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    isChecked={checked}
    onChange={(e) => {
      onCheckedChange?.(e.target.checked)
      onChange?.(e)
    }}
    size="md"
    {...props}
  />
))
SwitchComponent.displayName = "Switch"

export { SwitchComponent as Switch }
