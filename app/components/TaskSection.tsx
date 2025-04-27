'use client';

import { useState, useEffect } from 'react';
import { Task, Product } from '../types';
import TaskTable from './TaskTable';
import ConversationInput from './ConversationInput';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TaskSectionProps {
  selectedProduct: string | null;
  onProductSelect: (productId: string) => void;
  tasks: Task[];
  onTasksUpdated: (tasks: Task[]) => void;
}

export default function TaskSection({ selectedProduct, onProductSelect, tasks, onTasksUpdated }: TaskSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    if (selectedProduct) {
      fetchTasks();
    }
  }, [selectedProduct]);

  // Select the first product by default if none is selected
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      onProductSelect(products[0].id);
    }
  }, [products, selectedProduct, onProductSelect]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/get-tasks?product_id=${selectedProduct}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      onTasksUpdated(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationSubmit = async (conversation: string) => {
    if (!selectedProduct) {
      alert('Please select a product first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/parse-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: conversation,
          product_id: selectedProduct,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse conversation');
      }

      const newTasks = await response.json();
      onTasksUpdated([...tasks, ...newTasks]);
    } catch (error) {
      console.error('Error parsing conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="h-full flex flex-col bg-[linear-gradient(135deg,_#f8f6ff_0%,_#ede7fa_100%)] rounded-xl border border-gray-100 shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between mb-6 bg-[linear-gradient(135deg,_#f8f6ff_0%,_#ede7fa_100%)] rounded-xl p-4 border-b border-gray-100"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <motion.h2 
            className="text-2xl font-bold text-gray-900"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            My Tasks
          </motion.h2>
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
            <span className="text-sm text-pink-600 ">
              {tasks.length} tasks
            </span>
          </motion.div>
        </div>
        <motion.div 
          className="relative"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-200 text-gray-700 rounded-lg py-2 pl-4 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all duration-300"
              value={selectedProduct || ''}
              onChange={(e) => onProductSelect(e.target.value)}
            >
              <option value="" className="bg-white text-gray-400">Select a Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id} className="bg-white text-gray-700">
                  {product.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ConversationInput onSubmit={handleConversationSubmit} />
      </motion.div>

      <motion.div 
        className="flex-1 flex flex-col min-h-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
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
                  <div className="w-full h-full border-4 border-[#F746A4]/30 rounded-full" />
                  <div className="w-full h-full border-4 border-[#F746A4] border-t-transparent rounded-full absolute top-0 left-0" />
                </motion.div>
                <motion.p 
                  className="text-[#F746A4]/60 text-sm"
                  animate={{ 
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Loading tasks...
                </motion.p>
              </motion.div>
            </motion.div>
          ) :(
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto h-0"
            >
              <TaskTable tasks={tasks} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
} 