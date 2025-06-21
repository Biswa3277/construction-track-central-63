
import * as React from "react"
import { RadioGroup as ChakraRadioGroup, Radio as ChakraRadio } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    onValueChange?: (value: string) => void
    className?: string
  }
>(({ className, value, onValueChange, ...props }, ref) => {
  return (
    <ChakraRadioGroup
      ref={ref}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    value: string
    className?: string
  }
>(({ className, value, ...props }, ref) => {
  return (
    <ChakraRadio
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
