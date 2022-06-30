const { Router } = require("express");

// Middlewares
const { usuarioExistente } = require("../middlewares/usuarios.middlewares");

// Controladores
const {
  listarUsuarios,
  registrarUsuario,
  buscarUsuario,
  actualizarUsuario,
  deshabilitarUsuario,
} = require("../controllers/usuarios.controller");

const usuariosRoutes = Router();

usuariosRoutes.get("/", listarUsuarios);

usuariosRoutes.post("/", registrarUsuario);

usuariosRoutes
  .use("/:id", usuarioExistente)
  .route("/:id")
  .get(buscarUsuario)
  .patch(actualizarUsuario)
  .delete(deshabilitarUsuario);

module.exports = { usuariosRoutes };
