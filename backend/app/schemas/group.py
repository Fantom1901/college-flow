from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from app.models import UserRole


class UserShort(BaseModel):
  id: int
  username: Optional[str] = None
  tg_id: Optional[int] = None
  role: Optional[UserRole] = None

  model_config = ConfigDict(from_attributes=True)


class StudentInGroup(BaseModel):
  id: int
  full_name: str
  user_id: Optional[int] = None
  user: Optional[UserShort] = None

  model_config = ConfigDict(from_attributes=True)


class GroupRead(BaseModel):
  id: int
  name: str
  students: List[StudentInGroup] = []

  @property
  def student_count(self) -> int:
    return len(self.students)

  model_config = ConfigDict(from_attributes=True)


# --- Схемы для инициализации группы куратором ---

class GroupInitRequest(BaseModel):
  invite_code: str
  full_name: str
  group_name: str
  tg_id: int
  username: Optional[str] = None


class GroupInitResponse(BaseModel):
  group_id: int
  group_name: str