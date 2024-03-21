const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Убедитесь, что путь к файлу конфигурации корректен

const Building = sequelize.define(
  "Building",
  {
    // Атрибуты модели здания
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // Используйте TEXT для более длинного текста
      allowNull: true, // Сделаем описание необязательным
    },
  },
  {
    // Настройки модели
    timestamps: true, // Если вам нужны поля createdAt и updatedAt
    // Другие настройки по желанию
  }
);

module.exports = Building;
