'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            // queryInterface.bulkDelete('users', null, {truncat:true }),
            await queryInterface.bulkInsert(
                "occupations",
                [
                    {
                        astr_id: "100018",
                        astr_description: "ABOGADO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800236",
                        astr_description: "ACCESORIOS PARA VEHICULOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500005",
                        astr_description: "ACEITES GRASAS Y JABONES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800008",
                        astr_description: "ACROBATA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800009",
                        astr_description: "ACTOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800010",
                        astr_description: "ACTUARIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800273",
                        astr_description: "ACUACULTOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800011",
                        astr_description: "ADMINISTRADOR DE BIENES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800245",
                        astr_description: "ADMINISTRADOR DE CYBER",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800106",
                        astr_description: "ADMINISTRADOR DE LOCAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800272",
                        astr_description: "ADMINISTRADOR DE MINAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800243",
                        astr_description: "ADMINISTRADOR DE MINIMARKET",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800226",
                        astr_description: "ADMINISTRADOR DE RESTAURANTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800012",
                        astr_description: "ADMINISTRADOR DE SOCIEDADES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800013",
                        astr_description: "AFINADOR DE PIANOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800016",
                        astr_description: "AGENTE COMISIONISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800131",
                        astr_description: "AGENTE DE ADUANA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800014",
                        astr_description: "AGENTE DE BOLSAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800015",
                        astr_description: "AGENTE DE CAMBIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800018",
                        astr_description: "AGENTE DE VIAJES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800017",
                        astr_description: "AGENTE JUDICIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800019",
                        astr_description: "AGRICULTOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100010",
                        astr_description: "AGRICULTURA Y CAZA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800020",
                        astr_description: "ALBAÑIL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800038",
                        astr_description: "ALBAÑIL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800021",
                        astr_description: "ALFARERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500001",
                        astr_description: "ALIMENTOS Y BEBIDAS GASEOSAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800022",
                        astr_description: "ALPINISMO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800071",
                        astr_description: "ALQUILER DE DISFRACES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500009",
                        astr_description: "ALUMINIO Y VIDRIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800023",
                        astr_description: "AMA DE CASA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800040",
                        astr_description: "AMA DE CASA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800202",
                        astr_description: "ANALISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100032",
                        astr_description: "ANALISTA DE SISTEMAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800025",
                        astr_description: "APICULTOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800026",
                        astr_description: "ARMERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800027",
                        astr_description: "ARQUEOLOGO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100021",
                        astr_description: "ARQUITECTO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100081",
                        astr_description: "ARRENDAMIENTO MERCANTIL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100009",
                        astr_description: "ARROZ",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500006",
                        astr_description: "ARTESANIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800028",
                        astr_description: "ARTIFICERO PIROTECNICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800239",
                        astr_description: "ARTISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800101",
                        astr_description: "ASESOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800097",
                        astr_description: "ASESOR COMERCIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800311",
                        astr_description: "ASESOR DE SEGUROS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800117",
                        astr_description: "ASESOR JUR?DICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100061",
                        astr_description: "ASESOR TECNICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100095",
                        astr_description: "ASISTENTE ADMINNISTRATIVO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800203",
                        astr_description: "ASISTENTE DE RECURSOS HUMANOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100110",
                        astr_description: "ASISTENTE DE SERVICIOS DE CLIENTES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800247",
                        astr_description: "ASISTENTE DE SISTEMAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100062",
                        astr_description: "ASISTENTE DE VENTAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800225",
                        astr_description: "ASISTENTE FINANCIERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100131",
                        astr_description: "ASISTENTE/GERENCIA DE MATERIALES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100028",
                        astr_description: "AUDITOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800102",
                        astr_description: "AUXILIAR CONTABLE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100033",
                        astr_description: "AUXILIAR DE ENFERMERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800076",
                        astr_description: "AUXILIAR DE MANTENIMIENTO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100105",
                        astr_description: "AVIACION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100002",
                        astr_description: "AVICOLA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100041",
                        astr_description: "AYUDANTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100040",
                        astr_description: "AYUDANTE COMERCIALIZACION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100058",
                        astr_description: "AYUDANTE VENTAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800285",
                        astr_description: "AZAFATA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100003",
                        astr_description: "BANANO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100051",
                        astr_description: "BANCARIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800291",
                        astr_description: "BARTENDER",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800109",
                        astr_description: "BIBLIOTECARIA/O",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100076",
                        astr_description: "BIOLOGO MARINO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800041",
                        astr_description: "BODEGUERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800309",
                        astr_description: "BOMBERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800059",
                        astr_description: "BROKER DE REASEGUROS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800211",
                        astr_description: "BUZO INDUSTRIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800219",
                        astr_description: "CABINAS TELEFONICAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100005",
                        astr_description: "CACAO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100004",
                        astr_description: "CAFE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800098",
                        astr_description: "CAJERO / CAJERA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800307",
                        astr_description: "CAMARERO/A",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800237",
                        astr_description: "CAMAROGRAFO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "300003",
                        astr_description: "CAMARON",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "200000",
                        astr_description: "CAMARONERA Y LABORATORIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800281",
                        astr_description: "CAMBIO DE DINERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100007",
                        astr_description: "CANA DE AZUCAR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800113",
                        astr_description: "CANTANTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800123",
                        astr_description: "CAPACITACI?N",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800223",
                        astr_description: "CAPITAN DE BUQUE PESQUERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800212",
                        astr_description: "CARGADOR DE CAMIONES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800061",
                        astr_description: "CARPINTERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100090",
                        astr_description: "CARTONERA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800065",
                        astr_description: "CERRAJERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100043",
                        astr_description: "CIRUJANO PEDIATRA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800308",
                        astr_description: "CLUB SOCIAL Y DEPORTIVO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800046",
                        astr_description: "COCINERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100135",
                        astr_description: "COLECTORA COLEGIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800135",
                        astr_description: "COMERCIANTE BAZAR Y PAPELERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800136",
                        astr_description: "COMERCIANTE D ALUMINIO Y VIDRIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800186",
                        astr_description: "COMERCIANTE DE ABARROTES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800178",
                        astr_description: "COMERCIANTE DE ANTEOJOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800089",
                        astr_description: "COMERCIANTE DE ARTERSANIAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800160",
                        astr_description: "COMERCIANTE DE ARTICULOS DE RECICLAJE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800162",
                        astr_description: "COMERCIANTE DE CARNES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800277",
                        astr_description: "COMERCIANTE DE COLCHONES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800134",
                        astr_description: "COMERCIANTE DE COMIDAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800143",
                        astr_description: "COMERCIANTE DE COMPUTADORAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800201",
                        astr_description: "COMERCIANTE DE CONFITERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800036",
                        astr_description: "COMERCIANTE DE COSMETICOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800070",
                        astr_description: "COMERCIANTE DE ELECTRODOM?STICOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800205",
                        astr_description: "COMERCIANTE DE EMBUTIDOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800157",
                        astr_description: "COMERCIANTE DE EQUIPOS DE PESCA/ CACERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800155",
                        astr_description: "COMERCIANTE DE EQUIPOS DENTALES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800139",
                        astr_description: "COMERCIANTE DE FERRETERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800091",
                        astr_description: "COMERCIANTE DE GANADO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800287",
                        astr_description: "COMERCIANTE DE GRANOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800200",
                        astr_description: "COMERCIANTE DE HELADOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100098",
                        astr_description: "COMERCIANTE DE JOYAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800170",
                        astr_description: "COMERCIANTE DE JUGUETES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800164",
                        astr_description: "COMERCIANTE DE LACTEOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800158",
                        astr_description: "COMERCIANTE DE LIBROS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800187",
                        astr_description: "COMERCIANTE DE MADERA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800129",
                        astr_description: "COMERCIANTE DE MARISCOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800213",
                        astr_description: "COMERCIANTE DE MATERIAL ELECTRICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800303",
                        astr_description: "COMERCIANTE DE MATERIALES DE CONSTRUCCION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800173",
                        astr_description: "COMERCIANTE DE MEDICINAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800064",
                        astr_description: "COMERCIANTE DE MUEBLES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800241",
                        astr_description: "COMERCIANTE DE PERFUMES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800238",
                        astr_description: "COMERCIANTE DE PINTURAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800149",
                        astr_description: "COMERCIANTE DE PLASTICOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800185",
                        astr_description: "COMERCIANTE DE PRODUCTOS AGRICOLAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800217",
                        astr_description: "COMERCIANTE DE PRODUCTOS DE ASEO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800166",
                        astr_description: "COMERCIANTE DE PRODUCTOS NATURALES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800240",
                        astr_description: "COMERCIANTE DE RECICLAJE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800035",
                        astr_description: "COMERCIANTE DE ROPA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800130",
                        astr_description: "COMERCIANTE DE VENTANAS Y PUERTAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800172",
                        astr_description: "COMERCIANTE DE VIDEOJUEGOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800057",
                        astr_description: "COMERCIANTE DE VIVERES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800137",
                        astr_description: "COMERCIANTE DE ZAPATOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100016",
                        astr_description: "COMERCIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800146",
                        astr_description: "COMERCIO DE LICORES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800125",
                        astr_description: "COMPA??A DE SEGUROS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800001",
                        astr_description: "COMUNICACIONES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800268",
                        astr_description: "CONCEJAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100127",
                        astr_description: "CONDUCTOR CHOFER PROFESIONAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800029",
                        astr_description: "CONDUCTOR DE AMBULANCIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800030",
                        astr_description: "CONDUCTOR DE AUTOBUSES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800031",
                        astr_description: "CONDUCTOR DE EXCAVADORA/GRUA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800032",
                        astr_description: "CONDUCTOR DE LOCOMOTORA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800198",
                        astr_description: "CONSEJERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800099",
                        astr_description: "CONSERJE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800058",
                        astr_description: "CONSERVACION VIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "600000",
                        astr_description: "CONSTRUCCION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800043",
                        astr_description: "CONSULTOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800295",
                        astr_description: "CONSULTORIO MEDICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "300005",
                        astr_description: "CONSUMO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800002",
                        astr_description: "CONSUMO MASIVO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100022",
                        astr_description: "CONTADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800159",
                        astr_description: "CONTRATISTA OBRAS CIVILES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800105",
                        astr_description: "CONTROLADOR A?REO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800163",
                        astr_description: "COORDINADOR DE EVENTOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800258",
                        astr_description: "COSNSERVACION AMBIENTAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800051",
                        astr_description: "COSTURERA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800044",
                        astr_description: "COURIER",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800072",
                        astr_description: "CURANDERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800269",
                        astr_description: "CURTIEMBRE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800244",
                        astr_description: "CYBER",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800147",
                        astr_description: "DECANO/SUBDECANO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100093",
                        astr_description: "DECORADORA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800257",
                        astr_description: "DESPACHADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800133",
                        astr_description: "DIGITADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "001004",
                        astr_description: "DIPLOMÁTICO/A",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100067",
                        astr_description: "DIRECTORA PROPIETARIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800063",
                        astr_description: "DISE?ADOR GRAFICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800174",
                        astr_description: "DISEÑADOR INDUSTRIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100117",
                        astr_description: "DISTRIBUIDOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800302",
                        astr_description: "DISTRIBUIDORA DE GAS NATURAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100119",
                        astr_description: "DOCENTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800264",
                        astr_description: "EBANISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100023",
                        astr_description: "ECONOMISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100066",
                        astr_description: "EDUCACION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100037",
                        astr_description: "EDUCACION  SUPERIOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100046",
                        astr_description: "EDUCACION MEDIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100134",
                        astr_description: "EJECUTIVA BANCARIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800250",
                        astr_description: "EJECUTIVO DE CREDITO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100065",
                        astr_description: "EJECUTIVO DE MERCADEO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100087",
                        astr_description: "EJECUTIVO DE VENTAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "44001002",
                        astr_description: "EJECUTIVO TECNICO DE SEGUROS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "003001005",
                        astr_description: "ELABORACION DE RAMILLETES CORONAS Y CONDONES CON UÑAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500012",
                        astr_description: "ELECTRICIDAD",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800142",
                        astr_description: "ELECTRICISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800150",
                        astr_description: "EMBOTELLADORA DE AGUA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800168",
                        astr_description: "EMPACADOR / A",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800175",
                        astr_description: "EMPACADOR DE PLASTICOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800261",
                        astr_description: "EMPLEADA DOMESTICA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800274",
                        astr_description: "EMPLEADO ADMINISTRATIVO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100029",
                        astr_description: "EMPLEADO BANCARIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800037",
                        astr_description: "EMPLEADO PRIVADO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800181",
                        astr_description: "EMPLEADO PUBLICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800121",
                        astr_description: "EMPRESA DE SEGURIDAD ARMADA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800271",
                        astr_description: "ENCOFRADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800286",
                        astr_description: "ENCUESTADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800191",
                        astr_description: "ENDEREZADA Y PINTURA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800080",
                        astr_description: "ENFERMERO/A",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "044001001",
                        astr_description: "ENSENANZA PRIMARIA Y PREPRIMARIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800263",
                        astr_description: "ENTRENADOR DE DEPORTES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800267",
                        astr_description: "ESTIBADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800220",
                        astr_description: "ESTIBADOR EN CERVECERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800087",
                        astr_description: "ESTILISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800039",
                        astr_description: "ESTUDIANTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800078",
                        astr_description: "ETIQUETADORA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100013",
                        astr_description: "EXPLOTACION DE MINAS Y CANTERAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "300000",
                        astr_description: "EXPORTACION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800007",
                        astr_description: "FABRICA DE CALZADO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800266",
                        astr_description: "FABRICA DE CARROCERIAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800294",
                        astr_description: "FABRICA DE VELAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800232",
                        astr_description: "FABRICANTE DE LAPIDAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800306",
                        astr_description: "FABRICANTE DE LAPIDAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800206",
                        astr_description: "FARMACEUTICO/ A",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100055",
                        astr_description: "FISCALIZADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800124",
                        astr_description: "FLORICULTOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800079",
                        astr_description: "FOTOGRAFO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800183",
                        astr_description: "FUMIGADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800192",
                        astr_description: "FUNDACION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800128",
                        astr_description: "FUTBOLISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100001",
                        astr_description: "GANADO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800171",
                        astr_description: "GASFITERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800122",
                        astr_description: "GASOLINERA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800253",
                        astr_description: "GEOLOGO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100070",
                        astr_description: "GERENTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100114",
                        astr_description: "GERENTE COMERCIO EXTERIOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100132",
                        astr_description: "GERENTE DE AREA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100102",
                        astr_description: "GERENTE DE EXPORTACION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100125",
                        astr_description: "GERENTE DE RECURSOS HUMANOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100035",
                        astr_description: "GERENTE DE VENTAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100060",
                        astr_description: "GERENTE DE ZONA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100108",
                        astr_description: "GERENTE FINANCIERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100073",
                        astr_description: "GERENTE GENERAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100100",
                        astr_description: "GERENTE PROPIETARIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100103",
                        astr_description: "GERENTE REGIONAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100059",
                        astr_description: "GERENTE TECNICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100053",
                        astr_description: "GINECOLOGO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800153",
                        astr_description: "GRUPO FAMILIAR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100136",
                        astr_description: "GUARDIAS DE SEGURIDAD",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800103",
                        astr_description: "GUIA PENITENCIARIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800104",
                        astr_description: "GUIA TURISTICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800292",
                        astr_description: "IMPLANTES ORTOPEDICOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "400001",
                        astr_description: "IMPORTACION CAFE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "400000",
                        astr_description: "IMPORTACION Y COMERCIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500004",
                        astr_description: "IMPRENTA Y RELACIONADOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800169",
                        astr_description: "IMPULSADOR / A",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500017",
                        astr_description: "INDUSTRIA ALIMENTICIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800249",
                        astr_description: "INDUSTRIA AUTOMOTRIZ",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800278",
                        astr_description: "INDUSTRIA CAMARONERA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500018",
                        astr_description: "INDUSTRIA FARMACEUTICA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800229",
                        astr_description: "INDUSTRIA HOTELERA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100014",
                        astr_description: "INDUSTRIA MANUFACTURERA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100015",
                        astr_description: "INDUSTRIA METALICA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500016",
                        astr_description: "INDUSTRIA PAPELERA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500013",
                        astr_description: "INDUSTRIA QUIMICA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500000",
                        astr_description: "INDUSTRIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500015",
                        astr_description: "INDUSTRIAS DEL CUERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800252",
                        astr_description: "INFANTE DE MARINA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800092",
                        astr_description: "INGENIERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800077",
                        astr_description: "INGENIERO AGR?NOMO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800259",
                        astr_description: "INGENIERO AMBIENTAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100020",
                        astr_description: "INGENIERO CIVIL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100024",
                        astr_description: "INGENIERO COMERCIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800024",
                        astr_description: "INGENIERO DE SISTEMAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800231",
                        astr_description: "INGENIERO ELECTRICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800042",
                        astr_description: "INGENIERO ELECTRONICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800230",
                        astr_description: "INGENIERO EN TELECOMUNICACIONES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800093",
                        astr_description: "INGENIERO MEC?NICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800088",
                        astr_description: "INGENIERO QUIMICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800299",
                        astr_description: "INGENIERO ZOOTECNISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800284",
                        astr_description: "INMOBILIARIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800224",
                        astr_description: "INSPECTOR CATASTRO MUNICIPAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800305",
                        astr_description: "INSPECTOR DE MEDIDORES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "44001003",
                        astr_description: "INSPECTOR DE SANIDAD",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800067",
                        astr_description: "INSPECTOR FITOSANITARIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800053",
                        astr_description: "INSTALADOR DE CALEFACCION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800293",
                        astr_description: "INSTALADOR DE SANITARIOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100096",
                        astr_description: "INSTRUCTOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800246",
                        astr_description: "INSTRUCTOR DE BUCEO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800154",
                        astr_description: "INSTRUCTOR DE GIMNASIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800189",
                        astr_description: "INSTRUCTOR DE MANEJO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800004",
                        astr_description: "INSUMOS PARA AUTOMOTORES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800141",
                        astr_description: "JARDINERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100063",
                        astr_description: "JEFE CAPACITACION DE VENTAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100101",
                        astr_description: "JEFE CONTROL DE CALIDAD",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100115",
                        astr_description: "JEFE DE AGENCIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800148",
                        astr_description: "JEFE DE COBRANZAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100126",
                        astr_description: "JEFE DE COMPRAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100064",
                        astr_description: "JEFE DE COMPUTACION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100129",
                        astr_description: "JEFE DE COSTOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800132",
                        astr_description: "JEFE DE CR?DITO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100106",
                        astr_description: "JEFE DE FOTOMECANICA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100079",
                        astr_description: "JEFE DE IMPORTACIONES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100128",
                        astr_description: "JEFE DE INVENTARIOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100086",
                        astr_description: "JEFE DE INVERSIONES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100044",
                        astr_description: "JEFE DE PERSONAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100080",
                        astr_description: "JEFE DE PLANTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100047",
                        astr_description: "JEFE DE PROCES.DE DATOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100084",
                        astr_description: "JEFE DE SEGURIDAD INDUSTRIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100089",
                        astr_description: "JEFE DE TALLERES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800062",
                        astr_description: "JORNALERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100123",
                        astr_description: "JOYERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800045",
                        astr_description: "JUBILADO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800193",
                        astr_description: "JUEZ",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100122",
                        astr_description: "LABORATORIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800216",
                        astr_description: "LAVANDERIA DE CARROS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800215",
                        astr_description: "LAVANDERIA DE ROPA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800075",
                        astr_description: "LECTOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100025",
                        astr_description: "LICENCIADO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800221",
                        astr_description: "LIMPIEZA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800248",
                        astr_description: "LUBRICADORA DE AUTOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800074",
                        astr_description: "MAESTRA DE BELLEZA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800119",
                        astr_description: "MANTENIMIENTO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100075",
                        astr_description: "MARINO MERCANTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800161",
                        astr_description: "MASAJISTA / TERAPEUTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500010",
                        astr_description: "MAT. DE CONSTRUCCION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800100",
                        astr_description: "MAYORDOMO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800048",
                        astr_description: "MECANICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800086",
                        astr_description: "MECANICO AUTOMOTRIZ",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100111",
                        astr_description: "MECANICO DE AVIACION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800190",
                        astr_description: "MECANICO INDUSTRIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800194",
                        astr_description: "MECANICO INDUSTRIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100112",
                        astr_description: "MECANICO TORNERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100019",
                        astr_description: "MEDICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100074",
                        astr_description: "MEDICO CIRUJANO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800096",
                        astr_description: "MENSAJERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800115",
                        astr_description: "MESERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800107",
                        astr_description: "METEOR?LOGO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800265",
                        astr_description: "MIEMBRO DE JUNTA PARROQUIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100107",
                        astr_description: "MILITAR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800251",
                        astr_description: "MILITAR EN SERVICIO PASIVO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100099",
                        astr_description: "MINERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800242",
                        astr_description: "MINIMARKET",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800282",
                        astr_description: "MISIONERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100113",
                        astr_description: "MODISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100069",
                        astr_description: "MUEBLERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800114",
                        astr_description: "MUSICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800069",
                        astr_description: "NAVIERA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100071",
                        astr_description: "NEGOCIO PROPIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800218",
                        astr_description: "NIÑERA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "000001",
                        astr_description: "NINGUNA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800256",
                        astr_description: "NOTARIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800140",
                        astr_description: "NUTRICIONISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800082",
                        astr_description: "OBRERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800275",
                        astr_description: "OBRERO EQUIPOS DE BOMBEO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100133",
                        astr_description: "ODONTOLOGIA INFANTIL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100068",
                        astr_description: "ODONTOLOGO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100116",
                        astr_description: "OFICIAL MARINA MERCANTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800052",
                        astr_description: "OPERADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800056",
                        astr_description: "OPERADOR DE MAQUINARIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800167",
                        astr_description: "OPERADOR TELEFONICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100124",
                        astr_description: "OPTOMETRISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100006",
                        astr_description: "PALMA AFRICANA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800050",
                        astr_description: "PANADERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800209",
                        astr_description: "PARAMEDICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800060",
                        astr_description: "PARVULARIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800262",
                        astr_description: "PASTEURIZADORA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800156",
                        astr_description: "PASTOR EVANGELICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800081",
                        astr_description: "PAT?LOGO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800049",
                        astr_description: "PELUQUERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100026",
                        astr_description: "PERIODISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100011",
                        astr_description: "PESCA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "300002",
                        astr_description: "PESCA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800301",
                        astr_description: "PET SHOP",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800210",
                        astr_description: "PETROLERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800033",
                        astr_description: "PILADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800233",
                        astr_description: "PILOTO COMERCIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800127",
                        astr_description: "PINTOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500007",
                        astr_description: "PLASTICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800066",
                        astr_description: "PLOMERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800108",
                        astr_description: "POLICIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800197",
                        astr_description: "POLITICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800280",
                        astr_description: "PORTERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800151",
                        astr_description: "PRESIDENTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500003",
                        astr_description: "PRODUCCION DE CAJAS Y CARTON",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800055",
                        astr_description: "PRODUCCION DE DULCES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500002",
                        astr_description: "PRODUCCION DE PAPEL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100077",
                        astr_description: "PRODUCTOS METALICOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100034",
                        astr_description: "PROFESOR SECUNDARIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100030",
                        astr_description: "PROFESOR UNIVERSITARIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800207",
                        astr_description: "PROFESOR/ A PRIMARIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100038",
                        astr_description: "PROFESORA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100121",
                        astr_description: "PROGRAMADOR DE SISTEMAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100120",
                        astr_description: "PROMOTORA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800227",
                        astr_description: "PROPIETARIO DE ASADERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800222",
                        astr_description: "PROPIETARIO DE ASERRADERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800073",
                        astr_description: "PROPIETARIO DE BAR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800184",
                        astr_description: "PROPIETARIO DE DESPENSA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800118",
                        astr_description: "PROPIETARIO DE PAPELERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800214",
                        astr_description: "PROPIETARIO DE RESTAURANTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800313",
                        astr_description: "PROPIETARIO DE VOLQUETAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100118",
                        astr_description: "PROVEEDOR DE MARMOL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100054",
                        astr_description: "PROYECTISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100083",
                        astr_description: "PUBLICIDAD",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100078",
                        astr_description: "QUEHACERES DOMESTICOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500011",
                        astr_description: "QUIMICOS Y FARMACEUTICOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800279",
                        astr_description: "RADIOTECNICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800179",
                        astr_description: "REASEGURADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800110",
                        astr_description: "RECAUDADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800228",
                        astr_description: "RECEPCIONISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800270",
                        astr_description: "RECICLADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800126",
                        astr_description: "RECOLECTOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100039",
                        astr_description: "REGISTRADOR DE LA PROPIEDAD",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800255",
                        astr_description: "REHABILITADOR FISICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800290",
                        astr_description: "RELACIONISTA PUBLICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800235",
                        astr_description: "RELOJERIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800152",
                        astr_description: "REPARTIDOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100104",
                        astr_description: "REPRESENTANTE DE VENTAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800297",
                        astr_description: "RESIDENCIA CON GUARDIANIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800298",
                        astr_description: "RESIDENCIA SIN GUARDIANIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800006",
                        astr_description: "RESIDENCIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800304",
                        astr_description: "RESTAURADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800312",
                        astr_description: "RETENCION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800254",
                        astr_description: "SACERDOTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800083",
                        astr_description: "SASTRE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100036",
                        astr_description: "SECRETARIA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800176",
                        astr_description: "SERIGRAFO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800310",
                        astr_description: "SERVICIOS PETROLEROS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100042",
                        astr_description: "SERVICIOS PUBLICOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100052",
                        astr_description: "SICOLOGO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100012",
                        astr_description: "SILVICULTURA Y EXTRACCION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800283",
                        astr_description: "SISTEMAS DE RIEGO Y DRENAJE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100130",
                        astr_description: "SOCIO COOPERATIVA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800208",
                        astr_description: "SOLDADO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800047",
                        astr_description: "SOLDADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100008",
                        astr_description: "SOYA Y MAIZ",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100092",
                        astr_description: "SUBGERENTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100091",
                        astr_description: "SUBGERENTE DIVISION DE SISTEMAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100045",
                        astr_description: "SUPERINTEN. DE PLANTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800314",
                        astr_description: "SUPERVISOR DE OPERACIONES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800116",
                        astr_description: "SUPERVISOR DE PLANTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800296",
                        astr_description: "SUPERVISOR DE TRANSPORTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800034",
                        astr_description: "TALLER DE COSTURA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800005",
                        astr_description: "TALLERES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800182",
                        astr_description: "TAPICERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100097",
                        astr_description: "TECNICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100094",
                        astr_description: "TECNICO DE COMPUTACION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800085",
                        astr_description: "TECNICO ELECTRICISTA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800165",
                        astr_description: "TECNICO ELECTRONICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800276",
                        astr_description: "TECNICO EN REFRIGERACION",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800199",
                        astr_description: "TECNICO INDUSTRIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100057",
                        astr_description: "TECNICO MECANICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100031",
                        astr_description: "TECNOLOGO MEDICO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100085",
                        astr_description: "TERAPISTA DE LENGUAJE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800068",
                        astr_description: "TERCERIZACI?N DE PERSONAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500008",
                        astr_description: "TEXTIL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "500014",
                        astr_description: "TEXTILES Y PRENDAS DE VESTIR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800084",
                        astr_description: "TOP?GRAFO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800180",
                        astr_description: "TORERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100109",
                        astr_description: "TRABAJADORA SOCIAL",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800260",
                        astr_description: "TRADUCTOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800112",
                        astr_description: "TRAMITADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100017",
                        astr_description: "TRANSPORTE",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800003",
                        astr_description: "TRANSPORTE AEREO MARITIMO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800196",
                        astr_description: "TRANSPORTE DE CARGA PESADA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800177",
                        astr_description: "TRANSPORTE DE LEGUMBRES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800204",
                        astr_description: "TRANSPORTE DE MATERIAL PETREO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800145",
                        astr_description: "TRANSPORTE DE MATERIALES DE CONSTRUCCI?N",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800144",
                        astr_description: "TRANSPORTE DE PASAJEROS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "130008",
                        astr_description: "TRANSPORTES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "700000",
                        astr_description: "TURISMO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800234",
                        astr_description: "UTILERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800195",
                        astr_description: "VENDEDOR BIENES RAICES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800095",
                        astr_description: "VENDEDOR DE CD?S",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800120",
                        astr_description: "VENDEDOR DE CELULARES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "00001",
                        astr_description: "VENDEDOR DE EQUIPOS M?DICOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100050",
                        astr_description: "VENDEDOR DE FRUTAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100088",
                        astr_description: "VENDEDOR DE LLANTAS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800300",
                        astr_description: "VENTA DE ACCESORIOS PARA AUTOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800188",
                        astr_description: "VENTA DE ACCESORIOS PARA CELULAR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800288",
                        astr_description: "VENTA DE EQUIPOS DE SEGURIDAD",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800090",
                        astr_description: "VENTA DE FLORES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800289",
                        astr_description: "VENTA DE REPUESTOS AUTOMOTRICES",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100048",
                        astr_description: "VENTA ROPA DEPORTIVA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100072",
                        astr_description: "VENTA VEHICULOS Y REPUESTOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100027",
                        astr_description: "VETERINARIO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "100056",
                        astr_description: "VISITADOR A MEDICOS",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800094",
                        astr_description: "VULCANIZADOR",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "120001",
                        astr_description: "VULCANIZADORA",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "800138",
                        astr_description: "ZAPATERO",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ],
                { truncat: true }
            ),
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         *Exampl:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('occupations', null, { truncat: true });
    }
};
