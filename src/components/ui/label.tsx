
import { Text } from "@chakra-ui/react"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
  children?: React.ReactNode
  htmlFor?: string
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, htmlFor, ...props }, ref) => (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
)
Label.displayName = "Label"
