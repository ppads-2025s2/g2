import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Agendamentos from "./pages/Agendamentos";
import Alunos from "./pages/Alunos";
import "/src/styles/theme.css";

export default function App(){
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/agendamentos" replace />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/agendamentos" element={<ProtectedRoute><Agendamentos /></ProtectedRoute>} />
  <Route path="/alunos" element={<ProtectedRoute><Alunos /></ProtectedRoute>} />
        <Route path="*" element={<div className="container"><h3>Página não encontrada</h3></div>} />
      </Routes>
    </>
  );
}
