'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            // queryInterface.bulkDelete('users', null, { truncate:true }),
            await queryInterface.bulkInsert(
                "heritage_ranks",
                [
                    {
                        astr_id: 9,
                        astr_description: '0.00 - 10,000.00',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        astr_id: 10,
                        astr_description: '10,001.00 - 50,000.00',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        astr_id: 11,
                        astr_description: '50,001.00 - 200,000.00',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        astr_id: 12,
                        astr_description: ' > 200,001.00',
                        is_active: 1,
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
        await queryInterface.bulkDelete('heritage_ranks', null, { truncate: true });
    }
};
