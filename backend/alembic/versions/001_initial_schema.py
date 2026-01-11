"""Initial schema

Revision ID: 001
Revises:
Create Date: 2024-01-10

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'eval_runs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('project_name', sa.String(255), nullable=False),
        sa.Column('run_name', sa.String(255), nullable=False),
        sa.Column('eval_type', sa.String(100), nullable=True),
        sa.Column('raw_data', postgresql.JSONB(), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('status', sa.Enum('UPLOADED', 'CONFIGURED', 'GENERATED', name='evalstatus'), nullable=True),
    )

    op.create_table(
        'eval_configs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('eval_run_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('eval_runs.id'), nullable=False),
        sa.Column('context', postgresql.JSONB(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    op.create_table(
        'generated_reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('eval_run_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('eval_runs.id'), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('recommendation', sa.Enum('SHIP', 'NEEDS_WORK', 'BLOCK', name='recommendation'), nullable=True),
        sa.Column('key_findings', postgresql.JSONB(), nullable=True),
        sa.Column('risk_assessment', sa.Text(), nullable=True),
        sa.Column('trade_offs', sa.Text(), nullable=True),
        sa.Column('generated_at', sa.DateTime(), nullable=True),
        sa.Column('shareable_token', sa.String(255), unique=True, nullable=True),
    )

    op.create_index('idx_shareable_token', 'generated_reports', ['shareable_token'])
    op.create_index('idx_eval_run_id', 'generated_reports', ['eval_run_id'])


def downgrade() -> None:
    op.drop_index('idx_eval_run_id', 'generated_reports')
    op.drop_index('idx_shareable_token', 'generated_reports')
    op.drop_table('generated_reports')
    op.drop_table('eval_configs')
    op.drop_table('eval_runs')
    op.execute('DROP TYPE IF EXISTS recommendation')
    op.execute('DROP TYPE IF EXISTS evalstatus')
