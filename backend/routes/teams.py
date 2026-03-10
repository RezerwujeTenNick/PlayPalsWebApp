from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from database import get_session
from models.user import User, UserOut, Role
from models.team import Team, TeamMember, TeamCreate, TeamOut, TeamDetail, InviteRequest
from routes.deps import get_current_user, require_trener

router = APIRouter()


@router.get("", response_model=list[TeamOut])
def list_teams(session: Session = Depends(get_session)):
    return session.exec(select(Team)).all()


@router.post("", response_model=TeamOut, status_code=status.HTTP_201_CREATED)
def create_team(
    body: TeamCreate,
    current_user: User = Depends(require_trener),
    session: Session = Depends(get_session),
):
    if session.exec(select(Team).where(Team.name == body.name)).first():
        raise HTTPException(status_code=400, detail="Team name already taken")

    team = Team(name=body.name, owner_id=current_user.id)
    session.add(team)
    session.commit()
    session.refresh(team)

    # Owner automatically becomes a member
    session.add(TeamMember(user_id=current_user.id, team_id=team.id))
    session.commit()
    return team


@router.get("/{team_id}", response_model=TeamDetail)
def get_team(team_id: int, session: Session = Depends(get_session)):
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    memberships = session.exec(select(TeamMember).where(TeamMember.team_id == team_id)).all()
    members = [session.get(User, m.user_id) for m in memberships]
    members = [UserOut.model_validate(u) for u in members if u]

    return TeamDetail(
        id=team.id,
        name=team.name,
        owner_id=team.owner_id,
        captain_id=team.captain_id,
        category=team.category,
        created_at=team.created_at,
        members=members,
    )


@router.post("/{team_id}/join", response_model=TeamOut)
def join_team(
    team_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if current_user.role != Role.zawodnik:
        raise HTTPException(status_code=403, detail="Only Zawodnik can join a team")

    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    already = session.exec(
        select(TeamMember).where(TeamMember.user_id == current_user.id)
    ).first()
    if already:
        raise HTTPException(status_code=400, detail="You are already in a team")

    session.add(TeamMember(user_id=current_user.id, team_id=team_id))
    session.commit()
    return team


@router.post("/{team_id}/invite", response_model=TeamOut)
def invite_to_team(
    team_id: int,
    body: InviteRequest,
    current_user: User = Depends(require_trener),
    session: Session = Depends(get_session),
):
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    if team.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the team owner can invite players")

    invitee = session.exec(select(User).where(User.nickname == body.nickname)).first()
    if not invitee:
        raise HTTPException(status_code=404, detail="Player not found")
    if invitee.role != Role.zawodnik:
        raise HTTPException(status_code=400, detail="Can only invite Zawodnik")

    already = session.exec(
        select(TeamMember).where(TeamMember.user_id == invitee.id)
    ).first()
    if already:
        raise HTTPException(status_code=400, detail="Player is already in a team")

    session.add(TeamMember(user_id=invitee.id, team_id=team_id))
    session.commit()
    return team
