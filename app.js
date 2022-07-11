const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Rutas
const { usuariosRoutes } = require("./routes/usuarios.routes");
const { rolesRoutes } = require("./routes/roles.routes");

// Controladores
const { globalErrorHandler } = require("./controllers/error.controller");

// Utils
const { AppError } = require("./utils/appError.util");

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

// Aseguramos los headers
app.use(helmet());

// Comprimimos las respuestas -> [- tamaño = + velocidad = mejor rendimiento]
app.use(compression());

// Detalles de las solicitudes del cliente
process.env.NODE_ENV === "produccion"
  ? app.use(morgan("combined"))
  : app.use(morgan("dev"));

// Endpoints
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/roles", rolesRoutes);

// Handle incoming unknown routes to the server
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `${req.method} ${req.originalUrl} not found in this server`,
      404
    )
  );
});

// Manejo de errores globales
app.use(globalErrorHandler);

module.exports = { app };
