const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Models
const { Usuarios } = require("../models/usuarios.model");
const { Roles } = require("../models/roles.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const listarUsuarios = catchAsync(async (req, res, next) => {
  const usuarios = await Usuarios.findAll({
    attributes: { exclude: ["contrasena", "rolId"] },
    include: Roles,
  });
  res.status(200).json(usuarios);
});

const registrarUsuario = catchAsync(async (req, res, next) => {
  const { nombre, apellido, email, contrasena, rolId, dni, telefono } =
    req.body;

  // encriptamos
  const salt = await bcrypt.genSalt(12);
  const contraEncriptada = await bcrypt.hash(contrasena, salt);

  const nuevoUsuario = await Usuarios.create({
    nombre,
    apellido,
    email,
    contrasena: contraEncriptada,
    dni,
    telefono,
    rolId,
  });

  // no mostramos la contraseña
  nuevoUsuario.contrasena = undefined;

  res.status(201).json({ nuevoUsuario });
});

const buscarUsuario = catchAsync(async (req, res, next) => {});
const actualizarUsuario = catchAsync(async (req, res, next) => {});
const deshabilitarUsuario = catchAsync(async (req, res, next) => {});

module.exports = {
  listarUsuarios,
  registrarUsuario,
  buscarUsuario,
  actualizarUsuario,
  deshabilitarUsuario,
};
