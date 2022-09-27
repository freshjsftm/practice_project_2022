'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {

    static associate(models) {
      RefreshToken.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  RefreshToken.init({
    userId: {
      allowNull: false,
      type:DataTypes.INTEGER
    },
    value: {
      allowNull: false,
      type:DataTypes.TEXT
    },
    ua: {
      type:DataTypes.STRING
    },
    fingerprint: {
      type:DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'RefreshToken',
  });
  return RefreshToken;
};