import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Text,
  Button,
  HStack,
  Avatar,
  IconButton,
  Drawer,
  Portal,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function NavContent({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path) => {
    navigate(path);
    onNavigate?.();
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
    onNavigate?.();
  };

  return (
    <VStack align="stretch" gap={6} h="full">
      <Box>
        <Text fontSize="xl" fontWeight="bold" color="blue.600">
          Text-to-Learn
        </Text>
        <Text fontSize="sm" color="gray.500">
          AI Course Generator
        </Text>
      </Box>

      <VStack align="stretch" gap={1}>
        <Button
          variant={isActive('/') ? 'solid' : 'ghost'}
          colorPalette="blue"
          justifyContent="flex-start"
          onClick={() => go('/')}
        >
          Home
        </Button>
      </VStack>

      <Box mt="auto">
        <HStack gap={3} mb={3}>
          <Avatar.Root size="sm">
            <Avatar.Fallback name={user?.name || user?.email} />
          </Avatar.Root>
          <Box flex={1} minW={0}>
            <Text fontSize="sm" fontWeight="medium" truncate>
              {user?.name || user?.email || 'User'}
            </Text>
            <Text fontSize="xs" color="gray.500" truncate>
              {user?.email}
            </Text>
          </Box>
        </HStack>
        <Button variant="outline" size="sm" w="full" onClick={handleLogout}>
          Log Out
        </Button>
      </Box>
    </VStack>
  );
}

export default function SidebarNavigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Box
        display={{ base: 'none', md: 'block' }}
        w="260px"
        minH="100vh"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        p={6}
        position="sticky"
        top={0}
      >
        <NavContent />
      </Box>

      <Flex
        display={{ base: 'flex', md: 'none' }}
        position="sticky"
        top={0}
        zIndex={10}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={4}
        py={3}
        align="center"
        justify="space-between"
      >
        <Text fontWeight="bold" color="blue.600">
          Text-to-Learn
        </Text>
        <Drawer.Root open={drawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)}>
          <Drawer.Trigger asChild>
            <IconButton variant="outline" aria-label="Open menu" size="sm">
              ☰
            </IconButton>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Menu</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <NavContent onNavigate={() => setDrawerOpen(false)} />
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Flex>
    </>
  );
}
