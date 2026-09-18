import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Accordion,
  Button,
} from '@chakra-ui/react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useApi } from '../hooks/useApi';

export default function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { get } = useApi();

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await get(`/api/courses/${courseId}`);
        setCourse(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, get]);

  if (loading) return <LoadingSpinner message="Loading course..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!course) return null;

  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Button as={RouterLink} to="/" variant="ghost" size="sm" mb={2}>
          ← Back to Home
        </Button>
        <Heading size="xl" mb={2}>
          {course.title}
        </Heading>
        <Text color="gray.600" mb={3}>
          {course.description}
        </Text>
        <HStack gap={2} flexWrap="wrap">
          {course.tags?.map((tag) => (
            <Badge key={tag} colorPalette="blue">
              {tag}
            </Badge>
          ))}
        </HStack>
      </Box>

      <Accordion.Root multiple defaultValue={['0']}>
        {course.modules?.map((mod, moduleIndex) => (
          <Accordion.Item key={mod._id} value={String(moduleIndex)}>
            <Accordion.ItemTrigger>
              <Box flex={1} textAlign="left">
                <Text fontWeight="semibold">
                  Module {moduleIndex + 1}: {mod.title}
                </Text>
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <VStack align="stretch" gap={2}>
                  {mod.lessons?.map((lesson, lessonIndex) => (
                    <Button
                      key={lesson._id}
                      as={RouterLink}
                      to={`/courses/${courseId}/module/${moduleIndex}/lesson/${lessonIndex}`}
                      variant="outline"
                      justifyContent="space-between"
                      h="auto"
                      py={3}
                    >
                      <Text textAlign="left">
                        {lessonIndex + 1}. {lesson.title}
                      </Text>
                      <Badge colorPalette={lesson.isEnriched ? 'green' : 'orange'}>
                        {lesson.isEnriched ? 'Ready' : 'Pending'}
                      </Badge>
                    </Button>
                  ))}
                </VStack>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </VStack>
  );
}
