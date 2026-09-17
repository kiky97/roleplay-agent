const STORAGE_KEY = 'roleplay-active-session';

export interface StoredSession {
  sessionId: string;
}

export function loadActiveSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function saveActiveSession(session: StoredSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable (private mode, etc.) — safe to ignore
  }
}

export function clearActiveSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
