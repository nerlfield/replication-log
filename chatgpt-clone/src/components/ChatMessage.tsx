import React from 'react';
import { Message } from '../types';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div
      className={clsx(
        'message-bubble',
        message.role === 'user' ? 'user-bubble' : 'assistant-bubble',
        message.role === 'error' && 'error-bubble'
      )}
    >
      <button className="copy-btn" onClick={copyToClipboard} title="Copy">
        📋
      </button>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        linkTarget="_blank"
        components={{
          code({ node, inline, className, children, ...props }: { node?: any; inline: boolean; className?: string; children: React.ReactNode[] }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <SyntaxHighlighter
                style={oneDark as any}
                language={match ? match[1] : undefined}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMessage;