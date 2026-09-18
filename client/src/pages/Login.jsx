import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Text,
  VStack,
  Link,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        p={8}
        borderRadius="lg"
        shadow="md"
        w="full"
        maxW="md"
      >
        <VStack align="stretch" gap={4}>
          <Heading size="lg">Log in</Heading>
          <Text color="gray.600">Sign in to Text-to-Learn</Text>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <ErrorMessage message={error} />
          <Button type="submit" colorPalette="blue" loading={submitting}>
            Log In
          </Button>
          <Text fontSize="sm" textAlign="center">
            No account?{' '}
            <Link asChild color="blue.600">
              <RouterLink to="/signup">Sign up</RouterLink>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Center>
  );
}
