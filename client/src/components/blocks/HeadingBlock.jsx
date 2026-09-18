import { Heading } from '@chakra-ui/react';

export default function HeadingBlock({ text }) {
  return (
    <Heading as="h2" size="lg" mt={6} mb={3}>
      {text}
    </Heading>
  );
}
