import api from './api';

export const customerService = {
  // Recibe la página, el límite y el término de búsqueda
  async getCustomers(page = 1, limit = 10, search = '') {
    const response = await api.get(`/crm/customers?page=${page}&limit=${limit}&search=${search}`);
    return response.data; // Devuelve el { data, pagination } que armamos en Next.js
  },

  // Crear nuevo cliente
  async createCustomer(customerData) {
    const response = await api.post('/crm/customers', customerData);
    return response.data;
  },

  // Modificar cliente
  async updateCustomer(id, customerData) {
    const response = await api.put(`/crm/customers/${id}`, customerData);
    return response.data;
  },

  // Eliminar cliente
  async deleteCustomer(id) {
    const response = await api.delete(`/crm/customers/${id}`);
    return response.data;
  }
};