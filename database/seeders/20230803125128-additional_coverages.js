'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'additional_coverages',
        [

          {
            "id": 1,
            "product_id": null,
            "name": "Cláusula de cobertura con costo de huelga",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 2,
            "product_id": null,
            "name": "Cláusula de cobertura con costo de guerra",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 3,
            "product_id": null,
            "name": "Cláusula de cobertura con costo de transporte de dinero y/o valores",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 4,
            "product_id": null,
            "name": "Cláusula de cobertura con costo de transporte interno",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 5,
            "product_id": null,
            "name": "cláusula de cobertura con costo de lucro cesante",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 6,
            "product_id": null,
            "name": "Cláusula de cobertura con costo de sabotaje y terrorismo",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 7,
            "product_id": null,
            "name": "Cláusula (A) del instituto para carne congelada y 24 horas de descompostura (no adecuada para carne enfriada o fresca)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 8,
            "product_id": null,
            "name": "Cláusula de cobertura sin costo de intereses cubiertos",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 9,
            "product_id": null,
            "name": "Cláusula de cobertura sin costo de automaticidad de embarques",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 10,
            "product_id": null,
            "name": "Cláusula de cobertura sin costo de autoridad civil",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 11,
            "product_id": null,
            "name": "Cláusula aclaratoria de notificación de siniestros",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 12,
            "product_id": null,
            "name": "Cláusula aclaratoria de notificación de adhesión",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 13,
            "product_id": null,
            "name": "Cláusula aclaratoria de pago de primas",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 14,
            "product_id": null,
            "name": "Cláusula aclaratoria de extensión de vigencia",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 15,
            "product_id": null,
            "name": "Cláusula aclaratoria de errores u omisiones",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 16,
            "product_id": null,
            "name": "Cláusula aclaratoria de ajustadores liquidadores y peritos",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 17,
            "product_id": null,
            "name": "Cláusula aclaratoria de gastos para aminorar la pérdida",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 18,
            "product_id": null,
            "name": "Cláusula aclaratoria de gastos de salvataje y/o rescate",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 19,
            "product_id": null,
            "name": "Cláusula aclaratoria de reparaciones inmediatas",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 20,
            "product_id": null,
            "name": "Cláusula aclaratoria de destrucción preventiva",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 21,
            "product_id": null,
            "name": "Cláusula aclaratoria de par y juego",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 22,
            "product_id": null,
            "name": "Cláusula aclaratoria de designación de bienes",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 23,
            "product_id": null,
            "name": "Cláusula aclaratoria de salvamento",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 24,
            "product_id": null,
            "name": "Cláusula aclaratoria de sellos y marcas",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 25,
            "product_id": null,
            "name": "Cláusula aclaratoria de seguro insuficiente parcial",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 26,
            "product_id": null,
            "name": "Cláusula aclaratoria de definición de muebles, enseres y equipos de oficina",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 27,
            "product_id": null,
            "name": "Cláusula aclaratoria de definición de inventarios",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 28,
            "product_id": null,
            "name": "Cláusula aclaratoria de definición de maquinarías",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 29,
            "product_id": null,
            "name": "Cláusula aclaratoria de definición de dinero y valores",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 30,
            "product_id": null,
            "name": "Cláusula aclaratoria de contabilidad y prueba",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 31,
            "product_id": null,
            "name": "Cláusula aclaratoria de primera opción de compra",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 32,
            "product_id": null,
            "name": "Cláusula aclaratoria flotante de transporte",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 33,
            "product_id": null,
            "name": "Cláusula aclaratoria de beneficiario acreedor",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 34,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para cargamentos (A)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 35,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para cargamentos (B)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 36,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para cargamentos (C)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 37,
            "product_id": null,
            "name": "Cláusula del instituto para guerra (cargamentos)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 38,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para huelgas (cargamentos)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 39,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para guerra (carga aérea)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 40,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para huelgas (carga aérea)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 41,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto de aseguradores marítimos para alimentos congelados (A) (no aplicable a carne congelada)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 42,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto de aseguradores marítimos para huelgas (alimentos congelados) (no aplicable a carne congelada)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 43,
            "product_id": null,
            "name": "Cláusula aclaratoria de cancelación del riesgo de guerra (cargamentos)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 44,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para comercio de FOSFA TRADES (A) (Convenida con la Federación de Asociaciones de Aceites, Semillas y Grasas)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 45,
            "product_id": null,
            "name": "Cláusula aclaratoria para guerra del instituto para comercio de FOSFA",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 46,
            "product_id": null,
            "name": "(Acordadas con la Federación de Asociaciones de Aceites, Semillas y Grasas)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 47,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para huelgas comercio de FOSFA",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 48,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para huelgas (Carne congelada) (no adecuada para carne enfriada o fresca)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 49,
            "product_id": null,
            "name": "Cláusula de garantía de clasificación de buques",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 50,
            "product_id": null,
            "name": "Cláusula de garantía de custodia armada",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 51,
            "product_id": null,
            "name": "Cláusula de garantía de clasificación terrestre",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 52,
            "product_id": null,
            "name": "Cláusula de garantía de transportistas - personales naturales",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 53,
            "product_id": null,
            "name": "Cláusula de garantía de medios de transporte con rastreo satelital monitoreado",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 54,
            "product_id": null,
            "name": "Cláusula de exclusión de armas químicas, biológicas, bioquímicas, electromagnéticas y de ataque cibernético",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 55,
            "product_id": null,
            "name": "Cláusula extendida de exclusión de contaminación por radioactividad del instituto",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 56,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para guerra (carga aérea) (excluyendo los envíos por correo",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 57,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para mercancías (A) para uso solamente con la póliza de seguro marítimo para exportaciones",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 58,
            "product_id": null,
            "name": "Cláusula aclaratoria del instituto para cargamento (vía aérea) (excluyendo los envió por correo)",
            "standard": 0,
            "is_moderate": 0,
            "is_default": 0,
            "createdAt": new Date(),
            "updatedAt": new Date()
          }
        ],
        { truncate: true }
      ),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('additional_coverages', null, { truncate: true });
  }
};
