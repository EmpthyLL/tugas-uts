const { Sequelize } = require("sequelize");
require("dotenv").config();

const db_name = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const dialect = process.env.DB_ACCENT;

const sequelize = new Sequelize(db_name, username, password, { host, dialect });

module.exports = sequelize;
