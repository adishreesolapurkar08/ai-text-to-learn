import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  Link,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register(email, password, name);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        p={8}
        borderRadius="lg"
        shadow="md"
        w="full"
        maxW="md"
        mx={4}
      >
        <VStack align="stretch" gap={4}>
          <Heading size="lg">Sign up</Heading>
          <Text color="gray.600">Create your Text-to-Learn account</Text>
          <Input
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <ErrorMessage message={error} />
          <Button type="submit" colorPalette="blue" loading={submitting}>
            Create Account
          </Button>
          <Text fontSize="sm" textAlign="center">
            Already have an account?{' '}
            <Link asChild color="blue.600">
              <RouterLink to="/login">Log in</RouterLink>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
