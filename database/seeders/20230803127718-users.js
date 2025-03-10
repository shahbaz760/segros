
"use strict"
const { v4: uuidv4 } = require('uuid');

const bcrypt = require("bcrypt");
async function hash(password) {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      // queryInterface.bulkDelete('users', null, { truncate:true }),
      await queryInterface.bulkInsert(
        "users",
        [
          {
            id: 1,
            uuid:uuidv4(),
            company_id: 1,
            role_id: 1,
            ruc: "7554747460612",
            name: "Super Admin",
            email: "admin@pichincha.com",
            password: await hash("Pichincha@2024"),
            status: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { truncate: true }
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, { truncate: true });
  }
};
