from aiogram import Router, types
from aiogram.filters import CommandStart, CommandObject
from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.services.invite_service import get_invite_data, use_invite

user_router = Router()

@user_router.message(CommandStart())
async def cmd_start(message: types.Message, command: CommandObject, session):
    args = command.args
    tg_id = message.from_user.id

    stmt = select(User).where(User.tg_id == tg_id).options(selectinload(User.role))
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()

    if user:
        return await message.answer(f"Привет, {user.username}! Ты уже в системе как {user.role.name}.")

    if not args:
        return await message.answer("Для регистрации нужна ссылка-приглашение.")

    invite = await get_invite_data(session, args)

    if not invite:
        return await message.answer("Инвайт-код недействителен или уже использован.")

    new_user = await use_invite(
        session=session,
        invite=invite,
        tg_id=tg_id,
        username=message.from_user.full_name or "Unknown"
    )

    await message.answer(
        f"Регистрация успешна! Привет, {new_user.username}.\n"
        f"Твоя роль: {invite.role_id} (id группы: {invite.group_id})"
    )