import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { bookingService } from '../../api/bookingService';
import './Scheduler.css'; // Reutiliza o mesmo CSS

const ScheduleLaser = () => {
  const { user } = useAuth();
  
  // --- MUDANÇA: Novos estados para a API estruturada ---
  const [apiData, setApiData] = useState(null); // Guarda a resposta inteira da API
  const [selectedDate, setSelectedDate] = useState(''); // Guarda a DATA (ex: "2025-11-17")
  const [timeSlots, setTimeSlots] = useState([]); // Guarda os horários da data selecionada
  const [selectedTime, setSelectedTime] = useState(''); // Guarda o SLOT ISO (ex: "2025-11-17T08:00:00+00:00")
  // --- FIM DA MUDANÇA ---

  const [duration, setDuration] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // --- MUDANÇA: Lógica de fetch atualizada ---
  useEffect(() => {
    const fetchSlots = async () => {
      if (!user) return;
      try {
        // 1. Busca os dados estruturados do backend
        // A função do bookingService 'getAvailableSlots' continua a mesma
        const data = await bookingService.getAvailableSlots('laser');
        
        // 2. Salva os dados no estado
        setApiData(data);

        // 3. Se não houver dias disponíveis, informa o usuário
        if (!data.dias_disponiveis || data.dias_disponiveis.length === 0) {
          setError('Nenhum horário disponível nos próximos 14 dias.');
        }

      } catch (err) {
        // Mostra o erro real vindo da API
        setError(err.response?.data?.detail || 'Erro ao buscar horários disponíveis.');
      }
    };
    
    fetchSlots();
  }, [user]); // Roda quando o usuário é carregado
  // --- FIM DA MUDANÇA ---

  // --- MUDANÇA: Handler para o dropdown de DATA ---
  const handleDateChange = (date) => {
    setSelectedDate(date);
    
    // Limpa a seleção de hora e duração
    setSelectedTime('');
    setDuration(1);

    if (date === "") {
      setTimeSlots([]); // Limpa o dropdown de horas se "Selecione" for escolhido
      return;
    }

    // 1. Encontra os horários para a data selecionada
    const dayData = apiData.dias_disponiveis.find(dia => dia.data === date);
    
    // 2. Atualiza o estado dos horários
    setTimeSlots(dayData ? dayData.horarios_livres : []);
  };
  // --- FIM DA MUDANÇA ---

  // --- MUDANÇA: Handler para o dropdown de HORA ---
  const handleTimeChange = (timeIso) => {
    setSelectedTime(timeIso);
    // Reseta a duração para 1h quando a hora muda
    setDuration(1);
  };
  // --- FIM DA MUDANÇA ---

  // --- MUDANÇA: Função para verificar durações válidas ---
  const getValidDurations = () => {
    if (!selectedTime) return [{ value: 1, label: "1 hora" }];

    const selectedSlotData = timeSlots.find(slot => slot.slot_inicio_iso === selectedTime);

    // Se a API disse que 2h é disponível, mostra a opção
    if (selectedSlotData && selectedSlotData.duracao_2h_disponivel) {
      return [{ value: 1, label: "1 hora" }, { value: 2, label: "2 horas" }];
    }
    
    // Caso contrário, só permite 1h
    return [{ value: 1, label: "1 hora" }];
  };
  // --- FIM DA MUDANÇA ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      // --- MUDANÇA: Envia o 'selectedTime' (ISO string) ---
      // O seu bookingService.createBooking continua igual
      await bookingService.createBooking({
        type: 'laser', // O bookingService converte para 'CORTE_LASER'
        start_time: selectedTime, // Este é o 'slot_inicio_iso'
        duration: parseInt(duration),
      });
      // --- FIM DA MUDANÇA ---

      setMessage(`Agendamento para ${new Date(selectedTime).toLocaleString('pt-BR')} confirmado!`);
      
      // Limpa os seletores
      setSelectedDate('');
      setTimeSlots([]);
      setSelectedTime('');
      setDuration(1);
      setApiData(null); // Limpa os dados para forçar recarga
      
      // --- MUDANÇA: Re-busca os dados da API ---
      const data = await bookingService.getAvailableSlots('laser');
      setApiData(data);
      if (!data.dias_disponiveis || data.dias_disponiveis.length === 0) {
        setError('Nenhum horário disponível nos próximos 14 dias.');
      }
      // --- FIM DA MUDANÇA ---

    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao agendar!');
    }
  };

  // Função para formatar a data (YYYY-MM-DD -> DD/MM/YYYY)
  const formatDate = (dateString) => {
    // Usamos 'UTC' para evitar o bug de "um dia a menos"
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="scheduler-container">
      <h2>Agendar Corte a Laser</h2> 
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {/* --- MUDANÇA: Mostra as regras do aluno --- */}
      {apiData && apiData.regras_agendamento && (
        <p className="info-text">
          Lembrete: Você pode agendar em: <strong>{apiData.regras_agendamento.dias_permitidos_desc}</strong>
        </p>
      )}
      {/* --- FIM DA MUDANÇA --- */}

      <form onSubmit={handleSubmit}>
        
        {/* --- MUDANÇA: Dropdown 1 (Datas) --- */}
        <div className="form-group">
          <label>1. Escolha a data:</label>
          <select 
            value={selectedDate} 
            onChange={(e) => handleDateChange(e.target.value)} 
            required
          >
            <option value="">Selecione uma data</option>
            {apiData && apiData.dias_disponiveis.map(dia => (
              <option key={dia.data} value={dia.data}>
                {formatDate(dia.data)}
              </option>
            ))}
          </select>
        </div>
        {/* --- FIM DA MUDANÇA --- */}

        {/* --- MUDANÇA: Dropdown 2 (Horários) --- */}
        <div className="form-group">
          <label>2. Escolha o horário de início:</label>
          <select 
            value={selectedTime} 
            onChange={(e) => handleTimeChange(e.target.value)} 
            required
            disabled={!selectedDate || timeSlots.length === 0} // Desabilitado sem data
          >
            <option value="">Selecione um horário</option>
            {timeSlots.map(slot => (
              <option key={slot.slot_inicio_iso} value={slot.slot_inicio_iso}>
                {slot.hora_display}
              </option>
            ))}
          </select>
        </div>
        {/* --- FIM DA MUDANÇA --- */}

        {/* --- MUDANÇA: Dropdown 3 (Duração) --- */}
        {selectedTime && (
          <div className="form-group">
            <label>3. Duração:</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} required>
              {getValidDurations().map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
        {/* --- FIM DA MUDANÇA --- */}

        <button type="submit" className="btn-primary" disabled={!selectedTime}>
          Confirmar Agendamento
        </button>
      </form>
    </div>
  );
};

export default ScheduleLaser;