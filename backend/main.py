from contextlib import asynccontextmanager
from datetime import datetime, timezone
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import run_migrations
from routes import auth, teams, tournaments

APP_VERSION = "1.0.0"
# Używamy factory dla czasu, aby uniknąć problemów z serializacją w niektórych wersjach
START_TIME = datetime.now(timezone.utc).isoformat()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicjalizacja bazy danych przy starcie
    run_migrations()
    yield
    # Tutaj możesz dodać kod czyszczący przy zamykaniu aplikacji (np. zamknięcie sesji)

app = FastAPI(
    title="PlayPals API", 
    version=APP_VERSION, 
    lifespan=lifespan,
    description="Backend systemu do zarządzania drużynami i turniejami"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rejestracja Routerów
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(teams.router, prefix="/api/teams", tags=["teams"])
app.include_router(tournaments.router, prefix="/api/tournaments", tags=["tournaments"])

@app.get("/", tags=["system"])
def status_endpoint():
    return {
        "service": "playpals-backend", 
        "status": "running", 
        "timestamp": datetime.now(timezone.utc)
    }

@app.get("/health", tags=["system"])
def health():
    return {"status": "healthy", "started_at": START_TIME}

@app.get("/version", tags=["system"])
def version():
    return {"version": APP_VERSION}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)