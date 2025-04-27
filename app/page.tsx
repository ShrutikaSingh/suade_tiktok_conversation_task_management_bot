'use client';

import { useState } from 'react';
import TaskSection from './components/TaskSection';
import ChatSection from './components/ChatSection';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  const handleTasksUpdated = (updatedTasks: any[]) => {
    setTasks(updatedTasks);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 animate-float">
          <h1 className="text-4xl font-bold text-white mb-2">Suade Task Manager</h1>
          <p className="text-white/80">AI-powered task management for beauty conversations</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Tasks */}
          <div className="fancy-card h-[calc(100vh-12rem)]">
            <TaskSection 
              selectedProduct={selectedProduct}
              onProductSelect={setSelectedProduct}
              tasks={tasks}
              onTasksUpdated={handleTasksUpdated}
            />
          </div>

          {/* Right Side - Chat */}
          <div className="fancy-card h-[calc(100vh-12rem)]">
            <ChatSection 
              selectedProduct={selectedProduct}
              onTasksUpdated={handleTasksUpdated}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
