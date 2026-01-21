import enum

class UserRole(str, enum.Enum):
  ADMIN = 'admin'
  CURATOR = 'curator'
  LEADER = 'leader'
  STUDENT = 'student'