import type { Character } from '../types';
import { avatarGradient } from '../utils/avatarColor';

export function CharacterSelector({
  characters,
  onSelect,
  onCreateNew,
}: {
  characters: Character[];
  onSelect: (c: Character) => void;
  onCreateNew: () => void;
}) {
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
      <button className="character-card create-card" onClick={onCreateNew}>
        <div className="character-avatar create-avatar">+</div>
        <div className="character-info">
          <div className="character-name">创建角色</div>
          <div className="character-tagline">设计你自己的角色人设</div>
        </div>
      </button>
    </div>
  );
}
