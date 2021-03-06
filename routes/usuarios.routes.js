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
  actualizarRolUsuario,
  verificarSesion,
} = require("../controllers/usuarios.controller");
const {
  validacionDeUsuarios,
} = require("../middlewares/validadores.middleware");

const usuariosRoutes = Router();

const limiteDeIntentosLogin = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    message: "Haz intentado iniciar sesion varias veces, intentalo más tarde",
  },
});

usuariosRoutes.post("/check-session", verificarSesion);

usuariosRoutes.post("/login", limiteDeIntentosLogin, login);

usuariosRoutes.post("/", validacionDeUsuarios, registrarUsuario);

usuariosRoutes.use(validarToken);

usuariosRoutes.get("/", listarUsuarios);

usuariosRoutes.patch(
  "/rol/:id",
  usuarioExistente,
  validarAdmin,
  actualizarRolUsuario
);

usuariosRoutes
  .use("/:id", usuarioExistente)
  .route("/:id")
  .get(buscarUsuario)
  .patch(validarAdminOUsuario, actualizarUsuario)
  .delete(validarAdminOUsuario, deshabilitarUsuario);

module.exports = { usuariosRoutes };
