import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function* streamReply(params: {
  systemPrompt: string;
  memorySummary: string;
  history: ChatMessage[];
}): AsyncGenerator<string> {
  const system = params.memorySummary
    ? `${params.systemPrompt}\n\n# 此前对话摘要\n${params.memorySummary}`
    : params.systemPrompt;

  const stream = anthropic.messages.stream({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-5',
    max_tokens: 2048,
    system,
    messages: params.history,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}
