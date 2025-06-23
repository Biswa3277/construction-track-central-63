
import * as React from "react"
import { Switch } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const SwitchComponent = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { 
    className?: string
    onCheckedChange?: (checked: boolean) => void
    checked?: boolean
  }
>(({ className, onCheckedChange, checked, ...props }, ref) => (
  <Switch.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    checked={checked}
    onCheckedChange={onCheckedChange}
    {...props}
  >
    <Switch.Thumb />
  </Switch.Root>
))
SwitchComponent.displayName = "Switch"

export { SwitchComponent as Switch }
