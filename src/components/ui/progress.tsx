
import { ProgressRoot, ProgressValueText } from "@chakra-ui/react"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  indicatorClassName?: string
  className?: string
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, indicatorClassName, ...props }, ref) => (
    <ProgressRoot
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      value={value || 0}
      {...props}
    />
  )
)
Progress.displayName = "Progress"
