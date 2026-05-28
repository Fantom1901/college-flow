from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from loguru import logger

from app.core.database import get_db
from app.schemas.exchange import ExchangeCreate, ExchangeResponse, ExchangeStatusUpdate, ExchangeListResponse
from app.models.exchange import DutyExchange, ExchangeStatus
from app.models.duty import DutySchedule, DutyStatus
from app.models.student import Student
from app.models.role import UserRole
from app.api.v1.dependencies import RoleChecker
from app.services.bot_notifications import send_exchange_notification_via_bot

router = APIRouter(tags=["Duty Exchange"])

# Инициализируем чекер ролей для студентов и старост
get_current_student = RoleChecker(allowed_roles=[UserRole.STUDENT, UserRole.LEADER])


@router.get("/", response_model=ExchangeListResponse)
async def get_exchange_requests(
  db: AsyncSession = Depends(get_db),
  current_user=Depends(get_current_student)
):
  """
  Получить списки входящих, исходящих заявок и историю обменов для текущего студента
  """
  if not current_user.student_profile:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="У текущего пользователя отсутствует профиль студента."
    )

  student_id = current_user.student_profile.id

  # Загружаем все заявки, где пользователь является участником, со всеми зависимостями
  stmt = (
    select(DutyExchange)
    .where(or_(DutyExchange.initiator_id == student_id, DutyExchange.suggested_id == student_id))
    .options(
      selectinload(DutyExchange.initiator).selectinload(Student.user),
      selectinload(DutyExchange.suggested).selectinload(Student.user),
      selectinload(DutyExchange.initiator_duty),
      selectinload(DutyExchange.suggested_duty)
    )
    .order_by(DutyExchange.created_at.desc())
  )

  result = await db.execute(stmt)
  exchanges = result.scalars().all()

  incoming = []
  outgoing = []
  history = []

  for ex in exchanges:
    if ex.status == ExchangeStatus.PENDING:
      if ex.suggested_id == student_id:
        incoming.append(ex)
      else:
        outgoing.append(ex)
    else:
      history.append(ex)

  return ExchangeListResponse(
    incoming=incoming,
    outgoing=outgoing,
    history=history
  )


@router.post("/", response_model=ExchangeResponse, status_code=status.HTTP_201_CREATED)
async def create_exchange_request(
  payload: ExchangeCreate,
  db: AsyncSession = Depends(get_db),
  current_user=Depends(get_current_student)
):
  """
  Создать защищенную заявку на обмен дежурствами
  """
  if not current_user.student_profile:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="У текущего пользователя отсутствует профиль студента."
    )

  initiator_student_id = current_user.student_profile.id
  group_id = current_user.student_profile.group_id

  # 2. Проверяем дежурство инициатора
  init_duty_stmt = select(DutySchedule).where(DutySchedule.id == payload.initiator_duty_id)
  init_duty_res = await db.execute(init_duty_stmt)
  initiator_duty = init_duty_res.scalar_one_or_none()

  if not initiator_duty:
    raise HTTPException(status_code=404, detail="Ваше дежурство не найдено в расписании.")

  if initiator_duty.student_id != initiator_student_id:
    raise HTTPException(status_code=403, detail="Вы не можете инициировать обмен для чужого дежурства.")

  if initiator_duty.status != DutyStatus.PENDING:
    raise HTTPException(status_code=400, detail="Нельзя поменять дежурство, которое уже завершено или пропущено.")

  # 3. Проверяем дежурство оппонента
  sugg_duty_stmt = select(DutySchedule).where(DutySchedule.id == payload.suggested_duty_id)
  sugg_duty_res = await db.execute(sugg_duty_stmt)
  suggested_duty = sugg_duty_res.scalar_one_or_none()

  if not智慧_duty := suggested_duty:
    raise HTTPException(status_code=404, detail="Дежурство оппонента не найдено в расписании.")

  if suggested_duty.student_id != payload.suggested_id:
    raise HTTPException(status_code=400, detail="Указанное дежурство не принадлежит выбранному студенту.")

  if suggested_duty.group_id != group_id:
    raise HTTPException(status_code=400, detail="Вы не можете меняться дежурствами со студентами из других групп.")

  if suggested_duty.status != DutyStatus.PENDING:
    raise HTTPException(status_code=400, detail="Дежурство оппонента уже не активно для обмена.")

  # 4. Проверяем дубликаты
  dup_stmt = select(DutyExchange).where(
    DutyExchange.initiator_duty_id == payload.initiator_duty_id,
    DutyExchange.suggested_duty_id == payload.suggested_duty_id,
    DutyExchange.status == ExchangeStatus.PENDING
  )
  dup_res = await db.execute(dup_stmt)
  if dup_res.scalar_one_or_none():
    raise HTTPException(status_code=400, detail="Такая заявка на обмен уже существует и ждет рассмотрения.")

  # 5. Создаем лог обмена
  new_exchange = DutyExchange(
    initiator_id=initiator_student_id,
    initiator_duty_id=payload.initiator_duty_id,
    suggested_id=payload.suggested_id,
    suggested_duty_id=payload.suggested_duty_id,
    status=ExchangeStatus.PENDING
  )

  db.add(new_exchange)
  await db.commit()

  # Подгружаем объект со всеми связями для ответа и для отправки боту
  stmt = (
    select(DutyExchange)
    .where(DutyExchange.id == new_exchange.id)
    .options(
      selectinload(DutyExchange.initiator).selectinload(Student.user),
      selectinload(DutyExchange.suggested).selectinload(Student.user),
      selectinload(DutyExchange.initiator_duty),
      selectinload(DutyExchange.suggested_duty)
    )
  )
  result = await db.execute(stmt)
  exchange_full = result.scalar_one()

  # ХУК ДЛЯ ТЕЛЕГРАМ БОТА
  try:
    await send_exchange_notification_via_bot(exchange_full)
    logger.info(f"Заявка на обмен #{exchange_full.id} успешно создана и уведомление отправлено.")
  except Exception as e:
    logger.error(f"Ошибка при триггере уведомления бота для обмена #{exchange_full.id}: {e}")

  return exchange_full


