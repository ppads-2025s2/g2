import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "/src/styles/theme.css";

const linkClass = ({ isActive }) => "navlink" + (isActive ? " active" : "");

export default function Header(){
  const { token, logout } = useAuth();
  return (
    <header className="header">
      <div className="header-inner container">
        <a className="brand" href="/">
          <img src="/logo.png" alt="Mackenzie" />
          <h1>Mackenzie • Sistema de Gerenciamento</h1>
        </a>
        <nav>
          <NavLink className={linkClass} to="/agendamentos">Agendamentos</NavLink>
          <NavLink className={linkClass} to="/alunos">Alunos</NavLink>
        </nav>
        <div className="spacer" />
        {token && <button className="logout" onClick={logout}>Sair</button>}
      </div>
    </header>
  );
}
