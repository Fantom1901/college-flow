from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from app.core.database import Base

class Role(Base):
  __tablename__ = "role"

  id: Mapped[int] = mapped_column(primary_key=True)
  name: Mapped[str] = mapped_column(String(20), unique=True)

  users: Mapped[list["User"]] = relationship(back_populates="role")