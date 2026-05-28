from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.role import UserRole

class UserBase(BaseModel):
    tg_id: int
    username: Optional[str] = None

class UserCreate(UserBase):
    role: UserRole = UserRole.STUDENT

class StudentShort(BaseModel):
    full_name: str
    group_id: int
    model_config = ConfigDict(from_attributes=True)

class CuratorShort(BaseModel):
    full_name: str
    group_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

class UserRead(UserBase):
    id: int
    role: UserRole
    student_profile: Optional[StudentShort] = None
    curator_profile: Optional[CuratorShort] = None
    model_config = ConfigDict(from_attributes=True)

class UserUpdateSchema(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class StudentRegisterRequest(BaseModel):
    invite_code: str
    tg_id: int
    username: Optional[str] = None