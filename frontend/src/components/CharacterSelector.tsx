import type { Character } from '../types';
import { avatarGradient } from '../utils/avatarColor';

export function CharacterSelector({
  characters,
  onSelect,
}: {
  characters: Character[];
  onSelect: (c: Character) => void;
}) {
  if (characters.length === 0) {
    return <div className="empty-hint">正在加载角色...</div>;
  }

  return (
    <div className="character-grid">
      {characters.map((c) => (
        <button key={c.id} className="character-card" onClick={() => onSelect(c)}>
          <div className="character-avatar" style={{ backgroundImage: avatarGradient(c.id) }}>
            {c.avatarEmoji}
          </div>
          <div className="character-info">
            <div className="character-name">{c.name}</div>
            <div className="character-tagline">{c.tagline}</div>
          </div>
          <div className="character-arrow">→</div>
        </button>
      ))}
    </div>
  );
}
