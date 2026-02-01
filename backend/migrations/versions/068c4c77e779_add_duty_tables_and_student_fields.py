"""add_duty_tables_and_student_fields

Revision ID: 068c4c77e779
Revises: 42b9d32fac64
Create Date: 2026-02-01 23:53:13.737979

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '068c4c77e779'
down_revision: Union[str, Sequence[str], None] = '42b9d32fac64'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
  # 1. Создаем таблицу расписания
  op.create_table('duty_schedule',
                  sa.Column('id', sa.Integer(), nullable=False),
                  sa.Column('group_id', sa.Integer(), nullable=False),
                  sa.Column('student_id', sa.Integer(), nullable=False),
                  sa.Column('date', sa.Date(), nullable=False),
                  sa.Column('status', sa.Enum('PENDING', 'DONE', 'SKIPPED', name='dutystatus'), nullable=False),
                  sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ),
                  sa.ForeignKeyConstraint(['student_id'], ['students.id'], ),
                  sa.PrimaryKeyConstraint('id')
                  )

  op.add_column('duty_settings', sa.Column('last_generated_until', sa.Date(), nullable=True))

  op.add_column('students', sa.Column('is_active', sa.Boolean(), nullable=True))

  op.execute("UPDATE students SET is_active = True")

  op.alter_column('students', 'is_active', nullable=False)

  op.add_column('students', sa.Column('last_duty_date', sa.Date(), nullable=True))


def downgrade() -> None:
  op.drop_column('students', 'last_duty_date')
  op.drop_column('students', 'is_active')
  op.drop_column('duty_settings', 'last_generated_until')
  op.drop_table('duty_schedule')
  op.execute("DROP TYPE dutystatus")
