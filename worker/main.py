import os
import json
from fastapi import FastAPI, Body
from dapr.ext.fastapi import DaprApp
from groq import Groq
from sqlmodel import Session, create_engine, select
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Setup
app = FastAPI(title="Todo Worker")
dapr_app = DaprApp(app)

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL) if DATABASE_URL else None
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Import Task model logic (simplified for worker)
from sqlmodel import SQLModel, Field, Column, JSON
from typing import Optional, Literal

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: str = "medium"
    tags: list[str] = Field(default=[], sa_column=Column(JSON))
    updated_at: datetime = Field(default_factory=datetime.utcnow)

@app.get("/health")
def health():
    return {"status": "ok", "service": "todo-worker"}

@dapr_app.subscribe(pubsub_name="todo-pubsub", topic="task-events")
def task_event_handler(event_data=Body(...)):
    print(f"Received event: {event_data}")
    
    data = event_data.get("data")
    if isinstance(data, str):
        data = json.loads(data)
    
    action = data.get("action")
    task_id = data.get("id")
    user_id = data.get("user_id")
    title = data.get("title")

    if action == "created" and engine:
        process_new_task(task_id, user_id, title)

def process_new_task(task_id, user_id, title):
    try:
        # Use Groq to analyze task and suggest tags/subtasks
        prompt = f"Analyze this task: '{title}'. Suggest 3 relevant tags as a JSON list. Keep it concise."
        
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        suggestions = json.loads(chat_completion.choices[0].message.content)
        tags = suggestions.get("tags", [])
        
        # Update task with tags
        with Session(engine) as session:
            task = session.get(Task, task_id)
            if task:
                task.tags = list(set(task.tags + tags))
                task.updated_at = datetime.utcnow()
                session.add(task)
                session.commit()
                print(f"Updated task {task_id} with tags: {tags}")
                
    except Exception as e:
        print(f"Error processing task {task_id}: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
