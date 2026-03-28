import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    
    // Si el login es exitoso, guardamos el token y el usuario
    if (response.data.token) {
      localStorage.setItem('crm_token', response.data.token);
      localStorage.setItem('crm_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('crm_user'));
  }
};