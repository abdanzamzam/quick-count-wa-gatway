'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuickCount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QuickCount.init({
    tps: DataTypes.STRING,
    partai: DataTypes.STRING,
    suara: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'QuickCount',
  });
  return QuickCount;
};