import type { Character, Message } from '../types';
import { avatarGradient } from '../utils/avatarColor';

export function MessageBubble({ message, character }: { message: Message; character: Character }) {
  const isUser = message.role === 'user';
  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <div className="message-avatar" style={{ backgroundImage: avatarGradient(character.id) }}>
          {character.avatarEmoji}
        </div>
      )}
      <div className="bubble">{message.content}</div>
    </div>
  );
}
