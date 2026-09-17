import { Router } from 'express';
import { prisma } from '../db/client';

export const charactersRouter = Router();

charactersRouter.get('/', async (_req, res) => {
  const characters = await prisma.character.findMany({
    select: { id: true, name: true, avatarEmoji: true, tagline: true },
  });
  res.json(characters);
});
