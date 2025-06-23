
import { 
  Select as ChakraSelect,
  option as ChakraOption
} from "@chakra-ui/react"
import { cn } from "@/lib/utils"
import { forwardRef, createContext, useContext } from "react"

interface SelectContextType {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}

const SelectContext = createContext<SelectContextType>({})

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export const Select = ({ value, defaultValue, onValueChange, children }: SelectProps) => {
  const currentValue = value || defaultValue
  
  return (
    <SelectContext.Provider value={{ value: currentValue, onValueChange }}>
      <ChakraSelect 
        value={currentValue} 
        onChange={(e) => onValueChange?.(e.target.value)}
      >
        {children}
      </ChakraSelect>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }
>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
    </div>
  )
})
SelectTrigger.displayName = "SelectTrigger"

export const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <span>{placeholder}</span>
)

export const SelectContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
SelectContent.displayName = "SelectContent"

export const SelectItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; className?: string }
>(({ className, children, value, ...props }, ref) => (
  <option
    ref={ref}
    value={value}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
  </option>
))
SelectItem.displayName = "SelectItem"
