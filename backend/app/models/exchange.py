from sqlalchemy import ForeignKey, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from datetime import datetime
import enum


class ExchangeStatus(enum.Enum):
  PENDING = "pending"  # Ожидает подтверждения от второго студента
  ACCEPTED = "accepted"  # Обмен успешно совершен
  REJECTED = "rejected"  # Второй студент отказался
  CANCELLED = "cancelled"  # Инициатор сам отменил заявку


class DutyExchange(Base):
  __tablename__ = "duty_exchanges"

  id: Mapped[int] = mapped_column(primary_key=True)

  # Кто заварил кашу
  initiator_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
  initiator_duty_id: Mapped[int] = mapped_column(ForeignKey("duty_schedule.id", ondelete="CASCADE"), nullable=False)

  # Кому летит предложение
  suggested_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
  suggested_duty_id: Mapped[int] = mapped_column(ForeignKey("duty_schedule.id", ondelete="CASCADE"), nullable=False)

  # Статус транзакции
  status: Mapped[ExchangeStatus] = mapped_column(
    Enum(ExchangeStatus),
    default=ExchangeStatus.PENDING,
    nullable=False
  )

  created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

  # Relationships для удобной сборки JSON ответов на фронтенд
  initiator: Mapped["Student"] = relationship("Student", foreign_keys=[initiator_id])
  suggested: Mapped["Student"] = relationship("Student", foreign_keys=[suggested_id])

  initiator_duty: Mapped["DutySchedule"] = relationship("DutySchedule", foreign_keys=[initiator_duty_id])
  suggested_duty: Mapped["DutySchedule"] = relationship("DutySchedule", foreign_keys=[suggested_duty_id])

  def __repr__(self):
    return f"<DutyExchange id={self.id} status={self.status}>"