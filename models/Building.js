const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Building = sequelize.define(
  "Building",
  {
    technicalCustomer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    initialContractValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentContractValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    landArea: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    maxDensity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    maxHeight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalFloorArea: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    buildingArea: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    undergroundParkingSpaces: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    undergroundParkingArea: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    estimatedPopulation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    functionalPurpose: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvingAuthority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    landAreaLastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maxDensityLastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maxHeightLastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalFloorAreaLastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    buildingAreaLastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    undergroundParkingSpacesLastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    undergroundParkingAreaLastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estimatedPopulationLastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    functionalPurposeLastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    approvingAuthorityLastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pirContractValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "Стоимость ПИР по контракту",
    },
    pirPostMgeValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "Стоимость ПИР после МГЭ",
    },
    costPerSquareMeter: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "Стоимость объекта за м2",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Building;
