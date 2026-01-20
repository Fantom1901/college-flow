from pydantic import BaseModel
from typing import List, Optional

class UserShort(BaseModel):
    username: Optional[str] = None
    tg_id: int

    class Config:
        from_attributes = True

class StudentInGroup(BaseModel):
    id: int
    user_id: int
    user: UserShort

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