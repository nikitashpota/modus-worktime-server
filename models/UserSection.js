// models/UserSection.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class UserSection extends Model {}

UserSection.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users", // Убедитесь, что модель Users настроена правильно
        key: "id",
      },
      allowNull: false,
    },
    sectionId: {
      type: DataTypes.INTEGER,
      references: {
        model: "ProjectSection", // Это должна быть ваша модель для разделов
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserSection",
    timestamps: true, // Отметки времени для createdAt и updatedAt
  }
);

module.exports = UserSection;
