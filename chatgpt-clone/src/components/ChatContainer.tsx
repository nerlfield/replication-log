import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ChatMessage } from './ChatMessage';
import type { Message } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { MockApi } from '../services/mockApi';

export const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mockApi = MockApi.getInstance();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: "Hello! I'm your AI assistant. How can I help you today?",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response
      const response = await mockApi.sendMessage(content);
      setMessages(prev => [...prev, response.message]);
    } catch (error) {
      if (error instanceof Error && error.message === 'Request aborted') {
        // Request was cancelled, don't add error message
        return;
      }
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopGeneration = () => {
    mockApi.stopGeneration();
    setIsLoading(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsLoading(false);
    // The welcome message will be added by the useEffect
  };

  const handleClearChat = () => {
    setMessages([]);
    setIsLoading(false);
    // The welcome message will be added by the useEffect
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <ChatHeader
        onNewChat={handleNewChat}
        onClearChat={handleClearChat}
        messageCount={messages.length}
      />
      
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 overflow-hidden"
      >
        <div className="min-h-full flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
                <p className="text-sm">Ask me anything! I'm here to help.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div className="chat-message assistant-message">
                  <div className="max-w-3xl mx-auto flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          ChatGPT
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
      
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onStopGeneration={handleStopGeneration}
      />
    </div>
  );
};