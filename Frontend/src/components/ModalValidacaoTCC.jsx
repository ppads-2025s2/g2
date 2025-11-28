import React, { useState } from 'react';
import { validarTCC } from '../api/api'; 

// Importa o CSS separado
import './ModalValidacaoTCC.css';

const ModalValidacaoTCC = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', file); 

    try {
      await validarTCC(formData);
      
      setMessage({ type: 'success', text: 'SUCESSO! ACESSO LIBERADO.' });
      
      // Fecha automaticamente após sucesso
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.detail || 'Erro ao validar arquivo.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        
        {/* Botão Fechar (X) */}
        <button onClick={onClose} className="btn-close-modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-content">
          {/* Título */}
          <h2 className="modal-title">
            <svg width="24" height="24" className="icon-title" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Validar TCC
          </h2>
          
          <p className="modal-description">
            Envie o arquivo <strong>.CSV</strong> com os dados de matrícula para liberar o acesso.
          </p>

          {/* Área de Upload */}
          <div className="form-group">
            <label className="label-input">SELECIONE O ARQUIVO</label>
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          {/* Mensagens de Sucesso/Erro */}
          {message.text && (
            <div className={`message-box ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="modal-actions">
            <button onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button 
              onClick={handleUpload} 
              disabled={!file || loading}
              className="btn-confirm"
            >
              {loading ? 'VALIDANDO...' : 'VALIDAR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalValidacaoTCC;