from pydantic import BaseModel
from typing import Optional
from app.models.role import UserRole

class UserBase(BaseModel):
  tg_id: int
  username: Optional[str] = None

class UserCreate(UserBase):
  role: UserRole = UserRole.STUDENT

class UserRead(UserBase):
  id: int
  role: UserRole

  class Config:
    from_attributes = True

class UserUpdateSchema(BaseModel):
  full_name: str

class StudentRegisterRequest(BaseModel):
  invite_code: str
  tg_id: int
  username: Optional[str] = None