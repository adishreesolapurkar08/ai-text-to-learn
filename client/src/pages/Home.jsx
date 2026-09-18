import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import PromptForm from '../components/PromptForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useApi } from '../hooks/useApi';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { get } = useApi();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await get('/api/courses');
      setCourses(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <VStack align="stretch" gap={8}>
      <Box>
        <Heading size="xl" mb={2}>
          Welcome to Text-to-Learn
        </Heading>
        <Text color="gray.600">
          Transform any topic into a structured, multi-module online course powered by AI.
        </Text>
      </Box>

      <Box bg="white" p={6} borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.100">
        <PromptForm onCourseCreated={fetchCourses} />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Your Courses
        </Heading>
        {loading && <LoadingSpinner message="Loading your courses..." />}
        <ErrorMessage message={error} />
        {!loading && !error && courses.length === 0 && (
          <Text color="gray.500">No courses yet. Generate your first course above!</Text>
        )}
        {!loading && courses.length > 0 && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {courses.map((course) => (
              <RouterLink key={course._id} to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
                <Card.Root
                  h="full"
                  _hover={{ shadow: 'md', borderColor: 'blue.200' }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  <Card.Body>
                    <Heading size="sm" mb={2}>
                      {course.title}
                    </Heading>
                    <Text fontSize="sm" color="gray.600" mb={3} lineClamp={2}>
                      {course.description}
                    </Text>
                    <HStack gap={2} flexWrap="wrap">
                      {course.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} colorPalette="blue" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </HStack>
                  </Card.Body>
                </Card.Root>
              </RouterLink>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </VStack>
  );
}
