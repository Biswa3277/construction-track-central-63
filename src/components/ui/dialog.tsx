
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { forwardRef, createContext, useContext } from "react"

interface DialogContextType {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

const DialogContext = createContext<DialogContextType | null>(null)

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export const Dialog = ({ open = false, onOpenChange, children }: DialogProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: open })
  
  const handleClose = () => {
    onClose()
    onOpenChange?.(false)
  }

  const handleOpen = () => {
    onOpen()
    onOpenChange?.(true)
  }

  return (
    <DialogContext.Provider value={{ isOpen: open || isOpen, onClose: handleClose, onOpen: handleOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export const DialogTrigger = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const DialogContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, children, ...props }, ref) => {
  const context = useContext(DialogContext)
  
  return (
    <Modal isOpen={context?.isOpen || false} onClose={context?.onClose || (() => {})}>
      <ModalOverlay />
      <ModalContent
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <ModalCloseButton>
          <X className="h-4 w-4" />
        </ModalCloseButton>
      </ModalContent>
    </Modal>
  )
})
DialogContent.displayName = "DialogContent"

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <ModalHeader
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <ModalFooter
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"
