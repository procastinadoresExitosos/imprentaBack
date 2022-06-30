// models
const { Roles } = require("../models/roles.model");

// utils
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const rolExistente = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const rol = await Roles.findOne({ where: { id, status: "active" } });
  if (!rol) {
    return next(new AppError("Este rol no existe o ya fue deshabilitado", 404));
  }
  req.rol = rol;
  next();
});

module.exports = { rolExistente };
