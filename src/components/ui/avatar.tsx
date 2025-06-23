
import * as React from "react"
import { Avatar } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const AvatarComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    className?: string
    src?: string
    name?: string
  }
>(({ className, src, name, children, ...props }, ref) => (
  <Avatar.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  >
    {src && <Avatar.Image src={src} />}
    {name && <Avatar.Fallback>{name.charAt(0)}</Avatar.Fallback>}
    {children}
  </Avatar.Root>
))
AvatarComponent.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <Avatar.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <Avatar.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { AvatarComponent as Avatar, AvatarImage, AvatarFallback }
