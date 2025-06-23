
import * as React from "react"
import {
  Tooltip as ChakraTooltip,
  Portal
} from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const HoverCard = ({ children }: { children: React.ReactNode }) => (
  <ChakraTooltip>
    {children}
  </ChakraTooltip>
)

const HoverCardTrigger = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "center" | "end"
    sideOffset?: number
    className?: string
  }
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = "HoverCardContent"

export { HoverCard, HoverCardTrigger, HoverCardContent }
