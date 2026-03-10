from enum import Enum
from typing import Optional
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field
from .user import UserOut


class TeamCategory(str, Enum):
    u6_u7 = "u6_u7"       # Skrzaty
    u8_u9 = "u8_u9"       # Żaki
    u10_u11 = "u10_u11"   # Orliki
    u12_u13 = "u12_u13"   # Młodzicy
    u14_u15 = "u14_u15"   # Trampkarze
    u16_u17 = "u16_u17"   # Juniorzy młodsi
    u18_u19 = "u18_u19"   # Juniorzy starsi
    senior = "senior"


CATEGORY_LABELS: dict[str, str] = {
    "u6_u7": "Skrzaty (U6-U7)",
    "u8_u9": "Żaki (U8-U9)",
    "u10_u11": "Orliki (U10-U11)",
    "u12_u13": "Młodzicy (U12-U13)",
    "u14_u15": "Trampkarze (U14-U15)",
    "u16_u17": "Juniorzy młodsi (U16-U17)",
    "u18_u19": "Juniorzy starsi (U18-U19)",
    "senior": "Seniorzy",
}


class Team(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    owner_id: int = Field(foreign_key="user.id")
    captain_id: Optional[int] = Field(default=None, foreign_key="user.id")
    category: TeamCategory = Field(default=TeamCategory.senior)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TeamMember(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    team_id: int = Field(foreign_key="team.id")


# --- Request/Response schemas ---

class TeamCreate(SQLModel):
    name: str
    category: TeamCategory = TeamCategory.senior


class TeamOut(SQLModel):
    id: int
    name: str
    owner_id: int
    captain_id: Optional[int]
    category: TeamCategory
    created_at: datetime


class TeamDetail(TeamOut):
    members: list[UserOut]


class InviteRequest(SQLModel):
    nickname: str
