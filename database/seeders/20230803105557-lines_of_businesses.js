'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'lines_of_businesses',
        [
          {
            id: 1,
            name: 'Transportes',
            is_active: 1,
            is_display:1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            name: 'Financeiros',
            is_active: 0,
            is_display:1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 3,
            name: 'Patrimoniais',
            is_active: 0,
            is_display:1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
        ],
        { truncate: true }
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lines_of_businesses', null, { truncate: true });
  }
};
