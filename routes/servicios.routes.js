const { Router } = require("express");

// Controladores
const {
  actualizarServicio,
  agregarServicio,
  deshabilitarServicio,
  obtenerServicios,
  obtenerServiciosActivos,
  obtenerServiciosPorId,
} = require("../controllers/servicios.controller");

// Middlewares
const {
  validarAdmin,
  validarToken,
} = require("../middlewares/autenticacion.middleware");
const { servicioExistenta } = require("../middlewares/servicios.middleware");
const {
  validacionesDeServicios,
} = require("../middlewares/validadores.middleware");

const serviciosRoutes = Router();

serviciosRoutes.get("/", obtenerServiciosActivos);

serviciosRoutes.get("/todos", obtenerServiciosPorId);

serviciosRoutes.get("/:id", servicioExistenta, obtenerServicios);

serviciosRoutes.use(validarToken, validarAdmin);

serviciosRoutes.post("/", validacionesDeServicios, agregarServicio);

serviciosRoutes
  .use("/:id", servicioExistenta)
  .route("/:id")
  .patch(actualizarServicio)
  .delete(deshabilitarServicio);

module.exports = { serviciosRoutes };
