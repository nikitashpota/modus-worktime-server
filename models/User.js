const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
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
      defaultValue: "Проектировщик",
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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true, // Можно установить в null после сброса пароля
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true, // Можно установить в null после сброса пароля
    },
  },
  {
    // Настройки модели
  }
);

module.exports = User;
