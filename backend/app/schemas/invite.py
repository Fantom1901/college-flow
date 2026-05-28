from pydantic import BaseModel, ConfigDict
from typing import List, Optional

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

class BulkInviteCreate(BaseModel):
    group_id: int
    names: List[str]

class BulkInviteResponse(BaseModel):
    full_name: str
    link: str

    model_config = ConfigDict(from_attributes=True)

class CuratorInviteResponse(BaseModel):
    link: str