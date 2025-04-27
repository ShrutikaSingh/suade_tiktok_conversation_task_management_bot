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
    const { content, product_id } = await request.json();

    if (!content || !product_id) {
      return NextResponse.json(
        { error: 'Content and product_id are required' },
        { status: 400 }
      );
    }

    // Save conversation to database
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert([{ content, product_id }])
      .select()
      .single();

    if (conversationError) {
      throw conversationError;
    }

    // Parse conversation using OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a task management assistant. Analyze the following conversation and extract tasks. 
          Each task should have a name, priority (High/Medium/Low), status (To Do/In Progress/Completed), and an optional due date.
          Focus on identifying:
          - Customer questions
          - Positive/Negative feedback
          - Product suggestions
          - Pricing concerns
          - International shipping requests
          - Influencer/partnership inquiries
          Return the tasks in JSON format.`
        },
        {
          role: 'user',
          content: content
        }
      ],
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' }
    });

    const tasks = JSON.parse(completion.choices[0].message.content).tasks;

    // Save tasks to database
    const tasksWithIds = tasks.map((task: any) => ({
      ...task,
      conversation_id: conversation.id,
      product_id,
      status: 'To Do',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error: tasksError } = await supabase
      .from('tasks')
      .insert(tasksWithIds);

    if (tasksError) {
      throw tasksError;
    }

    return NextResponse.json(tasksWithIds);
  } catch (error) {
    console.error('Error parsing conversation:', error);
    return NextResponse.json(
      { error: 'Failed to parse conversation' },
      { status: 500 }
    );
  }
} 