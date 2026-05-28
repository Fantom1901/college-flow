import api from './client.js'

export const exchangeApi = {
  // GET /api/v1/exchange/
  // Получить списки входящих, исходящих заявок и историю обменов
  getRequests: () =>
    api.get('v1/exchange/').then(res => res.data),

  // POST /api/v1/exchange/
  // Создать новую заявку на обмен дежурствами
  // data: { initiator_duty_id: number, suggested_id: number, suggested_duty_id: number }
  createRequest: (data) =>
    api.post('v1/exchange/', data).then(res => res.data),

  // PATCH /api/v1/exchange/{exchange_id}/status
  // Изменить статус заявки (accepted, rejected, cancelled)
  updateStatus: (exchangeId, status) =>
    api.patch(`v1/exchange/${exchangeId}/status`, { status }).then(res => res.data),
}

export default exchangeApi