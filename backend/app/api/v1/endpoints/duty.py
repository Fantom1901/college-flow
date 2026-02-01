from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date
from typing import Optional, List

from app.core.database import get_db
from app.services.duty_service import DutyService
from app.models.duty import DutyStatus, DutyMechanism, DutySchedule
from app.models.user import User
from app.models.role import UserRole
from app.api.v1.dependencies import RoleChecker
from app.schemas.duty import DutySettingsUpdate, DutySettingsRead

router = APIRouter()

get_mgmt_user = RoleChecker([UserRole.CURATOR, UserRole.ADMIN, UserRole.LEADER])


async def check_group_access(current_user: User, group_id: int):
  """Проверка: имеет ли право юзер трогать эту группу"""
  if current_user.role == UserRole.ADMIN:
    return True

  # Проверка для куратора
  if current_user.role == UserRole.CURATOR:
    if current_user.curator_profile and current_user.curator_profile.group_id == group_id:
      return True

  # Проверка для старосты (лидера)
  if current_user.role == UserRole.LEADER:
    if current_user.student_profile and current_user.student_profile.group_id == group_id:
      return True

  raise HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="У вас нет прав для управления этой группой"
  )


@router.post("/generate/{group_id}", status_code=status.HTTP_201_CREATED)
async def generate_weekly_duty(
  group_id: int,
  start_date: Optional[date] = None,
  current_user: User = Depends(get_mgmt_user),
  db: AsyncSession = Depends(get_db),
):
  await check_group_access(current_user, group_id)

  if not start_date:
    start_date = date.today()

  await DutyService.generate_weekly_schedule(db, group_id, start_date)
  await db.commit()
  return {"detail": "Расписание сформировано"}


@router.patch("/{duty_id}/status")
async def update_duty_status(
  duty_id: int,
  new_status: DutyStatus,
  current_user: User = Depends(get_mgmt_user),
  db: AsyncSession = Depends(get_db),
):
  # Ищем дежурство, чтобы понять к какой группе оно относится
  stmt = select(DutySchedule).where(DutySchedule.id == duty_id)
  result = await db.execute(stmt)
  duty = result.scalar_one_or_none()

  if not duty:
    raise HTTPException(status_code=404, detail="Дежурство не найдено")

  await check_group_access(current_user, duty.group_id)

  await DutyService.set_duty_result(db, duty_id, new_status)
  await db.commit()
  return {"detail": "Статус обновлён"}


@router.patch("/settings/{group_id}", response_model=DutySettingsRead)
async def update_duty_settings(
  group_id: int,
  settings_data: DutySettingsUpdate,
  current_user: User = Depends(get_mgmt_user),
  db: AsyncSession = Depends(get_db),
):
  await check_group_access(current_user, group_id)

  settings = await DutyService.get_or_create_settings(db, group_id)

  if settings_data.mechanism is not None:
    settings.mechanism = settings_data.mechanism
  if settings_data.work_days is not None:
    settings.work_days = settings_data.work_days
  if settings_data.excluded_dates is not None:
    settings.excluded_dates = settings_data.excluded_dates
  if settings_data.person_per_day is not None:
    settings.person_per_day = settings_data.person_per_day

  await db.commit()
  await db.refresh(settings)
  return settings


@router.get("/settings/{group_id}", response_model=DutySettingsRead)
async def get_duty_settings(
  group_id: int,
  current_user: User = Depends(get_mgmt_user),
  db: AsyncSession = Depends(get_db),
):
  await check_group_access(current_user, group_id)
  return await DutyService.get_or_create_settings(db, group_id)