const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function buildUrl(path) {
  // remove trailing slash from base and ensure path starts with /
  const base = API.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

// Salva o token JWT no navegador
export const setToken = (t) => {
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
};

// Recupera o token salvo
export const getToken = () => localStorage.getItem("token");

// Remove o token (logout)
export const clearToken = () => localStorage.removeItem("token");

// Headers com Authorization (se o usuário estiver logado)
export function authHeaders(extra = {}) {
  const t = getToken();
  return {
    "Content-Type": "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...extra,
  };
}

// Função genérica para requisições HTTP
export async function http(path, options = {}) {
  const fullUrl = buildUrl(path);
  console.log(`➡️ Requisição para: ${fullUrl}`, options); // Debug

  const res = await fetch(fullUrl, options);
  const text = await res.text();
  console.log(`⬅️ Resposta:`, text); // Debug

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = (data && data.detail) ? data.detail : text || res.statusText;
    console.error(`❌ Erro na requisição:`, msg); // Debug
    throw new Error(msg || "Erro na requisição");
  }

  return data;
}
