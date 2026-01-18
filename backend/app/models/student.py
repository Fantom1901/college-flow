from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Student(Base):
  __tablename__ = 'students'

  id: Mapped[int] = mapped_column(primary_key=True)

  user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), unique=True, nullable=False)

  group_id: Mapped[int] = mapped_column(ForeignKey('groups.id'), nullable=False)

  user: Mapped["User"] = relationship("User", back_populates="student_profile")
  group: Mapped["Group"] = relationship("Group", back_populates="students")

  def __repr__(self):
    return f"<Student user_id={self.user_id}, group_id={self.group_id}>"