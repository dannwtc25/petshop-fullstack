let tutorEditId = null;
let petEditId = null;
let servicoEditId = null;
let produtoEditId = null;
let agendamentoEditId = null;

function mostrarErroLogin(msg) {
  const box = document.getElementById("erro-login");
  box.textContent = msg;
  box.classList.remove("d-none");
}

function esconderErroLogin() {
  const box = document.getElementById("erro-login");
  box.classList.add("d-none");
}

function exibirApp(usuario) {
  document.getElementById("sec-login").classList.add("d-none");
  document.getElementById("sec-app").classList.remove("d-none");

  const spanUsuario = document.getElementById("usuario-logado");
  spanUsuario.textContent = usuario ? usuario.nome : "";
  spanUsuario.classList.remove("d-none");

  document.getElementById("btn-sair").classList.remove("d-none");
}

function exibirLogin() {
  document.getElementById("sec-login").classList.remove("d-none");
  document.getElementById("sec-app").classList.add("d-none");
  document.getElementById("usuario-logado").classList.add("d-none");
  document.getElementById("btn-sair").classList.add("d-none");
}

async function handleLogin() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  esconderErroLogin();

  try {
    const data = await login(email, senha);
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    exibirApp(data.usuario);
    await carregarTodasListagens();
  } catch (e) {
    mostrarErroLogin(e.message);
  }
}

function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  exibirLogin();
}

