const { Servicios } = require("../models/servicios.model");
const { catchAsync } = require("../utils/catchAsync.util");

exports.obtenerServicios = catchAsync(async (req, res, next) => {
  const servicios = await Servicios.findAll();
  res.status(200).json({ servicios });
});

exports.obtenerServiciosActivos = catchAsync(async (req, res, next) => {
  const servicios = await Servicios.findAll({ where: { estado: "activo" } });
  res.status(200).json({ servicios });
});

exports.obtenerServiciosPorId = catchAsync(async (req, res, next) => {
  const { dbServicio } = req;
  res.status(200).json({ dbServicio });
});

exports.agregarServicio = catchAsync(async (req, res, next) => {
  const { nombre, descripcion } = req.body;
  const nuevoServicio = await Servicios.create({
    nombre,
    descripcion,
  });
  res.status(201).json({ nuevoServicio });
});

exports.actualizarServicio = catchAsync(async (req, res, next) => {
  const { dbServicio } = req;
  const { nombre, descripcion } = req.body;
  await dbServicio.update({ nombre, descripcion });
  res.status(200).json({ status: "success" });
});

exports.deshabilitarServicio = catchAsync(async (req, res, next) => {
  const { dbServicio } = req;
  await dbServicio.update({ estado: "inactivo" });
  res.status(200).json({ estado: "eliminado" });
});
