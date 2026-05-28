from aiogram import Bot
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.utils.keyboard import InlineKeyboardBuilder
from loguru import logger

from app.core.config import settings
from app.models.exchange import DutyExchange


async def send_exchange_notification_via_bot(exchange: DutyExchange):
  """
  Создает временный инстанс бота и отправляет инлайн-запрос на обмен
  студенту, которому предложили поменяться.
  """
  if not exchange.suggested or not exchange.suggested.user or not exchange.suggested.user.tg_id:
    logger.warning(
      f"Не удалось отправить уведомление для обмена #{exchange.id}: "
      f"у целевого студента (ID: {exchange.suggested_id}) отсутствует tg_id."
    )
    return

  # Извлекаем даты и форматируем для удобства чтения
  init_date = exchange.initiator_duty.date.strftime("%d.%m.%Y")
  sugg_date = exchange.suggested_duty.date.strftime("%d.%m.%Y")

  text = (
    f"🔄 <b>Предложение обмена дежурствами!</b>\n\n"
    f"Студент <b>{exchange.initiator.full_name}</b> хочет поменяться с вами днями:\n"
    f"• Его дежурство: <code>{init_date}</code>\n"
    f"• Ваше дежурство: <code>{sugg_date}</code>\n\n"
    f"Вы согласны на обмен?"
  )

  # Строим клавиатуру с зашитым ID обмена
  builder = InlineKeyboardBuilder()
  builder.button(text="✅ Принять", callback_data=f"exch:accept:{exchange.id}")
  builder.button(text="❌ Отклонить", callback_data=f"exch:reject:{exchange.id}")
  builder.adjust(2)

  bot = Bot(
    token=settings.BOT_TOKEN,
    default_properties=DefaultBotProperties(parse_mode=ParseMode.HTML)
  )

  try:
    await bot.send_message(
      chat_id=exchange.suggested.user.tg_id,
      text=text,
      reply_markup=builder.as_markup()
    )
    logger.success(
      f"Уведомление об обмене #{exchange.id} успешно отправлено в Telegram юзеру {exchange.suggested.user.tg_id}")
  except Exception as e:
    logger.error(f"Не удалось отправить сообщение через бота для обмена #{exchange.id}: {e}")
  finally:
    await bot.session.close()


async def send_exchange_status_update_to_initiator(exchange: DutyExchange, is_accepted: bool):
  """
  Опциональное уведомление инициатора о том, что его заявку приняли или отклонили
  """
  if not exchange.initiator or not exchange.initiator.user or not exchange.initiator.user.tg_id:
    return

  init_date = exchange.initiator_duty.date.strftime("%d.%m.%Y")
  sugg_date = exchange.suggested_duty.date.strftime("%d.%m.%Y")

  status_emoji = "✅" if is_accepted else "❌"
  status_text = "<b>ПРИНЯЛ</b>" if is_accepted else "<b>ОТКЛОНИЛ</b>"

  text = (
    f"{status_emoji} <b>Обновление статуса обмена!</b>\n\n"
    f"Студент <b>{exchange.suggested.full_name}</b> {status_text} ваше предложение обмена дежурствами:\n"
    f"• Ваш день: <code>{init_date}</code>\n"
    f"• Его день: <code>{sugg_date}</code>"
  )

  bot = Bot(
    token=settings.BOT_TOKEN,
    default_properties=DefaultBotProperties(parse_mode=ParseMode.HTML)
  )
  try:
    await bot.send_message(chat_id=exchange.initiator.user.tg_id, text=text)
  except Exception as e:
    logger.error(f"Не удалось отправить апдейт статуса инициатору обмена #{exchange.id}: {e}")
  finally:
    await bot.session.close()