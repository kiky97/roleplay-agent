import type { Character } from '../types';
import { avatarGradient } from '../utils/avatarColor';

export function TypingIndicator({ character }: { character: Character }) {
  return (
    <div className="message-row assistant">
      <div className="message-avatar" style={{ backgroundImage: avatarGradient(character.id) }}>
        {character.avatarEmoji}
      </div>
      <div className="bubble typing-bubble">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
