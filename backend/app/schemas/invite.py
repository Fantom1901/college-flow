from pydantic import BaseModel
from typing import List
from typing import Optional

class BulkInviteCreate(BaseModel):
    group_id: int
    names: List[str]

class CuratorInviteResponse(BaseModel):
  link: str

class CuratorRegistrationRequest(BaseModel):
  invite_code: str
  full_name: str
  group_name: str
  tg_id: int
  username : Optional[str] = None

class BulkInviteResponse(BaseModel):
  full_name: str
  link: str

  class Config:
    from_attributes = True