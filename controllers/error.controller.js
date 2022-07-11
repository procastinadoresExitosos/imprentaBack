require("dotenv").config();

// Utils
const { AppError } = require("../utils/appError.util");

const erroresDesarrollo = (err, req, res) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "fail",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const erroresCliente = (err, req, res) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "fail",
    message: err.message || "Algo salió mal",
  });
};

const erroresDelConstructorUnico = (err) => {
  if (err.errors[0].path === "dni") {
    return new AppError("Ingrese un DNI correcto.", 401);
  } else if (err.errors[0].path === "email") {
    return new AppError("Ingrese un correo valido", 401);
  }
};

const errorDeLlaveForanea = (err) => {
  console.log();
  return new AppError("No contamos con este rol", 401);
  //if (err.parent.constraint.split("_")[1] === "rolId") {
  //}
};

const errorDeJWTExpirado = () => {
  return new AppError("Sesión expirada.", 401);
};

const errorDeTokenInexistente = () => {
  return new AppError("Sesión invalida. Ingrese nuevamente", 401);
};

const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "desarrollo") {
    erroresDesarrollo(err, req, res);
  } else if (process.env.NODE_ENV === "produccion") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "SequelizeUniqueConstraintError") {
      error = erroresDelConstructorUnico(err);
    } else if (err.name === "TokenExpiredError") {
      error = errorDeJWTExpirado();
    } else if (err.name === "JsonWebTokenError") {
      error = errorDeTokenInexistente();
    } else if (err.name === "SequelizeForeignKeyConstraintError") {
      error = errorDeLlaveForanea(err);
    }

    erroresCliente(error, req, res);
  }
};

module.exports = { globalErrorHandler };
