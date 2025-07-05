import { Message } from '../types';

export async function sendMessage(messages: Message[], systemPrompt: string): Promise<string> {
  const lastUser = messages.filter(m => m.role === 'user').slice(-1)[0];
  // simulate network delay
  await new Promise(res => setTimeout(res, 1000));

  // randomly throw error to simulate network failure
  if (Math.random() < 0.1) {
    throw new Error('Mock network error');
  }
  return `(${systemPrompt}) You said: "${lastUser?.content ?? ''}"`;
}