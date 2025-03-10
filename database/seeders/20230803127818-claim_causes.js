'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.bulkInsert(
                "claim_causes",
                [
                    {
                        name: 'Vuelco',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Choque',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Robo',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Asalto',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Faltante',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Incendio',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Caída',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Mojadura',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Rotura',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Filtración',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Contaminación',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Derrame',
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Otros',
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
        await queryInterface.bulkDelete('claim_causes', null, { truncate: true });
    }
}