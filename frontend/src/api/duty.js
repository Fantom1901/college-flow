import api from './client.js'

export const dutyApi = {
  // GET /api/v1/duty/today/{group_id}
  getToday: (groupId) =>
    api.get(`v1/duty/today/${groupId}`).then(res => res.data),

  // PATCH /api/v1/duty/{duty_id}/status
  updateStatus: (dutyId, newStatus) =>
    api.patch(`v1/duty/${dutyId}/status`, null, { params: { new_status: newStatus } }),

  // GET /api/v1/duty/settings/{group_id}
  getSettings: (groupId) =>
    api.get(`v1/duty/settings/${groupId}`).then(res => res.data),

  // PATCH /api/v1/duty/settings/{group_id}
  updateSettings: (groupId, data) =>
    api.patch(`v1/duty/settings/${groupId}`, data).then(res => res.data),

  // POST /api/v1/duty/generate/{group_id}
  generate: (groupId, startDate) =>
    api.post(`v1/duty/generate/${groupId}`, null, { params: { start_date: startDate } }),

  // GET /api/v1/duty/weekly/{group_id}
  getWeekly: (groupId) =>
    api.get(`v1/duty/weekly/${groupId}`).then(res => res.data),
}