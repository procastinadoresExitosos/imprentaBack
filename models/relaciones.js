// Models
const { Roles } = require("./roles.model");
const { Usuarios } = require("./usuarios.model");

const relaciones = () => {
  Roles.hasMany(Usuarios);
  Usuarios.belongsTo(Roles);
};

module.exports = { relaciones };
