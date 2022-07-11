const jwt = require("jsonwebtoken");
require("dotenv").config();

// Models
const { Usuarios } = require("../models/usuarios.model");

// Utils
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

exports.validarToken = catchAsync(async (req, res, next) => {
  let token;

  // Usamos el token recibido
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // ['Bearer', 'token']
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Sesión invalida", 403));
  }

  // validar token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // decoded returns -> { id: 1, iat: 1651713776, exp: 1651717376 }
  const usuario = await Usuarios.findOne({
    where: { id: decoded.id, estado: "activo" },
  });

  if (!usuario) {
    return next(new AppError("La sesión ha expirado", 403));
  }

  req.usuarioEnSesion = usuario;
  next();
});

exports.validarAdmin = catchAsync(async (req, res, next) => {
  if (req.usuarioEnSesion.rolId !== 1) {
    return next(new AppError("No tienes acceso", 403));
  }
  next();
});

exports.validarUsuario = catchAsync(async (req, res, next) => {
  if (req.usuarioEnSesion.id !== req.usuario.id) {
    return next(new AppError("No puedes cambiar datos de otras cuentas", 403));
  }
  next();
});

exports.validarAdminOUsuario = catchAsync(async (req, res, next) => {
  const { usuarioEnSesion, usuario } = req;
  if (usuarioEnSesion.rolId === 1 || usuarioEnSesion.id === usuario.id) {
    next();
  } else {
    return next(new AppError("No tienes acceso", 403));
  }
});
