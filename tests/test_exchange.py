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
async def test_exchange_lifecycle(client, db_session): # тут db_session нужен для seed_data
  log(Color.INFO, "--- Запуск теста: Полный цикл обмена (Успех) ---")
  ids = await seed_data(db_session)
  log(Color.OK, "✅ База данных инициализирована.")

  # 1. Создание заявки на обмен
  resp = await client.post("/api/v1/exchange/", json={
    "initiator_duty_id": ids["init_duty_id"],
    "suggested_id": ids["sugg_student_id"],
    "suggested_duty_id": ids["sugg_duty_id"]
  }, headers={"X-TG-Data": "nixa_dev_mode"})

  assert resp.status_code == 201, f"Не удалось создать заявку: {resp.status_code} - {resp.text}"
  exchange_id = resp.json()["id"]
  log(Color.OK, f"✅ Заявка создана (ID: {exchange_id}).")

  # 2. Проверка эндпоинта списков
  resp_list = await client.get("/api/v1/exchange/", headers={"X-TG-Data": "nixa_dev_mode"})
  assert resp_list.status_code == 200, f"Ошибка получения списка: {resp_list.status_code}"
  assert len(resp_list.json()["outgoing"]) == 1
  log(Color.OK, "✅ Заявка успешно отображается в списке исходящих.")

  # 3. Принятие заявки оппонентом
  resp = await client.patch(f"/api/v1/exchange/{exchange_id}/status", json={"status": "accepted"},
                            headers={"X-TG-Data": "other_student_mode"})
  assert resp.status_code == 200, f"Ошибка принятия заявки: {resp.status_code} - {resp.text}"
  log(Color.OK, "✅ Заявка принята вторым студентом.")

  # 4. Проверка БД
  db_session.expire_all()
  res1 = await db_session.execute(select(DutySchedule).where(DutySchedule.id == ids["init_duty_id"]))
  res2 = await db_session.execute(select(DutySchedule).where(DutySchedule.id == ids["sugg_duty_id"]))

  assert res1.scalar_one().student_id == ids["sugg_student_id"]
  assert res2.scalar_one().student_id == ids["init_student_id"]
  log(Color.OK, "✅ Данные в БД успешно обновлены: студенты поменялись дежурствами.")


@pytest.mark.asyncio
async def test_exchange_rejection(client, db_session):
  log(Color.INFO, "--- Запуск теста: Отклонение заявки ---")
  ids = await seed_data(db_session)

  # 1. Создание
  resp = await client.post("/api/v1/exchange/", json={
    "initiator_duty_id": ids["init_duty_id"],
    "suggested_id": ids["sugg_student_id"],
    "suggested_duty_id": ids["sugg_duty_id"]
  }, headers={"X-TG-Data": "nixa_dev_mode"})
  assert resp.status_code == 201, f"Не удалось создать заявку: {resp.status_code} - {resp.text}"
  ex_id = resp.json()["id"]

  # 2. Отклонение оппонентом
  resp = await client.patch(f"/api/v1/exchange/{ex_id}/status", json={"status": "rejected"},
                            headers={"X-TG-Data": "other_student_mode"})
  assert resp.status_code == 200, f"Ошибка отклонения: {resp.status_code}"
  assert resp.json()["status"] == "rejected"
  log(Color.OK, "✅ Заявка успешно отклонена получателем.")

  # 3. Проверка истории
  resp_list = await client.get("/api/v1/exchange/", headers={"X-TG-Data": "nixa_dev_mode"})
  assert len(resp_list.json()["history"]) == 1
  log(Color.OK, "✅ Заявка со статусом rejected корректно упала в историю.")


@pytest.mark.asyncio
async def test_exchange_cancellation(client, db_session):
  log(Color.INFO, "--- Запуск теста: Отмена заявки создателем ---")
  ids = await seed_data(db_session)

  # 1. Создание
  resp = await client.post("/api/v1/exchange/", json={
    "initiator_duty_id": ids["init_duty_id"],
    "suggested_id": ids["sugg_student_id"],
    "suggested_duty_id": ids["sugg_duty_id"]
  }, headers={"X-TG-Data": "nixa_dev_mode"})
  assert resp.status_code == 201, f"Не удалось создать заявку: {resp.status_code} - {resp.text}"
  ex_id = resp.json()["id"]

  # 2. Попытка отмены ЧУЖИМ студентом
  resp_fail = await client.patch(f"/api/v1/exchange/{ex_id}/status", json={"status": "cancelled"},
                                 headers={"X-TG-Data": "other_student_mode"})
  assert resp_fail.status_code == 403
  log(Color.OK, "✅ Защита сработала: посторонний student не смог отменить чужую заявку.")

  # 3. Отмена самим создателем
  resp_ok = await client.patch(f"/api/v1/exchange/{ex_id}/status", json={"status": "cancelled"},
                               headers={"X-TG-Data": "nixa_dev_mode"})
  assert resp_ok.status_code == 200, f"Ошибка отмены: {resp_ok.status_code}"
  assert resp_ok.json()["status"] == "cancelled"
  log(Color.OK, "✅ Заявка успешно отменена самим инициатором.")


@pytest.mark.asyncio
async def test_exchange_security_gate(client, db_session):
  log(Color.INFO, "--- Запуск теста: Защита от дурака (Попытка взлома / двойного клика) ---")
  ids = await seed_data(db_session)

  # 1. Создание
  resp = await client.post("/api/v1/exchange/", json={
    "initiator_duty_id": ids["init_duty_id"],
    "suggested_id": ids["sugg_student_id"],
    "suggested_duty_id": ids["sugg_duty_id"]
  }, headers={"X-TG-Data": "nixa_dev_mode"})
  assert resp.status_code == 201, f"Не удалось создать заявку: {resp.status_code} - {resp.text}"
  ex_id = resp.json()["id"]

  # 2. Попытка инициатора САМОМУ принять свою же заявку
  resp_hack = await client.patch(f"/api/v1/exchange/{ex_id}/status", json={"status": "accepted"},
                                 headers={"X-TG-Data": "nixa_dev_mode"})
  assert resp_hack.status_code == 403
  log(Color.OK, "✅ Защита сработала: инициатор не может сам одобрить свой же запрос.")

  # 3. Принимаем заявку нормально
  await client.patch(f"/api/v1/exchange/{ex_id}/status", json={"status": "accepted"},
                     headers={"X-TG-Data": "other_student_mode"})

  # 4. Попытка обработать уже закрытую заявку повторно
  resp_double = await client.patch(f"/api/v1/exchange/{ex_id}/status", json={"status": "rejected"},
                                   headers={"X-TG-Data": "other_student_mode"})
  assert resp_double.status_code == 400
  log(Color.OK, "✅ Защита сработала: нельзя изменить статус уже закрытого обмена.")