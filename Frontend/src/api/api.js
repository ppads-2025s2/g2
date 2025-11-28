import axios from 'axios';

// MUDE A URL para a porta 8000 (FastAPI)
const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: Adiciona o token em CADA requisição autenticada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const validarTCC = async (formData) => {
  // O axios detecta FormData e configura o Content-Type multipart/form-data automaticamente
  const response = await api.post('/validar-tcc', formData);
  return response.data;
};

export default api;