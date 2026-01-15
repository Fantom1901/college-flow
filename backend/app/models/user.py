from sqlalchemy import BigInteger, String
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class User(Base):
  __tablename__ = "user"

  id: Mapped[int] = mapped_column(primary_key=True)
  tg_id: Mapped[int] = mapped_column(BigInteger, unique=True, index=True)
  username: Mapped[str | None] = mapped_column(String(32))
  role: Mapped[str] = mapped_column(default="student")