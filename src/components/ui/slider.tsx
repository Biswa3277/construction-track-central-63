
import * as React from "react"
import { Slider as ChakraSlider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react"
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
>(({ className, value, onValueChange, ...props }, ref) => (
  <ChakraSlider
    ref={ref}
    value={value}
    onValueChange={onValueChange}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderTrack className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderFilledTrack className="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </ChakraSlider>
))
Slider.displayName = "Slider"

export { Slider }
