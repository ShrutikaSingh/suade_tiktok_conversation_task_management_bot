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
    <motion.form 
      onSubmit={handleSubmit} 
      className="mt-4 px-4 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="relative group bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-white/20"
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused ? '0 0 20px rgba(255,255,255,0.1)' : '0 0 0 rgba(255,255,255,0)',
        }}
        transition={{ duration: 0.2 }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your message..."
          className="w-full pr-24 py-3 px-4 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-0 transition-all duration-300"
          disabled={disabled}
          aria-label="Chat message input"
        />
        <AnimatePresence>
          {message.trim() && (
            <motion.button
              type="submit"
              disabled={disabled}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-accent/90 hover:bg-accent text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Send message"
            >
              <span className="flex items-center gap-2">
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ 
                    rotate: isFocused ? 360 : 0,
                    scale: isFocused ? 1.2 : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </motion.svg>
                <span className="text-sm font-medium">Send</span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
      {disabled && (
        <motion.div 
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm py-1 px-3 rounded-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Processing your message...
        </motion.div>
      )}
    </motion.form>
  );
} 