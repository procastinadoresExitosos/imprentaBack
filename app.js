const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Controladores
const { globalErrorHandler } = require("./controllers/error.controller");

// Rutas
const { usuariosRoutes } = require("./routes/usuarios.routes");
const { rolesRoutes } = require("./routes/roles.routes");

// Inicializamos express
const app = express();

// Activar los CORS
app.use(cors());

// Permitinos la lectura y envio de JSON's
app.use(express.json());

// Limit IP requests
const limiter = rateLimit({
  max: 10000,
  windowMs: 1 * 60 * 60 * 1000, // 1 hr
  message: "Muchas peticiones desde este IP",
});

app.use(limiter);

// Endpoints
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/roles", rolesRoutes);

// Manejo de errores globales
app.use("*", globalErrorHandler);

module.exports = { app };
