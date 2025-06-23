
import * as React from "react"
import { RadioGroup } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const RadioGroupComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    onValueChange?: (value: string) => void
    className?: string
  }
>(({ className, value, onValueChange, ...props }, ref) => {
  return (
    <RadioGroup.Root
      ref={ref}
      value={value}
      onValueChange={onValueChange}
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
})
RadioGroupComponent.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    value: string
    className?: string
  }
>(({ className, value, ...props }, ref) => {
  return (
    <RadioGroup.Item
      ref={ref}
      value={value}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroup.ItemIndicator />
    </RadioGroup.Item>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroupComponent as RadioGroup, RadioGroupItem }
