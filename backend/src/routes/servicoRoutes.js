const express = require("express");
const { v4: uuid } = require("uuid");
const { loadDb, saveDb } = require("../services/db");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Servicos
 *   description: Gerenciamento de serviços do petshop
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Servico:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         nome:
 *           type: string
 *         descricao:
 *           type: string
 *         preco:
 *           type: number
 */

router.get("/", (req, res) => {
  const db = loadDb();
  res.json(db.servicos);
});

router.get("/:id", (req, res) => {
  const db = loadDb();
  const servico = db.servicos.find((s) => s.id === req.params.id);

  if (!servico) {
    return res.status(404).json({ erro: "Serviço não encontrado." });
  }

  res.json(servico);
});

router.post("/", (req, res) => {
  const { nome, descricao, preco } = req.body;

  if (!nome || preco == null) {
    return res
      .status(400)
      .json({ erro: "Nome e preço do serviço são obrigatórios." });
  }

  const db = loadDb();
  const novo = {
    id: uuid(),
    nome,
    descricao: descricao || "",
    preco: Number(preco)
  };

  db.servicos.push(novo);
  saveDb(db);

  res.status(201).json(novo);
});

router.put("/:id", (req, res) => {
  const db = loadDb();
  const index = db.servicos.findIndex((s) => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: "Serviço não encontrado." });
  }

  const { nome, descricao, preco } = req.body;

  db.servicos[index] = {
    ...db.servicos[index],
    nome: nome ?? db.servicos[index].nome,
    descricao: descricao ?? db.servicos[index].descricao,
    preco: preco != null ? Number(preco) : db.servicos[index].preco
  };

  saveDb(db);
  res.json(db.servicos[index]);
});

router.delete("/:id", (req, res) => {
  const db = loadDb();
  const index = db.servicos.findIndex((s) => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: "Serviço não encontrado." });
  }

  db.servicos.splice(index, 1);
  saveDb(db);

  res.status(204).send();
});

module.exports = router;




