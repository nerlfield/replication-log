import React from 'react';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { User, Bot } from 'lucide-react';
import { clsx } from 'clsx';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={clsx(
      'chat-message',
      isUser ? 'user-message' : 'assistant-message'
    )}>
      <div className="max-w-3xl mx-auto flex gap-4">
        <Avatar className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <AvatarFallback className="w-full h-full flex items-center justify-center">
            {isUser ? (
              <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <Bot className="w-4 h-4 text-green-600 dark:text-green-400" />
            )}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {isUser ? 'You' : 'ChatGPT'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          
          <div className="message-content text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};