const { Sequelize } = require("sequelize");

// Инициализация Sequelize
const sequelize = new Sequelize("mdwork", "root", "12345Qwert!", {
  host: "localhost",
  dialect: "mysql",
  logging: true,
});

module.exports = sequelize;
