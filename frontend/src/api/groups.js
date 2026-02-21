import api from "./client.js";

export const groupsApi = {

  getAll: () => api.get('v1/groups/').then(res => res.data),

  getMy: () => api.get('v1/groups/my').then(res => res.data),

  initGroup: (data) => api.post('v1/groups/init', data).then(res => res.data),
}