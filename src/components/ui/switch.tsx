
import * as React from "react"
import { Switch as ChakraSwitchRoot, SwitchControl, SwitchThumb } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof ChakraSwitchRoot>,
  React.ComponentPropsWithoutRef<typeof ChakraSwitchRoot> & { 
    className?: string
    onCheckedChange?: (checked: boolean) => void
  }
>(({ className, onCheckedChange, ...props }, ref) => (
  <ChakraSwitchRoot
    ref={ref}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    onCheckedChange={(e) => onCheckedChange?.(e.checked)}
    {...props}
  >
    <SwitchControl />
    <SwitchThumb />
  </ChakraSwitchRoot>
))
Switch.displayName = "Switch"

export { Switch }
