import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import SidebarNavigation from './components/SidebarNavigation';

export default function App() {
  return (
    <Flex minH="100vh" bg="gray.50" direction={{ base: 'column', md: 'row' }}>
      <SidebarNavigation />
      <Box flex={1} p={{ base: 4, md: 8 }} maxW="900px" w="full">
        <Outlet />
      </Box>
    </Flex>
  );
}
