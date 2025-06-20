
import { FormLabel, FormLabelProps } from "@chakra-ui/react"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export interface LabelProps extends FormLabelProps {
  className?: string
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <FormLabel
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
)
Label.displayName = "Label"
