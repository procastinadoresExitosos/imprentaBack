const { body, validationResult } = require("express-validator");
const { AppError } = require("../utils/appError.util");

const verificarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const mensajesError = errores.array().map((err) => err.msg);
    const mensaje = mensajesError.join(". ");
    return next(new AppError(mensaje, 400));
  }
  next();
};

exports.validacionDeUsuarios = [
  body("nombre").notEmpty().withMessage("Este campo no puede estar vacio"),
  body("apellido").notEmpty().withMessage("Este campo no puede estar vacio"),
  body("telefono").notEmpty().withMessage("Este campo no puede estar vacio"),
  body("dni")
    .notEmpty()
    .withMessage("Este campo no puede estar vacio")
    .isLength({ min: 8, max: 8 })
    .withMessage("Usted ya tiene una cuenta asociada a este DNI"),
  body("email")
    .notEmpty()
    .withMessage("Este campo no puede estar vacio")
    .isEmail()
    .withMessage("Usted ya tiene una cuenta asociada a este email"),
  body("contrasena")
    .notEmpty()
    .withMessage("Este campo no puede estar vacio")
    .isLength({ min: 8 })
    .withMessage("la contraseña debe 8 caracteres como minimo"),
  verificarCampos,
];

exports.validacionesDeRoles = [
  body("nombre").notEmpty().withMessage("Este campo no puede estar vacio"),
  verificarCampos,
];
