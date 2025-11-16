import api from './api';

export const authService = {
  // ATUALIZADO: envia como 'x-www-form-urlencoded'
  login: async (email, password) => {
    
    // 1. O backend espera o email no campo 'username'
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    // 2. Envia os dados como formulário
    const response = await api.post('/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // 3. A API SÓ retorna { access_token, token_type }
    return response.data; 
  },

  // NOVO: Função para buscar o usuário logado
  getMe: async () => {
    // Note que o 'api.js' já vai incluir o token no cabeçalho
    const response = await api.get('/usuarios/eu');
    return response.data; // Retorna { id, email, curso, semestre }
  },

  // ATUALIZADO: Rota mudou de 'register' para 'registrar'
  register: async (userData) => {
    // userData = { email, password, curso, semestre }
    const response = await api.post('/registrar', userData);
    return response.data;
  },
};