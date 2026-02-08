const API_URL =
  window.__API_URL__ || localStorage.getItem("apiBase") || "/api";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

function isAuthed() {
  return Boolean(getToken());
}

async function apiRequest(path, method = "GET", body) {
  const headers = {};
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch (err) {
    data = {};
  }

  if (!res.ok) {
    const message = data.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

function requireAuth(redirectPath = "pages/login.html") {
  if (!isAuthed()) {
    window.location.href = redirectPath;
    return false;
  }
  return true;
}
