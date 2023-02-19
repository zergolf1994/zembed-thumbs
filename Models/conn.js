"use strict";

const { Sequelize } = require("sequelize");
// Server database config
const database = process.env.DB_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

// Connecting to a database
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: "mysql",
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  timezone: "+07:00",
  logging: false,
});

// Testing the connection
try {
  sequelize.authenticate();
  console.log("Connection has been established successfully:");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
