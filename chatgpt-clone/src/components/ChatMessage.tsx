import React from 'react';
import { Message } from '../types';
import clsx from 'clsx';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={clsx(
        'message-bubble',
        message.role === 'user' ? 'user-bubble' : 'assistant-bubble'
      )}
    >
      {message.content}
    </div>
  );
};

export default ChatMessage;