import { Center, Spinner, Text, VStack } from '@chakra-ui/react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Center py={12}>
      <VStack gap={4}>
        <Spinner size="xl" colorPalette="blue" />
        <Text color="gray.600">{message}</Text>
      </VStack>
    </Center>
  );
}
