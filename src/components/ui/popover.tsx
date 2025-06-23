
import * as React from "react"
import {
  Popover as ChakraPopover,
  PopoverTrigger as ChakraPopoverTrigger,
  PopoverContent as ChakraPopoverContent,
  PopoverArrow,
  PopoverBody
} from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const Popover = ChakraPopover

const PopoverTrigger = ChakraPopoverTrigger

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "center" | "end"
    sideOffset?: number
    className?: string
  }
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <ChakraPopoverContent
    ref={ref}
    className={cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
      className
    )}
    {...props}
  />
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
