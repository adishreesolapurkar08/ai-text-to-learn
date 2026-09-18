import {
  createCourseFromTopic,
  getCoursesByUser,
  getCourseById,
  getLessonById,
  enrichLesson,
} from '../services/courseService.js';
import { getUserId } from '../middlewares/auth.js';

export const generateCourse = async (req, res, next) => {
  try {
    const { topic } = req.body;
    const creatorId = getUserId(req);

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const course = await createCourseFromTopic(topic.trim(), creatorId);
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

export const listCourses = async (req, res, next) => {
  try {
    const courses = await getCoursesByUser(getUserId(req));
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.id, getUserId(req));
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const getLesson = async (req, res, next) => {
  try {
    const lesson = await getLessonById(req.params.id, getUserId(req), true);
    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

export const generateLesson = async (req, res, next) => {
  try {
    const lesson = await enrichLesson(req.params.id, getUserId(req));
    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

export const healthCheck = (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};
