import { GoogleGenAI } from '@google/genai';
import { prisma } from '../db/client';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RECENT_MESSAGES_KEPT = 12;
const SUMMARIZE_THRESHOLD = 20;

export async function getContextForSession(sessionId: string) {
  const session = await prisma.session.findUniqueOrThrow({
    where: { id: sessionId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  if (session.messages.length > SUMMARIZE_THRESHOLD) {
    await summarizeOldMessages(sessionId, session.messages, session.summary);
    return getContextForSession(sessionId);
  }

  return {
    summary: session.summary,
    history: session.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  };
}

async function summarizeOldMessages(
  sessionId: string,
  messages: { id: string; role: string; content: string }[],
  existingSummary: string
) {
  const toSummarize = messages.slice(0, messages.length - RECENT_MESSAGES_KEPT);
  if (toSummarize.length === 0) return;

  const transcript = toSummarize.map((m) => `${m.role}: ${m.content}`).join('\n');

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    contents: `已有摘要:${existingSummary || '无'}\n\n新对话:\n${transcript}`,
    config: {
      systemInstruction:
        '你是对话摘要助手,请用中文将以下对话浓缩为不超过150字的关键事实摘要,保留人物关系、重要事件和用户偏好,不要添加解读或评价。',
    },
  });

  const summaryText = response.text ?? '';

  const idsToDelete = toSummarize.map((m) => m.id);
  await prisma.$transaction([
    prisma.message.deleteMany({ where: { id: { in: idsToDelete } } }),
    prisma.session.update({ where: { id: sessionId }, data: { summary: summaryText } }),
  ]);
}
