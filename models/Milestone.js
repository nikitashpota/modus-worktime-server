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
    initialDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
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
    initialDateChangeReason: {
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
    userResponsibleForInitialDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    documentUrls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("documentUrls");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("documentUrls", JSON.stringify(value));
      },
    },
    isCertified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Milestone",
  }
);

module.exports = Milestone;
