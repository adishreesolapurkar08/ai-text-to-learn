import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

export function AppProvider({ children }) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}
