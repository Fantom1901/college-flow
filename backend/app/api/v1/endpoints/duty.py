from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date
from typing import Optional

from app.core.database import get_db
from app.services.duty_service import DutyService
from app.models.duty import DutyStatus, DutyMechanism
from app.models.role import UserRole  # Твой Enum с ролями
from app.api.v1.dependencies import RoleChecker  # Твой класс проверки ролей
from app.schemas.duty import DutySettingsUpdate, DutySettingsRead

router = APIRouter()

allow_users = RoleChecker([UserRole.CURATOR, UserRole.ADMIN, UserRole.LEADER])
allow_curator_only = RoleChecker([UserRole.CURATOR, UserRole.ADMIN])

@router.post("/generate/{group_id}", status_code=status.HTTP_201_CREATED, dependencies=[Depends(allow_users)])
async def generate_weekly_duty(
  group_id: int,
  start_date: Optional[date] = None,
  db: AsyncSession = Depends(get_db),
):
  if not start_date:
    start_date = date.today()

  await DutyService.generate_weekly_schedule(db, group_id, start_date)
  await db.commit()
  return {"detail": "Расписание сформировано"}

@router.patch("/{duty_id}/status", dependencies=[Depends(allow_users)])
async def update_duty_status(
  duty_id: int,
  new_status: DutyStatus,
  db: AsyncSession = Depends(get_db),
):
  await DutyService.set_duty_result(db, duty_id, new_status)
  await db.commit()
  return {"detail": "Статус обновлён"}

@router.patch("/settings/{group_id}", response_model=DutySettingsRead, dependencies=[Depends(allow_users)])
async def update_duty_settings(
  group_id: int,
  settings_data: DutySettingsUpdate,
  db: AsyncSession = Depends(get_db),
):
  settings = await DutyService.get_or_create_settings(db, group_id)

  if settings_data.mechanism is not None:
    settings.mechanism = settings_data.mechanism
  if settings_data.work_days is not None:
    settings.work_days = settings_data.work_days
  if settings_data.excluded_dates is not None:
    settings.excluded_dates = settings_data.excluded_dates

  await db.commit()
  await db.refresh(settings)
  return settings

@router.get("/settings/{group_id}", response_model=DutySettingsRead)
async def get_duty_settings(
  group_id: int,
  db: AsyncSession = Depends(get_db),
):
  return await DutyService.get_or_create_settings(db, group_id)