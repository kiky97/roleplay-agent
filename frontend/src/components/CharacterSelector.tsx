import type { Character } from '../types';

export function CharacterSelector({
  characters,
  onSelect,
}: {
  characters: Character[];
  onSelect: (c: Character) => void;
}) {
  return (
    <div className="character-grid">
      {characters.map((c) => (
        <button key={c.id} className="character-card" onClick={() => onSelect(c)}>
          <div className="avatar">{c.avatarEmoji}</div>
          <div className="name">{c.name}</div>
          <div className="tagline">{c.tagline}</div>
        </button>
      ))}
    </div>
  );
}
