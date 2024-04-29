// models/UserBuilding.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class UserBuilding extends Model {}

UserBuilding.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    buildingId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Buildings",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserBuilding",
    timestamps: true, // Если вы хотите иметь поля createdAt и updatedAt
  }
);

module.exports = UserBuilding;
