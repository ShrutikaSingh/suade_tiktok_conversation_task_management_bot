export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'To Do' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  conversation_id: string;
  product_id: string;
  name: string;
  priority: Priority;
  status: Status;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  product_id: string;
  content: string;
  created_at: string;
}

export interface ChatMessage {
  id?: string;
  product_id: string;
  message: string;
  is_user: boolean;
  created_at: string;
}

export interface ParsedTask {
  name: string;
  priority: Priority;
  status: Status;
  due_date?: string;
} 