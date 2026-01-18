from sqlalchemy import BigInteger, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from typing import Optional

class User(Base):
  __tablename__ = "users"

  id: Mapped[int] = mapped_column(primary_key=True)
  tg_id: Mapped[int] = mapped_column(BigInteger, unique=True, index=True)
  username: Mapped[str | None] = mapped_column(String(32))

  role_id: Mapped[int] = mapped_column(ForeignKey("role.id"))
  role: Mapped["Role"] = relationship(back_populates="users")

  student_profile: Mapped[Optional["Student"]] = relationship("Student", back_populates="user", uselist=False)
