
import * as React from "react"
import { Avatar as ChakraAvatarRoot, AvatarImage as ChakraAvatarImage, AvatarFallback as ChakraAvatarFallback } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    className?: string
    src?: string
    name?: string
  }
>(({ className, src, name, ...props }, ref) => (
  <ChakraAvatarRoot
    ref={ref}
    src={src}
    name={name}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <ChakraAvatarImage
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
  <ChakraAvatarFallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
