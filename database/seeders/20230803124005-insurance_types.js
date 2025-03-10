'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'insurance_types',
        [
          {
            id: 1,
            name: 'Especifica',
            description: 'Para un viaje específico',
            is_active: 1,
            is_display: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            name: 'Anual',
            description: 'Para múltiples viajes con facturación individual o agrupada',
            is_active: 1,
            is_display: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
        ],
        { truncate: true }
      ),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('insurance_types', null, { truncate: true });
  }
};