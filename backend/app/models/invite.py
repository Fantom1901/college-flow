import uuid
from sqlalchemy import String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
  from app.models.group import Group
  from app.models.student import Student


class InviteLink(Base):
  __tablename__ = 'invite_links'

  id: Mapped[int] = mapped_column(primary_key=True)
  code: Mapped[str] = mapped_column(String(36), default=lambda: str(uuid.uuid4()), unique=True, index=True)

  role_id: Mapped[int] = mapped_column(ForeignKey('role.id'), nullable=False)

  group_id: Mapped[int | None] = mapped_column(ForeignKey('groups.id', ondelete="CASCADE"), nullable=True)
  group: Mapped["Group"] = relationship("Group")

  student_id: Mapped[int | None] = mapped_column(ForeignKey('students.id', ondelete="SET NULL"), nullable=True)
  student: Mapped["Student"] = relationship("Student")

  is_used: Mapped[bool] = mapped_column(Boolean, default=False)
  created_by: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=True)

  def __repr__(self):
    return f"<InviteLink code: {self.code} used={self.is_used}>"