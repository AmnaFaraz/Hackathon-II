# Phase III Spec — AI Chatbot

## Overview
Add a Groq-powered AI chatbot to the TODO app. The chatbot can manage tasks via Groq tool_calling.

## New Supabase Tables

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tool_calls JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Backend

### New file: routes/chat.py

```
POST /api/{user_id}/chat
Request:  { conversation_id?: str, message: str }
Response: { conversation_id: str, response: str, tool_calls: list[str] }
```

### Chat Flow
1. Load last 10 messages from conversation
2. Store user message in Supabase
3. Call Groq llama-3.3-70b-versatile with tools
4. Execute any tool_calls (add/list/complete/delete/update task)
5. Feed tool results back to Groq
6. Store assistant response
7. Return { conversation_id, response, tool_calls: [tool names used] }

### Groq Tools

| Tool | Args | Action |
|------|------|--------|
| add_task | title, description?, priority?, due_date? | Create new task |
| list_tasks | status?, sort? | Return task list |
| complete_task | task_id | Mark complete |
| delete_task | task_id | Delete task |
| update_task | task_id, title?, description?, priority?, due_date? | Update task |

### System Prompt
"You are a friendly TODO assistant for {user_id}. Help manage their tasks using the available tools. Always confirm actions taken. Be concise and helpful."

## Frontend

### New page: /chat

Layout:
- Left sidebar: conversation list (title, date)
- Main area: message thread
  - User messages: right-aligned, accent color bubble
  - Bot messages: left-aligned, neutral bubble
  - Tool call pills under bot messages: "✓ Task added", "✓ Task completed"
  - Typing indicator (animated dots)
- Bottom: auto-resize textarea + Send button
  - Ctrl+Enter to send

New conversation button in sidebar.
Click conversation to load history.
