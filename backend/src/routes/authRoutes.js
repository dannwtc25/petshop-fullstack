const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByEmail } = require("../services/userService");
const { JWT_SECRET } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Login e obtenção de token JWT
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ erro: "E-mail e senha são obrigatórios para login." });
  }

  const user = findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ erro: "Credenciais inválidas." });
  }

  const senhaOk = await bcrypt.compare(password, user.passwordHash);

  if (!senhaOk) {
    return res.status(401).json({ erro: "Credenciais inválidas." });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      nome: user.nome,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: "8h"
    }
  );

  return res.json({
    token,
    usuario: {
      id: user.id,
      nome: user.nome,
      email: user.email
    }
  });
});

module.exports = router;




