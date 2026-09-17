import { useState } from 'react';
import type { Character } from '../types';
import { createCharacter } from '../api/chatApi';

const EMOJI_OPTIONS = ['🎭', '🎨', '🌳', '🐱', '🎮', '📚', '🎸', '☕', '🌙', '🦊', '🐧', '⚡'];

export function CreateCharacterForm({
  onCreated,
  onCancel,
}: {
  onCreated: (character: Character) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('🎭');
  const [tagline, setTagline] = useState('');
  const [background, setBackground] = useState('');
  const [personality, setPersonality] = useState('');
  const [speakingStyle, setSpeakingStyle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit =
    name.trim() && tagline.trim() && background.trim() && personality.trim() && speakingStyle.trim();

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const character = await createCharacter({
        name,
        avatarEmoji,
        tagline,
        background,
        personality,
        speakingStyle,
      });
      onCreated(character);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败,请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-form">
      <div className="create-form-header">
        <button className="back-button" onClick={onCancel} aria-label="返回">
          ‹
        </button>
        <h2>创建角色</h2>
      </div>

      <div className="form-field">
        <label>头像</label>
        <div className="emoji-picker">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={`emoji-option ${avatarEmoji === emoji ? 'selected' : ''}`}
              onClick={() => setAvatarEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label>名字</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例如:林晚" maxLength={20} />
      </div>

      <div className="form-field">
        <label>一句话简介</label>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="会显示在角色卡片上,例如:独居猫奴插画师"
          maxLength={40}
        />
      </div>

      <div className="form-field">
        <label>身份背景</label>
        <textarea
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          placeholder="TA 是谁?做什么工作?有什么经历?"
          rows={3}
        />
      </div>

      <div className="form-field">
        <label>性格</label>
        <textarea
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          placeholder="性格特点、喜好、讨厌什么"
          rows={3}
        />
      </div>

      <div className="form-field">
        <label>说话风格</label>
        <textarea
          value={speakingStyle}
          onChange={(e) => setSpeakingStyle(e.target.value)}
          placeholder="用词习惯、语气、是否常用 emoji 等,也可以写一两句对话范例"
          rows={3}
        />
      </div>

      {error && <div className="form-error">{error}</div>}

      <button className="create-submit" onClick={handleSubmit} disabled={!canSubmit || submitting}>
        {submitting ? '创建中...' : '创建并开始聊天'}
      </button>
    </div>
  );
}
