import React, { useEffect, useState } from "react";
import { listarAlunos, criarAluno, atualizarAluno, deletarAluno } from "../api/alunos";

export default function Alunos(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ tia:"", email:"", nome:"", curso:"", semestre: 1, doing_tcc:false, active:true, admin:false,senha_hash:"" });

  async function load(){
    setLoading(true);
    try{
      const data = await listarAlunos();
      setItems(Array.isArray(data) ? data : []);
    }finally{
      setLoading(false);
    }
  }
  useEffect(()=>{ load(); }, []);

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  async function submit(e){
    e.preventDefault();
    await criarAluno(form);
    setForm({ tia:"", email:"", nome:"", curso:"", semestre: 1, doing_tcc:false, active:true, admin:false, senha_hash:"" });
    await load();
  }

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ marginTop:0, color:"var(--brand)" }}>Alunos</h2>
        <form className="row" onSubmit={submit}>
          <input placeholder="TIA" value={form.tia} onChange={e=>onChange("tia", e.target.value)} />
          <input placeholder="Email" value={form.email} onChange={e=>onChange("email", e.target.value)} />
          <input placeholder="Nome" value={form.nome} onChange={e=>onChange("nome", e.target.value)} />
          <input placeholder="Curso" value={form.curso} onChange={e=>onChange("curso", e.target.value)} />
          <input placeholder="Semestre" type="number" value={form.semestre} onChange={e=>onChange("semestre", Number(e.target.value))} />
          <input placeholder="Senha" type="password" value={form.senha_hash} onChange={e=>onChange("senha_hash", e.target.value)} />
          <select value={form.doing_tcc ? "true" : "false"} onChange={e=>onChange("doing_tcc", e.target.value==="true")}>
            <option value="false">Regular</option>
            <option value="true">Fazendo TCC</option>
          </select>
          <button className="btn">+ Criar</button>
        </form>
      </div>

      <div className="card">
        {loading ? (
          <p>Carregando…</p>
        ) : items.length === 0 ? (
          <p>Nenhum aluno.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>ID</th><th>TIA</th><th>Nome</th><th>Email</th><th>Curso</th><th>Semestre</th><th>TCC?</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.tia}</td>
                  <td>{a.nome}</td>
                  <td>{a.email}</td>
                  <td>{a.curso}</td>
                  <td>{a.semestre}</td>
                  <td>{a.doing_tcc ? "Sim" : "Não"}</td>
                  <td className="row">
                    <button className="btn outline" onClick={async()=>{ await atualizarAluno(a.id, { active: !a.active }); await load(); }}>{a.active ? "Desativar" : "Ativar"}</button>
                    <button className="btn" onClick={async()=>{ await deletarAluno(a.id); await load(); }}>Excluir</button>
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
