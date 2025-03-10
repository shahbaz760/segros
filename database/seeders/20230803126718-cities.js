'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'cities',
        [
          {
            "id": 1,
            "name": "Cuenca",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 2,
            "name": "Girón",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 3,
            "name": "Gualaceo",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 4,
            "name": "Nabón",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 5,
            "name": "Paute",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 6,
            "name": "Pucará",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 7,
            "name": "San Fernando",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 8,
            "name": "Santa Isabel",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 9,
            "name": "Sigsig",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 10,
            "name": "Oña",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 11,
            "name": "Chordeleg",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 12,
            "name": "El Pan",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 13,
            "name": "Sevilla de Oro",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 14,
            "name": "Guachapala",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 15,
            "name": "Camilo Ponce Enríquez",
            "state_id": 1,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 16,
            "name": "Guaranda",
            "state_id": 2,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 17,
            "name": "Chillanes",
            "state_id": 2,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 18,
            "name": "Chimbo",
            "state_id": 2,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 19,
            "name": "Echeandía",
            "state_id": 2,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 20,
            "name": "San Miguel",
            "state_id": 2,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 21,
            "name": "Caluma",
            "state_id": 2,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 22,
            "name": "Las Naves",
            "state_id": 2,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 23,
            "name": "Azogues",
            "state_id": 3,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 24,
            "name": "Biblián",
            "state_id": 3,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 25,
            "name": "Cañar",
            "state_id": 3,
            "is_active": 1,
            "state_id": 3,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 26,
            "name": "La Troncal",
            "state_id": 3,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 27,
            "name": "El Tambo",
            "state_id": 3,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 28,
            "name": "Déleg",
            "state_id": 3,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 29,
            "name": "Suscal",
            "state_id": 3,
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 30,
            "name": "Tulcán",
            "is_active": 1,
            "state_id": 4,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 31,
            "name": "Bolívar",
            "is_active": 1,
            "state_id": 4,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 32,
            "name": "Espejo",
            "is_active": 1,
            "state_id": 4,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 33,
            "name": "Mira",
            "is_active": 1,
            "state_id": 4,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 34,
            "name": "Montúfar",
            "is_active": 1,
            "state_id": 4,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 35,
            "name": "San Pedro de Huaca",
            "is_active": 1,
            "state_id": 4,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 36,
            "name": "Riobamba",
            "is_active": 1,
            "state_id": 5,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 37,
            "name": "Alausí",
            "is_active": 1,
            "state_id": 5,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 38,
            "name": "Colta",
            "is_active": 1,
            "state_id": 5,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 39,
            "name": "Chambo",
            "is_active": 1,
            "state_id": 5,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 40,
            "name": "Chunchi",
            "is_active": 1,
            "state_id": 5,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 41,
            "name": "Guamote",
            "is_active": 1,
            "state_id": 5,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 42,
            "name": "Guano",
            "is_active": 1,
            "state_id": 5,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 43,
            "name": "Pallatanga",
            "is_active": 1,
            "state_id": 5,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 44,
            "name": "Penipe",
            "is_active": 1,
            "state_id": 5,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 45,
            "name": "Cumandá",
            "is_active": 1,
            "state_id": 5,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 46,
            "name": "Latacunga",
            "is_active": 1,
            "state_id": 6,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 47,
            "name": "La Maná",
            "is_active": 1,
            "state_id": 6,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 48,
            "name": "Pangua",
            "is_active": 1,
            "state_id": 6,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 49,
            "name": "Pujilí",
            "is_active": 1,
            "state_id": 6,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 50,
            "name": "Salcedo",
            "is_active": 1,
            "state_id": 6,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 51,
            "name": "Saquisilí",
            "is_active": 1,
            "state_id": 6,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 52,
            "name": "Sigchos",
            "is_active": 1,
            "state_id": 6,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 53,
            "name": "Arenillas",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 54,
            "name": "Atahualpa",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 55,
            "name": "Balsas",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 56,
            "name": "Chilla",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 57,
            "name": "El Guabo",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 58,
            "name": "Huaquillas",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 59,
            "name": "Las Lajas",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 60,
            "name": "Machala",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 61,
            "name": "Marcabelí",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 62,
            "name": "Pasaje",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 63,
            "name": "Piñas",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 64,
            "name": "Portovelo",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 65,
            "name": "Santa Rosa",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 66,
            "name": "Zaruma",
            "is_active": 1,
            "state_id": 7,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 67,
            "name": "Atacames",
            "is_active": 1,
            "state_id": 8,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 68,
            "name": "Eloy Alfaro",
            "is_active": 1,
            "state_id": 8,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 69,
            "name": "Esmeraldas",
            "is_active": 1,
            "state_id": 8,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 70,
            "name": "Muisne",
            "is_active": 1,
            "state_id": 8,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 71,
            "name": "Quinindé",
            "is_active": 1,
            "state_id": 8,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 72,
            "name": "Rioverde",
            "is_active": 1,
            "state_id": 8,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 73,
            "name": "San Lorenzo",
            "is_active": 1,
            "state_id": 8,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 74,
            "name": "Isabela",
            "is_active": 1,
            "state_id": 9,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 75,
            "name": "San Cristóbal",
            "is_active": 1,
            "state_id": 9,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 76,
            "name": "Santa Cruz",
            "is_active": 1,
            "state_id": 9,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 77,
            "name": "Alfredo Baquerizo Moreno (Jujan)",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 78,
            "name": "Balao",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 79,
            "name": "Balzar",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 80,
            "name": "Colimes",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 81,
            "name": "Coronel Marcelino Maridueña",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 82,
            "name": "Daule",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 83,
            "name": "Durán",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 84,
            "name": "El Empalme",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 85,
            "name": "El Triunfo",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 86,
            "name": "General Antonio Elizalde (Bucay)",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 87,
            "name": "Guayaquil",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 88,
            "name": "Isidro Ayora",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 89,
            "name": "Lomas de Sargentillo",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 90,
            "name": "Milagro",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 91,
            "name": "Naranjal",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 92,
            "name": "Naranjito",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 93,
            "name": "Nobol",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 94,
            "name": "Palestina",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 95,
            "name": "Pedro Carbo",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 96,
            "name": "Playas (General Villamil)",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 97,
            "name": "Salitre",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 98,
            "name": "Samborondón",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 99,
            "name": "Santa Lucía",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 100,
            "name": "Simón Bolívar",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 101,
            "name": "Yaguachi",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 102,
            "name": "Antonio Ante",
            "is_active": 1,
            "state_id": 11,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 103,
            "name": "Cotacachi",
            "is_active": 1,
            "state_id": 11,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 104,
            "name": "Simón Bolívar",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 105,
            "name": "Yaguachi",
            "is_active": 1,
            "state_id": 10,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 106,
            "name": "Antonio Ante",
            "is_active": 1,
            "state_id": 11,

            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 107,
            "name": "Cotacachi",
            "is_active": 1,
            "state_id": 11,

            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 108,
            "name": "Ibarra",
            "is_active": 1,
            "state_id": 11,

            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 109,
            "name": "Otavalo",
            "is_active": 1,
            "state_id": 11,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 110,
            "name": "Pimampiro",
            "is_active": 1,
            "state_id": 11,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 111,
            "name": "San Miguel de Urcuquí",
            "is_active": 1,
            "state_id": 11,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 112,
            "name": "Calvas",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 113,
            "name": "Catamayo",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 114,
            "name": "Celica",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 115,
            "name": "Chaguarpamba",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 116,
            "name": "Espíndola",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 117,
            "name": "Gonzanamá",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 118,
            "name": "Loja",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 119,
            "name": "Macará",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 120,
            "name": "Olmedo",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 121,
            "name": "Paltas",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 122,
            "name": "Pindal",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 123,
            "name": "Puyango",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 124,
            "name": "Quilanga",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 125,
            "name": "Saraguro",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 126,
            "name": "Sozoranga",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 127,
            "name": "Zapotillo",
            "is_active": 1,
            "state_id": 12,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 128,
            "name": "Baba",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 129,
            "name": "Babahoyo",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 130,
            "name": "Buena Fe",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 131,
            "name": "Mocache",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 132,
            "name": "Montalvo",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 133,
            "name": "Palenque",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 134,
            "name": "Puebloviejo",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 135,
            "name": "Quevedo",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 136,
            "name": "Quinsaloma",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 137,
            "name": "Urdaneta",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 138,
            "name": "Valencia",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 139,
            "name": "Ventanas",
            "is_active": 1,
            "state_id": 13,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 140,
            "name": "Bolívar",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 141,
            "name": "Chone",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 142,
            "name": "El Carmen",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 143,
            "name": "Flavio Alfaro",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 144,
            "name": "Jama",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 145,
            "name": "Jaramijó",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 146,
            "name": "Jipijapa",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 147,
            "name": "Junín",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 148,
            "name": "Manta",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 149,
            "name": "Montecristi",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 150,
            "name": "Olmedo",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 151,
            "name": "Paján",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 152,
            "name": "Pedernales",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 153,
            "name": "Pichincha",
            "is_active": 1,
            "state_id": 14,
            "state_id": 19,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 154,
            "name": "Portoviejo",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 155,
            "name": "Puerto López",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 156,
            "name": "Rocafuerte",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 157,
            "name": "Santa Ana",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 158,
            "name": "Sucre",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 159,
            "name": "Tosagua",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 160,
            "name": "24 de Mayo",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 161,
            "name": "Jama",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 162,
            "name": "Jaramijó",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 163,
            "name": "San Vicente",
            "is_active": 1,
            "state_id": 14,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 164,
            "name": "Gualaquiza",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 165,
            "name": "Huamboya",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 166,
            "name": "Limón Indanza",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 167,
            "name": "Logroño",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 168,
            "name": "Morona",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 169,
            "name": "Pablo Sexto",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 170,
            "name": "Palora",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 171,
            "name": "San Juan Bosco",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 172,
            "name": "Santiago",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 173,
            "name": "Sucúa",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 174,
            "name": "Taisha",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 175,
            "name": "Tiwintza",
            "is_active": 1,
            "state_id": 15,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 176,
            "name": "Archidona",
            "is_active": 1,
            "state_id": 16,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 177,
            "name": "Carlos Julio Arosemena Tola",
            "is_active": 1,
            "state_id": 16,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 178,
            "name": "El Chaco",
            "is_active": 1,
            "state_id": 16,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 179,
            "name": "Quijos",
            "is_active": 1,
            "state_id": 16,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 180,
            "name": "Tena",
            "is_active": 1,
            "state_id": 16,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 181,
            "name": "Aguarico",
            "is_active": 1,
            "state_id": 17,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 182,
            "name": "La Joya de los Sachas",
            "is_active": 1,
            "state_id": 17,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 183,
            "name": "Loreto",
            "is_active": 1,
            "state_id": 17,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 184,
            "name": "Orellana",
            "is_active": 1,
            "state_id": 17,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 185,
            "name": "Arajuno",
            "is_active": 1,
            "state_id": 18,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 186,
            "name": "Mera",
            "is_active": 1,
            "state_id": 18,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 187,
            "name": "Pastaza",
            "is_active": 1,
            "state_id": 18,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 188,
            "name": "Santa Clara",
            "is_active": 1,
            "state_id": 18,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 189,
            "name": "Cayambe",
            "is_active": 1,
            "state_id": 19,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 190,
            "name": "Mejía",
            "is_active": 1,
            "state_id": 19,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 191,
            "name": "Pedro Moncayo",
            "is_active": 1,
            "state_id": 19,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 192,
            "name": "Pedro Vicente Maldonado",
            "is_active": 1,
            "state_id": 19,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 193,
            "name": "Puerto Quito",
            "is_active": 1,
            "state_id": 19,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 194,
            "name": "Quito",
            "is_active": 1,
            "state_id": 19,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 195,
            "name": "Rumiñahui",
            "is_active": 1,
            "state_id": 19,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 196,
            "name": "La Libertad",
            "is_active": 1,
            "state_id": 20,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 197,
            "name": "Salinas",
            "is_active": 1,
            "state_id": 20,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 198,
            "name": "Santa Elena",
            "is_active": 1,
            "state_id": 20,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 199,
            "name": "La Concordia",
            "is_active": 1,
            "state_id": 21,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 200,
            "name": "Santo Domingo",
            "is_active": 1,
            "state_id": 21,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 201,
            "name": "Cascales",
            "is_active": 1,
            "state_id": 22,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 202,
            "name": "Cuyabeno",
            "is_active": 1,
            "state_id": 22,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 203,
            "name": "Gonzalo Pizarro",
            "is_active": 1,
            "state_id": 22,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 204,
            "name": "Lago Agrio",
            "is_active": 1,
            "state_id": 22,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 205,
            "name": "Putumayo",
            "is_active": 1,
            "state_id": 22,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 206,
            "name": "Shushufindi",
            "is_active": 1,
            "state_id": 22,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 207,
            "name": "Sucumbíos",
            "is_active": 1,
            "state_id": 22,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 208,
            "name": "Ambato",
            "is_active": 1,
            "state_id": 23,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 209,
            "name": "Baños de Agua Santa",
            "is_active": 1,
            "state_id": 23,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 210,
            "name": "Cevallos",
            "is_active": 1,
            "state_id": 23,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 211,
            "name": "Mocha",
            "is_active": 1,
            "state_id": 23,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 212,
            "name": "Patate",
            "is_active": 1,
            "state_id": 23,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 213,
            "name": "Pelileo",
            "is_active": 1,
            "state_id": 23,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 214,
            "name": "Píllaro",
            "is_active": 1,
            "state_id": 23,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 215,
            "name": "Quero",
            "is_active": 1,
            "state_id": 23,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 216,
            "name": "Tisaleo",
            "is_active": 1,
            "state_id": 23,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 217,
            "name": "Centinela del Cóndor",
            "is_active": 1,
            "state_id": 24,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 218,
            "name": "Chinchipe",
            "is_active": 1,
            "state_id": 24,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 219,
            "name": "El Pangui",
            "is_active": 1,
            "state_id": 24,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 220,
            "name": "Nangaritza",
            "is_active": 1,
            "state_id": 24,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 221,
            "name": "Palanda",
            "is_active": 1,
            "state_id": 24,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 222,
            "name": "Paquisha",
            "is_active": 1,
            "state_id": 24,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 223,
            "name": "Yacuambi",
            "is_active": 1,
            "state_id": 24,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 224,
            "name": "Yantzaza",
            "is_active": 1,
            "state_id": 24,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 225,
            "name": "Zamora",
            "is_active": 1,
            "state_id": 24,
            "createdAt": new Date(),
            "updatedAt": new Date()
          }
        ],
        { truncate: true }
      ),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cities', null, { truncate: true });
  }
};
