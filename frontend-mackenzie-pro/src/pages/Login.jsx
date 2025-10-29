import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(form);               // usa login do contexto (salva token no estado)
      navigate("/agendamentos");     // pós-login
    } catch (e) {
      setErr(e.message || "Usuário ou senha inválidos");
    }
  };

  return (
    <div style={{maxWidth:420, margin:"48px auto"}}>
      <h1>Entrar</h1>
      <form onSubmit={onSubmit}>
        <input name="username" placeholder="Usuário ou email" value={form.username} onChange={onChange} required />
        <br />
        <input name="password" type="password" placeholder="Senha" value={form.password} onChange={onChange} required />
        <br />
        <button type="submit">Login</button>
      </form>
      {err && <p style={{color:"red"}}>{err}</p>}
      <p style={{marginTop:8}}>Não tem conta? <Link to="/register">Criar conta</Link></p>
    </div>
  );
}
