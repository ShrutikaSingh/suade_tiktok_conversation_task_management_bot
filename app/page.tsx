'use client';

import { useState, useEffect } from 'react';
import TaskSection from './components/TaskSection';
import ChatSection from './components/ChatSection';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  // Centralized fetchTasks function
  const fetchTasks = async (productId: string | null) => {
    if (!productId) return;
    const response = await fetch(`/api/get-tasks?product_id=${productId}`);
    const data = await response.json();
    setTasks(data);
  };

  // Fetch tasks when selectedProduct changes
  useEffect(() => {
    fetchTasks(selectedProduct);
  }, [selectedProduct]);

  // Always re-fetch after any update
  const handleTasksUpdated = () => {
    fetchTasks(selectedProduct);
  };

  return (
    <div className="min-h-screen h-screen w-full overflow-hidden bg-[linear-gradient(135deg,_#f6fbff_0%,_#d6f1ff_100%)]">
      <main className="min-h-screen h-screen p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
     
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0 h-full">
            {/* Left Side - Tasks */}
            <div className="fancy-card flex flex-col h-full min-h-0 lg:col-span-2">
              
              <TaskSection 
                selectedProduct={selectedProduct}
                onProductSelect={setSelectedProduct}
                tasks={tasks}
                onTasksUpdated={handleTasksUpdated}
                fetchTasks={fetchTasks}
              />
            </div>
            {/* Right Side - Chat */}
            <div className="fancy-card flex flex-col h-full min-h-0 lg:col-span-1">
              <ChatSection 
                selectedProduct={selectedProduct}
                onTasksUpdated={handleTasksUpdated}
                fetchTasks={fetchTasks}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
