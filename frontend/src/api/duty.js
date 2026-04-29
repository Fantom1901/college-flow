import api from './client.js'

export const dutyApi = {
  // Исправлено: добавлен слеш перед groupId и правильный путь
  generate: (groupId, startDate) =>
    api.post(`v1/duty/generate/${groupId}`, null, { params: { start_date: startDate } }),

  // Исправлено: путь v1/duty/{id}/status
  updateStatus: (dutyId, newStatus) =>
    api.patch(`v1/duty/${dutyId}/status`, null, { params: { new_status: newStatus } }),

  getSettings: (groupId) =>
    api.get(`v1/duty/settings/${groupId}`).then(res => res.data),

  // Новое: обновление настроек (тот самый PATCH)
  updateSettings: (groupId, data) =>
    api.patch(`v1/duty/settings/${groupId}`, data).then(res => res.data),

  // Новое: получение расписания
  getWeekly: (groupId) =>
    api.get(`v1/duty/weekly/${groupId}`).then(res => res.data),

  getToday: (groupId) =>
    api.get(`v1/duty/today/${groupId}`).then(res => res.data),
}