function renderTutoresSection(tutores) {
  const container = document.getElementById("tab-tutores");
  container.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <div class="form-section">
          <div class="section-title">Cadastro de Tutor</div>
          <form id="form-tutor">
            <div class="mb-2">
              <label class="form-label">Nome</label>
              <input type="text" class="form-control" id="tutor-nome" required />
            </div>
            <div class="mb-2">
              <label class="form-label">Contato</label>
              <input type="text" class="form-control" id="tutor-contato" />
            </div>
            <div class="mb-2">
              <label class="form-label">Endereço</label>
              <input type="text" class="form-control" id="tutor-endereco" />
            </div>
            <div class="mb-2">
              <label class="form-label">Telefone</label>
              <input type="text" class="form-control" id="tutor-telefone" required />
            </div>
            <button type="submit" class="btn btn-primary w-100 mt-2">
              <span id="tutor-btn-text">Salvar</span>
            </button>
          </form>
        </div>
      </div>
      <div class="col-md-8">
        <div class="table-wrapper">
          <div class="section-title">Tutores cadastrados</div>
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Contato</th>
                  <th>Endereço</th>
                  <th>Telefone</th>
                  <th style="width: 140px">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${tutores
                  .map(
                    (t) => `
                  <tr>
                    <td>${t.nome}</td>
                    <td>${t.contato || ""}</td>
                    <td>${t.endereco || ""}</td>
                    <td>${t.telefone}</td>
                    <td>
                      <button class="btn btn-sm btn-secondary me-1" data-edit-tutor="${t.id}">Editar</button>
                      <button class="btn btn-sm btn-danger" data-del-tutor="${t.id}">Excluir</button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  document
    .getElementById("form-tutor")
    .addEventListener("submit", handleSubmitTutor);

  container.querySelectorAll("[data-edit-tutor]").forEach((btn) => {
    btn.addEventListener("click", () =>
      preencherFormTutor(btn.getAttribute("data-edit-tutor"), tutores)
    );
  });

  container.querySelectorAll("[data-del-tutor]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("Confirma excluir este tutor?")) {
        await removerTutor(btn.getAttribute("data-del-tutor"));
        await carregarTodasListagens();
      }
    });
  });
}

function preencherFormTutor(id, tutores) {
  const tutor = tutores.find((t) => t.id === id);
  if (!tutor) return;

  tutorEditId = id;
  document.getElementById("tutor-nome").value = tutor.nome;
  document.getElementById("tutor-contato").value = tutor.contato || "";
  document.getElementById("tutor-endereco").value = tutor.endereco || "";
  document.getElementById("tutor-telefone").value = tutor.telefone;
  document.getElementById("tutor-btn-text").textContent = "Atualizar";
}

async function handleSubmitTutor(e) {
  e.preventDefault();

  const data = {
    nome: document.getElementById("tutor-nome").value,
    contato: document.getElementById("tutor-contato").value,
    endereco: document.getElementById("tutor-endereco").value,
    telefone: document.getElementById("tutor-telefone").value
  };

  if (!data.nome || !data.telefone) {
    alert("Preencha ao menos nome e telefone.");
    return;
  }

  if (tutorEditId) {
    await atualizarTutor(tutorEditId, data);
  } else {
    await criarTutor(data);
  }

  tutorEditId = null;
  e.target.reset();
  document.getElementById("tutor-btn-text").textContent = "Salvar";
  await carregarTodasListagens();
}

function renderPetsSection(pets, tutores) {
  const container = document.getElementById("tab-pets");

  const optionsTutores = tutores
    .map((t) => `<option value="${t.id}">${t.nome}</option>`)
    .join("");

  container.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <div class="form-section">
          <div class="section-title">Cadastro de Pet</div>
          <form id="form-pet">
            <div class="mb-2">
              <label class="form-label">Nome</label>
              <input type="text" class="form-control" id="pet-nome" required />
            </div>
            <div class="mb-2">
              <label class="form-label">Espécie</label>
              <input type="text" class="form-control" id="pet-especie" required />
            </div>
            <div class="mb-2">
              <label class="form-label">Raça</label>
              <input type="text" class="form-control" id="pet-raca" />
            </div>
            <div class="mb-2">
              <label class="form-label">Sexo</label>
              <input type="text" class="form-control" id="pet-sexo" />
            </div>
            <div class="mb-2">
              <label class="form-label">Tutor</label>
              <select class="form-select" id="pet-tutor" required>
                <option value="">Selecione...</option>
                ${optionsTutores}
              </select>
            </div>
            <button type="submit" class="btn btn-primary w-100 mt-2">
              <span id="pet-btn-text">Salvar</span>
            </button>
          </form>
        </div>
      </div>
      <div class="col-md-8">
        <div class="table-wrapper">
          <div class="section-title">Pets cadastrados</div>
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Espécie</th>
                  <th>Raça</th>
                  <th>Sexo</th>
                  <th>Tutor</th>
                  <th style="width: 140px">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${pets
                  .map((p) => {
                    const tutor = tutores.find((t) => t.id === p.tutorId);
                    return `
                      <tr>
                        <td>${p.nome}</td>
                        <td>${p.especie}</td>
                        <td>${p.raca || ""}</td>
                        <td>${p.sexo || ""}</td>
                        <td>${tutor ? tutor.nome : ""}</td>
                        <td>
                          <button class="btn btn-sm btn-secondary me-1" data-edit-pet="${p.id}">Editar</button>
                          <button class="btn btn-sm btn-danger" data-del-pet="${p.id}">Excluir</button>
                        </td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  document
    .getElementById("form-pet")
    .addEventListener("submit", handleSubmitPet);

  container.querySelectorAll("[data-edit-pet]").forEach((btn) => {
    btn.addEventListener("click", () =>
      preencherFormPet(btn.getAttribute("data-edit-pet"), pets)
    );
  });

  container.querySelectorAll("[data-del-pet]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("Confirma excluir este pet?")) {
        await removerPet(btn.getAttribute("data-del-pet"));
        await carregarTodasListagens();
      }
    });
  });
}

function preencherFormPet(id, pets) {
  const pet = pets.find((p) => p.id === id);
  if (!pet) return;

  petEditId = id;
  document.getElementById("pet-nome").value = pet.nome;
  document.getElementById("pet-especie").value = pet.especie;
  document.getElementById("pet-raca").value = pet.raca || "";
  document.getElementById("pet-sexo").value = pet.sexo || "";
  document.getElementById("pet-tutor").value = pet.tutorId;
  document.getElementById("pet-btn-text").textContent = "Atualizar";
}

