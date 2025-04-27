'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-4 mt-4">
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your message..."
          className="flex-1 py-3 px-4 rounded-xl border border-indigo-200 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 shadow-sm transition-all duration-300"
          disabled={disabled}
          aria-label="Chat message input"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="ml-auto gap-2 px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-[#8541f2] to-[#b993f7] text-white shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      {disabled && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm py-1 px-3 rounded-full">
          Processing your message...
        </div>
      )}
    </form>
  );
} 