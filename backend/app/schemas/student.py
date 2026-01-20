from pydantic import BaseModel

class StudentShort(BaseModel):
  id: int
  user_id: int

  class Config:
    from_attributes = True