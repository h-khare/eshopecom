'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resetPasswords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull:false ,
        type: Sequelize.INTEGER
      },
      userEmail:{
        type:Sequelize.STRING,
        allowNull:false
      },
      tokenValue:{
        type:Sequelize.STRING,
        allowNull:false
      },
      expireAt:{
        type:Sequelize.DATE,
        allowNull:false
      },
      used:{
        defaultValue:0,
        type:Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resetPasswords');
  }
};