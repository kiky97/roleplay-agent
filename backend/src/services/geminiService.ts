import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function toGeminiHistory(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

export async function* streamReply(params: {
  systemPrompt: string;
  memorySummary: string;
  history: ChatMessage[];
}): AsyncGenerator<string> {
  const systemInstruction = params.memorySummary
    ? `${params.systemPrompt}\n\n# 此前对话摘要\n${params.memorySummary}`
    : params.systemPrompt;

  const pastMessages = params.history.slice(0, -1);
  const latestMessage = params.history[params.history.length - 1];

  const chat = ai.chats.create({
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    history: toGeminiHistory(pastMessages),
    config: { systemInstruction },
  });

  const stream = await chat.sendMessageStream({ message: latestMessage.content });

  for await (const chunk of stream) {
    if (chunk.text) yield chunk.text;
  }
}
