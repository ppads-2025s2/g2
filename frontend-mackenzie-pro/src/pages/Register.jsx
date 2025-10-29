
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    nome: "",
    tia: "",
    curso: "",
    semestre: 1,
    senha: ""
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "semestre" || name === "tia" ? Number(value) : value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      navigate("/login");
    } catch (e) {
      setErr(e.message || "Erro ao registrar");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "48px auto" }}>
      <h1>Criar conta</h1>
      <form onSubmit={onSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <br />
        <input name="nome" placeholder="Nome completo" value={form.nome} onChange={onChange} required />
        <br />
        <input name="tia" placeholder="TIA" value={form.tia} onChange={onChange} required />
        <br />
        <input name="curso" placeholder="Curso" value={form.curso} onChange={onChange} required />
        <br />
        <input name="semestre" type="number" min="1" placeholder="Semestre" value={form.semestre} onChange={onChange} required />
        <br />
        <input name="senha" type="password" placeholder="Senha" value={form.senha} onChange={onChange} required />
        <br />
        <button type="submit">Registrar</button>
      </form>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <p style={{ marginTop: 8 }}>Já tem conta? <Link to="/login">Entrar</Link></p>
    </div>
  );
}
