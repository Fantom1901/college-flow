import api from './client.js'

export const inviteApi = {
  createCuratorLink: () =>
    api.post('v1/invite/create-curator-link').then(res => res.data),

  bulkCreate: (groupId, names) =>
    api.post('v1/invite/bulk-create', { group_id: groupId, names }).then(res => res.data),
}