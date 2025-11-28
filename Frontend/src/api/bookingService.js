import api from './api';

export const bookingService = {
  // ATUALIZADO: Pega os slots que o aluno logado PODE agendar
  getAvailableSlots: async () => {
    const response = await api.get('/agendamentos/disponiveis');
    return response.data; 
  },

  // ATUALIZADO: Busca histórico do usuário
  getMyBookings: async () => {
    const response = await api.get('/meus_agendamentos');
    return response.data; // Espera [{...}, {...}]
  },

  // ATUALIZADO: Cria novo agendamento
  createBooking: async (bookingData) => {
    const apiData = {
      tipo_maquina: bookingData.type === '3d' ? 'impressora_3d' : 'laser',
      data_inicio: bookingData.start_time,
      duracao_horas: bookingData.duration
    };

    const response = await api.post('/agendamentos', apiData);
    return response.data;
  },

  cancelBooking: async (bookingId) => {
    // Chama a rota DELETE /api/agendamentos/{id}
    const response = await api.delete(`/agendamentos/${bookingId}`);
    return response.data;
  }
};