import React, { useState, useEffect } from 'react';
import { bookingService } from '../../api/bookingService';
import './MyBookings.css'; // O CSS continua o mesmo

const MyBookings = () => {
  // Vamos filtrar a lista de agendamentos
  const [bookings3d, setBookings3d] = useState([]);
  const [bookingsLaser, setBookingsLaser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setLoading(true);
        // 1. Busca todos os agendamentos do usuário
        const allBookings = await bookingService.getMyBookings();

        // 2. Filtra os agendamentos por tipo
        const laserBookings = allBookings.filter(
          book => book.tipo_maquina === 'laser'
        );
        const impressionBookings = allBookings.filter(
          book => book.tipo_maquina === 'impressora_3d'
        );

        setBookings3d(impressionBookings);
        setBookingsLaser(laserBookings);

      } catch (err) {
        setError('Erro ao carregar agendamentos.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  // Formata a data para um formato legível
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <p>Carregando seus agendamentos...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="my-bookings-container">
      <h2>Meus Agendamentos</h2>
      
      <div className="booking-list">
        <h3>Impressora 3D</h3>
        {bookings3d.length > 0 ? (
          <ul>
            {bookings3d.map(book => (
              // Usa o ID do agendamento como chave
              <li key={book.id}> 
                <strong>Início:</strong> {formatDate(book.data_inicio)} <br />
                <strong>Fim:</strong> {formatDate(book.data_fim)}
              </li>
            ))}
          </ul>
        ) : (
          <p>Você não tem agendamentos para Impressora 3D.</p>
        )}
      </div>

      <div className="booking-list">
        <h3>Corte a Laser</h3>
        {bookingsLaser.length > 0 ? (
          <ul>
            {bookingsLaser.map(book => (
              <li key={book.id}>
                <strong>Início:</strong> {formatDate(book.data_inicio)} <br />
                <strong>Fim:</strong> {formatDate(book.data_fim)}
              </li>
            ))}
          </ul>
        ) : (
          <p>Você não tem agendamentos para Corte a Laser.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;