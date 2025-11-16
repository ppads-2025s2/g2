import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          {/* Use a logo do Mackenzie aqui se desejar */}
          <img src="/mackenzie-logo.png" alt="Mackenzie" style={{ height: '40px' }}/>
        </Link>
        <nav>
          {user ? (
            <>
              <Link to="/agendar-3d">Impressora 3D</Link>
              <Link to="/agendar-laser">Corte a Laser</Link>
              <Link to="/meus-agendamentos">Meus Agendamentos</Link>
              <button onClick={handleLogout} className="btn-logout">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Cadastro</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;