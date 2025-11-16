import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Header from './components/Header/Header'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Schedule3D from './pages/Schedule3D/Schedule3D'
import ScheduleLaser from './pages/ScheduleLaser/ScheduleLaser'
import MyBookings from './pages/MyBookings/MyBookings'

// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Carregando...</div>; // Evita piscar a tela de login
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas Protegidas */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agendar-3d" 
            element={
              <ProtectedRoute>
                <Schedule3D />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agendar-laser" 
            element={
              <ProtectedRoute>
                <ScheduleLaser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/meus-agendamentos" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          
          {/* Redireciona qualquer rota não encontrada */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  )
}

export default App