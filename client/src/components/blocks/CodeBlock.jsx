import { Box, Text } from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ language, text }) {
  return (
    <Box mb={4} borderRadius="md" overflow="hidden">
      <Box bg="gray.700" px={3} py={1}>
        <Text fontSize="xs" color="gray.300" textTransform="uppercase">
          {language}
        </Text>
      </Box>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{ margin: 0, borderRadius: 0 }}
      >
        {text}
      </SyntaxHighlighter>
    </Box>
  );
}
