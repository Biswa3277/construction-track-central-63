
import * as React from "react"
import { Slider as ChakraSlider } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number[]
    onValueChange?: (value: number[]) => void
    max?: number
    min?: number
    step?: number
    className?: string
  }
>(({ className, value, onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => (
  <ChakraSlider
    ref={ref}
    value={value?.[0] || 0}
    onChange={(e) => onValueChange?.([e.target.value])}
    max={max}
    min={min}
    step={step}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  />
))
Slider.displayName = "Slider"

export { Slider }
