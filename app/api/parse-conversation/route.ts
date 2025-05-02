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

    const CATEGORY_ENUM_MAP: Record<number, string> = {
      1: 'Product Suggestions',
      2: 'Customer Support',
      3: 'Collaboration or Partnership',
      4: 'Shipping and Availability',
      5: 'Content Requests',
      6: 'Shade or Color Requests',
      7: 'Application or Usage Questions',
      8: 'Others',
    };
    

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
          content: `You are a task management assistant. Analyze the following conversation and extract tasks only if they represent recurring themes or urgent issues.

Each task must include:
- name
- priority (High/Medium/Low)
- status (To Do/In Progress/Completed)
- optional due date
- category: use ONLY the numeric ID from the list below

Use the following **strict category number mapping**:
1: Product Suggestions  
2: Customer Support  
3: Collaboration or Partnership  
4: Shipping and Availability  
5: Content Requests  
6: Shade or Color Requests  
7: Application or Usage Questions  
8: Others

⚠️ Return only the category **number**, not the label.

Focus on identifying:
- Comments that suggest product improvements or restocking needs  
- Customer support issues that require immediate attention  
- Opportunities for collaboration or partnership  
- Questions about shipping and product availability  
- Requests for content creation or marketing campaigns  
- Feedback on product shades or colors  
- Questions about product application or usage  

✅ Return only a strict JSON object like this:
{
  "tasks": [
    {
      "name": "Restock Cheirosa 76",
      "priority": "High",
      "status": "To Do",
      "due_date": "2024-05-10",
      "category": 1
    },
    {
      "name": "Clarify scent differences",
      "priority": "Medium",
      "status": "To Do",
      "category": 5
    }
  ]
}

Do not include any explanation. Only return the JSON object. Ignore conversation parts that do not match the above task types.`

           
        },
        {
          role: 'user',
          content: content
        }
      ],
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' }
    });

    const contentStr = completion.choices[0].message.content;
    console.log(contentStr)
    if (typeof contentStr !== 'string') {
      throw new Error('OpenAI response content is null or not a string');
    }
    const tasks = JSON.parse(contentStr).tasks;

    // Save tasks to database
    const tasksWithIds = tasks.map((task: any) => ({
      ...task,
      category: CATEGORY_ENUM_MAP[task.category], // numeric key only
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