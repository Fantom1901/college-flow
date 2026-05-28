from fastapi import Header, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import verify_telegram_data
from app.models.user import User
from app.models.role import UserRole

class RoleChecker:
    def __init__(self, allowed_roles: list[UserRole]):
        self.allowed_roles = allowed_roles

    async def __call__(
        self,
        x_tg_data: str = Header(alias="X-TG-Data"),
        db: AsyncSession = Depends(get_db),
    ):
        # Костыль для тестов (оставлен, раз он уже там был)
        if x_tg_data in ["nixa_dev_mode", "other_student_mode"]:
            tg_id = 111111111 if x_tg_data == "nixa_dev_mode" else 222222222
            stmt = select(User).where(User.tg_id == tg_id).options(
                selectinload(User.student_profile),
                selectinload(User.curator_profile)
            )
            result = await db.execute(stmt)
            user = result.scalar_one_or_none()
            if user:
                if user.role not in self.allowed_roles:
                    raise HTTPException(status_code=403, detail="Forbidden")
                return user

        tg_user_data = verify_telegram_data(x_tg_data)

        if not tg_user_data:
            raise HTTPException(status_code=401, detail="Invalid Telegram data")

        tg_id = tg_user_data.get("id")

        stmt = (
            select(User)
            .where(User.tg_id == tg_id)
            .options(
                selectinload(User.student_profile),
                selectinload(User.curator_profile)
            )
        )
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if user.role not in self.allowed_roles:
            raise HTTPException(status_code=403, detail="You don't have permission")

        return user