import React from 'react';
import { Message } from '../types';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={clsx(
        'message-bubble',
        message.role === 'user' ? 'user-bubble' : 'assistant-bubble',
        message.role === 'error' && 'error-bubble'
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} linkTarget="_blank">
        {message.content}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMessage;