const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "..", "db.json");

function getEmptyDb() {
  return {
    users: [],
    tutores: [],
    pets: [],
    servicos: [],
    produtos: [],
    agendamentos: []
  };
}

function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    return getEmptyDb();
  }

  const raw = fs.readFileSync(DB_PATH, "utf-8");

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao ler db.json, recriando arquivo.", e);
    return getEmptyDb();
  }
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

module.exports = {
  loadDb,
  saveDb
};




