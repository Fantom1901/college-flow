from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.exchange import ExchangeStatus
from app.schemas.group import StudentInGroup
from app.schemas.duty import DutyScheduleRead

class ExchangeCreate(BaseModel):
    initiator_duty_id: int    # ID дежурства, от которого СТУДЕНТ хочет отказаться
    suggested_duty_id: int    # ID дежурства ТОГО, с кем он хочет поменяться
    suggested_id: int         # ID студента, на чью дату мы претендуем

    model_config = ConfigDict(from_attributes=True)

class ExchangeStatusUpdate(BaseModel):
    status: ExchangeStatus    # Примет ACCEPTED, REJECTED или CANCELLED

class ExchangeResponse(BaseModel):
    id: int
    initiator_id: int
    initiator_duty_id: int
    suggested_id: int
    suggested_duty_id: int
    status: ExchangeStatus
    created_at: datetime

    initiator: StudentInGroup
    suggested: StudentInGroup
    initiator_duty: DutyScheduleRead
    suggested_duty: DutyScheduleRead

    model_config = ConfigDict(from_attributes=True)


class ExchangeListResponse(BaseModel):
  incoming: list[ExchangeResponse]  # Активные заявки текущему юзеру (PENDING)
  outgoing: list[ExchangeResponse]  # Активные заявки от текущего юзера (PENDING)
  history: list[ExchangeResponse]  # Все завершенные обмены (ACCEPTED, REJECTED, CANCELLED)

  model_config = ConfigDict(from_attributes=True)