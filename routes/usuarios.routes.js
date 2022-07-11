const rateLimit = require("express-rate-limit");

const { Router } = require("express");

// Middlewares
const { usuarioExistente } = require("../middlewares/usuarios.middlewares");
const {
  validarToken,
  validarAdmin,
  validarUsuario,
  validarAdminOUsuario,
} = require("../middlewares/autenticacion.middleware");

// Controladores
const {
  listarUsuarios,
  registrarUsuario,
  buscarUsuario,
  actualizarUsuario,
  deshabilitarUsuario,
  login,
} = require("../controllers/usuarios.controller");
const {
  validacionDeUsuarios,
} = require("../middlewares/validadores.middleware");

const usuariosRoutes = Router();

const limiteDeIntentosLogin = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 3,
  message: "Haz intentado iniciar sesion varias veces, intentalo más tarde",
});

usuariosRoutes.post("/login", limiteDeIntentosLogin, login);

usuariosRoutes.post("/", validacionDeUsuarios, registrarUsuario);

usuariosRoutes.use(validarToken);

usuariosRoutes.get("/", listarUsuarios);

usuariosRoutes
  .use("/:id", usuarioExistente)
  .route("/:id")
  .get(buscarUsuario)
  .patch(validarUsuario, actualizarUsuario)
  .delete(validarAdminOUsuario, deshabilitarUsuario);

module.exports = { usuariosRoutes };
