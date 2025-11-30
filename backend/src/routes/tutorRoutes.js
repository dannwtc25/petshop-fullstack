const express = require("express");
const { v4: uuid } = require("uuid");
const { loadDb, saveDb } = require("../services/db");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Tutores
 *   description: Gerenciamento de tutores de pets
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tutor:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         nome:
 *           type: string
 *         contato:
 *           type: string
 *         endereco:
 *           type: string
 *         telefone:
 *           type: string
 */

/**
 * @swagger
 * /tutores:
 *   get:
 *     summary: Lista todos os tutores
 *     tags: [Tutores]
 *     responses:
 *       200:
 *         description: Lista de tutores
 */
router.get("/", (req, res) => {
  const db = loadDb();
  res.json(db.tutores);
});

/**
 * @swagger
 * /tutores/{id}:
 *   get:
 *     summary: Obtém um tutor pelo ID
 *     tags: [Tutores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutor encontrado
 *       404:
 *         description: Tutor não encontrado
 */
router.get("/:id", (req, res) => {
  const db = loadDb();
  const tutor = db.tutores.find((t) => t.id === req.params.id);

  if (!tutor) {
    return res.status(404).json({ erro: "Tutor não encontrado." });
  }

  res.json(tutor);
});

/**
 * @swagger
 * /tutores:
 *   post:
 *     summary: Cria um novo tutor
 *     tags: [Tutores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tutor'
 *     responses:
 *       201:
 *         description: Tutor criado
 */
router.post("/", (req, res) => {
  const { nome, contato, endereco, telefone } = req.body;

  if (!nome || !telefone) {
    return res
      .status(400)
      .json({ erro: "Nome e telefone do tutor são obrigatórios." });
  }

  const db = loadDb();
  const novo = {
    id: uuid(),
    nome,
    contato: contato || "",
    endereco: endereco || "",
    telefone
  };

  db.tutores.push(novo);
  saveDb(db);

  res.status(201).json(novo);
});

/**
 * @swagger
 * /tutores/{id}:
 *   put:
 *     summary: Atualiza um tutor existente
 *     tags: [Tutores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tutor'
 *     responses:
 *       200:
 *         description: Tutor atualizado
 *       404:
 *         description: Tutor não encontrado
 */
router.put("/:id", (req, res) => {
  const db = loadDb();
  const index = db.tutores.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: "Tutor não encontrado." });
  }

  const { nome, contato, endereco, telefone } = req.body;

  db.tutores[index] = {
    ...db.tutores[index],
    nome: nome ?? db.tutores[index].nome,
    contato: contato ?? db.tutores[index].contato,
    endereco: endereco ?? db.tutores[index].endereco,
    telefone: telefone ?? db.tutores[index].telefone
  };

  saveDb(db);
  res.json(db.tutores[index]);
});

/**
 * @swagger
 * /tutores/{id}:
 *   delete:
 *     summary: Remove um tutor
 *     tags: [Tutores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tutor removido
 *       404:
 *         description: Tutor não encontrado
 */
router.delete("/:id", (req, res) => {
  const db = loadDb();
  const index = db.tutores.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: "Tutor não encontrado." });
  }

  db.tutores.splice(index, 1);
  saveDb(db);

  res.status(204).send();
});

module.exports = router;




