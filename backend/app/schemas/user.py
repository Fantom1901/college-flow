from typing import Optional
from pydantic import BaseModel, computed_field
from app.models import Curator
from app.models.role import UserRole

class UserBase(BaseModel):
    tg_id: int
    username: Optional[str] = None

class UserCreate(UserBase):
    role: UserRole = UserRole.STUDENT

class StudentShort(BaseModel):
    full_name: str
    group_id: int

    class Config:
        from_attributes = True


class CuratorShort(BaseModel):
  full_name: str

  @computed_field
  def group_id(self) -> Optional[int]:
    if hasattr(self, 'group') and self.group:
      return self.group.id

    return None

  class Config:
    from_attributes = True

class UserRead(UserBase):
  id: int
  role: UserRole
  student_profile: Optional[StudentShort] = None
  curator_profile: Optional[CuratorShort] = None

  class Config:
    from_attributes = True


class UserUpdateSchema(BaseModel):
  full_name: Optional[str] = None
  username: Optional[str] = None

  class Config:
    from_attributes = True

class StudentRegisterRequest(BaseModel):
    invite_code: str
    tg_id: int
    username: Optional[str] = None