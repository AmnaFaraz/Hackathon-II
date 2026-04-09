# Phase IV Spec — Kubernetes
Add Docker and Kubernetes support to the TODO app for local development and orchestration.

## Dockerization

### Backend (`backend/Dockerfile`)
- Use `python:3.13-slim`.
- Install `libpq-dev` for Postgres support.
- Expose port 8000.
- Command: `uvicorn main:app --host 0.0.0.0 --port 8000`.

### Frontend (`frontend/Dockerfile`)
- Use multi-stage build (`node:22-alpine`).
- Enable `standalone` output in `next.config.ts`.
- Expose port 3000.
- Command: `node server.js`.

### Orchestration (`docker-compose.yml`)
- Unified setup for local testing.
- Links `frontend` to `backend` via environment variables.

## Kubernetes (`k8s/`)

### Namespace
- `todo-app`

### Config & Secrets
- `ConfigMap`: `NEXT_PUBLIC_API_URL`.
- `Secret`: `DATABASE_URL`, `GROQ_API_KEY`.

### Services
- `backend-service`: ClusterIP (internal).
- `frontend-service`: LoadBalancer (external).

## Deployment Steps
1. Build images: `docker build -t hackathon-2-backend ./backend && docker build -t hackathon-2-frontend ./frontend`.
2. Apply manifests: `kubectl apply -f k8s/`.
3. Expose frontend: `minikube service frontend-service -n todo-app`.
