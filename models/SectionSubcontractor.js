// models/SectionSubcontractor.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class SectionSubcontractor extends Model {}

SectionSubcontractor.init(
  {
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Sections",
        key: "id",
      },
    },
    subcontractorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Subcontractors",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "SectionSubcontractor",
  }
);

module.exports = SectionSubcontractor;
