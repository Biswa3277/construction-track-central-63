
import { ChakraProvider as BaseChakraProvider } from "@chakra-ui/react"
import { system } from "./theme"

interface ChakraProviderProps {
  children: React.ReactNode
}

export const ChakraProvider = ({ children }: ChakraProviderProps) => {
  return <BaseChakraProvider value={system}>{children}</BaseChakraProvider>
}