async function handleSubmitPet(e) {
  e.preventDefault();

  const data = {
    nome: document.getElementById("pet-nome").value,
    especie: document.getElementById("pet-especie").value,
    raca: document.getElementById("pet-raca").value,
    sexo: document.getElementById("pet-sexo").value,
    tutorId: document.getElementById("pet-tutor").value
  };

  if (!data.nome || !data.especie || !data.tutorId) {
    alert("Preencha nome, espécie e tutor.");
    return;
  }

  if (petEditId) {
    await atualizarPet(petEditId, data);
  } else {
    await criarPet(data);
  }

  petEditId = null;
  e.target.reset();
  document.getElementById("pet-btn-text").textContent = "Salvar";
  await carregarTodasListagens();
}

function renderServicosSection(servicos) {
  const container = document.getElementById("tab-servicos");
  container.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <div class="form-section">
          <div class="section-title">Cadastro de Serviço</div>
          <form id="form-servico">
            <div class="mb-2">
              <label class="form-label">Nome</label>
              <input type="text" class="form-control" id="servico-nome" required />
            </div>
            <div class="mb-2">
              <label class="form-label">Descrição</label>
              <textarea class="form-control" id="servico-descricao"></textarea>
            </div>
            <div class="mb-2">
              <label class="form-label">Preço</label>
              <input type="number" class="form-control" id="servico-preco" required />
            </div>
            <button type="submit" class="btn btn-primary w-100 mt-2">
              <span id="servico-btn-text">Salvar</span>
            </button>
          </form>
        </div>
      </div>
      <div class="col-md-8">
        <div class="table-wrapper">
          <div class="section-title">Serviços cadastrados</div>
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Preço</th>
                  <th style="width: 140px">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${servicos
                  .map(
                    (s) => `
                  <tr>
                    <td>${s.nome}</td>
                    <td>${s.descricao || ""}</td>
                    <td>R$ ${s.preco.toFixed(2)}</td>
                    <td>
                      <button class="btn btn-sm btn-secondary me-1" data-edit-servico="${s.id}">Editar</button>
                      <button class="btn btn-sm btn-danger" data-del-servico="${s.id}">Excluir</button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  document
    .getElementById("form-servico")
    .addEventListener("submit", handleSubmitServico);

  container.querySelectorAll("[data-edit-servico]").forEach((btn) => {
    btn.addEventListener("click", () =>
      preencherFormServico(btn.getAttribute("data-edit-servico"), servicos)
    );
  });

  container.querySelectorAll("[data-del-servico]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("Confirma excluir este serviço?")) {
        await removerServico(btn.getAttribute("data-del-servico"));
        await carregarTodasListagens();
      }
    });
  });
}

function preencherFormServico(id, servicos) {
  const servico = servicos.find((s) => s.id === id);
  if (!servico) return;

  servicoEditId = id;
  document.getElementById("servico-nome").value = servico.nome;
  document.getElementById("servico-descricao").value = servico.descricao || "";
  document.getElementById("servico-preco").value = servico.preco;
  document.getElementById("servico-btn-text").textContent = "Atualizar";
}

async function handleSubmitServico(e) {
  e.preventDefault();

  const data = {
    nome: document.getElementById("servico-nome").value,
    descricao: document.getElementById("servico-descricao").value,
    preco: Number(document.getElementById("servico-preco").value)
  };

  if (!data.nome || isNaN(data.preco)) {
    alert("Preencha nome e preço.");
    return;
  }

  if (servicoEditId) {
    await atualizarServico(servicoEditId, data);
  } else {
    await criarServico(data);
  }

  servicoEditId = null;
  e.target.reset();
  document.getElementById("servico-btn-text").textContent = "Salvar";
  await carregarTodasListagens();
}

function renderProdutosSection(produtos) {
  const container = document.getElementById("tab-produtos");
  container.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <div class="form-section">
          <div class="section-title">Cadastro de Produto</div>
          <form id="form-produto">
            <div class="mb-2">
              <label class="form-label">Nome</label>
              <input type="text" class="form-control" id="produto-nome" required />
            </div>
            <div class="mb-2">
              <label class="form-label">Descrição</label>
              <textarea class="form-control" id="produto-descricao"></textarea>
            </div>
            <div class="mb-2">
              <label class="form-label">Preço</label>
              <input type="number" class="form-control" id="produto-preco" required />
            </div>
            <div class="mb-2">
              <label class="form-label">Estoque</label>
              <input type="number" class="form-control" id="produto-estoque" value="0" />
            </div>
            <button type="submit" class="btn btn-primary w-100 mt-2">
              <span id="produto-btn-text">Salvar</span>
            </button>
          </form>
        </div>
      </div>
      <div class="col-md-8">
        <div class="table-wrapper">
          <div class="section-title">Produtos cadastrados</div>
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th style="width: 140px">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${produtos
                  .map(
                    (p) => `
                  <tr>
                    <td>${p.nome}</td>
                    <td>${p.descricao || ""}</td>
                    <td>R$ ${p.preco.toFixed(2)}</td>
                    <td>${p.estoque}</td>
                    <td>
                      <button class="btn btn-sm btn-secondary me-1" data-edit-produto="${p.id}">Editar</button>
                      <button class="btn btn-sm btn-danger" data-del-produto="${p.id}">Excluir</button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  document
    .getElementById("form-produto")
    .addEventListener("submit", handleSubmitProduto);

  container.querySelectorAll("[data-edit-produto]").forEach((btn) => {
    btn.addEventListener("click", () =>
      preencherFormProduto(btn.getAttribute("data-edit-produto"), produtos)
    );
  });

  container.querySelectorAll("[data-del-produto]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("Confirma excluir este produto?")) {
        await removerProduto(btn.getAttribute("data-del-produto"));
        await carregarTodasListagens();
      }
    });
  });
}

