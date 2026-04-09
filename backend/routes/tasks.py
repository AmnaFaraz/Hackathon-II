from datetime import datetime
from typing import Literal, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from database import get_session
from models import Task, TaskCreate, TaskRead, TaskUpdate
from dapr.clients import DaprClient
import json

router = APIRouter()


@router.get("/{user_id}/tasks", response_model=list[TaskRead])
def list_tasks(
    user_id: str,
    status: Optional[Literal["all", "pending", "completed"]] = Query(default="all"),
    sort: Optional[Literal["created", "priority", "due", "title"]] = Query(default="created"),
    search: Optional[str] = Query(default=None),
    session: Session = Depends(get_session),
):
    query = select(Task).where(Task.user_id == user_id)

    if status == "pending":
        query = query.where(Task.completed == False)
    elif status == "completed":
        query = query.where(Task.completed == True)

    if search:
        query = query.where(
            Task.title.ilike(f"%{search}%") | Task.description.ilike(f"%{search}%")
        )

    tasks = session.exec(query).all()

    # Sort in Python for flexibility
    priority_order = {"urgent": 0, "high": 1, "medium": 2, "low": 3}
    if sort == "priority":
        tasks = sorted(tasks, key=lambda t: priority_order.get(t.priority, 99))
    elif sort == "due":
        tasks = sorted(tasks, key=lambda t: (t.due_date is None, t.due_date))
    elif sort == "title":
        tasks = sorted(tasks, key=lambda t: t.title.lower())
    else:  # created (default)
        tasks = sorted(tasks, key=lambda t: t.created_at, reverse=True)

    return tasks


@router.post("/{user_id}/tasks", response_model=TaskRead, status_code=201)
def create_task(
    user_id: str,
    task_in: TaskCreate,
    session: Session = Depends(get_session),
):
    task = Task(**task_in.model_dump(), user_id=user_id)
    session.add(task)
    session.commit()
    session.refresh(task)

    # Phase V: Publish event to Dapr
    try:
        with DaprClient() as client:
            client.publish_event(
                pubsub_name="todo-pubsub",
                topic_name="task-events",
                data=json.dumps({
                    "id": task.id,
                    "user_id": user_id,
                    "title": task.title,
                    "action": "created"
                }),
                data_content_type="application/json",
            )
    except Exception as e:
        # Don't fail the request if Dapr is not available (common in local dev)
        print(f"Dapr publish failed: {e}")

    return task


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskRead)
def get_task(user_id: str, task_id: int, session: Session = Depends(get_session)):
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    return task


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskRead)
def update_task(
    user_id: str,
    task_id: int,
    task_in: TaskUpdate,
    session: Session = Depends(get_session),
):
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    update_data = task_in.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(task, key, val)
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{user_id}/tasks/{task_id}", status_code=204)
def delete_task(user_id: str, task_id: int, session: Session = Depends(get_session)):
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    session.delete(task)
    session.commit()


@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskRead)
def toggle_complete(
    user_id: str, task_id: int, session: Session = Depends(get_session)
):
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
