const express = require("express");
const { v4: uuid } = require("uuid");
const { loadDb, saveDb } = require("../services/db");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Agendamentos
 *   description: Gerenciamento de agendamentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Agendamento:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tutorId:
 *           type: string
 *         petId:
 *           type: string
 *         servicoId:
 *           type: string
 *         dataHora:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 */

router.get("/", (req, res) => {
  const db = loadDb();
  res.json(db.agendamentos);
});

router.get("/:id", (req, res) => {
  const db = loadDb();
  const agendamento = db.agendamentos.find((a) => a.id === req.params.id);

  if (!agendamento) {
    return res.status(404).json({ erro: "Agendamento não encontrado." });
  }

  res.json(agendamento);
});

router.post("/", (req, res) => {
  const { tutorId, petId, servicoId, dataHora, status } = req.body;

  if (!tutorId || !petId || !servicoId || !dataHora) {
    return res.status(400).json({
      erro: "tutorId, petId, servicoId e dataHora são obrigatórios."
    });
  }

  const db = loadDb();

  const tutorExiste = db.tutores.some((t) => t.id === tutorId);
  const petExiste = db.pets.some((p) => p.id === petId);
  const servicoExiste = db.servicos.some((s) => s.id === servicoId);

  if (!tutorExiste || !petExiste || !servicoExiste) {
    return res
      .status(400)
      .json({ erro: "Tutor, pet ou serviço informado não existe." });
  }

  const novo = {
    id: uuid(),
    tutorId,
    petId,
    servicoId,
    dataHora,
    status: status || "PENDENTE"
  };

  db.agendamentos.push(novo);
  saveDb(db);

  res.status(201).json(novo);
});

router.put("/:id", (req, res) => {
  const db = loadDb();
  const index = db.agendamentos.findIndex((a) => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: "Agendamento não encontrado." });
  }

  const { tutorId, petId, servicoId, dataHora, status } = req.body;

  if (tutorId) {
    const tutorExiste = db.tutores.some((t) => t.id === tutorId);
    if (!tutorExiste) {
      return res
        .status(400)
        .json({ erro: "Tutor informado no agendamento não existe." });
    }
  }

  if (petId) {
    const petExiste = db.pets.some((p) => p.id === petId);
    if (!petExiste) {
      return res
        .status(400)
        .json({ erro: "Pet informado no agendamento não existe." });
    }
  }

  if (servicoId) {
    const servicoExiste = db.servicos.some((s) => s.id === servicoId);
    if (!servicoExiste) {
      return res
        .status(400)
        .json({ erro: "Serviço informado no agendamento não existe." });
    }
  }

  db.agendamentos[index] = {
    ...db.agendamentos[index],
    tutorId: tutorId ?? db.agendamentos[index].tutorId,
    petId: petId ?? db.agendamentos[index].petId,
    servicoId: servicoId ?? db.agendamentos[index].servicoId,
    dataHora: dataHora ?? db.agendamentos[index].dataHora,
    status: status ?? db.agendamentos[index].status
  };

  saveDb(db);
  res.json(db.agendamentos[index]);
});

router.delete("/:id", (req, res) => {
  const db = loadDb();
  const index = db.agendamentos.findIndex((a) => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: "Agendamento não encontrado." });
  }

  db.agendamentos.splice(index, 1);
  saveDb(db);

  res.status(204).send();
});

module.exports = router;




