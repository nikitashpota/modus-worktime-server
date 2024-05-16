const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Путь к файлу конфигурации

const User = sequelize.define(
  "User",
  {
    // Модель пользователя
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2), // Тип данных для хранения денежных сумм
      allowNull: true, // Можно сделать поле необязательным
      defaultValue: 0.0, // Значение по умолчанию
    },
  },
  {
    // Настройки модели
  }
);

module.exports = User;
