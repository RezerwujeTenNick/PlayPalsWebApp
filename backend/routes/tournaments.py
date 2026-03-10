from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from database import get_session
from models.user import User
from models.team import Team
from models.tournament import (
    Tournament,
    TournamentTeam,
    TournamentCreate,
    TournamentOut,
    TournamentDetail,
    TournamentStatus,
    EnrollRequest,
)
from routes.deps import get_current_user, require_trener

router = APIRouter()


@router.get("", response_model=list[TournamentOut])
def list_tournaments(session: Session = Depends(get_session)):
    return session.exec(select(Tournament)).all()


@router.post("", response_model=TournamentOut, status_code=status.HTTP_201_CREATED)
def create_tournament(
    body: TournamentCreate,
    current_user: User = Depends(require_trener),
    session: Session = Depends(get_session),
):
    tournament = Tournament(
        **body.model_dump(),
        creator_id=current_user.id,
        status=TournamentStatus.open,
    )
    session.add(tournament)
    session.commit()
    session.refresh(tournament)
    return tournament


@router.get("/{tournament_id}", response_model=TournamentDetail)
def get_tournament(tournament_id: int, session: Session = Depends(get_session)):
    tournament = session.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")

    enrollments = session.exec(
        select(TournamentTeam).where(TournamentTeam.tournament_id == tournament_id)
    ).all()

    enrolled_teams = []
    for e in enrollments:
        team = session.get(Team, e.team_id)
        if team:
            enrolled_teams.append({"id": team.id, "name": team.name})

    return TournamentDetail(
        **tournament.model_dump(),
        enrolled_team_ids=[e.team_id for e in enrollments],
        enrolled_teams=enrolled_teams,
    )


@router.post("/{tournament_id}/enroll", response_model=TournamentOut)
def enroll_team(
    tournament_id: int,
    body: EnrollRequest,
    current_user: User = Depends(require_trener),
    session: Session = Depends(get_session),
):
    tournament = session.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    if tournament.status == TournamentStatus.finished:
        raise HTTPException(status_code=400, detail="Tournament is already finished")

    team = session.get(Team, body.team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    if team.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You don't own this team")

    enrollments = session.exec(
        select(TournamentTeam).where(TournamentTeam.tournament_id == tournament_id)
    ).all()

    if len(enrollments) >= tournament.max_teams:
        raise HTTPException(status_code=400, detail="Tournament is full")
    if any(e.team_id == body.team_id for e in enrollments):
        raise HTTPException(status_code=400, detail="Team already enrolled")

    session.add(TournamentTeam(tournament_id=tournament_id, team_id=body.team_id))
    tournament.updated_at = datetime.now(timezone.utc)
    session.add(tournament)
    session.commit()
    session.refresh(tournament)
    return tournament
