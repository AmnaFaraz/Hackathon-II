# Phase II Spec — Full-Stack Web App

## Overview
Full-stack TODO app with FastAPI backend (SQLModel + JWT auth) and Next.js 15 frontend (shadcn/ui + Better Auth).

## Backend

### Models (SQLModel)
```python
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str
    title: str
    description: str | None = None
    completed: bool = False
    priority: Literal["low", "medium", "high", "urgent"] = "medium"
    tags: list[str] = Field(default=[], sa_column=Column(JSON))
    due_date: datetime | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/{user_id}/tasks | List tasks (filter: status, sort, search) |
| POST | /api/{user_id}/tasks | Create task |
| GET | /api/{user_id}/tasks/{id} | Get single task |
| PUT | /api/{user_id}/tasks/{id} | Full update |
| DELETE | /api/{user_id}/tasks/{id} | Delete task |
| PATCH | /api/{user_id}/tasks/{id}/complete | Toggle complete |
| GET | /health | Health check |

Query params: `?status=pending|completed|all`, `?sort=created|priority|due|title`, `?search=<term>`

### Auth
- Better Auth with emailAndPassword + jwt plugin
- JWT middleware validates Bearer token on all /api routes

## Frontend

### Pages
| Route | Description |
|-------|-------------|
| / | Landing page |
| /sign-in | Login form |
| /sign-up | Register form |
| /dashboard | Main task list |
| /dashboard/[id] | Task detail |

### Dashboard Features
- Task list with ✅/⬜ toggle
- Filter: All / Pending / Completed
- Sort: Created / Priority / Due / Title
- Priority badges: urgent=red, high=orange, medium=yellow, low=green
- Add task modal (title, desc, priority, tags, due date)
- Inline edit
- Delete with confirmation dialog
- Mark complete with animation
- Client-side search
- Loading skeletons
- Empty state with CTA
- Keyboard shortcut: `N` = new task

## Database
- Supabase PostgreSQL
- Table: tasks (matches SQLModel schema above)

## Files
```
backend/
  main.py
  models.py
  routes/tasks.py
  routes/auth.py
  database.py
  middleware/auth.py
  requirements.txt
  .env.example

frontend/
  app/page.tsx
  app/sign-in/page.tsx
  app/sign-up/page.tsx
  app/dashboard/page.tsx
  app/dashboard/[id]/page.tsx
  components/TaskCard.tsx
  components/TaskModal.tsx
  components/FilterBar.tsx
  components/PriorityBadge.tsx
  lib/api.ts
  lib/auth.ts
  .env.local.example
```
