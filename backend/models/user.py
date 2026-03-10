from enum import Enum
from typing import Optional
from datetime import datetime, timezone, date
from sqlmodel import SQLModel, Field


class Role(str, Enum):
    zawodnik = "zawodnik"
    trener = "trener"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    nickname: str = Field(unique=True, index=True)
    role: Role
    hashed_password: str
    date_of_birth: Optional[date] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# --- Request/Response schemas ---

class UserRegister(SQLModel):
    email: str
    nickname: str
    password: str
    role: Role
    date_of_birth: Optional[date] = None


class UserLogin(SQLModel):
    email: str
    password: str


class UserOut(SQLModel):
    id: int
    email: str
    nickname: str
    role: Role
    date_of_birth: Optional[date] = None
    created_at: datetime


class TokenResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
