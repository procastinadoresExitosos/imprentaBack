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
  login,
  validarToken,
} = require("../controllers/usuarios.controller");

const usuariosRoutes = Router();

usuariosRoutes.post("/login", login);

usuariosRoutes.use(validarToken);

usuariosRoutes.post("/", registrarUsuario);

usuariosRoutes.get("/", listarUsuarios);

usuariosRoutes
  .use("/:id", usuarioExistente)
  .route("/:id")
  .get(buscarUsuario)
  .patch(actualizarUsuario)
  .delete(deshabilitarUsuario);

module.exports = { usuariosRoutes };
