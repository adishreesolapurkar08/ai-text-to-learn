import { Alert } from '@chakra-ui/react';

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <Alert.Root status="error" borderRadius="md">
      <Alert.Indicator />
      <Alert.Title>{message}</Alert.Title>
    </Alert.Root>
  );
}
