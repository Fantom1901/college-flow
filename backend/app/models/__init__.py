from .role import Role
from .user import User
from .group import Group
from .student import Student
from .invite import InviteLink

# Это нужно, чтобы можно было удобно импортировать всё одной кучей
__all__ = ["Role", "User", "Group", "Student", "InviteLink"]