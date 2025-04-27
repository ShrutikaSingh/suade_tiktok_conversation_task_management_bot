-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create conversations table
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')) NOT NULL,
    status TEXT CHECK (status IN ('To Do', 'In Progress', 'Completed')) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create chat_history table
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_user BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_product_id ON tasks(product_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_chat_history_product_id ON chat_history(product_id);
CREATE INDEX idx_conversations_product_id ON conversations(product_id);
