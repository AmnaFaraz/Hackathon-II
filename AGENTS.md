# AGENTS.md

Spec-driven development. No code without spec.
LLM: Groq llama-3.3-70b-versatile. Never openai/anthropic.
Frontend: Next.js 15 + shadcn/ui. DB: Supabase. Deploy: Vercel + Koyeb.

## Student
Name: Amna Faraz
GitHub: AmnaFaraz

## Project
Hackathon II — Evolution of TODO (5 Phases)
Points: 1000 pts + 600 bonus
Submit: https://forms.gle/KMKEKaFUD6ZX4UtY8

## Stack
- Phase I: Python console (rich, dataclasses)
- Phase II+: FastAPI + SQLModel + Next.js 15 + shadcn/ui
- Auth: Better Auth (emailAndPassword + jwt plugin)
- DB: Supabase free tier (PostgreSQL)
- Phase III: Groq llama-3.3-70b-versatile (tool_calling)
- Phase IV: Docker + Minikube + Kubernetes
- Phase V: Kafka (Strimzi) + Dapr + Oracle Cloud OKE

## Rules
- All LLM calls use Groq SDK with model: llama-3.3-70b-versatile
- Frontend: Next.js 15 App Router + TypeScript strict + Tailwind CSS + shadcn/ui
- Backend: FastAPI + Python 3.13 + uvicorn + SQLModel
- NEVER commit .env or .env.local files
- BUILD GATE: npm run build must pass 0 errors before deploy