@router.patch("/{exchange_id}/status", response_model=ExchangeResponse)
async def update_exchange_status(
  exchange_id: int = Path(...),
  payload: ExchangeStatusUpdate = None,
  db: AsyncSession = Depends(get_db),
  current_user=Depends(get_current_student)
):
  if not payload:
    raise HTTPException(status_code=400, detail="Не передано тело запроса.")

  stmt = (
    select(DutyExchange)
    .where(DutyExchange.id == exchange_id)
    .options(
      selectinload(DutyExchange.initiator).selectinload(Student.user),
      selectinload(DutyExchange.suggested).selectinload(Student.user),
      selectinload(DutyExchange.initiator_duty),
      selectinload(DutyExchange.suggested_duty)
    )
  )
  result = await db.execute(stmt)
  exchange = result.scalar_one_or_none()

  if not exchange:
    raise HTTPException(status_code=404, detail="Заявка не найдена.")

  if exchange.status != ExchangeStatus.PENDING:
    raise HTTPException(status_code=400, detail="Эта заявка уже обработана.")

  student_id = current_user.student_profile.id

  # Разделение прав доступа на основе желаемого статуса
  if payload.status in [ExchangeStatus.ACCEPTED, ExchangeStatus.REJECTED]:
    if exchange.suggested_id != student_id:
      logger.warning(f"Студент {student_id} пытался изменить статус чужой входящей заявки #{exchange_id}")
      raise HTTPException(status_code=403, detail="Вы можете отвечать только на входящие вам предложения.")

    if payload.status == ExchangeStatus.ACCEPTED:
      # Проверяем атомарность перед обменом: вдруг статусы дежурств изменились
      if exchange.initiator_duty.status != DutyStatus.PENDING or exchange.suggested_duty.status != DutyStatus.PENDING:
        raise HTTPException(status_code=400, detail="Одно из дежурств уже неактивно, обмен невозможен.")

      # Меняем дежурных местами
      exchange.initiator_duty.student_id = exchange.suggested_id
      exchange.suggested_duty.student_id = exchange.initiator_id
      exchange.status = ExchangeStatus.ACCEPTED
      logger.info(f"Обмен #{exchange_id} успешно ПРИНЯТ. Дежурства перераспределены.")
    else:
      exchange.status = ExchangeStatus.REJECTED
      logger.info(f"Обмен #{exchange_id} ОТКЛОНЕН получателем.")

  elif payload.status == ExchangeStatus.CANCELLED:
    if exchange.initiator_id != student_id:
      logger.warning(f"Студент {student_id} пытался отменить чужую исходящую заявку #{exchange_id}")
      raise HTTPException(status_code=403, detail="Вы можете отменять только свои созданные заявки.")

    exchange.status = ExchangeStatus.CANCELLED
    logger.info(f"Обмен #{exchange_id} ОТМЕНЕН создателем.")

  else:
    raise HTTPException(status_code=400, detail="Неверный статус для обновления.")

  await db.commit()
  return exchange