'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'claim_causa_codes',
        [
          {
            "id": 1,
            "name": "Abalroamento",
            "causa_id": 2,
            "imp_exp": 11256,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 2,
            "name": "Adernamento",
            "causa_id": 27,
            "imp_exp": 11672,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 3,
            "name": "Amassamento",
            "causa_id": 10,
            "imp_exp": 13128,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 4,
            "name": "Avaria",
            "causa_id": 28,
            "imp_exp": null,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 5,
            "name": "Capotamento",
            "causa_id": 3,
            "imp_exp": 11360,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 6,
            "name": "Colisão",
            "causa_id": 1,
            "imp_exp": 11256,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 7,
            "name": "Contaminação",
            "causa_id": 15,
            "imp_exp": 12608,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 8,
            "name": "Desaparecimento de Veículo e Carga",
            "causa_id": 25,
            "imp_exp": 11776,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 9,
            "name": "Desvio de Carga",
            "causa_id": 24,
            "imp_exp": 11880,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 10,
            "name": "Diferença de peso",
            "causa_id": 13,
            "imp_exp": 12816,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 11,
            "name": "Explosão",
            "causa_id": 4,
            "imp_exp": 11464,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 12,
            "name": "Explosãono Depósito do Transportador",
            "causa_id": 8,
            "imp_exp": 11568,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 13,
            "name": "Extravio",
            "causa_id": 18,
            "imp_exp": 12296,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 14,
            "name": "Falta de Carga",
            "causa_id": 23,
            "imp_exp": 11984,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 15,
            "name": "Furto de Carga",
            "causa_id": 22,
            "imp_exp": 12088,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 16,
            "name": "Furto de Veículo e Carga",
            "causa_id": 20,
            "imp_exp": 12192,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 17,
            "name": "Incêndio",
            "causa_id": 6,
            "imp_exp": 11464,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 18,
            "name": "Incêndio no Depósito do Transportador",
            "causa_id": 7,
            "imp_exp": 11568,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 19,
            "name": "Molhadura",
            "causa_id": 9,
            "imp_exp": 13232,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 20,
            "name": "Não soube informar",
            "causa_id": 34,
            "imp_exp": null,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 21,
            "name": "Outros",
            "causa_id": 26,
            "imp_exp": null,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 22,
            "name": "Oxidação",
            "causa_id": 11,
            "imp_exp": 13024,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 23,
            "name": "Quebra",
            "causa_id": 12,
            "imp_exp": 12920,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 24,
            "name": "Quebra de Máquina Frigorífica",
            "causa_id": 31,
            "imp_exp": 12920,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 25,
            "name": "Quebra mecânica",
            "causa_id": 33,
            "imp_exp": 12920,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 26,
            "name": "Queda",
            "causa_id": 16,
            "imp_exp": 12504,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 27,
            "name": "Roubo de Carga",
            "causa_id": 21,
            "imp_exp": 12088,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 28,
            "name": "Roubo de veículo e carga",
            "causa_id": 19,
            "imp_exp": 12192,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 29,
            "name": "Saída de pista",
            "causa_id": 32,
            "imp_exp": 11256,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 30,
            "name": "Temperatura inadequada",
            "causa_id": 14,
            "imp_exp": 12712,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 31,
            "name": "Tombamento",
            "causa_id": 5,
            "imp_exp": 11360,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 32,
            "name": "Vazamento",
            "causa_id": 17,
            "imp_exp": 12400,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
        ],
        { truncate: true }
      ),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('claim_causa_codes', null, { truncate: true });
  }
};
