from fastapi import APIRouter
from app.api.v1.endpoints import users
from app.api.v1.endpoints import groups
from app.api.v1.endpoints import invite

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(groups.router, prefix="/groups", tags=["groups"])
api_router.include_router(invite.router, prefix="/invite", tags=["invite"])