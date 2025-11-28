import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import ModalValidacaoTCC from '../../components/ModalValidacaoTCC';

import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSuccess = () => {
    window.location.reload();
  };

  const primeiroNome = user?.email ? user.email.split('@')[0] : 'Aluno';

  // Lógica: Só mostra TCC se o semestre for 7 ou maior
  const semestreAtual = parseInt(user?.semestre || 0);
  const alunoFaseTCC = semestreAtual >= 7;

  return (
    <div className="dashboard-page">
      <div className="brand-stripe"></div>

      <div className="dashboard-container">
        
        <header className="dashboard-header">
          <div className="greeting-section">
            <h1>
              Olá, <span className="highlight-name">{primeiroNome}</span>
            </h1>
            
            <div className="user-badges">
              <div className="badge">
                <svg width="20" height="20" className="icon-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"></path>
                  <path d="M6 12v5c3 0 6-1 6-1v-5"></path>
                </svg>
                <span>{user?.curso || 'CURSO NÃO DEFINIDO'}</span>
              </div>

              <div className="badge">
                <svg width="20" height="20" className="icon-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{user?.semestre}º SEMESTRE</span>
              </div>
            </div>
          </div>

          {/* --- Área de Status TCC (CONDICIONAL) --- */}
          {alunoFaseTCC && (
            <div className="status-section">
              <span className="status-label">SITUAÇÃO TCC</span>
              
              {user?.eh_aluno_tcc ? (
                /* Status: ENVIADO */
                <div className="status-badge-sent">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  ENVIADO
                </div>
              ) : (
                /* Status: PENDENTE + BOTÃO */
                <div className="status-actions">
                  <span className="status-text-pending">Pendente</span>
                  <button onClick={() => setModalOpen(true)} className="btn-solid-red">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                    </svg>
                    Enviar Comprovante
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        <main>
          <div className="menu-title-wrapper">
            <div className="title-marker"></div>
            <h2 className="menu-title">Menu Principal</h2>
          </div>
          
          <div className="cards-grid">
            <Link to="/agendar-3d" className="service-card">
              <div className="card-bar-top"></div>
              <div className="icon-circle">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
              </div>
              <h3 className="card-title">Impressora 3D</h3>
              <span className="card-desc">Agendar Prototipagem</span>
            </Link>

            <Link to="/agendar-laser" className="service-card">
              <div className="card-bar-top"></div>
              <div className="icon-circle">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3 className="card-title">Corte a Laser</h3>
              <span className="card-desc">Agendar Corte</span>
            </Link>

            <Link to="/meus-agendamentos" className="service-card">
              <div className="card-bar-top"></div>
              <div className="icon-circle">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="card-title">Meus Agendamentos</h3>
              <span className="card-desc">Ver Horários</span>
            </Link>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <ModalValidacaoTCC 
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;