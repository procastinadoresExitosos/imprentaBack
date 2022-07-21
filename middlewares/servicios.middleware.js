const { catchAsync } = require("../utils/catchAsync.util");
const { Servicios } = require("../models/servicios.model");
const { AppError } = require("../utils/appError.util");

const servicioExistenta = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const dbServicio = await Servicios.findOne({
    where: { id, estado: "activo" },
  });

  if (!dbServicio) {
    return next(new AppError("Este servicio no se encuentra disponible", 404));
  }

  req.dbServicio = dbServicio;

  next();
});

module.exports = { servicioExistenta };
