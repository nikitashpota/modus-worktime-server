const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Milestone extends Model {}

Milestone.init(
  {
    buildingId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Buildings",
        key: "id",
      },
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    updatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    dateChangeReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updatedDateChangeReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userResponsibleForChange: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userResponsibleForUpdate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Milestone",
  }
);

module.exports = Milestone;
