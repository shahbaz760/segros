'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.bulkInsert(
                "claim_currencies",
                [
                    {
                        name: 'Real (R$)',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Dólar Americano (US$)',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                ],
                { truncate: true }
            )
        ])
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('claim_currencies', null, { truncate: true });
      }
}