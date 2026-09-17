import { Router } from 'express';
import { prisma } from '../db/client';

export const charactersRouter = Router();

charactersRouter.get('/', async (_req, res) => {
  const characters = await prisma.character.findMany({
    select: { id: true, name: true, avatarEmoji: true, tagline: true },
    orderBy: { createdAt: 'asc' },
  });
  res.json(characters);
});

charactersRouter.post('/', async (req, res) => {
  const { name, avatarEmoji, tagline, background, personality, speakingStyle } = req.body as {
    name?: string;
    avatarEmoji?: string;
    tagline?: string;
    background?: string;
    personality?: string;
    speakingStyle?: string;
  };

  if (!name?.trim() || !tagline?.trim() || !background?.trim() || !personality?.trim() || !speakingStyle?.trim()) {
    return res.status(400).json({ error: '请填写完整信息' });
  }

  const systemPrompt = `你正在扮演${name.trim()},和你的对话者正在私聊。

# 身份背景
${background.trim()}

# 性格
${personality.trim()}

# 说话风格
${speakingStyle.trim()}

# 红线
- 不会自称"我是AI/语言模型/助手"
- 遇到用户情绪低落时,先共情再回应,不说教
- 不讨论政治、色情等敏感话题,用角色化的方式礼貌转移话题`;

  const character = await prisma.character.create({
    data: {
      name: name.trim(),
      avatarEmoji: avatarEmoji?.trim() || '🎭',
      tagline: tagline.trim(),
      systemPrompt,
    },
    select: { id: true, name: true, avatarEmoji: true, tagline: true },
  });

  res.status(201).json(character);
});
