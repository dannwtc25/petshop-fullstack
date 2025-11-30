const API_BASE_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let msg = "Erro ao comunicar com o servidor.";
    try {
      const body = await response.json();
      if (body && body.erro) {
        msg = body.erro;
      }
    } catch (e) {
      // ignora
    }
    throw new Error(msg);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function login(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

async function listarTutores() {
  return apiRequest("/tutores");
}

async function criarTutor(data) {
  return apiRequest("/tutores", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

async function atualizarTutor(id, data) {
  return apiRequest(`/tutores/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

async function removerTutor(id) {
  return apiRequest(`/tutores/${id}`, {
    method: "DELETE"
  });
}

async function listarPets() {
  return apiRequest("/pets");
}

async function criarPet(data) {
  return apiRequest("/pets", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

async function atualizarPet(id, data) {
  return apiRequest(`/pets/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

async function removerPet(id) {
  return apiRequest(`/pets/${id}`, {
    method: "DELETE"
  });
}

async function listarServicos() {
  return apiRequest("/servicos");
}

async function criarServico(data) {
  return apiRequest("/servicos", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

async function atualizarServico(id, data) {
  return apiRequest(`/servicos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

async function removerServico(id) {
  return apiRequest(`/servicos/${id}`, {
    method: "DELETE"
  });
}

async function listarProdutos() {
  return apiRequest("/produtos");
}

async function criarProduto(data) {
  return apiRequest("/produtos", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

async function atualizarProduto(id, data) {
  return apiRequest(`/produtos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

async function removerProduto(id) {
  return apiRequest(`/produtos/${id}`, {
    method: "DELETE"
  });
}

async function listarAgendamentos() {
  return apiRequest("/agendamentos");
}

async function criarAgendamento(data) {
  return apiRequest("/agendamentos", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

async function atualizarAgendamento(id, data) {
  return apiRequest(`/agendamentos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

async function removerAgendamento(id) {
  return apiRequest(`/agendamentos/${id}`, {
    method: "DELETE"
  });
}




