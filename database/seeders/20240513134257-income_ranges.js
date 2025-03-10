'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            // queryInterface.bulkDelete('users', null, { truncate:true }),
            await queryInterface.bulkInsert(
                "income_ranges",
                [
                    {
                        astr_id: 1,
                        astr_description: '0.00 - 500.00',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        astr_id: 2,
                        astr_description: '501.00 - 1000.00',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        astr_id: 3,
                        astr_description: '1,001.00 - 2000.00',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        astr_id: 4,
                        astr_description: '  > 2,000.00',
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
        await queryInterface.bulkDelete('income_ranges', null, { truncate: true });
    }
};
