'use client';

import { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatHistoryProps {
  messages: ChatMessage[];
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="space-y-4 p-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent bg-[#FEF5FA]">
      <AnimatePresence>
        {messages.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block p-8 rounded-2xl bg-pink-500/5 backdrop-blur-sm border border-pink-500/10"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-4 text-pink-500/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </motion.svg>
                  <p className="text-pink-600/90 text-xl font-medium mb-2">No messages yet</p>
                  <p className="text-pink-600/50 text-sm">Start a conversation to see messages here</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: message.is_user ? 100 : -100 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className={`flex ${message.is_user ? 'justify-end' : 'justify-start'} items-end gap-2`}
            >
              {!message.is_user && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 text-pink-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.is_user 
                    ? 'bg-pink-500 text-white rounded-br-sm' 
                    : 'bg-pink-500/10 backdrop-blur-sm text-pink-600 rounded-bl-sm'
                } transform transition-all duration-300`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.message}</p>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mt-2"
                >
                  <p className="text-xs opacity-70">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                  {message.is_user && (
                    <svg
                      className="w-3 h-3 opacity-70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </motion.div>
              </motion.div>
              {message.is_user && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 text-pink-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
} 