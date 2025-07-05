import React, { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { clsx } from 'clsx';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  onStopGeneration?: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  onStopGeneration,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleStop = () => {
    onStopGeneration?.();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              disabled={disabled}
              className={clsx(
                'flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
                'placeholder-gray-500 dark:placeholder-gray-400',
                'px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'max-h-32 min-h-[44px]'
              )}
              rows={1}
            />
            
            {isLoading ? (
              <button
                type="button"
                onClick={handleStop}
                className="absolute right-2 bottom-2 p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Stop generation"
              >
                <Square className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                className={clsx(
                  'absolute right-2 bottom-2 p-2 rounded-md transition-colors',
                  message.trim() && !disabled
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                )}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};