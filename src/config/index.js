require("dotenv").config();

module.exports = {
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "opensim",
  DB_PASS: process.env.DB_PASS || "4Dm1n321",
  DB_NAME: process.env.DB_NAME || "MQTT",
};
