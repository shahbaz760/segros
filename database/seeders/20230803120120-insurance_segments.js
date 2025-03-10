'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
      'insurance_segments',
      [
        {
          id: 1,
          name: 'Embarcadores',
          line_of_business_id: 1,
          is_active:1,
          is_display:1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'Transportadores',
          line_of_business_id: 1,
          is_active:0,
          is_display:0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      { truncate: true }
      ),
    ]);
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('insurance_segments', null, {  truncate: true });
  }
};
