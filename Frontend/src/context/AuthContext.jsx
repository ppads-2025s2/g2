import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';
import api from '../api/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para checar o login inicial

  useEffect(() => {
    // Tenta pegar o usuário do localStorage ao carregar a página
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Diz ao Axios para usar esse token em requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // ATUALIZADO: Função de login agora tem 2 passos
  const login = async (email, password) => {
    try {
      // PASSO 1: Fazer o login e pegar o token
      const { access_token } = await authService.login(email, password);
      
      // Salva o token no localStorage e no Axios
      localStorage.setItem('authToken', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // PASSO 2: Buscar os dados do usuário com o token
      const userData = await authService.getMe(); // Chama /api/usuarios/eu
      
      // Agora sim, salva o usuário no estado e no localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

    } catch (error) {
      // Limpa tudo se o login falhar
      logout();
      throw error; // Joga o erro para a página de Login tratar
    }
  };

  // ATUALIZADO: usa o novo 'authService'
  const register = async (userData) => {
    // O register do backend pode ou não retornar o token
    // Por simplicidade, vamos apenas registrar e pedir que ele faça login
    await authService.register(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};