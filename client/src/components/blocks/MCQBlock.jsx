import { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Button,
  Badge,
} from '@chakra-ui/react';

export default function MCQBlock({ question, options, answer, explanation }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  const isCorrect = selected === answer;

  return (
    <Box
      mb={4}
      p={4}
      border="1px solid"
      borderColor={answered ? (isCorrect ? 'green.200' : 'red.200') : 'gray.200'}
      borderRadius="md"
      bg={answered ? (isCorrect ? 'green.50' : 'red.50') : 'white'}
    >
      <Badge mb={2} colorPalette="purple">
        Quiz
      </Badge>
      <Text fontWeight="semibold" mb={3}>
        {question}
      </Text>
      <VStack align="stretch" gap={2}>
        {options.map((option, index) => {
          let variant = 'outline';
          if (answered) {
            if (index === answer) variant = 'solid';
            else if (index === selected) variant = 'subtle';
          }

          return (
            <Button
              key={index}
              variant={variant}
              colorPalette={
                answered && index === answer
                  ? 'green'
                  : answered && index === selected
                    ? 'red'
                    : 'gray'
              }
              justifyContent="flex-start"
              onClick={() => !answered && setSelected(index)}
              disabled={answered}
              size="sm"
            >
              {option}
            </Button>
          );
        })}
      </VStack>
      {answered && (
        <Box mt={3} p={3} bg="white" borderRadius="md">
          <Text fontSize="sm" fontWeight="medium" color={isCorrect ? 'green.600' : 'red.600'}>
            {isCorrect ? 'Correct!' : 'Not quite.'}
          </Text>
          <Text fontSize="sm" color="gray.700" mt={1}>
            {explanation}
          </Text>
        </Box>
      )}
    </Box>
  );
}
