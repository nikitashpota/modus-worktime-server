// models/Subcontractor.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Subcontractor extends Model {}

Subcontractor.init(
  {
    buildingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Buildings",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Subcontractor",
  }
);

module.exports = Subcontractor;
