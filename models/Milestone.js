// models/Milestone.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Milestone extends Model {}

Milestone.init({
  buildingId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Buildings',
      key: 'id',
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
}, {
  sequelize,
  modelName: 'Milestone',
});

module.exports = Milestone;
