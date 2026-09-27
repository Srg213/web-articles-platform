const BASE = '/api';

function getToken() {
  return localStorage.getItem('fg_token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me', { auth: true }),

  published: () => request('/articles/published'),
  publishedOne: (id) => request(`/articles/published/${id}`),
  submit: (payload) => request('/articles', { method: 'POST', body: payload, auth: true }),
  mine: () => request('/articles/mine', { auth: true }),
  queue: () => request('/articles/queue', { auth: true }),
  claim: (id) => request(`/articles/${id}/claim`, { method: 'POST', auth: true }),
  publish: (id) => request(`/articles/${id}/publish`, { method: 'POST', auth: true }),
  returnArticle: (id, note) => request(`/articles/${id}/return`, { method: 'POST', body: { note }, auth: true }),
};

export function saveSession(token, user) {
  localStorage.setItem('fg_token', token);
  localStorage.setItem('fg_user', JSON.stringify(user));
}
export function clearSession() {
  localStorage.removeItem('fg_token');
  localStorage.removeItem('fg_user');
}
export function loadUser() {
  const raw = localStorage.getItem('fg_user');
  return raw ? JSON.parse(raw) : null;
}
