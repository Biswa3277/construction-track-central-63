
import * as React from "react"
import { Checkbox as ChakraCheckboxRoot, CheckboxControl, CheckboxIndicator } from "@chakra-ui/react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof ChakraCheckboxRoot>,
  React.ComponentPropsWithoutRef<typeof ChakraCheckboxRoot> & { 
    className?: string
    onCheckedChange?: (checked: boolean) => void
  }
>(({ className, onCheckedChange, ...props }, ref) => (
  <ChakraCheckboxRoot
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    onCheckedChange={(e) => onCheckedChange?.(e.checked)}
    {...props}
  >
    <CheckboxControl />
    <CheckboxIndicator>
      <Check className="h-4 w-4" />
    </CheckboxIndicator>
  </ChakraCheckboxRoot>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
