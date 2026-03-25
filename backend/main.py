"""
Panaversity Hackathon II — Backend (FastAPI)
Phases II + III
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables
from routes.tasks import router as tasks_router
from routes.chat import router as chat_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="Panaversity TODO API",
    description="Hackathon II — Evolution of TODO (Phases II + III)",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router, prefix="/api", tags=["tasks"])
app.include_router(chat_router, prefix="/api", tags=["chat"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "panaversity-todo-api", "version": "2.0.0"}
