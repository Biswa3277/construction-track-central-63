
import { FormLabel, FormLabelProps } from "@chakra-ui/react"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export interface LabelProps extends Omit<FormLabelProps, 'children'> {
  className?: string
  children?: React.ReactNode
  htmlFor?: string
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, htmlFor, ...props }, ref) => (
    <FormLabel
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </FormLabel>
  )
)
Label.displayName = "Label"
