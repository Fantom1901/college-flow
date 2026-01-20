from pydantic import BaseModel
from typing import List

class BulkInviteCreate(BaseModel):
    group_id: int
    names: List[str]