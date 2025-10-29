import { http, setToken } from "./client";

// Login para obter token de acesso
// Aceita ambos formatos: { email, senha } ou { username, password }
export async function login(params) {
  const email = params?.email ?? params?.username ?? "";
  const senha = params?.senha ?? params?.password ?? "";

  const payload = { email, senha };

  const data = await http("/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (data?.access_token) {
    setToken(data.access_token);
  }
  return data;
}

// Registro de novo aluno
export async function register(payload) {
  const data = await http("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return data;
}

// Obter dados do usuário autenticado
export async function getMe() {
  const data = await http("/auth/me", {
    method: "GET",
    headers: {},
  });
  return data;
}

export async function logout() {
  setToken(null);
}
