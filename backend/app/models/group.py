from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Group(Base):
    __tablename__ = 'groups'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)

    students: Mapped[list["Student"]] = relationship("Student", back_populates="group")

    def __repr__(self):
      return f"<Group {self.name}>"