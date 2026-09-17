import type { Message } from '../types';

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`bubble-row ${isUser ? 'user' : 'assistant'}`}>
      <div className="bubble">{message.content || '···'}</div>
    </div>
  );
}
