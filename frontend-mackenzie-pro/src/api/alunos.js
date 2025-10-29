import { http, authHeaders } from "./client";

// Lista todos os alunos (com filtros opcionais)
export async function listarAlunos({ skip = 0, limit = 100, curso } = {}) {
  let query = `?skip=${skip}&limit=${limit}`;
  if (curso) query += `&curso=${encodeURIComponent(curso)}`;
  return http(`/alunos${query}`, { headers: authHeaders() });
}

// Cria um novo aluno
export async function criarAluno(payload) {
  return http("/alunos", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

// Atualiza um aluno existente
export async function atualizarAluno(id, payload) {
  return http(`/alunos/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

// Remove um aluno
export async function deletarAluno(id) {
  return http(`/alunos/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

// Busca um aluno pelo ID
export async function buscarAluno(id) {
  return http(`/alunos/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });
}
