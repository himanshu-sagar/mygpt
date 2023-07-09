// src/components/ChatBubble.tsx
import React from 'react';

interface ChatBubbleProps {
  content: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ content }) => {
  return <div className="chat-bubble">{content}</div>;
};

export default ChatBubble;
