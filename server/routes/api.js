import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { register, login, me } from '../controllers/authController.js';
import {
  generateCourse,
  listCourses,
  getCourse,
  getLesson,
  generateLesson,
  healthCheck,
} from '../controllers/courseController.js';

const router = Router();

router.get('/health', healthCheck);

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', requireAuth, me);

router.post('/generate-course', requireAuth, generateCourse);
router.get('/courses', requireAuth, listCourses);
router.get('/courses/:id', requireAuth, getCourse);
router.get('/lessons/:id', requireAuth, getLesson);
router.post('/lessons/:id/generate', requireAuth, generateLesson);

export default router;
