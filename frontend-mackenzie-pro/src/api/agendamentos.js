import { http, authHeaders } from "./client";

/**
 * Lista todos os agendamentos
 */
export async function listarAgendamentos() {
  return http("/agendamentos", { headers: authHeaders() });
}


// Cria um novo agendamento
// O backend espera um corpo do tipo { horas_necessarias: number }
export async function criarAgendamento(horas_necessarias = 1) {
  const payload = { horas_necessarias: Number(horas_necessarias) || 1 };
  return http("/agendamentos", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}


// Atualiza um agendamento existente
export async function atualizarAgendamento(id, payload) {
  return http(`/agendamentos/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}


// Cancela um agendamento existente
export async function cancelarAgendamento(id) {
  return http(`/agendamentos/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

// Obtém um agendamento pelo ID
export async function obterAgendamento(id) {
  return http(`/agendamentos/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });
}
