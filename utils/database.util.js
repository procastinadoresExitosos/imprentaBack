const { Sequelize, DataTypes } = require("sequelize");

require("dotenv").config();

const db = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  logging: false,
});

module.exports = { db, DataTypes };
