import api from './client.js'

export const usersApi = {
  getMe: () => api.get('v1/users/me').then(res => res.data),

  registerStudent: (data) =>  api.post('v1/users/register_student', data),

  updateMe: (data) => api.patch('v1/users/me', data).then(res => res.data),
}