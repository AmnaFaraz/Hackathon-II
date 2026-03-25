from datetime import datetime
from typing import Literal
from models import Task


class TodoApp:
    def __init__(self):
        self._tasks: list[Task] = []
        self._counter: int = 0

    def _next_id(self) -> int:
        self._counter += 1
        return self._counter

    def _find(self, task_id: int) -> Task:
        for t in self._tasks:
            if t.id == task_id:
                return t
        raise ValueError(f"Task #{task_id} not found.")

    def add(self, title: str, description: str = "") -> Task:
        if not title or not title.strip():
            raise ValueError("Title is required.")
        if len(title) > 100:
            raise ValueError("Title must be 100 characters or less.")
        if len(description) > 500:
            raise ValueError("Description must be 500 characters or less.")

        task = Task(
            id=self._next_id(),
            title=title.strip(),
            description=description.strip(),
            completed=False,
            created_at=datetime.now(),
        )
        self._tasks.append(task)
        return task

    def delete(self, task_id: int) -> bool:
        try:
            task = self._find(task_id)
            self._tasks.remove(task)
            return True
        except ValueError:
            return False

    def update(
        self,
        task_id: int,
        title: str | None = None,
        description: str | None = None,
    ) -> Task:
        task = self._find(task_id)
        if title is not None:
            if not title.strip():
                raise ValueError("Title cannot be empty.")
            if len(title) > 100:
                raise ValueError("Title must be 100 characters or less.")
            task.title = title.strip()
        if description is not None:
            if len(description) > 500:
                raise ValueError("Description must be 500 characters or less.")
            task.description = description.strip()
        return task

    def complete(self, task_id: int) -> Task:
        task = self._find(task_id)
        task.completed = True
        return task

    def list(
        self, filter: Literal["all", "pending", "completed"] = "all"
    ) -> list[Task]:
        if filter == "pending":
            return [t for t in self._tasks if not t.completed]
        elif filter == "completed":
            return [t for t in self._tasks if t.completed]
        return list(self._tasks)
