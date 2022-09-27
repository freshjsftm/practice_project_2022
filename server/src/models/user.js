'use strict';
const bcrypt = require('bcrypt');
const { Model } = require('sequelize');
const {SALT_ROUNDS} = require('../constants');
async function hashPassword(user, options){
  if(user.changed('password')){
    const {password} = user;
    const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);
    user.password = hashedPass;
  }
}
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.RefreshToken, {
        foreignKey: 'userId'
      });
      
      User.hasMany(models.Offers, {
        foreignKey: 'userId', 
        targetKey: 'id'
      });
      User.hasMany(models.Contests, {
        foreignKey: 'userId', 
        targetKey: 'id'
      });
      User.hasMany(models.Ratings, {
        foreignKey: 'userId', 
        targetKey: 'id'
      });
    }

    async comparePassword (password){
      return bcrypt.compare(password, this.getDataValue('password'));
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      field: 'passwordHash',
      type: DataTypes.STRING,
      allowNull: false,
      // set(pass) {
      //   bcrypt.hash(pass, SALT_ROUNDS, (err, hashedPass) => {
      //     if(err){
      //       throw err;
      //     }
      //     this.setDataValue('password', hashedPass);
      //   });
      // }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM('customer', 'creator'),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps:true
  });

  User.beforeCreate(hashPassword);
  User.beforeUpdate(hashPassword);

  return User;
};