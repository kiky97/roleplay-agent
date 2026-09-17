import { useEffect, useState } from 'react';
import type { Character } from './types';
import { fetchCharacters, createSession, fetchSession } from './api/chatApi';
import { CharacterSelector } from './components/CharacterSelector';
import { ChatWindow } from './components/ChatWindow';
import { loadActiveSession, saveActiveSession, clearActiveSession } from './utils/sessionStorage';

export default function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [active, setActive] = useState<{ character: Character; sessionId: string } | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    fetchCharacters().then(setCharacters);
  }, []);

  useEffect(() => {
    const stored = loadActiveSession();
    if (!stored) {
      setRestoring(false);
      return;
    }

    fetchSession(stored.sessionId)
      .then((result) => {
        if (result) {
          setActive({ character: result.character, sessionId: result.sessionId });
        } else {
          clearActiveSession();
        }
      })
      .catch(() => clearActiveSession())
      .finally(() => setRestoring(false));
  }, []);

  const handleSelect = async (character: Character) => {
    const sessionId = await createSession(character.id);
    saveActiveSession({ sessionId });
    setActive({ character, sessionId });
  };

  const handleBack = () => {
    clearActiveSession();
    setActive(null);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo">💬</div>
        <div>
          <h1>角色扮演聊天</h1>
          <p className="app-subtitle">选一个角色,开始一段对话</p>
        </div>
      </header>
      <main className="app-main">
        {restoring ? (
          <div className="empty-hint">正在恢复上次的对话...</div>
        ) : active ? (
          <ChatWindow character={active.character} sessionId={active.sessionId} onBack={handleBack} />
        ) : (
          <CharacterSelector characters={characters} onSelect={handleSelect} />
        )}
      </main>
    </div>
  );
}
