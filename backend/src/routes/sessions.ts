import { Router } from 'express';
import { prisma } from '../db/client';

export const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
  const { characterId } = req.body as { characterId: string };
  const character = await prisma.character.findUnique({ where: { id: characterId } });
  if (!character) return res.status(404).json({ error: 'character not found' });

  const session = await prisma.session.create({ data: { characterId } });
  res.json({ sessionId: session.id });
});

sessionsRouter.get('/:id', async (req, res) => {
  const session = await prisma.session.findUnique({
    where: { id: req.params.id },
    include: { character: true },
  });
  if (!session) return res.status(404).json({ error: 'session not found' });

  res.json({
    sessionId: session.id,
    character: {
      id: session.character.id,
      name: session.character.name,
      avatarEmoji: session.character.avatarEmoji,
      tagline: session.character.tagline,
    },
  });
});

sessionsRouter.get('/:id/messages', async (req, res) => {
  const messages = await prisma.message.findMany({
    where: { sessionId: req.params.id },
    orderBy: { createdAt: 'asc' },
  });
  res.json(messages);
});
