'use client';

import { useState, useEffect } from 'react';
import { ChatMessage, Product } from '../types';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ChatSectionProps {
  selectedProduct: string | null;
  onTasksUpdated?: (tasks: any[]) => void;
}

export default function ChatSection({ selectedProduct, onTasksUpdated }: ChatSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      fetchChatHistory();
      fetchProductDetails();
    } else {
      setMessages([]);
      setCurrentProduct(null);
    }
  }, [selectedProduct]);

  const fetchProductDetails = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', selectedProduct)
      .single();

    if (!error && data) {
      setCurrentProduct(data);
    }
  };

  const handleClearChat = async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('product_id', selectedProduct);

      if (error) {
        throw error;
      }

      setMessages([]);
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const fetchChatHistory = async () => {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('product_id', selectedProduct)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedProduct) {
      alert('Please select a product first');
      return;
    }

    setIsLoading(true);
    try {
      // Add user message to chat
      const userMessage: ChatMessage = {
        product_id: selectedProduct,
        message,
        is_user: true,
        created_at: new Date().toISOString(),
      };
      setMessages([...messages, userMessage]);

      // Send message to API
      const response = await fetch('/api/update-task-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: selectedProduct,
          message,
          isUser: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process message');
      }

      const { reply, updatedTasks } = await response.json();

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        product_id: selectedProduct,
        message: reply,
        is_user: false,
        created_at: new Date().toISOString(),
      };
      setMessages([...messages, userMessage, aiMessage]);

      // Save messages to database
      const { error: chatError } = await supabase
        .from('chat_history')
        .insert([userMessage, aiMessage]);

      if (chatError) {
        throw chatError;
      }

      // Notify parent component about updated tasks
      if (updatedTasks && onTasksUpdated) {
        onTasksUpdated(updatedTasks);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="h-full flex flex-col bg-[#FEF5FA] rounded-xl border border-pink-500/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between mb-6 p-4 border-b border-pink-500/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div className="flex items-center gap-3">
          <motion.h2 
            className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Chat History
          </motion.h2>
          {selectedProduct && (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-sm text-pink-600/60">
                {messages.length} messages
              </span>
            </motion.div>
          )}
        </motion.div>
        {selectedProduct && (
          <motion.div 
            className="flex items-center gap-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-sm text-pink-600/60 bg-pink-500/5 px-4 py-2 rounded-lg border border-pink-500/20">
              Product ID: {selectedProduct}
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-sm text-pink-600 hover:text-pink-700 bg-pink-500/5 hover:bg-pink-500/10 px-4 py-2 rounded-lg border border-pink-500/20 transition-all duration-300"
            >
              Clear Chat
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Clear Chat History
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to clear all chat history for {currentProduct?.name} (ID: {selectedProduct})? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearChat}
                  className="px-4 py-2 text-sm text-white bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
                >
                  Clear History
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-hidden mb-4 relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="relative w-16 h-16"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full border-4 border-pink-500/30 rounded-full" />
                  <div className="w-full h-full border-4 border-pink-500 border-t-transparent rounded-full absolute top-0 left-0" />
                </motion.div>
                <motion.p 
                  className="text-pink-600/60 text-sm"
                  animate={{ 
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Processing your message...
                </motion.p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ChatHistory messages={messages} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </motion.div>
    </motion.div>
  );
} 