export interface Character {
  id: string;
  name: string;
  avatarEmoji: string;
  tagline: string;
}

export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}
