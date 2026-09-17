import { useCallback, useState } from 'react';
import type { Message } from '../types';
import { streamChat } from '../api/chatApi';

export function useChatStream(sessionId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!sessionId || !text.trim()) return;

      setMessages((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: '' }]);
      setIsStreaming(true);

      try {
        await streamChat(sessionId, text, (delta) => {
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: 'assistant',
              content: next[next.length - 1].content + delta,
            };
            return next;
          });
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsStreaming(false);
      }
    },
    [sessionId]
  );

  return { messages, setMessages, sendMessage, isStreaming };
}
