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

const buscarUsuario = catchAsync(async (req, res, next) => {
  const { usuario } = req;
  res.status(200).json({ usuario });
});

const actualizarUsuario = catchAsync(async (req, res, next) => {
  const { usuario } = req;
  const { telefono } = req.body;
  await usuario.update({ telefono });
  res.status(200).json(usuario);
});

const deshabilitarUsuario = catchAsync(async (req, res, next) => {
  const { usuario } = req;
  await usuario.update({ estado: "inactivo" });
  res.status(200).json(usuario);
});

const login = catchAsync(async (req, res, next) => {
  const { email, contrasena } = req.body;

  // Validamos que el correo exista
  const usuario = await Usuarios.findOne({
    where: { email, estado: "activo" },
  });

  // Comparamos la contraseña ingresada con la de la bd
  if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
    return next(new AppError("Credenciales incorrectas", 400));
  }

  // Generamos el JWT
  const token = await jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JW_EXPIRES_IN,
  });

  usuario.contrasena = undefined;

  res.status(200).json({ token, usuario });
});

const validarToken = catchAsync(async (req, res, next) => {
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

module.exports = {
  listarUsuarios,
  registrarUsuario,
  buscarUsuario,
  actualizarUsuario,
  deshabilitarUsuario,
  login,
  validarToken,
};
