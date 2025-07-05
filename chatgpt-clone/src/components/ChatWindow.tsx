import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import * as ScrollArea from '@radix-ui/react-scroll-area';

interface ChatWindowProps {
  messages: Message[];
  onSend: (text: string) => void;
  isLoading: boolean;
  onClear: () => void;
  error?: string | null;
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSend,
  isLoading,
  onClear,
  error,
  systemPrompt,
  onSystemPromptChange,
}) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const vp = viewportRef.current;
    if (vp) {
      vp.scrollTop = vp.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      <div style={{ padding: '0.5rem', borderBottom: '1px solid #444654', display:'flex', gap:'0.5rem', alignItems:'center', flexWrap:'wrap' }}>
        <button className="new-chat-btn" onClick={onClear}>
          Clear Chat
        </button>
        <select value={systemPrompt} onChange={e=>onSystemPromptChange(e.target.value)} style={{background:'#444654', color:'#ececf1', border:'none', padding:'0.5rem', borderRadius:'6px'}}>
          <option value="Helpful">Helpful</option>
          <option value="Sarcastic">Sarcastic</option>
          <option value="Formal">Formal</option>
          <option value="Emoji">Emoji</option>
        </select>
      </div>
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
          {error && (
            <ChatMessage
              message={{ id: 'error', role: 'error', content: error }}
            />
          )}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" />
      </ScrollArea.Root>
      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  );
};

export default ChatWindow;