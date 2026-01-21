from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.duty import DutySetting


class Group(Base):
    __tablename__ = 'groups'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)

    students: Mapped[list["Student"]] = relationship("Student", back_populates="group")

    duty_settings: Mapped["DutySetting"] = relationship(
      "DutySetting", back_populates="group", uselist=False
    )

    def __repr__(self):
      return f"<Group {self.name}>"