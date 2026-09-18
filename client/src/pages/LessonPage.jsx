import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  List,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { toaster } from '../components/ui/toaster';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import LessonRenderer from '../components/LessonRenderer';
import { useApi } from '../hooks/useApi';

export default function LessonPage() {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const { get, post } = useApi();

  const modIdx = parseInt(moduleIndex, 10);
  const lesIdx = parseInt(lessonIndex, 10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const courseData = await get(`/api/courses/${courseId}`);
        setCourse(courseData);

        const mod = courseData.modules?.[modIdx];
        const lessonMeta = mod?.lessons?.[lesIdx];

        if (!lessonMeta) {
          setError('Lesson not found');
          return;
        }

        const lessonData = await get(`/api/lessons/${lessonMeta._id}`);
        setLesson(lessonData);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, modIdx, lesIdx, get]);

  const handleRegenerate = async () => {
    if (!lesson) return;
    setGenerating(true);
    setError('');
    try {
      const data = await post(`/api/lessons/${lesson._id}/generate`);
      setLesson(data);
      toaster.success({ title: 'Lesson regenerated' });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to regenerate';
      setError(msg);
      toaster.error({ title: 'Regeneration failed', description: msg });
    } finally {
      setGenerating(false);
    }
  };

  if (loading || generating) {
    return (
      <LoadingSpinner
        message={
          generating
            ? 'Regenerating lesson content...'
            : 'Loading lesson... Content may be generated on first visit (30-60s).'
        }
      />
    );
  }

  if (error) return <ErrorMessage message={error} />;
  if (!lesson || !course) return null;

  const mod = course.modules?.[modIdx];

  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Button as={RouterLink} to={`/courses/${courseId}`} variant="ghost" size="sm" mb={2}>
          ← Back to Course
        </Button>
        <Text fontSize="sm" color="gray.500" mb={1}>
          {course.title} / {mod?.title}
        </Text>
        <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={2}>
          <Heading size="xl">{lesson.title}</Heading>
          <Badge colorPalette={lesson.isEnriched ? 'green' : 'orange'}>
            {lesson.isEnriched ? 'Ready' : 'Pending'}
          </Badge>
        </HStack>
      </Box>

      {lesson.objectives?.length > 0 && (
        <Box bg="blue.50" p={4} borderRadius="md">
          <Text fontWeight="semibold" mb={2}>
            Learning Objectives
          </Text>
          <List.Root gap={1}>
            {lesson.objectives.map((obj, i) => (
              <List.Item key={i} fontSize="sm" color="gray.700">
                {obj}
              </List.Item>
            ))}
          </List.Root>
        </Box>
      )}

      <Box bg="white" p={6} borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.100">
        <LessonRenderer content={lesson.content} />
      </Box>

      <Button
        variant="outline"
        alignSelf="flex-start"
        onClick={handleRegenerate}
        loading={generating}
      >
        Regenerate Lesson
      </Button>
    </VStack>
  );
}
