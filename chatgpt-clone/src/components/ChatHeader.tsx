import React from 'react';
import { Bot, MoreVertical, Plus } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';

interface ChatHeaderProps {
  onNewChat?: () => void;
  onClearChat?: () => void;
  messageCount?: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onNewChat,
  onClearChat,
  messageCount = 0,
}) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ChatGPT Clone
            </h1>
            {messageCount > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {messageCount} message{messageCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="New chat"
          >
            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                className="min-w-[160px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1"
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Item
                  onClick={onClearChat}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer',
                    'text-gray-700 dark:text-gray-300',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700'
                  )}
                  disabled={messageCount === 0}
                >
                  Clear chat
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
};