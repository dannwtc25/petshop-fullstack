const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const authRoutes = require("./routes/authRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const petRoutes = require("./routes/petRoutes");
const servicoRoutes = require("./routes/servicoRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const agendamentoRoutes = require("./routes/agendamentoRoutes");

const { ensureAdminUser } = require("./services/userService");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*"
  })
);

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Petshop - Projeto Fullstack",
    version: "1.0.0",
    description:
      "API REST de Petshop com autenticação JWT e CRUD completo para uso em projeto fullstack."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/tutores", tutorRoutes);
app.use("/pets", petRoutes);
app.use("/servicos", servicoRoutes);
app.use("/produtos", produtoRoutes);
app.use("/agendamentos", agendamentoRoutes);

app.get("/", (req, res) => {
  res.json({ mensagem: "API Petshop funcionando." });
});

const PORT = process.env.PORT || 3000;

ensureAdminUser()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao garantir usuário admin padrão:", err);
    process.exit(1);
  });




