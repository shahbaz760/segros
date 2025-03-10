'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            // queryInterface.bulkDelete('users', null, { truncate:true }),
            await queryInterface.bulkInsert(
                "agencies",
                [
                    {
                        astr_id: '00001',
                        astr_description: 'MATRIZ - QUITO',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        astr_id: '00002',
                        astr_description: 'GUAYAQUIL',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        astr_id: '00003',
                        astr_description: 'CUENCA',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        astr_id: '00004',
                        astr_description: 'PORTOVIEJO',
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
        await queryInterface.bulkDelete('agencies', null, { truncate: true });
    }
};
