# Hackathon II — Evolution of TODO

**Student:** Amna Faraz | **GitHub:** AmnaFaraz
**Points:** 1000 pts + 600 bonus
**Submit:** https://forms.gle/KMKEKaFUD6ZX4UtY8

## Phases

| Phase | Description | Points |
|-------|-------------|--------|
| I | Python Console App | 100 |
| II | Full-Stack Web App (FastAPI + Next.js 15) | 150 |
| III | AI Chatbot (Groq tool_calling) | 200 |
| IV | Kubernetes (Docker + Minikube) | 250 |
| V | Kafka + Dapr + Oracle Cloud | 300 |

## Quick Start

### Phase I — Python Console
```bash
cd phase-1
pip install -r requirements.txt
python main.py
```

### Phase II — Backend
```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL + GROQ_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload
```

### Phase II — Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Stack
- Frontend: Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui
- Backend: FastAPI + SQLModel + Python 3.13
- AI: Groq llama-3.3-70b-versatile (tool_calling)
- DB: Supabase PostgreSQL
- Deploy: Vercel (frontend) + Koyeb (backend)
