import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { sendMessage } from '../api/mockApi';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scroll to bottom whenever messages change
    const vp = viewportRef.current;
    if (vp) {
      vp.scrollTop = vp.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const assistantText = await sendMessage([...messages, userMsg]);
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantText,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <ScrollArea.Root className="chat-scroll-area">
        <ScrollArea.Viewport className="chat-viewport" ref={viewportRef}>
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <ChatMessage
              message={{ id: 'loading', role: 'assistant', content: '…' }}
            />
          )}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" />
      </ScrollArea.Root>
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
};

export default ChatWindow;