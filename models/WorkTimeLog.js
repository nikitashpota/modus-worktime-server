const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Section = require("./Section");
class WorkTimeLog extends Model {}

WorkTimeLog.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", 
        key: "id",
      },
    },
    buildingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Buildings",
        key: "id",
      },
    },
    sectionId: { // Новое поле для связи с разделами
      type: DataTypes.INTEGER,
      allowNull: false, // Раздел может быть не указан для некоторых записей
      references: {
        model: "Sections", // Убедитесь, что имя модели правильное
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
    },
    hours: {
      type: DataTypes.DECIMAL(5, 2), 
      allowNull: false,
    },
    workType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "WorkTimeLog",
  }
);

module.exports = WorkTimeLog;
