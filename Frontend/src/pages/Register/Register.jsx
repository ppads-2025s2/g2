import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/Form.css';

const semesterOptions = {
  design: [3, 4, 5, 6, 7, 8, 9, 10],
  arquitetura: [3, 4, 5, 6, 7, 8, 9, 10],
  sistemas: [1, 2, 3, 4, 5, 6, 7, 8],
};

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    curso: '',
    semestre: '',
  });
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleCourseChange = (e) => {
    const curso = e.target.value;
    setFormData({ ...formData, curso, semestre: '' });
    setAvailableSemesters(semesterOptions[curso] || []);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(formData);
      setSuccess('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar. O email já pode estar em uso.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Cadastro de Aluno</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <input
          type="email" name="email" placeholder="Email"
          onChange={handleChange} required
        />
        <input
          type="password" name="password" placeholder="Senha"
          onChange={handleChange} required
        />
        <select name="curso" onChange={handleCourseChange} required>
          <option value="">Selecione seu curso</option>
          <option value="design">Design</option>
          <option value="arquitetura">Arquitetura e Urbanismo</option>
          <option value="sistemas">Sistemas de Informação</option>
        </select>
        <select
          name="semestre"
          value={formData.semestre}
          onChange={handleChange}
          disabled={!formData.curso}
          required
        >
          <option value="">Selecione o semestre</option>
          {availableSemesters.map((sem) => (
            <option key={sem} value={sem}>{sem}º Semestre</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">Cadastrar</button>
      </form>
    </div>
  );
};

export default Register;