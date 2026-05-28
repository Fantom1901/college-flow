from aiogram import Router, F, types
from loguru import logger
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import async_session
from app.models.exchange import DutyExchange, ExchangeStatus
from app.models.duty import DutyStatus
from app.services.bot_notifications import send_exchange_status_update_to_initiator

router = Router()


@router.callback_query(F.data.startswith("exch:"))
async def handle_exchange_callback(callback: types.CallbackQuery):
  # Разбираем callback_data (формат exch:action:exchange_id)
  parts = callback.data.split(":")
  if len(parts) != 3:
    await callback.answer("⚠️ Ошибка структуры данных колбэка.")
    return

  action, exchange_id_str = parts[1], parts[2]
  try:
    exchange_id = int(exchange_id_str)
  except ValueError:
    await callback.answer("⚠️ Некорректный ID обмена.")
    return

  tg_id = callback.from_user.id

  async with async_session() as session:
    # Тянем обмен со всеми связями
    stmt = (
      select(DutyExchange)
      .where(DutyExchange.id == exchange_id)
      .options(
        selectinload(DutyExchange.initiator).selectinload(
          Template := DutyExchange.initiator.property.mapper.class_.user),
        selectinload(DutyExchange.suggested).selectinload(
          Template := DutyExchange.suggested.property.mapper.class_.user),
        selectinload(DutyExchange.initiator_duty),
        selectinload(DutyExchange.suggested_duty)
      )
    )
    res = await session.execute(stmt)
    exchange = res.scalar_one_or_none()

    if not exchange:
      await callback.answer("❌ Заявка на обмен не найдена в базе данных.", show_alert=True)
      await callback.message.edit_text("🛑 Эта заявка больше не существует.")
      return

    # Проверяем, что кнопку нажал именно тот, кому адресован обмен
    if exchange.suggested.user.tg_id != tg_id:
      await callback.answer("⚠️ Вы не можете управлять чужим обменом дежурствами!", show_alert=True)
      return

    # Проверяем, что статус ещё PENDING
    if exchange.status != ExchangeStatus.PENDING:
      await callback.answer("ℹ️ Эта заявка уже была обработана ранее.", show_alert=True)
      init_date = exchange.initiator_duty.date.strftime("%d.%m.%Y")
      sugg_date = exchange.suggested_duty.date.strftime("%d.%m.%Y")
      await callback.message.edit_text(
        f"ℹ️ <b>Заявка закрыта.</b>\n"
        f"Обмен дежурствами (с {init_date} на {sugg_date}) уже имеет статус: <b>{exchange.status.value}</b>."
      )
      return

    init_date = exchange.initiator_duty.date.strftime("%d.%m.%Y")
    sugg_date = exchange.suggested_duty.date.strftime("%d.%m.%Y")

    if action == "accept":
      # Проверяем актуальность дежурств
      if exchange.initiator_duty.status != DutyStatus.PENDING or exchange.suggested_duty.status != DutyStatus.PENDING:
        await callback.answer("❌ Одно из дежурств уже завершено или отменено. Обмен невозможен.", show_alert=True)
        exchange.status = ExchangeStatus.CANCELLED
        await session.commit()
        await callback.message.edit_text("🛑 Обмен сорвался: дежурства стали неактивными.")
        return

      # Меняем студентов местами
      exchange.initiator_duty.student_id = exchange.suggested_id
      exchange.suggested_duty.student_id = exchange.initiator_id
      exchange.status = ExchangeStatus.ACCEPTED

      await session.commit()

      await callback.answer("✅ Вы успешно приняли обмен дежурствами!", show_alert=True)
      await callback.message.edit_text(
        f"✅ <b>Обмен успешно совершен!</b>\n\n"
        f"Вы поменялись дежурствами со студентом <b>{exchange.initiator.full_name}</b>.\n"
        f"• Вы дежурите: <code>{init_date}</code>\n"
        f"• Он дежурит: <code>{sugg_date}</code>\n\n"
        f"Расписание в приложении обновлено автоматически."
      )

      # Уведомляем инициатора
      await send_exchange_status_update_to_initiator(exchange, is_accepted=True)

    elif action == "reject":
      exchange.status = ExchangeStatus.REJECTED
      await session.commit()

      await callback.answer("Вы отклонили обмен дежурствами.")
      await callback.message.edit_text(
        f"❌ <b>Вы отклонили предложение обмена.</b>\n\n"
        f"Запрос от <b>{exchange.initiator.full_name}</b> (с <code>{init_date}</code> на <code>{sugg_date}</code>) был отклонён."
      )

      # Уведомляем инициатора
      await send_exchange_status_update_to_initiator(exchange, is_accepted=False)