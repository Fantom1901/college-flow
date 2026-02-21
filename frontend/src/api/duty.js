import api from './client.js'

export const dutyApi = {

  generate:  (groupId, startDate) =>
    api.post(`v1/duty/generate${groupId}`, null, { params: {start_date: startDate} }),

  updateStatus: (dutyId, newStatus) =>
    api.patch(`v1/duty${dutyId}/status`, null, { params: {new_status: newStatus}}),

  getSettings: (groupId) => api.get(`v1/duty/settings/${groupId}`).then(res => res.data),
}