
import * as React from "react"
import { 
  Accordion as ChakraAccordion,
  AccordionItem as ChakraAccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box
} from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const Accordion = ChakraAccordion

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; className?: string }
>(({ className, ...props }, ref) => (
  <ChakraAccordionItem
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <AccordionButton
    ref={ref}
    className={cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
      className
    )}
    {...props}
  >
    <Box flex="1" textAlign="left">
      {children}
    </Box>
    <AccordionIcon />
  </AccordionButton>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <AccordionPanel
    ref={ref}
    className={cn("pb-4 pt-0", className)}
    {...props}
  >
    {children}
  </AccordionPanel>
))
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
