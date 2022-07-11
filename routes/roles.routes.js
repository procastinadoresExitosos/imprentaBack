const { Router } = require("express");

// Middlewares
const { rolExistente } = require("../middlewares/roles.middlewares");
const {
  validarToken,
  validarAdmin,
} = require("../middlewares/autenticacion.middleware");

// Controladores
const {
  listarRoles,
  registrarRol,
  buscarRol,
  actualizarRol,
  deshabilitarRol,
} = require("../controllers/roles.controller");

const rolesRoutes = Router();

rolesRoutes.get("/", listarRoles);

rolesRoutes.post("/", registrarRol);
rolesRoutes.use(validarToken, validarAdmin);

rolesRoutes
  .use("/:id", rolExistente)
  .route("/:id")
  .get(buscarRol)
  .patch(actualizarRol)
  .delete(deshabilitarRol);

module.exports = { rolesRoutes };
