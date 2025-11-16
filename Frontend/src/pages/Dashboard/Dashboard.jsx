import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Bem-vindo, {user.email}!</h2>
      <p>Curso: {user.curso}</p>
      <p>Semestre: {user.semestre}º</p>
      
      <h3>O que você gostaria de fazer?</h3>
      <nav>
        <Link to="/agendar-3d" className="btn-primary">Agendar Impressora 3D</Link>
        <Link to="/agendar-laser" className="btn-primary">Agendar Corte a Laser</Link>
        <Link to="/meus-agendamentos" className="btn-primary">Ver Meus Agendamentos</Link>
      </nav>
    </div>
  );
};

export default Dashboard;