const express = require("express");
const { v4: uuid } = require("uuid");
const { loadDb, saveDb } = require("../services/db");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Gerenciamento de pets
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         nome:
 *           type: string
 *         especie:
 *           type: string
 *         raca:
 *           type: string
 *         sexo:
 *           type: string
 *         tutorId:
 *           type: string
 */

router.get("/", (req, res) => {
  const db = loadDb();
  res.json(db.pets);
});

router.get("/:id", (req, res) => {
  const db = loadDb();
  const pet = db.pets.find((p) => p.id === req.params.id);

  if (!pet) {
    return res.status(404).json({ erro: "Pet não encontrado." });
  }

  res.json(pet);
});

router.post("/", (req, res) => {
  const { nome, especie, raca, sexo, tutorId } = req.body;

  if (!nome || !especie || !tutorId) {
    return res
      .status(400)
      .json({ erro: "Nome, espécie e tutorId do pet são obrigatórios." });
  }

  const db = loadDb();
  const tutorExiste = db.tutores.some((t) => t.id === tutorId);

  if (!tutorExiste) {
    return res.status(400).json({ erro: "Tutor informado não existe." });
  }

  const novo = {
    id: uuid(),
    nome,
    especie,
    raca: raca || "",
    sexo: sexo || "",
    tutorId
  };

  db.pets.push(novo);
  saveDb(db);

  res.status(201).json(novo);
});

router.put("/:id", (req, res) => {
  const db = loadDb();
  const index = db.pets.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: "Pet não encontrado." });
  }

  const { nome, especie, raca, sexo, tutorId } = req.body;

  if (tutorId) {
    const tutorExiste = db.tutores.some((t) => t.id === tutorId);
    if (!tutorExiste) {
      return res.status(400).json({ erro: "Tutor informado não existe." });
    }
  }

  db.pets[index] = {
    ...db.pets[index],
    nome: nome ?? db.pets[index].nome,
    especie: especie ?? db.pets[index].especie,
    raca: raca ?? db.pets[index].raca,
    sexo: sexo ?? db.pets[index].sexo,
    tutorId: tutorId ?? db.pets[index].tutorId
  };

  saveDb(db);
  res.json(db.pets[index]);
});

router.delete("/:id", (req, res) => {
  const db = loadDb();
  const index = db.pets.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: "Pet não encontrado." });
  }

  db.pets.splice(index, 1);
  saveDb(db);

  res.status(204).send();
});

module.exports = router;




