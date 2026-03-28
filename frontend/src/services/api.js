import axios from 'axios';

// 1. Crear la instancia base
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // La URL de tu backend en Next.js
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. INTERCEPTOR DE PETICIONES (La magia modular)
// Esto se ejecuta AUTOMÁTICAMENTE antes de cada petición al backend.
apiClient.interceptors.request.use(
  (config) => {
    // Buscamos el token en el LocalStorage
    const token = localStorage.getItem('crm_token');
    
    // Si hay token, se lo inyectamos al Header de Autorización
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. INTERCEPTOR DE RESPUESTAS
// Para capturar errores globales (ej. si el token expiró y el backend devuelve 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si da error 401, borramos el token viejo y redirigimos al login
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;