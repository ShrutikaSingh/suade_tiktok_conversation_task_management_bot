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
    <form onSubmit={handleSubmit} className="w-full mt-4">
      <div className="relative flex items-end w-full">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your message..."
          className="flex-1 py-4 px-5 rounded-2xl border border-[#b993f7] bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b993f7]/40 focus:border-[#8541f2] shadow-lg transition-all duration-300 resize-none min-h-[3.5rem] text-base pr-16"
          disabled={disabled}
          aria-label="Chat message input"
          rows={3}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="absolute right-3 bottom-3 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#b993f7] to-[#8541f2] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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