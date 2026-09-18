import { z } from 'zod';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.APP_URL || 'http://localhost:5173',
    'X-Title': 'Text-to-Learn',
  },
});

const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

const courseOutlineSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).min(1),
  modules: z
    .array(
      z.object({
        title: z.string().min(1),
        lessons: z.array(z.string().min(1)).min(3).max(5),
      })
    )
    .min(3)
    .max(6),
});

const contentBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), text: z.string() }),
  z.object({ type: z.literal('paragraph'), text: z.string() }),
  z.object({
    type: z.literal('code'),
    language: z.string(),
    text: z.string(),
  }),
  z.object({
    type: z.literal('mcq'),
    question: z.string(),
    options: z.array(z.string()).min(2),
    answer: z.number().int().nonnegative(),
    explanation: z.string(),
  }),
]);

const lessonContentSchema = z.object({
  title: z.string().min(1),
  objectives: z.array(z.string()).min(2),
  content: z.array(contentBlockSchema).min(5),
});

async function callLLM(messages, retryMessage) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.includes('your-key-here')) {
    throw new Error('Set a valid OPENROUTER_API_KEY in server/.env');
  }

  try {
    const response = await client.chat.completions.create({
      model,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) {
      throw new Error('Empty response from OpenRouter');
    }

    try {
      return JSON.parse(raw);
    } catch {
      if (!retryMessage) {
        throw new Error('Failed to parse OpenRouter JSON response');
      }

      const retryResponse = await client.chat.completions.create({
        model,
        messages: [
          ...messages,
          { role: 'assistant', content: raw },
          { role: 'user', content: retryMessage },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const retryRaw = retryResponse.choices[0]?.message?.content;
      if (!retryRaw) {
        throw new Error('Empty retry response from OpenRouter');
      }
      return JSON.parse(retryRaw);
    }
  } catch (err) {
    if (err.status === 401) {
      throw new Error('Invalid OPENROUTER_API_KEY — get a key at https://openrouter.ai/keys');
    }
    throw err;
  }
}

export async function generateCourseOutline(topic) {
  const messages = [
    {
      role: 'system',
      content: `You are an expert curriculum designer. Return ONLY valid JSON with no markdown.`,
    },
    {
      role: 'user',
      content: `Create a structured online course outline for the topic: "${topic}".

Return JSON with this exact shape:
{
  "title": "Course title",
  "description": "2-3 sentence course description",
  "tags": ["tag1", "tag2"],
  "modules": [
    {
      "title": "Module title",
      "lessons": ["Lesson title 1", "Lesson title 2", "Lesson title 3"]
    }
  ]
}

Rules:
- 3 to 6 modules
- Each module has 3 to 5 lesson titles (strings only, no lesson content yet)
- Progress from foundational to advanced concepts
- Cover the topic comprehensively`,
    },
  ];

  const parsed = await callLLM(
    messages,
    'Fix the JSON to match the required schema exactly. Return only valid JSON.'
  );

  return courseOutlineSchema.parse(parsed);
}

export async function generateLessonContent({ courseTitle, moduleTitle, lessonTitle }) {
  const messages = [
    {
      role: 'system',
      content: `You are an expert educator. Return ONLY valid JSON with no markdown or code fences.`,
    },
    {
      role: 'user',
      content: `Write a complete lesson for:
Course: "${courseTitle}"
Module: "${moduleTitle}"
Lesson: "${lessonTitle}"

Return JSON with this exact shape:
{
  "title": "Lesson title",
  "objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "content": [
    { "type": "heading", "text": "Section heading" },
    { "type": "paragraph", "text": "Educational paragraph..." },
    { "type": "code", "language": "javascript", "text": "code here" },
    { "type": "mcq", "question": "...", "options": ["A", "B", "C", "D"], "answer": 1, "explanation": "Why this is correct" }
  ]
}

Rules:
- Include 2-4 learning objectives
- Start with headings and paragraphs explaining the concept clearly
- Include a code block ONLY if relevant to the lesson topic
- Do not include video blocks or YouTube links
- End with 4-5 MCQ blocks (answer is 0-based index into options)
- Each MCQ must include an explanation for the correct answer
- Make content thorough but readable for self-learners`,
    },
  ];

  const parsed = await callLLM(
    messages,
    'Fix the JSON to match the required schema. Ensure 4-5 MCQs at the end. Do not include video blocks. Return only valid JSON.'
  );

  if (Array.isArray(parsed?.content)) {
    parsed.content = parsed.content.filter((block) => block?.type !== 'video');
  }

  return lessonContentSchema.parse(parsed);
}
