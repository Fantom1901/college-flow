from sqlalchemy import ForeignKey
from enum import Enum as PyEnum
from sqlalchemy import Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from sqlalchemy import String

class Student(Base):
  __tablename__ = 'students'
  id: Mapped[int] = mapped_column(primary_key=True)

  user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), unique=True, nullable=True)
  group_id: Mapped[int] = mapped_column(ForeignKey('groups.id'), nullable=False)

  full_name: Mapped[str] = mapped_column(String(255), nullable=False)

  user: Mapped["User"] = relationship("User", back_populates="student_profile")
  group: Mapped["Group"] = relationship("Group", back_populates="students")

  weight: Mapped[int] =  mapped_column(nullable=False)

  def __repr__(self):
    return f"<Student user_id={self.user_id}, group_id={self.group_id}>"