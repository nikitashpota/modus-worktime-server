const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TaskFile = sequelize.define(
  "TaskFile",
  {
    taskId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Tasks", // Ссылка на модель Task
        key: "id",
      },
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING, // Путь к файлу (например, URL или путь на сервере)
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING, // Тип файла (например, 'image/png', 'application/pdf')
      allowNull: false,
    },
  },
  {
    timestamps: true, // Отметки времени для автоматического создания полей createdAt и updatedAt
  }
);

module.exports = TaskFile;
