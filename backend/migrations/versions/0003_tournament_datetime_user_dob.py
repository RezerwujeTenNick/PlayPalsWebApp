"""tournament datetime + user date_of_birth

Revision ID: 0003
Revises: 0002
Create Date: 2026-03-10

Adds:
  - tournament.date changed from Date to DateTime (stored as 'YYYY-MM-DD HH:MM')
  - user.date_of_birth (DATE, nullable)
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # SQLite: batch_alter_table to recreate columns
    with op.batch_alter_table("tournament") as batch_op:
        # Replace Date column with DateTime — store as string in SQLite, no data loss
        batch_op.alter_column(
            "date",
            type_=sa.DateTime(),
            existing_type=sa.Date(),
            existing_nullable=False,
        )

    with op.batch_alter_table("user") as batch_op:
        batch_op.add_column(
            sa.Column("date_of_birth", sa.Date(), nullable=True)
        )


def downgrade() -> None:
    with op.batch_alter_table("user") as batch_op:
        batch_op.drop_column("date_of_birth")

    with op.batch_alter_table("tournament") as batch_op:
        batch_op.alter_column(
            "date",
            type_=sa.Date(),
            existing_type=sa.DateTime(),
            existing_nullable=False,
        )
