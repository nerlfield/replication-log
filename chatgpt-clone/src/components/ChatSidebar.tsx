import React from 'react';
import { Conversation } from '../types';
import clsx from 'clsx';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          + New Chat
        </button>
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