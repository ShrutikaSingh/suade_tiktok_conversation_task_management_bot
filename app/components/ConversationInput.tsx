'use client';

import { useState } from 'react';

interface ConversationInputProps {
  onSubmit: (conversation: string) => void;
}

export default function ConversationInput({ onSubmit }: ConversationInputProps) {
  const [conversation, setConversation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conversation.trim()) {
      onSubmit(conversation);
      setConversation('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <textarea
          value={conversation}
          onChange={(e) => setConversation(e.target.value)}
          placeholder="Paste your social media conversation here..."
          className="fancy-input w-full h-32 resize-none"
        />
        <div className="absolute bottom-3 right-3 flex items-center space-x-2">
          <button
            type="submit"
            disabled={!conversation.trim()}
            className="fancy-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Parse Conversation
          </button>
        </div>
      </div>
    </form>
  );
} 