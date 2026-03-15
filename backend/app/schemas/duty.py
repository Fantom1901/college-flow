from pydantic import BaseModel, ConfigDict, Field
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
  person_per_day: Optional[int] = Field(None, ge=1, le=5)

  model_config = ConfigDict(from_attributes=True)


class DutySettingsRead(DutySettingsUpdate):
  group_id: int


class StudentShort(BaseModel):
    id: int
    full_name: str
    model_config = ConfigDict(from_attributes=True)

class DutyScheduleWithStudent(DutyScheduleRead):
    student: StudentShort