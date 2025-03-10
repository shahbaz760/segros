'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'countries',
        [
          {
            "astr_id": "377",
            "name": "AFGANISTAN",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "368",
            "name": "ALBANIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "345",
            "name": "ALEMANIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "367",
            "name": "ANTIGUA Y BERMUDA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "331",
            "name": "ARGENTINA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "00365",
            "name": "AUSTRALIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "369",
            "name": "AUSTRIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "348",
            "name": "BELGICA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "364",
            "name": "BENIN",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "329",
            "name": "BOLIVIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "326",
            "name": "BRASIL",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "352",
            "name": "BULGARIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "316",
            "name": "CANADA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "330",
            "name": "CHILE",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "334",
            "name": "CHINA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "325",
            "name": "COLOMBIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "357",
            "name": "COREA DEL NORTE",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "339",
            "name": "COREA DEL SUR",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "337",
            "name": "CUBA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "343",
            "name": "DINAMARCA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "374",
            "name": "DOMINICA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "327",
            "name": "ECUADOR",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "372",
            "name": "EGIPTO",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "320",
            "name": "EL SALVADOR",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "375",
            "name": "EMIRATOS ARABES UNIDOS",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "378",
            "name": "ERITREA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "353",
            "name": "ESCOCIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "380",
            "name": "ESLOVENIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "342",
            "name": "ESPANA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "314",
            "name": "ESTADOS UNIDOS",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "359",
            "name": "FINLANDIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "338",
            "name": "FRANCIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "346",
            "name": "GRECIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "370",
            "name": "GUATEMALA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "323",
            "name": "HAITI",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "344",
            "name": "HOLANDA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "318",
            "name": "HONDURAS",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "347",
            "name": "HUNGRIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "371",
            "name": "INDIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "336",
            "name": "INGLATERRA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "373",
            "name": "IRAN",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "361",
            "name": "IRLANDA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "360",
            "name": "ISLANDIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "349",
            "name": "ISRAEL",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "341",
            "name": "ITALIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "319",
            "name": "JAMAICA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "335",
            "name": "JAPON",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "363",
            "name": "LÍBANO",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "358",
            "name": "LITUANIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "362",
            "name": "LUXENBURGO",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "376",
            "name": "MALI",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "315",
            "name": "MEXICO",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "351",
            "name": "NORUEGA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "317",
            "name": "PANAMA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "333",
            "name": "PARAGUAY",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "328",
            "name": "PERU",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "00366",
            "name": "POLONIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "321",
            "name": "PUERTO RICO",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "322",
            "name": "REPUBLICA DOMINICANA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "350",
            "name": "RUMANIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "340",
            "name": "RUSIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "354",
            "name": "SUECIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "355",
            "name": "SUIZA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "332",
            "name": "URUGUAY",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "324",
            "name": "VENEZUELA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "379",
            "name": "WALLIS Y FUTUNA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "astr_id": "356",
            "name": "YUGOSLAVIA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          }
        ],
        { truncate: true }
      ),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('countries', null, { truncate: true });
  }
};
