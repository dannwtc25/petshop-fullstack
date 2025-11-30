const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "segredo-super-simples-petshop";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não informado." });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ erro: "Token inválido." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

module.exports = {
  authMiddleware,
  JWT_SECRET
};




