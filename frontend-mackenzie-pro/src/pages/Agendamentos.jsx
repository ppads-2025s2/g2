import React, { useEffect, useState } from "react";
import { listarAgendamentos, criarAgendamento, cancelarAgendamento, atualizarAgendamento } from "../api/agendamentos";

export default function Agendamentos(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [criando, setCriando] = useState(false);
  const [horas, setHoras] = useState(1);

  async function load(){
    setLoading(true);
    try{
      setErr("");
      const data = await listarAgendamentos();
      setItems(Array.isArray(data) ? data : []);
    }finally{
      setLoading(false);
    }
  }
  useEffect(()=>{ load(); }, []);

  async function handleCriar(){
    setCriando(true);
    try{
      setErr("");
      await criarAgendamento(Number(horas) || 1);
      await load();
    }catch(e){
      setErr(e.message || String(e));
    }finally{
      setCriando(false);
    }
  }

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ marginTop:0, color:"var(--brand)" }}>Agendamentos</h2>
        <div className="row" style={{ marginTop: 6 }}>
          <select value={horas} onChange={e=>setHoras(e.target.value)}>
            <option value="1">1 hora</option>
            <option value="2">2 horas</option>
            <option value="3">3 horas</option>
          </select>
          <button className="btn" onClick={handleCriar} disabled={criando}>
            {criando ? "Criando..." : "+ Criar agendamento"}
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Carregando…</p>
        ) : err ? (
          <p style={{ color: "red" }}>{err}</p>
        ) : items.length === 0 ? (
          <p>Nenhum agendamento.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Aluno</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Status</th>
                <th>Criado em</th>
                <th style={{width:220}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.aluno_id ?? "—"}</td>
                  <td>{a.data_inicio ? new Date(a.data_inicio).toLocaleString() : "—"}</td>
                  <td>{a.data_fim ? new Date(a.data_fim).toLocaleString() : "—"}</td>
                  <td>{a.status}</td>
                  <td>{a.created_at ? new Date(a.created_at).toLocaleString() : "—"}</td>
                  <td className="row">
                    <button className="btn outline" onClick={async()=>{ try{ await atualizarAgendamento(a.id, { status:"confirmado" }); await load(); }catch(e){ setErr(e.message || String(e)); } }}>Confirmar</button>
                    <button className="btn" onClick={async()=>{ try{ await cancelarAgendamento(a.id); await load(); }catch(e){ setErr(e.message || String(e)); } }}>Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
