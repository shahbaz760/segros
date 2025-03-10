'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'authority_levels',
        [
          {
            "id": 1,
            "commission": 15,
            "microsoft_group_id": 'f8ae03c0-8acc-4ba1-8ed5-9c1cb1a3876a',
            "microsoft_group_name": 'ALBATROZ SDP COTIZACION',
            "access_type": '{All}',
            "imp_exp_limit": '2000000',
            "type": '1',
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 2,
            "commission": 15,
            "microsoft_group_id": 'e552d605-a02e-46f1-8567-2b656371afcc',
            "microsoft_group_name": 'ALBATROZ SDP AUTORIZACION',
            "access_type": '{All}',
            "imp_exp_limit": '2000000',
            "type": '1',
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 3,
            "commission": 15,
            "microsoft_group_id": 'dcca9006-dbfc-4a01-afe5-a556da622972',
            "microsoft_group_name": 'ALBATROZ SDP CONSULTA',
            "access_type": '{All}',
            "imp_exp_limit": '2000000',
            "type": '1',
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 4,
            "commission": 15,
            "microsoft_group_id": 'f8e3c251-950e-43b8-ab22-cbc20d460436',
            "microsoft_group_name": 'TEST-ALB-NOVA',
            "access_type": '{All}',
            "imp_exp_limit": '2000000',
            "type": '2',
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 5,
            "commission": 15,
            "microsoft_group_id": 'c1d851cd-f4d0-41b4-9974-42a935558353',
            "microsoft_group_name": 'TEST-ALB-PAZMINO-JATIVA',
            "access_type": '{All}',
            "imp_exp_limit": '2000000',
            "type": '2',
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
        ],
        { truncate: true }
      ),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('authority_levels', null, { truncate: true });
  }
};