import express from 'express';
import cors from 'cors';
import { charactersRouter } from './routes/characters';
import { sessionsRouter } from './routes/sessions';
import { chatRouter } from './routes/chat';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/characters', charactersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/chat', chatRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
