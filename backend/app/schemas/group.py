from pydantic import BaseModel
from typing import List, Optional
from app.models import UserRole


class UserShort(BaseModel):
  id: int
  username: Optional[str] = None
  tg_id: Optional[int] = None
  role: Optional[UserRole] = None

  class Config:
    from_attributes = True


class StudentInGroup(BaseModel):
  id: int
  full_name: str
  user_id: Optional[int] = None
  user: Optional[UserShort] = None

  class Config:
    from_attributes = True

class GroupRead(BaseModel):
    id: int
    name: str
    students: List[StudentInGroup] = []

    @property
    def student_count(self) -> int:
        return len(self.students)

    class Config:
        from_attributes = True