function preencherFormProduto(id, produtos) {
  const produto = produtos.find((p) => p.id === id);
  if (!produto) return;

  produtoEditId = id;
  document.getElementById("produto-nome").value = produto.nome;
  document.getElementById("produto-descricao").value = produto.descricao || "";
  document.getElementById("produto-preco").value = produto.preco;
  document.getElementById("produto-estoque").value = produto.estoque;
  document.getElementById("produto-btn-text").textContent = "Atualizar";
}

async function handleSubmitProduto(e) {
  e.preventDefault();

  const data = {
    nome: document.getElementById("produto-nome").value,
    descricao: document.getElementById("produto-descricao").value,
    preco: Number(document.getElementById("produto-preco").value),
    estoque: Number(document.getElementById("produto-estoque").value || 0)
  };

  if (!data.nome || isNaN(data.preco)) {
    alert("Preencha nome e preço.");
    return;
  }

  if (produtoEditId) {
    await atualizarProduto(produtoEditId, data);
  } else {
    await criarProduto(data);
  }

  produtoEditId = null;
  e.target.reset();
  document.getElementById("produto-btn-text").textContent = "Salvar";
  await carregarTodasListagens();
}

function renderAgendamentosSection(agendamentos, tutores, pets, servicos) {
  const container = document.getElementById("tab-agendamentos");

  const tutorOptions = tutores
    .map((t) => `<option value="${t.id}">${t.nome}</option>`)
    .join("");
  const petOptions = pets
    .map((p) => `<option value="${p.id}">${p.nome}</option>`)
    .join("");
  const servicoOptions = servicos
    .map((s) => `<option value="${s.id}">${s.nome}</option>`)
    .join("");

  container.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <div class="form-section">
          <div class="section-title">Novo Agendamento</div>
          <form id="form-agendamento">
            <div class="mb-2">
              <label class="form-label">Tutor</label>
              <select class="form-select" id="ag-tutor" required>
                <option value="">Selecione...</option>
                ${tutorOptions}
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">Pet</label>
              <select class="form-select" id="ag-pet" required>
                <option value="">Selecione...</option>
                ${petOptions}
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">Serviço</label>
              <select class="form-select" id="ag-servico" required>
                <option value="">Selecione...</option>
                ${servicoOptions}
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">Data e Hora</label>
              <input type="datetime-local" class="form-control" id="ag-datahora" required />
            </div>
            <div class="mb-2">
              <label class="form-label">Status</label>
              <select class="form-select" id="ag-status">
                <option value="PENDENTE">Pendente</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary w-100 mt-2">
              <span id="ag-btn-text">Salvar</span>
            </button>
          </form>
        </div>
      </div>
      <div class="col-md-8">
        <div class="table-wrapper">
          <div class="section-title">Agendamentos</div>
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Tutor</th>
                  <th>Pet</th>
                  <th>Serviço</th>
                  <th>Data/Hora</th>
                  <th>Status</th>
                  <th style="width: 140px">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${agendamentos
                  .map((a) => {
                    const tutor = tutores.find((t) => t.id === a.tutorId);
                    const pet = pets.find((p) => p.id === a.petId);
                    const servico = servicos.find((s) => s.id === a.servicoId);
                    const dataFmt = a.dataHora
                      ? new Date(a.dataHora).toLocaleString("pt-BR")
                      : "";
                    return `
                      <tr>
                        <td>${tutor ? tutor.nome : ""}</td>
                        <td>${pet ? pet.nome : ""}</td>
                        <td>${servico ? servico.nome : ""}</td>
                        <td>${dataFmt}</td>
                        <td>${a.status}</td>
                        <td>
                          <button class="btn btn-sm btn-secondary me-1" data-edit-ag="${a.id}">Editar</button>
                          <button class="btn btn-sm btn-danger" data-del-ag="${a.id}">Excluir</button>
                        </td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  document
    .getElementById("form-agendamento")
    .addEventListener("submit", handleSubmitAgendamento);

  container.querySelectorAll("[data-edit-ag]").forEach((btn) => {
    btn.addEventListener("click", () =>
      preencherFormAgendamento(
        btn.getAttribute("data-edit-ag"),
        agendamentos
      )
    );
  });

  container.querySelectorAll("[data-del-ag]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("Confirma excluir este agendamento?")) {
        await removerAgendamento(btn.getAttribute("data-del-ag"));
        await carregarTodasListagens();
      }
    });
  });
}

function preencherFormAgendamento(id, agendamentos) {
  const ag = agendamentos.find((a) => a.id === id);
  if (!ag) return;

  agendamentoEditId = id;
  document.getElementById("ag-tutor").value = ag.tutorId;
  document.getElementById("ag-pet").value = ag.petId;
  document.getElementById("ag-servico").value = ag.servicoId;
  document.getElementById("ag-status").value = ag.status;

  const dt = new Date(ag.dataHora);
  const isoLocal = dt.toISOString().slice(0, 16);
  document.getElementById("ag-datahora").value = isoLocal;

  document.getElementById("ag-btn-text").textContent = "Atualizar";
}

async function handleSubmitAgendamento(e) {
  e.preventDefault();

  const data = {
    tutorId: document.getElementById("ag-tutor").value,
    petId: document.getElementById("ag-pet").value,
    servicoId: document.getElementById("ag-servico").value,
    dataHora: document.getElementById("ag-datahora").value,
    status: document.getElementById("ag-status").value
  };

  if (!data.tutorId || !data.petId || !data.servicoId || !data.dataHora) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  if (agendamentoEditId) {
    await atualizarAgendamento(agendamentoEditId, data);
  } else {
    await criarAgendamento(data);
  }

  agendamentoEditId = null;
  e.target.reset();
  document.getElementById("ag-btn-text").textContent = "Salvar";
  await carregarTodasListagens();
}

async function carregarTodasListagens() {
  const [tutores, pets, servicos, produtos, agendamentos] = await Promise.all([
    listarTutores(),
    listarPets(),
    listarServicos(),
    listarProdutos(),
    listarAgendamentos()
  ]);

  renderTutoresSection(tutores);
  renderPetsSection(pets, tutores);
  renderServicosSection(servicos);
  renderProdutosSection(produtos);
  renderAgendamentosSection(agendamentos, tutores, pets, servicos);
}

window.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("btn-login")
    .addEventListener("click", handleLogin);
  document
    .getElementById("btn-sair")
    .addEventListener("click", handleLogout);

  const token = localStorage.getItem("token");
  const usuarioStr = localStorage.getItem("usuario");

  if (token && usuarioStr) {
    try {
      const usuario = JSON.parse(usuarioStr);
      exibirApp(usuario);
      await carregarTodasListagens();
    } catch (e) {
      handleLogout();
    }
  } else {
    exibirLogin();
  }
});




