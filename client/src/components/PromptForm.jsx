import { useState } from 'react';
import {
  Box,
  Button,
  Textarea,
  VStack,
  Text,
  Heading,
} from '@chakra-ui/react';
import { toaster } from './ui/toaster';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function PromptForm({ onCourseCreated }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { post } = useApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;

    setLoading(true);
    setError('');

    try {
      const course = await post('/api/generate-course', { topic: topic.trim() });
      setTopic('');
      toaster.success({
        title: 'Course generated!',
        description: `"${course.title}" is ready to explore.`,
      });
      onCourseCreated?.();
      navigate(`/courses/${course._id}`);
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || 'Failed to generate course';
      setError(msg);
      toaster.error({ title: 'Generation failed', description: msg });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Generating your course outline... This may take 30-60 seconds." />;
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack align="stretch" gap={4}>
        <Heading size="md">Create a New Course</Heading>
        <Text color="gray.600">
          Enter any topic and AI will build a structured course with modules and lessons.
        </Text>
        <Textarea
          placeholder='e.g. "Intro to React Hooks", "Basics of Copyright Law"'
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
          resize="vertical"
        />
        <ErrorMessage message={error} />
        <Button
          type="submit"
          colorPalette="blue"
          alignSelf="flex-start"
          disabled={!topic.trim()}
        >
          Generate Course
        </Button>
      </VStack>
    </Box>
  );
}
