
import * as React from "react"
import { Slider } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const SliderComponent = React.forwardRef<
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
  <Slider.Root
    ref={ref}
    value={value}
    onValueChange={onValueChange}
    max={max}
    min={min}
    step={step}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>
    <Slider.Thumb />
  </Slider.Root>
))
SliderComponent.displayName = "Slider"

export { SliderComponent as Slider }
