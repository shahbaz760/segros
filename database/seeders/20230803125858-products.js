'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'products',
        [
          {
            "id": 2,
            "name": "IMP",
            "description": "Seguro de Transporte Internacional - Importação",
            "is_active": 1,
            "line_of_business_id": 1,
            "insurance_segment_id": 1,
            "branch_code": 62,
            "product_code": 373,
            "product_number": "062201",
            "ramo": 22,
            "susep_code": "15414.613865/2021-89",
            "is_display": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 3,
            "name": "EXP",
            "description": "Seguro de Transporte Internacional - Exportação",
            "is_active": 1,
            "line_of_business_id": 1,
            "insurance_segment_id": 1,
            "branch_code": 62,
            "product_code": 373,
            "product_number": "062201",
            "ramo": 22,
            "susep_code": "15414.613865/2021-89",
            "is_display": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
        ],
        { truncate: true }
      ),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, { truncate: true });
  }
};
