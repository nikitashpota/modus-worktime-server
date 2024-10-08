const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Section extends Model {}

Section.init(
  {
    buildingId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Buildings",
        key: "id",
      },
      allowNull: false,
    },
    sectionCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sectionName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    modifications: {
      type: DataTypes.JSON, // Используем JSON для хранения массива изменений
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Not Issued",
    },
  },
  {
    sequelize,
    modelName: "Section",
    timestamps: true, // Отметки времени для автоматического создания полей createdAt и updatedAt
  }
);

module.exports = Section;
