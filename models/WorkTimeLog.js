const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Убедитесь, что путь к вашему файлу конфигурации базы данных корректен

class WorkTimeLog extends Model {}

WorkTimeLog.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Указываем имя таблицы, на которую ссылается этот ключ
        key: "id",
      },
    },
    buildingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Buildings", // Указываем имя таблицы, на которую ссылается этот ключ
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY, // Только дата без времени
      allowNull: false,
    },
    hours: {
      type: DataTypes.DECIMAL(5, 2), // Позволяет хранить часы с точностью до минут, например, 8.5 часов
      allowNull: false,
    },
    workType: {
      type: DataTypes.STRING, // Тип данных - строка
      allowNull: false, // Поле обязательно к заполнению
    },
  },
  {
    sequelize,
    modelName: "WorkTimeLog",
  }
);

module.exports = WorkTimeLog;
