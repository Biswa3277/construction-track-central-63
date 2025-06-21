
import * as React from "react"
import { Slider as ChakraSliderRoot, SliderTrack, SliderThumb, SliderRange } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof ChakraSliderRoot>,
  React.ComponentPropsWithoutRef<typeof ChakraSliderRoot> & {
    value?: number[]
    onValueChange?: (value: number[]) => void
    max?: number
    min?: number
    step?: number
    className?: string
  }
>(({ className, value, onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => (
  <ChakraSliderRoot
    ref={ref}
    value={value || [0]}
    onValueChange={(e) => onValueChange?.(e.value)}
    max={max}
    min={min}
    step={step}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderTrack className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderRange className="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb 
      index={0}
      className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" 
    />
  </ChakraSliderRoot>
))
Slider.displayName = "Slider"

export { Slider }
