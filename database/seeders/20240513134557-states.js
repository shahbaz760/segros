'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            // queryInterface.bulkDelete('users', null, { truncate:true }),
            await queryInterface.bulkInsert(
                "states",
                [
                    {
                        "id": "1",
                        "name": "Azuay",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "2",
                        "name": "Bolívar",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "3",
                        "name": "Cañar",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "4",
                        "name": "Carchi",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "5",
                        "name": "Chimborazo",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "6",
                        "name": "Cotopaxi",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "7",
                        "name": "El Oro",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "8",
                        "name": "Esmeraldas",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "9",
                        "name": "Galápagos",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "10",
                        "name": "Guayas",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "11",
                        "name": "Imbabura",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "12",
                        "name": "Loja",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "13",
                        "name": "Los Ríos",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "14",
                        "name": "Manabí",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "15",
                        "name": "Morona Santiago",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "16",
                        "name": "Napo",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "17",
                        "name": "Orellana",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "18",
                        "name": "Pastaza",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "19",
                        "name": "Pichincha",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "20",
                        "name": "Santa Elena",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "21",
                        "name": "Santo Domingo de los Tsáchilas",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "22",
                        "name": "Sucumbíos",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "23",
                        "name": "Tungurahua",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        "id": "24",
                        "name": "Zamora Chinchipe",
                        "is_active": 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
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
        await queryInterface.bulkDelete('states', null, { truncate: true });
    }
};
