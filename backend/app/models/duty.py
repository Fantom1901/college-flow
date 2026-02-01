from sqlalchemy import ForeignKey, Enum, JSON, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from datetime import date
import enum

class DutyMechanism(enum.Enum):
    ALPHABETICAL = 'alphabetical'
    WEIGHTED = 'weighted'

class DutyStatus(enum.Enum):
    PENDING = "pending"
    DONE = "done"
    SKIPPED = "skipped"

class DutySetting(Base):
    __tablename__ = 'duty_settings'

    group_id: Mapped[int] = mapped_column(ForeignKey('groups.id'), primary_key=True)
    mechanism: Mapped[DutyMechanism] = mapped_column(
        Enum(DutyMechanism),
        default=DutyMechanism.WEIGHTED,
        nullable=False
    )
    work_days: Mapped[list[int]] = mapped_column(JSON, default=lambda: [0, 1, 2, 3, 4])
    excluded_dates: Mapped[list[str]] = mapped_column(JSON, default=list)
    last_generated_until: Mapped[date | None] = mapped_column(Date, nullable=True)
    person_per_day: Mapped[int] = mapped_column(default=2, server_default="2")

    group: Mapped["Group"] = relationship("Group", back_populates="duty_settings")

    def __repr__(self):
        return f"<DutySetting(group_id={self.group_id}, mechanism={self.mechanism})>"

class DutySchedule(Base):
    __tablename__ = "duty_schedule"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("groups.id"))
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"))
    date: Mapped[date] = mapped_column(Date)
    status: Mapped[DutyStatus] = mapped_column(
        Enum(DutyStatus),
        default=DutyStatus.PENDING,
        nullable=False
    )

    student: Mapped["Student"] = relationship("Student")

    def __repr__(self):
        return f"<DutySchedule(date={self.date}, student_id={self.student_id}, status={self.status})>"