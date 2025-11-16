import api from './api';

export const bookingService = {
  // ATUALIZADO: Esta rota é muito melhor!
  // Pega os slots que o aluno logado PODE agendar
  getAvailableSlots: async () => {
    const response = await api.get('/agendamentos/disponiveis');
    return response.data; 
  },

  // ATUALIZADO: Rota mudou de 'my_bookings' para 'meus_agendamentos'
  getMyBookings: async () => {
    const response = await api.get('/meus_agendamentos');
    return response.data; // Espera [{...}, {...}]
  },

  // ATUALIZADO: Rota mudou de 'book' para 'agendamentos' e os dados são diferentes
  createBooking: async (bookingData) => {
    // bookingData = { type, start_time, duration }
    
    // 1. Mapeia os dados do front-end para o que a API espera
    const apiData = {
      tipo_maquina: bookingData.type === '3d' ? 'impressora_3d' : 'laser',
      data_inicio: bookingData.start_time,
      duracao_horas: bookingData.duration
    };

    // 2. Chama a rota POST /api/agendamentos
    const response = await api.post('/agendamentos', apiData);
    return response.data;
  },
};