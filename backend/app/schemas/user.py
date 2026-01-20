from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
  tg_id: int
  username: Optional[str] = None

class UserCreate(UserBase):
  role_id: int

class UserRead(UserBase):
  id: int
  role_id: int

  class Config:
    from_attributes = True