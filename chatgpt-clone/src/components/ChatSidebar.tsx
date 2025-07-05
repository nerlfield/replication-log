import React from 'react';
import { Conversation } from '../types';
import clsx from 'clsx';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  open?: boolean;
  onClose?: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  open,
  onClose,
}) => {
  return (
    <div className={clsx('sidebar', open && 'open')}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          + New Chat
        </button>
        {onClose && (
          <button className="new-chat-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>
      <div className="conversation-list">
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={clsx(
              'conversation-item',
              conv.id === activeId && 'active'
            )}
            onClick={() => onSelect(conv.id)}
          >
            {conv.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;