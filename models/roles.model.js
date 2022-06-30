const { db, DataTypes } = require("../utils/database.util");

const Roles = db.define(
  "rol",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "activo",
      validate: {
        isIn: [["activo", "inactivo"]],
      },
    },
  },
  { timestamps: false }
);

module.exports = { Roles };
