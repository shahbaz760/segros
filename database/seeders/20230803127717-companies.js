'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      // queryInterface.bulkDelete('users', null, { truncate:true }),
      await queryInterface.bulkInsert(
        "companies",
        [
          {
            uuid: uuidv4(),
            ruc: "9090909090909",
            company_name: "Seguros del Pichincha",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            uuid: uuidv4(),
            ruc: "2345465434534",
            company_name: "Broker Company",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { truncate: true }
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('companies', null, { truncate: true });
  }
};
