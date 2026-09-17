import { useEffect, useRef, useState } from 'react';
import type { Character } from '../types';
import { MessageBubble } from './MessageBubble';
import { useChatStream } from '../hooks/useChatStream';
import { fetchMessages } from '../api/chatApi';

export function ChatWindow({
  character,
  sessionId,
  onBack,
}: {
  character: Character;
  sessionId: string;
  onBack: () => void;
}) {
  const { messages, setMessages, sendMessage, isStreaming } = useChatStream(sessionId);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages(sessionId).then(setMessages);
  }, [sessionId, setMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button onClick={onBack}>← 返回</button>
        <span>
          {character.avatarEmoji} {character.name}
        </span>
      </div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="输入消息..."
          disabled={isStreaming}
        />
        <button onClick={handleSend} disabled={isStreaming}>
          发送
        </button>
      </div>
    </div>
  );
}
