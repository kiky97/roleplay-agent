import { Router } from 'express';
import { prisma } from '../db/client';
import { streamReply } from '../services/claudeService';
import { getContextForSession } from '../services/memoryService';

export const chatRouter = Router();

chatRouter.post('/', async (req, res) => {
  const { sessionId, message } = req.body as { sessionId: string; message: string };
  if (!sessionId || !message) {
    return res.status(400).json({ error: 'sessionId and message are required' });
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { character: true },
  });
  if (!session) {
    return res.status(404).json({ error: 'session not found' });
  }

  await prisma.message.create({
    data: { sessionId, role: 'user', content: message },
  });

  const { summary, history } = await getContextForSession(sessionId);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let fullReply = '';
  try {
    for await (const chunk of streamReply({
      systemPrompt: session.character.systemPrompt,
      memorySummary: summary,
      history: [...history, { role: 'user', content: message }],
    })) {
      fullReply += chunk;
      res.write(`data: ${JSON.stringify({ type: 'delta', text: chunk })}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
  } catch (err) {
    console.error(err);
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'AI 回复失败,请检查后端日志' })}\n\n`);
  } finally {
    res.end();
  }

  if (fullReply) {
    await prisma.message.create({
      data: { sessionId, role: 'assistant', content: fullReply },
    });
  }
});
