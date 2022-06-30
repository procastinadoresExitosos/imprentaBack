// Models
const { Roles } = require("../models/roles.model");
const { Usuarios } = require("../models/usuarios.model");
const { AppError } = require("../utils/appError.util");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

const listarRoles = catchAsync(async (req, res, next) => {
  const roles = await Roles.findAll({
    include: [
      {
        model: Usuarios,
        attributes: ["id", "nombre", "apellido", "email", "estado"],
      },
    ],
  });
  res.status(200).json(roles);
});

const registrarRol = catchAsync(async (req, res, next) => {
  const { nombre } = req.body;

  const nuevoRol = await Roles.create({ nombre });

  res.status(201).json({ nuevoRol });
});

const buscarRol = catchAsync(async (req, res, next) => {
  const { rol } = req;
  res.status(200).json({ rol });
});

const actualizarRol = catchAsync(async (req, res, next) => {
  const { rol } = req;
  const { nombre } = req.body;
  await rol.update({ nombre });
  res.status(200).json({ status: "Rol Actualizado" });
});

const deshabilitarRol = catchAsync(async (req, res, next) => {
  const { rol } = req;
  await rol.update({ status: "inactivo" });
});

module.exports = {
  listarRoles,
  registrarRol,
  buscarRol,
  actualizarRol,
  deshabilitarRol,
};
