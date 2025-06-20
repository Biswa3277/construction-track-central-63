
import { Box, BoxProps } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

interface CardProps extends BoxProps {
  children: React.ReactNode
}

export const Card = ({ className, children, ...props }: CardProps) => (
  <Box
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  >
    {children}
  </Box>
)

export const CardHeader = ({ className, children, ...props }: CardProps) => (
  <Box
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  >
    {children}
  </Box>
)

export const CardTitle = ({ className, children, ...props }: CardProps) => (
  <Box
    as="h3"
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </Box>
)

export const CardDescription = ({ className, children, ...props }: CardProps) => (
  <Box
    as="p"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </Box>
)

export const CardContent = ({ className, children, ...props }: CardProps) => (
  <Box className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </Box>
)

export const CardFooter = ({ className, children, ...props }: CardProps) => (
  <Box
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  >
    {children}
  </Box>
)
