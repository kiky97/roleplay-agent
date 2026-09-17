import type { Character, Message } from '../types';

const BASE = '/api';

export async function fetchCharacters(): Promise<Character[]> {
  const res = await fetch(`${BASE}/characters`);
  return res.json();
}

export async function createSession(characterId: string): Promise<string> {
  const res = await fetch(`${BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ characterId }),
  });
  const data = await res.json();
  return data.sessionId;
}

export async function fetchMessages(sessionId: string): Promise<Message[]> {
  const res = await fetch(`${BASE}/sessions/${sessionId}/messages`);
  return res.json();
}

export async function fetchSession(
  sessionId: string
): Promise<{ sessionId: string; character: Character } | null> {
  const res = await fetch(`${BASE}/sessions/${sessionId}`);
  if (res.status === 404) return null;
  return res.json();
}

export interface CreateCharacterInput {
  name: string;
  avatarEmoji: string;
  tagline: string;
  background: string;
  personality: string;
  speakingStyle: string;
}

export async function createCharacter(input: CreateCharacterInput): Promise<Character> {
  const res = await fetch(`${BASE}/characters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '创建失败,请重试' }));
    throw new Error(err.error || '创建失败,请重试');
  }
  return res.json();
}

export async function streamChat(
  sessionId: string,
  message: string,
  onDelta: (text: string) => void
): Promise<void> {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message }),
  });

  if (!res.body) throw new Error('No response body');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = JSON.parse(line.slice(6));
      if (payload.type === 'delta') onDelta(payload.text);
      if (payload.type === 'error') throw new Error(payload.message);
    }
  }
}
