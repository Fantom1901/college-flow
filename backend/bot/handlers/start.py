import logging
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

  if not invite_code:
    await message.answer(
      "👋 <b>Добро пожаловать в College Flow!</b>\n\n"
      "Для регистрации вам необходима ссылка-приглашение от вашего куратора или администратора.",
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
          f"Ваш аккаунт уже активен. Открывайте Mini App и приступайте к работе.",
          parse_mode=ParseMode.HTML
        )
        return

      await status_msg.edit_text("🎫 <b>Считываю приглашение...</b>", parse_mode=ParseMode.HTML)
      res = await session.execute(
        select(InviteLink).where(InviteLink.code == invite_code, InviteLink.is_used == False)
      )
      invite = res.scalar_one_or_none()

      if not invite:
        await status_msg.edit_text(
            "⚠️ <b>Ошибка доступа:</b>\nДанная ссылка недействительна или уже была использована.",
            parse_mode=ParseMode.HTML
        )
        return

      await status_msg.edit_text("✍️ <b>Регистрирую профиль в системе...</b>", parse_mode=ParseMode.HTML)
      new_user = User(
        tg_id=tg_id,
        username=message.from_user.username,
        role=invite.role
      )
      session.add(new_user)
      await session.flush()

      display_name = "Пользователь"

      if invite.role == UserRole.STUDENT:
        await status_msg.edit_text("🎓 <b>Привязываю студенческий билет...</b>", parse_mode=ParseMode.HTML)
        res = await session.execute(select(Student).where(Student.id == invite.student_id))
        student = res.scalar_one_or_none()

        if not student:
          await status_msg.edit_text(
            "🛑 <b>Ошибка:</b> Ваш профиль студента не найден. Обратитесь к куратору.",
            parse_mode=ParseMode.HTML
          )
          return

        student.user_id = new_user.id
        display_name = student.full_name

      elif invite.role == UserRole.CURATOR:
        await status_msg.edit_text("💼 <b>Подготавливаю кабинет куратора...</b>", parse_mode=ParseMode.HTML)
        display_name = message.from_user.full_name or "Куратор"
        new_curator = Curator(
          user_id=new_user.id,
          full_name=display_name
        )
        session.add(new_curator)

      invite.is_used = True
      await session.commit()

      await status_msg.edit_text(
        f"✅ <b>Регистрация успешно завершена!</b>\n\n"
        f"👤 Профиль: <b>{display_name}</b>\n"
        f"🎭 Роль: <code>{invite.role.value.capitalize()}</code>\n\n"
        f"Добро пожаловать в систему дежурств. Теперь вы можете открыть приложение через меню бота.",
        parse_mode=ParseMode.HTML
      )

  except Exception as e:
    logging.error(f"START_HANDLER_ERROR: {e}")
    await status_msg.edit_text(
      "❌ <b>Техническая ошибка</b>\nНе удалось завершить регистрацию. Попробуйте позже или свяжитесь с поддержкой.",
      parse_mode=ParseMode.HTML
    )