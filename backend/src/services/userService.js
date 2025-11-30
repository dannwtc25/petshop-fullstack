const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const { loadDb, saveDb } = require("./db");

async function ensureAdminUser() {
  const db = loadDb();
  const existing = db.users.find((u) => u.email === "admin@petshop.com");

  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 10);

  db.users.push({
    id: uuid(),
    nome: "Administrador",
    email: "admin@petshop.com",
    passwordHash
  });

  saveDb(db);
  console.log(
    'Usuário admin criado com sucesso. Login: admin@petshop.com / Senha: admin123'
  );
}

function findUserByEmail(email) {
  const db = loadDb();
  return db.users.find((u) => u.email === email);
}

module.exports = {
  ensureAdminUser,
  findUserByEmail
};




