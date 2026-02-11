from loguru import logger
from aiogram import Router, types
from aiogram.filters import CommandObject, Command
from aiogram.enums import ParseMode
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import async_session
from app.models.invite import InviteLink
from app.models.user import User
from app.models.student import Student
from app.models.curator import Curator
from app.models.role import UserRole

router = Router()


@router.message(Command("start"))
async def cmd_start(message: types.Message, command: CommandObject):
  invite_code = command.args
  tg_id = message.from_user.id

  with logger.contextualize(scope=f"BOT:{tg_id}"):
    if not invite_code:
      await message.answer(
        "👋 <b>Добро пожаловать в College Flow!</b>\n\n"
        "Для регистрации вам необходима ссылка-приглашение от вашего куратора.",
        parse_mode=ParseMode.HTML
      )
      return

    status_msg = await message.answer("🔄 <b>Устанавливаю соединение...</b>", parse_mode=ParseMode.HTML)

    try:
      async with async_session() as session:
        await status_msg.edit_text("🔍 <b>Проверяю статус аккаунта...</b>", parse_mode=ParseMode.HTML)

        stmt = select(User).where(User.tg_id == tg_id).options(
          selectinload(User.student_profile),
          selectinload(User.curator_profile)
        )
        res = await session.execute(stmt)
        existing_user = res.scalar_one_or_none()

        if existing_user:
          name = ""
          if existing_user.role == UserRole.STUDENT and existing_user.student_profile:
            name = f", {existing_user.student_profile.full_name}"
          elif existing_user.role == UserRole.CURATOR and existing_user.curator_profile:
            name = f", {existing_user.curator_profile.full_name}"

          await status_msg.edit_text(
            f"🚀 <b>Рады видеть вас снова{name}!</b>\n\n"
            f"Ваш аккаунт уже активен.",
            parse_mode=ParseMode.HTML
          )
          return

        await status_msg.edit_text("🎫 <b>Считываю приглашение...</b>", parse_mode=ParseMode.HTML)
        res = await session.execute(
          select(InviteLink).where(InviteLink.code == invite_code, InviteLink.is_used == False)
        )
        invite = res.scalar_one_or_none()

        if not invite:
          logger.warning(f"Попытка входа по неверному коду: {invite_code}")
          await status_msg.edit_text(
            "⚠️ <b>Ошибка доступа:</b>\nСсылка недействительна.",
            parse_mode=ParseMode.HTML
          )
          return

        new_user = User(
          tg_id=tg_id,
          username=message.from_user.username,
          role=invite.role
        )
        session.add(new_user)
        await session.flush()

        display_name = "Пользователь"

        if invite.role == UserRole.STUDENT:
          res = await session.execute(select(Student).where(Student.id == invite.student_id))
          student = res.scalar_one_or_none()

          if not student:
            logger.error(f"Студент ID {invite.student_id} не найден для инвайта {invite_code}")
            await status_msg.edit_text("🛑 <b>Ошибка:</b> Профиль не найден.", parse_mode=ParseMode.HTML)
            return

          student.user_id = new_user.id
          display_name = student.full_name

        elif invite.role == UserRole.CURATOR:
          display_name = message.from_user.full_name or "Куратор"
          new_curator = Curator(user_id=new_user.id, full_name=display_name)
          session.add(new_curator)

        invite.is_used = True
        await session.commit()

        logger.success(f"Зарегистрирован новый {invite.role}: {display_name}")

        await status_msg.edit_text(
          f"✅ <b>Регистрация завершена!</b>\n👤 Профиль: <b>{display_name}</b>",
          parse_mode=ParseMode.HTML
        )

    except Exception as e:
      logger.exception(f"Критическая ошибка при регистрации TG:{tg_id} '{e}'")
      await status_msg.edit_text(
        "❌ <b>Техническая ошибка</b>",
        parse_mode=ParseMode.HTML
      )