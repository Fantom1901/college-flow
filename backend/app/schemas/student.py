from pydantic import BaseModel, ConfigDict

class StudentShort(BaseModel):
  id: int
  user_id: int

  class Config:
    model_config = ConfigDict(from_attributes=True)