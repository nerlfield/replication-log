import React, { useState } from 'react';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import { Conversation, Message } from './types';
import { sendMessage } from './api/mockApi';

const createEmptyConversation = (): Conversation => ({
  id: crypto.randomUUID(),
  title: 'New chat',
  messages: [],
});

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    createEmptyConversation(),
  ]);
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState('Helpful');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeConv = conversations.find(c => c.id === activeId)!;

  const updateActiveConv = (updater: (c: Conversation) => Conversation) => {
    setConversations(prev =>
      prev.map(c => (c.id === activeId ? updater(c) : c))
    );
  };

  const handleSend = async (text: string) => {
    setError(null);
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    updateActiveConv(c => ({
      ...c,
      messages: [...c.messages, userMsg],
      title: c.title === 'New chat' ? text.slice(0, 20) : c.title,
    }));
    setIsLoading(true);

    try {
      const assistantText = await sendMessage(
        [...activeConv.messages, userMsg],
        systemPrompt
      );

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
      };
      const assistantId = assistantMsg.id;
      updateActiveConv(c => ({ ...c, messages: [...c.messages, assistantMsg] }));

      // Stream characters
      for (let i = 0; i < assistantText.length; i++) {
        await new Promise(r => setTimeout(r, 25));
        const partial = assistantText.slice(0, i + 1);
        updateActiveConv(c => ({
          ...c,
          messages: c.messages.map(m =>
            m.id === assistantId ? { ...m, content: partial } : m
          ),
        }));
      }
    } catch (err) {
      const msg: Message = {
        id: crypto.randomUUID(),
        role: 'error',
        content: (err as Error).message,
      };
      updateActiveConv(c => ({ ...c, messages: [...c.messages, msg] }));
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newConv = createEmptyConversation();
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newConv.id);
  };

  const handleClearChat = () => {
    updateActiveConv(c => ({ ...c, messages: [] }));
  };

  return (
    <div className="app-layout">
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={id => {
          setActiveId(id);
          setSidebarOpen(false);
        }}
        onNewChat={() => {
          handleNewChat();
          setSidebarOpen(false);
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
        <ChatWindow
          messages={activeConv.messages}
          onSend={handleSend}
          isLoading={isLoading}
          onClear={handleClearChat}
          error={error}
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
        />
      </div>
    </div>
  );
};

export default App;