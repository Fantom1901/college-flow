import pytest
from sqlalchemy import select
from app.models.duty import DutySchedule
from seed import seed_data


class Color:
  HEADER = "\033[95m"
  OK = "\033[92m"
  INFO = "\033[94m"
  FAIL = "\033[91m"
  END = "\033[0m"


def log(status, message):
  print(f"\n{status} {message}{Color.END}")


@pytest.mark.asyncio
async def test_exchange_lifecycle(client, db_session):
  log(Color.INFO, "--- Запуск теста: Полный цикл обмена ---")
  await seed_data(db_session)
  log(Color.OK, "✅ База данных инициализирована.")

  # Создание
  resp = await client.post("/api/v1/exchange/", json={
    "initiator_duty_id": 1, "suggested_id": 2, "suggested_duty_id": 2
  }, headers={"X-TG-Data": "nixa_dev_mode"})

  assert resp.status_code == 201
  exchange_id = resp.json()["id"]
  log(Color.OK, f"✅ Заявка создана (ID: {exchange_id}).")

  # Принятие
  resp = await client.patch(f"/api/v1/exchange/{exchange_id}/status", json={"status": "accepted"},
                            headers={"X-TG-Data": "other_student_mode"})

  assert resp.status_code == 200
  log(Color.OK, "✅ Заявка принята вторым студентом.")

  # Проверка БД
  res1 = await db_session.execute(select(DutySchedule).where(DutySchedule.id == 1))
  res2 = await db_session.execute(select(DutySchedule).where(DutySchedule.id == 2))
  assert res1.scalar_one().student_id == 2
  assert res2.scalar_one().student_id == 1
  log(Color.OK, "✅ Данные в БД успешно обновлены.")


@pytest.mark.asyncio
async def test_exchange_rejection(client, db_session):
  log(Color.INFO, "--- Запуск теста: Отклонение заявки ---")
  await seed_data(db_session)

  # Создание
  resp = await client.post("/api/v1/exchange/", json={
    "initiator_duty_id": 1, "suggested_id": 2, "suggested_duty_id": 2
  }, headers={"X-TG-Data": "nixa_dev_mode"})
  ex_id = resp.json()["id"]

  # Отклонение
  resp = await client.patch(f"/api/v1/exchange/{ex_id}/status", json={"status": "rejected"},
                            headers={"X-TG-Data": "other_student_mode"})

  assert resp.status_code == 200
  assert resp.json()["status"] == "rejected"
  log(Color.OK, "✅ Заявка успешно отклонена.")