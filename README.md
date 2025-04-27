# Suade Task Manager

An AI-powered task management system that parses social media conversations and generates structured tasks.

## Features

- Parse social media conversations into structured tasks
- AI-powered task management through chat interface
- Real-time task updates
- Product-based task organization
- Modern and responsive UI

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd suade-task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

4. Set up the Supabase database:
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in the Supabase SQL editor

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Select a product from the dropdown menu
2. Paste a social media conversation in the text area
3. Click "Parse Conversation" to generate tasks
4. Use the chat interface to manage tasks:
   - Update task status
   - Change priorities
   - Set due dates
   - Add new tasks

## Project Structure

```
suade-task-manager/
├── app/
│   ├── api/                 # API routes
│   ├── components/          # React components
│   ├── types/              # TypeScript types
│   └── page.tsx            # Main page
├── supabase/
│   └── schema.sql          # Database schema
└── public/                 # Static assets
```

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenAI API
- Supabase
- React 19

## License

MIT
