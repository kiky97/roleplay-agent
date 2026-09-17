import { useEffect, useRef, useState } from 'react';
import type { Character } from '../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { useChatStream } from '../hooks/useChatStream';
import { fetchMessages } from '../api/chatApi';
import { avatarGradient } from '../utils/avatarColor';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchMessages(sessionId).then(setMessages);
  }, [sessionId, setMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const lastMessage = messages[messages.length - 1];
  const showTyping = isStreaming && lastMessage?.role === 'assistant' && lastMessage.content === '';
  const visibleMessages = showTyping ? messages.slice(0, -1) : messages;

  return (
    <div className="chat-shell">
      <div className="chat-header">
        <button className="back-button" onClick={onBack} aria-label="返回">
          ‹
        </button>
        <div className="chat-header-avatar" style={{ backgroundImage: avatarGradient(character.id) }}>
          {character.avatarEmoji}
        </div>
        <div>
          <div className="chat-header-name">{character.name}</div>
          <div className="chat-header-status">
            <span className="status-dot" />
            在线
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {visibleMessages.length === 0 && !showTyping && (
          <div className="empty-hint">说点什么,开始和 {character.name} 聊天吧</div>
        )}
        {visibleMessages.map((m, i) => (
          <MessageBubble key={i} message={m} character={character} />
        ))}
        {showTyping && <TypingIndicator character={character} />}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-bar">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息,Enter 发送,Shift+Enter 换行"
          disabled={isStreaming}
          rows={1}
        />
        <button className="send-button" onClick={handleSend} disabled={isStreaming || !input.trim()}>
          发送
        </button>
      </div>
    </div>
  );
}
