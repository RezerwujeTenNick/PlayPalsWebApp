from enum import Enum
from typing import Optional
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class TournamentStatus(str, Enum):
    draft = "draft"
    open = "open"
    in_progress = "in_progress"
    finished = "finished"


class TournamentType(str, Enum):
    league = "league"
    cup = "cup"
    friendly = "friendly"


class Tournament(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    date: datetime                                        # date + time
    creator_id: int = Field(foreign_key="user.id")
    status: TournamentStatus = TournamentStatus.draft
    min_teams: int
    max_teams: int
    location: str
    tournament_type: TournamentType
    is_paid: bool = Field(default=False)
    entry_fee: Optional[float] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TournamentTeam(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tournament_id: int = Field(foreign_key="tournament.id")
    team_id: int = Field(foreign_key="team.id")


# --- Request/Response schemas ---

class TournamentCreate(SQLModel):
    name: str
    date: datetime                                        # ISO datetime from frontend
    min_teams: int
    max_teams: int
    location: str
    tournament_type: TournamentType
    is_paid: bool = False
    entry_fee: Optional[float] = None


class TournamentOut(SQLModel):
    id: int
    name: str
    date: datetime
    creator_id: int
    status: TournamentStatus
    min_teams: int
    max_teams: int
    location: str
    tournament_type: TournamentType
    is_paid: bool
    entry_fee: Optional[float]
    created_at: datetime
    updated_at: datetime


class TournamentDetail(TournamentOut):
    enrolled_team_ids: list[int]
    enrolled_teams: list[dict]      # [{id, name}]


class EnrollRequest(SQLModel):
    team_id: int
