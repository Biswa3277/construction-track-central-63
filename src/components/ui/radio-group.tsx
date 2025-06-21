
import * as React from "react"
import { RadioGroup as ChakraRadioGroupRoot, RadioGroupItem as ChakraRadioGroupItem } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof ChakraRadioGroupRoot>,
  React.ComponentPropsWithoutRef<typeof ChakraRadioGroupRoot> & {
    value?: string
    onValueChange?: (value: string) => void
    className?: string
  }
>(({ className, value, onValueChange, ...props }, ref) => {
  return (
    <ChakraRadioGroupRoot
      ref={ref}
      value={value}
      onValueChange={(e) => onValueChange?.(e.value)}
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof ChakraRadioGroupItem>,
  React.ComponentPropsWithoutRef<typeof ChakraRadioGroupItem> & {
    value: string
    className?: string
  }
>(({ className, value, ...props }, ref) => {
  return (
    <ChakraRadioGroupItem
      ref={ref}
      value={value}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
