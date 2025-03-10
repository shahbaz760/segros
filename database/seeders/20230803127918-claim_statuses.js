'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.bulkInsert(
                "claim_statuses",
                [
                    {
                        id: 1,
                        name: 'Pagado',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: 2,
                        name: 'Negado',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: 3,
                        name: 'Pendiente',
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
        await queryInterface.bulkDelete('claim_statuses', null, { truncate: true });
    }
}