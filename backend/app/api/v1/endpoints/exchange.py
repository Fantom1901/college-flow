from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.schemas.exchange import ExchangeCreate, ExchangeResponse
from app.models.exchange import DutyExchange, ExchangeStatus
from app.models.duty import DutySchedule, DutyStatus
from app.models.student import Student
from app.models.role import UserRole
# Импортируем твой RoleChecker (подправь путь к файлу проверки ролей, если надо)
from app.api.v1.dependencies import RoleChecker

router = APIRouter(tags=["Duty Exchange"])

# Инициализируем чекер ролей для студентов и старост
get_current_student = RoleChecker(allowed_roles=[UserRole.STUDENT, UserRole.LEADER])


@router.post("/", response_model=ExchangeResponse, status_code=status.HTTP_201_CREATED)
async def create_exchange_request(
  payload: ExchangeCreate,
  db: AsyncSession = Depends(get_db),
  current_user=Depends(get_current_student)  # Вот она, железная стена авторизации
):
  """
  Создать защищенную заявку на обмен дежурствами
  """
  # 1. Проверяем, привязан ли к юзеру профиль студента
  if not current_user.student_profile:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="У текущего пользователя отсутствует профиль студента."
    )

  initiator_student_id = current_user.student_profile.id
  group_id = current_user.student_profile.group_id

  # 2. Проверяем дежурство инициатора: существует ли, принадлежит ли ему, статус PENDING
  init_duty_stmt = select(DutySchedule).where(DutySchedule.id == payload.initiator_duty_id)
  init_duty_res = await db.execute(init_duty_stmt)
  initiator_duty = init_duty_res.scalar_one_or_none()

  if not initiator_duty:
    raise HTTPException(status_code=404, detail="Ваше дежурство не найдено в расписании.")

  if initiator_duty.student_id != initiator_student_id:
    raise HTTPException(status_code=403, detail="Вы не можете инициировать обмен для чужого дежурства.")

  if initiator_duty.status != DutyStatus.PENDING:
    raise HTTPException(status_code=400, detail="Нельзя поменять дежурство, которое уже завершено или пропущено.")

  # 3. Проверяем дежурство оппонента: существует ли, принадлежит ли ему, одна ли у них группа
  sugg_duty_stmt = select(DutySchedule).where(DutySchedule.id == payload.suggested_duty_id)
  sugg_duty_res = await db.execute(sugg_duty_stmt)
  suggested_duty = sugg_duty_res.scalar_one_or_none()

  if not suggested_duty:
    raise HTTPException(status_code=404, detail="Дежурство оппонента не найдено в расписании.")

  if suggested_duty.student_id != payload.suggested_id:
    raise HTTPException(status_code=400, detail="Указанное дежурство не принадлежит выбранному студенту.")

  if suggested_duty.group_id != group_id:
    raise HTTPException(status_code=400, detail="Вы не можете меняться дежурствами со студентами из других групп.")

  if suggested_duty.status != DutyStatus.PENDING:
    raise HTTPException(status_code=400, detail="Дежурство оппонента уже не активно для обмена.")

  # 4. Проверяем, нет ли уже активной точно такой же заявки, чтобы избежать дублей
  dup_stmt = select(DutyExchange).where(
    DutyExchange.initiator_duty_id == payload.initiator_duty_id,
    DutyExchange.suggested_duty_id == payload.suggested_duty_id,
    DutyExchange.status == ExchangeStatus.PENDING
  )
  dup_res = await db.execute(dup_stmt)
  if dup_res.scalar_one_or_none():
    raise HTTPException(status_code=400, detail="Такая заявка на обмен уже существует и ждет рассмотрения.")

  # 5. Если все проверки пройдены — создаем чистый лог обмена
  new_exchange = DutyExchange(
    initiator_id=initiator_student_id,
    initiator_duty_id=payload.initiator_duty_id,
    suggested_id=payload.suggested_id,
    suggested_duty_id=payload.suggested_duty_id,
    status=ExchangeStatus.PENDING
  )

  db.add(new_exchange)
  await db.commit()

  # Снова подгружаем объект со всеми связями для красивого ответа схемы ExchangeResponse
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

  return exchange_full