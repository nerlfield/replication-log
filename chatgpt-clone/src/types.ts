export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}