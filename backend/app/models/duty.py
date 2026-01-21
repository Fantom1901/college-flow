from sqlalchemy import ForeignKey, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import enum

class DutyMechanism(enum.Enum):
  ALPHABETICAL = 'alphabetical'
  WEIGHTED = 'weighted'

class DutySetting(Base):
  __tablename__ = 'duty_settings'

  group_id: Mapped[int] = mapped_column(ForeignKey('groups.id'), primary_key=True)

  mechanism: Mapped[DutyMechanism] = mapped_column(
    Enum(DutyMechanism), default=DutyMechanism.WEIGHTED
  )

  work_days: Mapped[list[int]] = mapped_column(JSON, default=list(range(5)))

  excluded_dates: Mapped[list[str]] = mapped_column(JSON, default=[])

  group = relationship("Group", back_populates="duty_settings")