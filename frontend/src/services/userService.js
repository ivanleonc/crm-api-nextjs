import api from './api';

export const userService = {
  async getUsers(search = '') {
    const response = await api.get(`/crm/users?search=${search}`);
    return response.data;
  },

  async createUser(userData) {
    // userData debe contener: first_name, last_name, email, password, y opcionalmente role_id
    const response = await api.post('/crm/users', userData);
    return response.data;
  },

  async getRoles() {
    const response = await api.get('/crm/roles');
    return response.data;
  }
};