'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'basic_coverages',
        [

          {
            "id": 1,
            "product_id": null,
            "name": "Libre de Avería Particular",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 2,
            "product_id": null,
            "name": "Con Avería Particular.",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 3,
            "product_id": null,
            "name": "Todo Riesgo",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          }
        ],
        { truncate: true }
      ),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('basic_coverages', null, { truncate: true });
  }
};
