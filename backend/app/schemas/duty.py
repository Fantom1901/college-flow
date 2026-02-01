from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import List, Optional
from app.models.duty import DutyStatus, DutyMechanism


class DutyScheduleRead(BaseModel):
  id: int
  group_id: int
  student_id: int
  date: date
  status: DutyStatus

  model_config = ConfigDict(from_attributes=True)


class DutySettingsUpdate(BaseModel):
  mechanism: Optional[DutyMechanism] = None
  work_days: Optional[List[int]] = None
  excluded_dates: Optional[List[str]] = None

  model_config = ConfigDict(from_attributes=True)


class DutySettingsRead(DutySettingsUpdate):
  group_id: int