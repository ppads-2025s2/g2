import React, { useState, useEffect } from 'react';
import { bookingService } from '../../api/bookingService';
import './MyBookings.css'; 

const MyBookings = () => {
  const [bookings3d, setBookings3d] = useState([]);
  const [bookingsLaser, setBookingsLaser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const allBookings = await bookingService.getMyBookings();

      // Filtra os agendamentos por tipo
      // OBS: Verifique se o backend retorna 'laser'/'impressora_3d' ou 'CORTE_LASER'/'IMPRESSORA_3D'
      // Ajustei aqui para ser mais flexível com toLowerCase()
      const laserBookings = allBookings.filter(
        book => book.tipo_maquina?.toLowerCase().includes('laser')
      );
      const impressionBookings = allBookings.filter(
        book => book.tipo_maquina?.toLowerCase().includes('3d')
      );

      setBookings3d(impressionBookings);
      setBookingsLaser(laserBookings);

    } catch (err) {
      setError('Erro ao carregar agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  // --- NOVO: Lógica de Cancelar ---
  const handleCancel = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    try {
      await bookingService.cancelBooking(id);
      
      // Remove visualmente das listas para não precisar recarregar a página
      setBookings3d(prev => prev.filter(b => b.id !== id));
      setBookingsLaser(prev => prev.filter(b => b.id !== id));
      
      alert('Agendamento cancelado!');
    } catch (err) {
      console.error(err);
      alert('Erro ao cancelar. Tente novamente.');
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <p className="loading">Carregando seus agendamentos...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="my-bookings-container">
      <h2>Meus Agendamentos</h2>
      
      <div className="booking-section">
        <h3>Impressora 3D</h3>
        {bookings3d.length > 0 ? (
          <ul className="booking-list">
            {bookings3d.map(book => (
              <li key={book.id} className="booking-item"> 
                <div className="booking-info">
                  <strong>Início:</strong> {formatDate(book.data_inicio)} <br />
                  <strong>Fim:</strong> {formatDate(book.data_fim)}
                </div>
                {/* Botão de Cancelar */}
                <button 
                  className="btn-cancel"
                  onClick={() => handleCancel(book.id)}
                >
                  Cancelar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-msg">Você não tem agendamentos para Impressora 3D.</p>
        )}
      </div>

      <div className="booking-section">
        <h3>Corte a Laser</h3>
        {bookingsLaser.length > 0 ? (
          <ul className="booking-list">
            {bookingsLaser.map(book => (
              <li key={book.id} className="booking-item">
                <div className="booking-info">
                  <strong>Início:</strong> {formatDate(book.data_inicio)} <br />
                  <strong>Fim:</strong> {formatDate(book.data_fim)}
                </div>
                {/* Botão de Cancelar */}
                <button 
                  className="btn-cancel"
                  onClick={() => handleCancel(book.id)}
                >
                  Cancelar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-msg">Você não tem agendamentos para Corte a Laser.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;