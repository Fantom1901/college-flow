from .role import UserRole
from .duty import DutyMechanism, DutySetting, DutyStatus, DutySchedule
from .group import Group
from .user import User
from .student import Student
from .curator import Curator
from .invite import InviteLink
from .exchange import DutyExchange, ExchangeStatus # Добавили сюда

__all__ = [
    "User",
    "Group",
    "Student",
    "InviteLink",
    "UserRole",
    "DutySetting",
    "DutyMechanism",
    "DutyStatus",
    "DutySchedule",
    "Curator",
    "DutyExchange",   # И сюда
    "ExchangeStatus"
]