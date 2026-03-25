"""
Phase III — AI Chatbot via Groq tool_calling
"""

import json
import os
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from groq import Groq
from database import get_session
from models import Task, TaskCreate

router = APIRouter()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

# ── Supabase tables for conversations + messages are managed separately ──
# Using simple in-memory fallback for Phase III demo; swap with Supabase client as needed.

CONVERSATIONS: dict[str, list[dict]] = {}


class ChatRequest(BaseModel):
    conversation_id: str | None = None
    message: str


class ChatResponse(BaseModel):
    conversation_id: str
    response: str
    tool_calls: list[str]


TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Add a new task for the user",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "urgent"]},
                    "due_date": {"type": "string", "description": "ISO 8601 datetime string"},
                },
                "required": ["title"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "List tasks for the user",
            "parameters": {
                "type": "object",
                "properties": {
                    "status": {"type": "string", "enum": ["all", "pending", "completed"]},
                    "sort": {"type": "string", "enum": ["created", "priority", "due", "title"]},
                },
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "complete_task",
            "description": "Mark a task as completed",
            "parameters": {
                "type": "object",
                "properties": {"task_id": {"type": "integer"}},
                "required": ["task_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Delete a task",
            "parameters": {
                "type": "object",
                "properties": {"task_id": {"type": "integer"}},
                "required": ["task_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "update_task",
            "description": "Update an existing task",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer"},
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "urgent"]},
                    "due_date": {"type": "string"},
                },
                "required": ["task_id"],
            },
        },
    },
]


def execute_tool(tool_name: str, args: dict, user_id: str, session: Session) -> str:
    if tool_name == "add_task":
        task = Task(
            user_id=user_id,
            title=args["title"],
            description=args.get("description"),
            priority=args.get("priority", "medium"),
            due_date=datetime.fromisoformat(args["due_date"]) if args.get("due_date") else None,
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        return f"Task #{task.id} '{task.title}' added successfully."

    elif tool_name == "list_tasks":
        status = args.get("status", "all")
        query = select(Task).where(Task.user_id == user_id)
        if status == "pending":
            query = query.where(Task.completed == False)
        elif status == "completed":
            query = query.where(Task.completed == True)
        tasks = session.exec(query).all()
        if not tasks:
            return "No tasks found."
        lines = [f"#{t.id} [{('✅' if t.completed else '⬜')}] {t.title} ({t.priority})" for t in tasks]
        return "\n".join(lines)

    elif tool_name == "complete_task":
        task = session.exec(
            select(Task).where(Task.id == args["task_id"], Task.user_id == user_id)
        ).first()
        if not task:
            return f"Task #{args['task_id']} not found."
        task.completed = True
        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        return f"Task #{task.id} '{task.title}' marked as complete."

    elif tool_name == "delete_task":
        task = session.exec(
            select(Task).where(Task.id == args["task_id"], Task.user_id == user_id)
        ).first()
        if not task:
            return f"Task #{args['task_id']} not found."
        session.delete(task)
        session.commit()
        return f"Task #{args['task_id']} deleted."

    elif tool_name == "update_task":
        task = session.exec(
            select(Task).where(Task.id == args["task_id"], Task.user_id == user_id)
        ).first()
        if not task:
            return f"Task #{args['task_id']} not found."
        if "title" in args:
            task.title = args["title"]
        if "description" in args:
            task.description = args["description"]
        if "priority" in args:
            task.priority = args["priority"]
        if "due_date" in args:
            task.due_date = datetime.fromisoformat(args["due_date"])
        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        return f"Task #{task.id} updated."

    return "Unknown tool."


@router.post("/{user_id}/chat", response_model=ChatResponse)
def chat(user_id: str, req: ChatRequest, session: Session = Depends(get_session)):
    # Get or create conversation
    conv_id = req.conversation_id or f"{user_id}-{datetime.utcnow().timestamp()}"
    history = CONVERSATIONS.get(conv_id, [])

    # Add user message
    history.append({"role": "user", "content": req.message})

    # Build messages (last 10)
    system_msg = {
        "role": "system",
        "content": (
            f"You are a friendly TODO assistant for user '{user_id}'. "
            "Help manage their tasks using the available tools. "
            "Always confirm actions taken. Be concise and helpful."
        ),
    }
    messages = [system_msg] + history[-10:]

    # Call Groq
    response = groq_client.chat.completions.create(
        model=MODEL,
        messages=messages,
        tools=TOOLS,
        tool_choice="auto",
        max_tokens=1024,
    )

    tool_names_used: list[str] = []
    msg = response.choices[0].message

    # Execute tool calls if any
    if msg.tool_calls:
        tool_results = []
        for tc in msg.tool_calls:
            tool_name = tc.function.name
            args = json.loads(tc.function.arguments)
            result = execute_tool(tool_name, args, user_id, session)
            tool_names_used.append(tool_name)
            tool_results.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "content": result,
            })

        # Add assistant + tool results to messages, get final response
        messages.append({"role": "assistant", "content": msg.content or "", "tool_calls": [
            {"id": tc.id, "type": "function", "function": {"name": tc.function.name, "arguments": tc.function.arguments}}
            for tc in msg.tool_calls
        ]})
        messages.extend(tool_results)

        final = groq_client.chat.completions.create(
            model=MODEL,
            messages=messages,
            max_tokens=512,
        )
        assistant_content = final.choices[0].message.content or ""
    else:
        assistant_content = msg.content or ""

    # Store assistant reply in history
    history.append({"role": "assistant", "content": assistant_content})
    CONVERSATIONS[conv_id] = history

    return ChatResponse(
        conversation_id=conv_id,
        response=assistant_content,
        tool_calls=tool_names_used,
    )
