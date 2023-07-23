'use strict';
const bcrypt = require("bcrypt")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    async passwordValidate(password) {
      const isValid = await bcrypt.compare(password, this.password);
      return isValid;
    }
  }
  User.init({
    name: DataTypes.STRING,
    email:DataTypes.STRING,
    mobile:DataTypes.BIGINT,
    password : DataTypes.TEXT,
    varified:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    hooks:{
      beforeCreate:async function(user){
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
      },
    }
  });
  return User;
};