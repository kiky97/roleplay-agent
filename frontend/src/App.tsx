import { useEffect, useState } from 'react';
import type { Character } from './types';
import { fetchCharacters, createSession } from './api/chatApi';
import { CharacterSelector } from './components/CharacterSelector';
import { ChatWindow } from './components/ChatWindow';

export default function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [active, setActive] = useState<{ character: Character; sessionId: string } | null>(null);

  useEffect(() => {
    fetchCharacters().then(setCharacters);
  }, []);

  const handleSelect = async (character: Character) => {
    const sessionId = await createSession(character.id);
    setActive({ character, sessionId });
  };

  return (
    <div className="app">
      <h1>角色扮演聊天</h1>
      {active ? (
        <ChatWindow character={active.character} sessionId={active.sessionId} onBack={() => setActive(null)} />
      ) : (
        <CharacterSelector characters={characters} onSelect={handleSelect} />
      )}
    </div>
  );
}
