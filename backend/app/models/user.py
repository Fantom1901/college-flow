from sqlalchemy import BigInteger, String, Enum as SQLEnm
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.role import UserRole
from app.core.database import Base
from typing import Optional

class User(Base):
  __tablename__ = "users"

  id: Mapped[int] = mapped_column(primary_key=True)
  tg_id: Mapped[int] = mapped_column(BigInteger, unique=True, index=True)
  username: Mapped[str | None] = mapped_column(String(32))

  role: Mapped[UserRole] = mapped_column(
    SQLEnm(UserRole),
    default=UserRole.STUDENT,
    nullable=False,
  )

  student_profile: Mapped[Optional["Student"]] = relationship("Student", back_populates="user", uselist=False)
