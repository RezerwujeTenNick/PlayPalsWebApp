import os
from sqlmodel import SQLModel, create_engine, Session
from alembic.config import Config
from alembic import command

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./playpals.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


def run_migrations():
    """Run all pending Alembic migrations on startup."""
    alembic_cfg = Config(os.path.join(os.path.dirname(__file__), "alembic.ini"))
    alembic_cfg.set_main_option("sqlalchemy.url", DATABASE_URL)
    alembic_cfg.set_main_option(
        "script_location",
        os.path.join(os.path.dirname(__file__), "migrations"),
    )
    command.upgrade(alembic_cfg, "head")


def get_session():
    with Session(engine) as session:
        yield session
