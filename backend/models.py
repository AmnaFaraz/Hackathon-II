from datetime import datetime
from typing import Literal, Optional
from sqlmodel import SQLModel, Field, Column, JSON


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = False
    priority: Literal["low", "medium", "high", "urgent"] = "medium"
    tags: list[str] = Field(default=[], sa_column=Column(JSON))
    due_date: Optional[datetime] = None


class Task(TaskBase, table=True):
    __tablename__ = "tasks"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskCreate(TaskBase):
    pass


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[Literal["low", "medium", "high", "urgent"]] = None
    tags: Optional[list[str]] = None
    due_date: Optional[datetime] = None


class TaskRead(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime
