'use client';

import { Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

interface TaskTableProps {
  tasks: Task[];
}

export default function TaskTable({ tasks }: TaskTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: '', direction: null };
        return { key, direction: 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedTasks = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return tasks;
    const sorted = [...tasks];
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key as keyof Task];
      let bValue = b[sortConfig.key as keyof Task];
      if (sortConfig.key === 'due_date') {
        const aTime = aValue ? new Date(aValue as string).getTime() : 0;
        const bTime = bValue ? new Date(bValue as string).getTime() : 0;
        if (aTime < bTime) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aTime > bTime) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      if (sortConfig.key === 'id') {
        const aNum = typeof aValue === 'number' ? aValue : Number(aValue);
        const bNum = typeof bValue === 'number' ? bValue : Number(bValue);
        if (aNum < bNum) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aNum > bNum) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      if (sortConfig.key === 'priority') {
        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
        const aPriority = priorityOrder[(aValue as 'Low' | 'Medium' | 'High')] ?? 0;
        const bPriority = priorityOrder[(bValue as 'Low' | 'Medium' | 'High')] ?? 0;
        if (aPriority < bPriority) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aPriority > bPriority) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [tasks, sortConfig]);

  const renderSortArrow = (key: string) => {
    if (sortConfig.key !== key || !sortConfig.direction) {
      // Default up/down icon
      return (
        <span className="ml-1 inline-block align-middle opacity-40">
          <svg width="14" height="18" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
            <polygon points="10,4 16,10 4,10" fill="black" />
            <polygon points="10,20 16,14 4,14" fill="black" />
          </svg>
        </span>
      );
    }
    // Show sort direction
    return (
      <span className={`ml-1 inline-block transition-transform align-middle ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}
        aria-label={sortConfig.direction === 'asc' ? 'Ascending' : 'Descending'}>
        <svg width="14" height="18" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
          <polygon points="10,4 16,10 4,10" fill="black" />
        </svg>
      </span>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Low':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'To Do':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'in progress':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent h-full">
        <table className="w-full">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-sm font-semibold text-black cursor-pointer select-none" onClick={() => handleSort('id')}>
                <span className="flex items-center gap-1">Task ID {renderSortArrow('id')}</span>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">Task Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black cursor-pointer select-none" onClick={() => handleSort('priority')}>
                <span className="flex items-center gap-1">Priority {renderSortArrow('priority')}</span>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black cursor-pointer select-none" onClick={() => handleSort('status')}>
                <span className="flex items-center gap-1">Status {renderSortArrow('status')}</span>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black cursor-pointer select-none" onClick={() => handleSort('due_date')}>
                <span className="flex items-center gap-1">Due Date {renderSortArrow('due_date')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedTasks.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <td colSpan={5} className="px-6 py-12">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block p-4 rounded-full bg-[#F746A4]/5 mb-4"
                      >
                        <svg className="w-8 h-8 text-[#F746A4]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </motion.div>
                      <p className="text-[#F746A4]/90 text-sm font-medium">No tasks found</p>
                      <p className="text-[#F746A4]/40 text-sm mt-1">Paste a conversation to get started!</p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                sortedTasks.map((task, index) => (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-[#F746A4]/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-500">{task.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-medium text-[#F746A4]">{task.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-[#F746A4]/60 text-sm">
                        <svg className="w-4 h-4 mr-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : '-'}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
} 