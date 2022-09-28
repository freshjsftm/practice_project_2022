'use strict'
const bcrypt = require('bcrypt');
const {SALT_ROUNDS} = require('../constants');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName:"Buyer2",
          lastName:"Buyer2",
          displayName:"Buyer2",
          email:"buyer2@gmail.com",
          passwordHash: bcrypt.hashSync("buyer2@gmail.com",SALT_ROUNDS),
          role:"customer"
        },
        {
          firstName:"creator2",
          lastName:"creator2",
          displayName:"creator2",
          email:"creator2@gmail.com",
          passwordHash: bcrypt.hashSync("creator2@gmail.com",SALT_ROUNDS),
          role:"creator"
        }
      ],
      {}
    )
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Users', null, {});

  }
}
