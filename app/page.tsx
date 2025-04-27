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
    <div className="min-h-screen h-screen w-full overflow-hidden bg-[linear-gradient(135deg,_#f6fbff_0%,_#d6f1ff_100%)]">
      <main className="min-h-screen h-screen p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
     
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 h-full">
            {/* Left Side - Tasks */}
            <div className="fancy-card flex flex-col h-full min-h-0">
              <TaskSection 
                selectedProduct={selectedProduct}
                onProductSelect={setSelectedProduct}
                tasks={tasks}
                onTasksUpdated={handleTasksUpdated}
              />
            </div>
            {/* Right Side - Chat */}
            <div className="fancy-card flex flex-col h-full min-h-0">
              <ChatSection 
                selectedProduct={selectedProduct}
                onTasksUpdated={handleTasksUpdated}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
