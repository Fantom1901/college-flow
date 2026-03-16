from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
  from app.models.user import User
  from app.models.group import Group


class Curator(Base):
  __tablename__ = "curators"

  id: Mapped[int] = mapped_column(primary_key=True)
  user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
  full_name: Mapped[str] = mapped_column(String(225), nullable=False)

  group_id: Mapped[int | None] = mapped_column(ForeignKey("groups.id"), nullable=True)

  # Сама связь (relationship) остается
  group: Mapped["Group"] = relationship("Group", back_populates="curator", uselist=False, lazy="selectin")
  user: Mapped["User"] = relationship("User", back_populates="curator_profile")