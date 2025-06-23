
import * as React from "react"
import { Tooltip } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const TooltipProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

const TooltipComponent = ({ children, ...props }: { children: React.ReactNode } & any) => (
  <Tooltip.Root {...props}>
    {children}
  </Tooltip.Root>
)

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <Tooltip.Trigger ref={ref} {...props}>
    {children}
  </Tooltip.Trigger>
))
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    sideOffset?: number
    className?: string
  }
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Tooltip.Positioner>
    <Tooltip.Content
      ref={ref}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </Tooltip.Positioner>
))
TooltipContent.displayName = "TooltipContent"

export { TooltipComponent as Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
