'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      // queryInterface.bulkDelete('users', null, { truncate:true }),
      await queryInterface.bulkInsert(
        "currency_exchange_rates",
        [
          {
            id: 1,
            rate: 5.4,
            is_active: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { truncate: true }
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('currency_exchange_rates', null, { truncate: true });
  }
};
