// models/ProjectSection.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class ProjectSection extends Model {}

ProjectSection.init(
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
      validate: {
        isIn: [["PD", "WD"]],
      },
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ProjectSection",
    timestamps: true, // Отметки времени для автоматического создания полей createdAt и updatedAt
  }
);

module.exports = ProjectSection;
