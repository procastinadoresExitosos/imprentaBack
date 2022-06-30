// models
const { Usuarios } = require("../models/usuarios.model");

// utils
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const usuarioExistente = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const usuario = await Usuarios.findOne({ where: { id, status: "active" } });
  if (!usuario) {
    return next(
      new AppError("El usuario no existe o ya fue deshabilitado", 404)
    );
  }
  req.usuario = usuario;
  next();
});

module.exports = { usuarioExistente };
