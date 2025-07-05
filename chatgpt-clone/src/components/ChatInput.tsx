import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your message…"
        disabled={disabled}
        rows={1}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
          } else if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
            // insert newline
            e.preventDefault();
            const { selectionStart, selectionEnd } = e.currentTarget;
            const newValue =
              text.slice(0, selectionStart) + '\n' + text.slice(selectionEnd);
            setText(newValue);
            // adjust caret
            queueMicrotask(() => {
              e.currentTarget.selectionStart =
                e.currentTarget.selectionEnd = selectionStart + 1;
            });
          }
        }}
        style={{ resize: 'none' }}
      />
      <button type="submit" disabled={disabled || !text.trim()}>
        Send
      </button>
    </form>
  );
};

export default ChatInput;