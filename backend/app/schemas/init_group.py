from pydantic import BaseModel
from typing import Optional

class GroupInitRequest(BaseModel):
  invite_code: str
  full_name: str
  group_name: str
  tg_id: int
  username: Optional[str] = None

class GroupInitResponse(BaseModel):
  status: str
  group_id: int
  group_name: str
