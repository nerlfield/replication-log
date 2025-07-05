import { Message } from '../types';

export async function sendMessage(messages: Message[]): Promise<string> {
  const lastUser = messages.filter(m => m.role === 'user').slice(-1)[0];
  // simulate network delay
  await new Promise(res => setTimeout(res, 1000));
  return `You said: "${lastUser?.content ?? ''}" (mock response)`;
}