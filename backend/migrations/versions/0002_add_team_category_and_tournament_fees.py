"""add team_category and tournament fees

Revision ID: 0002
Revises: 0001
Create Date: 2026-03-10

Adds:
  - team.category        (VARCHAR, default 'senior')
  - tournament.is_paid   (BOOLEAN, default false)
  - tournament.entry_fee (FLOAT, nullable)
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # SQLite does not support ALTER COLUMN, but ADD COLUMN with a default is fine.
    with op.batch_alter_table("team") as batch_op:
        batch_op.add_column(
            sa.Column("category", sa.String(), nullable=False, server_default="senior")
        )

    with op.batch_alter_table("tournament") as batch_op:
        batch_op.add_column(
            sa.Column("is_paid", sa.Boolean(), nullable=False, server_default=sa.false())
        )
        batch_op.add_column(
            sa.Column("entry_fee", sa.Float(), nullable=True)
        )


def downgrade() -> None:
    with op.batch_alter_table("tournament") as batch_op:
        batch_op.drop_column("entry_fee")
        batch_op.drop_column("is_paid")

    with op.batch_alter_table("team") as batch_op:
        batch_op.drop_column("category")
