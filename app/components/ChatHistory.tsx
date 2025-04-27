'use client';

import { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiUser } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';

interface ChatHistoryProps {
  messages: ChatMessage[];
}

const USER_AVATAR = '/avatars/candace.png'; // Place your static user image in public/avatars/
const AI_AVATAR = '/avatars/suade.png';    // Place your static AI image in public/avatars/

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="space-y-6 p-4 h-full overflow-y-auto bg-[#F8F8FA]">
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
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4 text-pink-500/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
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
            </div>
          </motion.div>
        ) : (
          messages.map((message, index) => {
            const isUser = message.is_user;
            const name = isUser ? 'Candace Doe' : 'Suade';
            const date = new Date(message.created_at);
            const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            return (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: isUser ? 100 : -100 }}
                transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div className="flex flex-col items-center mr-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-xl border shadow">
                      <FaRobot />
                    </div>
                  </div>
                )}
                <div className={`max-w-[70%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-sm">{name}</span>
                    <span className="text-xs text-gray-400">{formattedDate}</span>
                  </div>
                  <div className={`p-4 rounded-2xl shadow-md ${isUser ? 'bg-white' : 'bg-gradient-to-br from-white to-[#f3e8ff]'} text-gray-900 text-base whitespace-pre-line`}>
                    {message.message}
                  </div>
                </div>
                {/* User Avatar */}
                {isUser && (
                  <div className="flex flex-col items-center ml-2">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xl border shadow">
                      <FiUser />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
      {/* Processing State Example (show if needed) */}
      {/*
      <div className="flex items-center gap-2 mt-4">
        <span className="font-bold text-gray-900">Suade</span>
        <svg className="animate-spin h-5 w-5 text-pink-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="text-gray-500">Processing...</span>
      </div>
      */}
    </div>
  );
} 