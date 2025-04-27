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
    <div className="mb-0">
      <form onSubmit={handleSubmit} className="">
        <div className="relative">
          <textarea
            value={conversation}
            onChange={(e) => setConversation(e.target.value)}
            placeholder="Paste your social media conversation here..."
            className="fancy-input w-full h-28 resize-none rounded-xl border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
            style={{ minHeight: '100px', maxHeight: '160px' }}
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <button
              type="submit"
              disabled={!conversation.trim()}
              className="px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#3c0596] to-[#8541f2] text-white transition-all duration-200 hover:from-[#a084e8] hover:to-[#ede7fa] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Parse Conversation
            </button>
          </div>
        </div>
      </form>
      <div className="w-full h-px bg-gray-200 mt-0 mb-0" />
    </div>
  );
} 