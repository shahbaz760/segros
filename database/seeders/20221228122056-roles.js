"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
     // queryInterface.bulkDelete("roles", null, { truncate: true }),
      queryInterface.bulkInsert(
        "roles",
        [
          {
            name: "Admin",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "SubAdmin",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Agency",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "SubAgency",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Broker",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "SubBroker",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Customer",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Quote",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { truncate: true }
      ),
    ]);
  },

  down: (queryInterface) =>
    queryInterface.bulkDelete("roles", null, { truncate: true }),
};
