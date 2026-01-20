import uuid
from sqlalchemy import String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.group import Group

class InviteLink(Base):
  __tablename__ = 'invite_links'

  id: Mapped[int] = mapped_column(primary_key=True)
  code: Mapped[str] = mapped_column(String(36), default=lambda: str(uuid.uuid4()), unique=True)

  role_id: Mapped[int] = mapped_column(ForeignKey('role.id'), nullable=False)
  group_id:  Mapped[int | None] = mapped_column(ForeignKey('groups.id'), nullable=True)
  group: Mapped["Group"] = relationship("Group")
  student_id: Mapped[int] = mapped_column(ForeignKey('students.id'), nullable=True)
  student: Mapped["Student"] = relationship("Student")

  is_used: Mapped[bool] = mapped_column(Boolean, default=False)
  created_by: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=True)

  def __repr__(self):
    return f"<InviteLink code: {self.code} used={self.is_used}>"