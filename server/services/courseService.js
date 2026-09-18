import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import { generateCourseOutline, generateLessonContent } from './llmService.js';

export async function createCourseFromTopic(topic, creatorId) {
  const outline = await generateCourseOutline(topic);

  const course = await Course.create({
    title: outline.title,
    description: outline.description,
    creator: creatorId,
    tags: outline.tags,
    modules: [],
  });

  const moduleIds = [];

  for (const mod of outline.modules) {
    const moduleDoc = await Module.create({
      title: mod.title,
      course: course._id,
      lessons: [],
    });

    const lessonIds = [];

    for (const lessonTitle of mod.lessons) {
      const lessonDoc = await Lesson.create({
        title: lessonTitle,
        module: moduleDoc._id,
        objectives: [],
        content: [],
        isEnriched: false,
      });
      lessonIds.push(lessonDoc._id);
    }

    moduleDoc.lessons = lessonIds;
    await moduleDoc.save();
    moduleIds.push(moduleDoc._id);
  }

  course.modules = moduleIds;
  await course.save();

  return getCourseById(course._id.toString(), creatorId);
}

export async function getCoursesByUser(creatorId) {
  return Course.find({ creator: creatorId })
    .sort({ createdAt: -1 })
    .select('title description tags createdAt updatedAt')
    .lean();
}

export async function getCourseById(courseId, creatorId) {
  const course = await Course.findOne({ _id: courseId, creator: creatorId })
    .populate({
      path: 'modules',
      populate: {
        path: 'lessons',
        select: 'title isEnriched objectives',
      },
    })
    .lean();

  if (!course) {
    const err = new Error('Course not found');
    err.status = 404;
    throw err;
  }

  return course;
}

export async function getLessonById(lessonId, creatorId, autoGenerate = true) {
  const lesson = await Lesson.findById(lessonId)
    .populate({
      path: 'module',
      populate: {
        path: 'course',
        select: 'title creator',
      },
    })
    .lean();

  if (!lesson) {
    const err = new Error('Lesson not found');
    err.status = 404;
    throw err;
  }

  if (lesson.module?.course?.creator !== creatorId) {
    const err = new Error('Lesson not found');
    err.status = 404;
    throw err;
  }

  if (!lesson.isEnriched && autoGenerate) {
    return enrichLesson(lessonId, creatorId);
  }

  return lesson;
}

export async function enrichLesson(lessonId, creatorId) {
  const lesson = await Lesson.findById(lessonId).populate({
    path: 'module',
    populate: { path: 'course', select: 'title creator' },
  });

  if (!lesson) {
    const err = new Error('Lesson not found');
    err.status = 404;
    throw err;
  }

  if (lesson.module.course.creator !== creatorId) {
    const err = new Error('Lesson not found');
    err.status = 404;
    throw err;
  }

  const generated = await generateLessonContent({
    courseTitle: lesson.module.course.title,
    moduleTitle: lesson.module.title,
    lessonTitle: lesson.title,
  });

  lesson.title = generated.title;
  lesson.objectives = generated.objectives;
  lesson.content = generated.content;
  lesson.isEnriched = true;

  await lesson.save();

  return lesson.toObject();
}
