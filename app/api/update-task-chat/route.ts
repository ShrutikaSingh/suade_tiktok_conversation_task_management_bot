import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { product_id, message, isUser } = await request.json();

    if (!product_id || !message) {
      return NextResponse.json(
        { error: 'Product ID and message are required' },
        { status: 400 }
      );
    }

    // Convert product_id to integer
    const productId = parseInt(product_id, 10);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    // Get current tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('product_id', productId);

    if (tasksError) {
      throw tasksError;
    }

    // Use OpenAI to understand the update request
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant managing tasks for product ${productId}. Current tasks: ${JSON.stringify(tasks)}
          
          You can perform the following operations:
          1. Update task status (To Do, In Progress, Completed)
          2. Update task priority (High, Medium, Low)
          3. Add/update due dates
          4. Delete tasks
          5. Filter/query tasks
          6. Provide task summaries
          7. Batch updates
          
          Return your response in this JSON format:
          {
            "operation": "update/delete/query/summary",
            "taskName": "name of the task" or null,
            "updates": {
              "priority": "High/Medium/Low" or null,
              "status": "To Do/In Progress/Completed" or null,
              "due_date": "YYYY-MM-DD" or null
            },
            "query": {
              "priority": "High/Medium/Low" or null,
              "status": "To Do/In Progress/Completed" or null,
              "has_due_date": true/false or null
            },
            "reply": "Your natural language response to the user"
          }`
        },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" }
    });

    if (!completion.choices[0]?.message?.content) {
      return NextResponse.json(
        { error: 'Failed to generate AI response' },
        { status: 500 }
      );
    }

    const response = JSON.parse(completion.choices[0].message.content);
    const { operation, taskName, updates, query, reply } = response;

    let updatedTasks = tasks;

    // Handle different operations
    switch (operation) {
      case 'update':
        if (taskName && updates) {
          const updateData: any = {};
          if (updates.priority) updateData.priority = updates.priority;
          if (updates.status) updateData.status = updates.status;
          if (updates.due_date) updateData.due_date = updates.due_date;

          if (Object.keys(updateData).length > 0) {
            const { error: updateError } = await supabase
              .from('tasks')
              .update(updateData)
              .eq('product_id', productId)
              .eq('name', taskName);

            if (updateError) {
              console.error('Error updating task:', updateError);
              return NextResponse.json(
                { error: 'Failed to update task' },
                { status: 500 }
              );
            }
          }
        }
        break;

      case 'delete':
        if (taskName) {
          const { error: deleteError } = await supabase
            .from('tasks')
            .delete()
            .eq('product_id', productId)
            .eq('name', taskName);

          if (deleteError) {
            console.error('Error deleting task:', deleteError);
            return NextResponse.json(
              { error: 'Failed to delete task' },
              { status: 500 }
            );
          }
        }
        break;

      case 'batch_update':
        if (updates) {
          const { error: batchError } = await supabase
            .from('tasks')
            .update(updates)
            .eq('product_id', productId)
            .ilike('name', `%${taskName}%`);

          if (batchError) {
            console.error('Error batch updating tasks:', batchError);
            return NextResponse.json(
              { error: 'Failed to batch update tasks' },
              { status: 500 }
            );
          }
        }
        break;
    }

    // Fetch updated tasks
    const { data: freshTasks, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('product_id', productId);

    if (fetchError) {
      console.error('Error fetching updated tasks:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch updated tasks' },
        { status: 500 }
      );
    }

    // Filter tasks if query is specified
    if (operation === 'query' && query) {
      updatedTasks = freshTasks.filter(task => {
        if (query.priority && task.priority !== query.priority) return false;
        if (query.status && task.status !== query.status) return false;
        if (query.has_due_date !== null) {
          if (query.has_due_date && !task.due_date) return false;
          if (!query.has_due_date && task.due_date) return false;
        }
        return true;
      });
    } else {
      updatedTasks = freshTasks;
    }

    return NextResponse.json({ 
      reply,
      updatedTasks,
      operation
    });
  } catch (error) {
    console.error('Error updating tasks:', error);
    return NextResponse.json(
      { error: 'Failed to update tasks' },
      { status: 500 }
    );
  }
} 