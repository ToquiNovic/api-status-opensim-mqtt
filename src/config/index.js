require("dotenv").config();

module.exports = {
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_USER: process.env.DB_USER || "root",
    DB_PASS: process.env.DB_PASS || "root",
    DB_NAME: process.env.DB_NAME || "sigelbd",
    JWT_KEY: process.env.JWT_KEY || "zxcv",
  };