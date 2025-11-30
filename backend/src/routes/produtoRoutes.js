const express = require("express");
const { v4: uuid } = require("uuid");
const { loadDb, saveDb } = require("../services/db");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos do petshop
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
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
 *         estoque:
 *           type: number
 */

router.get("/", (req, res) => {
  const db = loadDb();
  res.json(db.produtos);
});

router.get("/:id", (req, res) => {
  const db = loadDb();
  const produto = db.produtos.find((p) => p.id === req.params.id);

  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  res.json(produto);
});

router.post("/", (req, res) => {
  const { nome, descricao, preco, estoque } = req.body;

  if (!nome || preco == null) {
    return res
      .status(400)
      .json({ erro: "Nome e preço do produto são obrigatórios." });
  }

  const db = loadDb();
  const novo = {
    id: uuid(),
    nome,
    descricao: descricao || "",
    preco: Number(preco),
    estoque: estoque != null ? Number(estoque) : 0
  };

  db.produtos.push(novo);
  saveDb(db);

  res.status(201).json(novo);
});

router.put("/:id", (req, res) => {
  const db = loadDb();
  const index = db.produtos.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  const { nome, descricao, preco, estoque } = req.body;

  db.produtos[index] = {
    ...db.produtos[index],
    nome: nome ?? db.produtos[index].nome,
    descricao: descricao ?? db.produtos[index].descricao,
    preco: preco != null ? Number(preco) : db.produtos[index].preco,
    estoque: estoque != null ? Number(estoque) : db.produtos[index].estoque
  };

  saveDb(db);
  res.json(db.produtos[index]);
});

router.delete("/:id", (req, res) => {
  const db = loadDb();
  const index = db.produtos.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  db.produtos.splice(index, 1);
  saveDb(db);

  res.status(204).send();
});

module.exports = router;




