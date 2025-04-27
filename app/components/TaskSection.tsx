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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');

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

  const handleAddProduct = async () => {
    if (!newProductName.trim()) {
      alert('Product name cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{ name: newProductName }])
        .select()
        .single();
      if (error) throw error;
      setProducts([data, ...products]);
      onProductSelect(data.id);
      setIsDialogOpen(false);
      setNewProductName('');
    } catch (error) {
      console.error('Error creating product:', error);
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
        className="flex items-center justify-between mb-0 bg-[linear-gradient(135deg,_#f8f6ff_0%,_#ede7fa_100%)] rounded-xl p-4 border-b border-gray-100"
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
          <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#F746A4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Select Product</span>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 text-gray-700 rounded-lg py-2 pl-4 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all duration-300"
                value={selectedProduct || ''}
                onChange={(e) => {
                  if (e.target.value === 'add') {
                    setIsDialogOpen(true);
                  } else {
                    onProductSelect(e.target.value);
                  }
                }}
              >
                
                <option value="" className="bg-white text-gray-400">Select a Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id} className="bg-white text-gray-700">
                    {product.name}
                  </option>
                ))}
                <option value="add" className="bg-white text-gray-700">+ Add New Product</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
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

      {/* Dialog for adding a new product */}
      {isDialogOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsDialogOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg p-6 w-96 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Product</h2>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Enter product name"
              className="w-full p-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#F746A4]/20 focus:border-[#F746A4]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddProduct();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-[#F746A4] text-white rounded-lg hover:bg-[#F746A4]/90 transition-colors"
              >
                Add Product
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 