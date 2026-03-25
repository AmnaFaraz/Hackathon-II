# Phase I Spec — Python Console TODO App

## Overview
A terminal-based TODO application built with Python dataclasses and `rich` library for formatted output. Implements a REPL (Read-Eval-Print Loop) interface.

## Data Model

```python
@dataclass
class Task:
    id: int
    title: str
    description: str
    completed: bool
    created_at: datetime
```

## TodoApp Class — Required Methods

| Method | Signature | Behavior |
|--------|-----------|----------|
| add | `add(title, description) -> Task` | Auto-increment id, completed=False, created_at=now() |
| delete | `delete(task_id: int) -> bool` | Remove by id, return False if not found |
| update | `update(task_id, title?, description?) -> Task` | Partial update, raise if not found |
| complete | `complete(task_id: int) -> Task` | Set completed=True |
| list | `list(filter?) -> list[Task]` | filter: all/pending/completed |

## REPL Interface

Commands:
- `add` — prompt for title + description
- `delete <id>` — delete task
- `update <id>` — prompt for new title/description
- `complete <id>` — mark complete
- `list [all|pending|completed]` — show table
- `help` — show commands
- `exit` / `quit` — exit app

## Display Table (rich)

Columns: ID | Status | Title | Description | Created
- Status: ✅ (completed) / ⬜ (pending)
- Created: relative format (e.g. "2 hours ago")
- Title column: max 30 chars, truncate with ...
- Description: max 50 chars, truncate with ...

## Validation
- Title: required, min 1 char, max 100 chars
- Description: optional, max 500 chars
- Task ID: must be positive integer

## Files
- `phase-1/main.py` — entry point (python main.py)
- `phase-1/todo_app.py` — TodoApp class
- `phase-1/models.py` — Task dataclass
- `phase-1/display.py` — rich table rendering
- `phase-1/requirements.txt` — rich>=13.0.0
