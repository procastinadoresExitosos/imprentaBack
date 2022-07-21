const { DataTypes, db } = require("../utils/database.util");

const Servicios = db.define(
  "servicio",
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
    descripcion: {
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

module.exports = { Servicios };
