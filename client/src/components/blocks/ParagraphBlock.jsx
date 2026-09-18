import { Text } from '@chakra-ui/react';

export default function ParagraphBlock({ text }) {
  return (
    <Text fontSize="md" lineHeight="tall" mb={4} color="gray.700">
      {text}
    </Text>
  );
}
