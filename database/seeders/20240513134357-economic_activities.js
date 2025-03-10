'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            // queryInterface.bulkDelete('users', null, { truncate:true }),
            await queryInterface.bulkInsert(
                "economic_activities",
                [
                    {
                        astr_id: "36002002",
                        astr_description: "Abastecimiento de eventos y otras actividades de servicio de comidas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "40001005",
                        astr_description: "Actividades auxiliares de seguros (incluye las actividades de peritos de seguros y asesores productores de seguros)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "37001008",
                        astr_description: "Actividades complemetarias de transporte",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001003",
                        astr_description: "Actividades de administración de empresas y consultoría",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001011",
                        astr_description: "Actividades de agencias de empleo",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001015",
                        astr_description: "Actividades de agencias de viajes, operadores turísticos y servicios de reserva",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "39001007",
                        astr_description: "Actividades de Almaceneras",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001014",
                        astr_description: "Actividades de alquiler y arrendamiento (excepto inmobiliarias)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "9002001",
                        astr_description: "Actividades de apoyo a la extracción de petróleo y gas natural",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001004",
                        astr_description: "Actividades de arquitectura e ingeniería",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "46001002",
                        astr_description: "Actividades de asociaciones u organizaciones",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "39001001",
                        astr_description: "Actividades de bancos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "39001006",
                        astr_description: "Actividades de Casas de Cambio",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "39001003",
                        astr_description: "Actividades de Cooperativas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "45001001",
                        astr_description: "Actividades de hospitales",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "23001002",
                        astr_description: "Actividades de impresión y reproducción de grabaciones",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "39001005",
                        astr_description: "Actividades de Instituciones Financieras Públicas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "45001002",
                        astr_description: "Actividades de médicos y odontólogos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "39001004",
                        astr_description: "Actividades de Mutualistas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "38002003",
                        astr_description: "Actividades de producción de películas, de video, de programas de televisión, grabación y publicación de música y sonido",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "38002004",
                        astr_description: "Actividades de programación y distribución de radio y trasmisión de televisión",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001012",
                        astr_description: "Actividades de seguridad e investigación",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001013",
                        astr_description: "Actividades de servicios a edificios y paisajes",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "39001002",
                        astr_description: "Actividades de sociedades financieras",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "39001008",
                        astr_description: "Actividades de Tarjetas de Crédito",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "34001003",
                        astr_description: "Actividades especializadas de la construcción",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "41001001",
                        astr_description: "Actividades inmobiliarias",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001002",
                        astr_description: "Actividades jurídicas y de contabilidad",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "38001001",
                        astr_description: "Actividades postales y de correo",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001010",
                        astr_description: "Actividades veterinarias",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "36002003",
                        astr_description: "Actividades vinculadas al abastecimiento de bebidas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "7001001",
                        astr_description: "Acuicultura y pesca de camarón",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "43001001",
                        astr_description: "Adm pública, defensa; planes seg social obligatoria",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "000000S03",
                        astr_description: "Ama de Casa",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "46001001",
                        astr_description: "Artes, entretenimiento y recreación",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "22001001",
                        astr_description: "Aserraderos y cepilladura de madera",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "33002001",
                        astr_description: "Captación, depuración y distribución de agua y saneamiento",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003040",
                        astr_description: "Comercio al por mayor de otra maquinaria y equipo",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003014",
                        astr_description: "Comercio al por mayor de aceites y grasas de origen vegetal y animal",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003020",
                        astr_description: "Comercio al por mayor de alimentos para animales",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003007",
                        astr_description: "Comercio al por mayor de animales vivos y sus productos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003017",
                        astr_description: "Comercio al por mayor de azúcar y sus productos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003001",
                        astr_description: "Comercio al por mayor de banano y plátano",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003022",
                        astr_description: "Comercio al por mayor de bebidas alcohólicas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003023",
                        astr_description: "Comercio al por mayor de bebidas no alcohólicas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003003",
                        astr_description: "Comercio al por mayor de cacao en grano",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003002",
                        astr_description: "Comercio al por mayor de café (cereza y café pilado)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003019",
                        astr_description: "Comercio al por mayor de café tostado molido y soluble",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003028",
                        astr_description: "Comercio al por mayor de calzado",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003011",
                        astr_description: "Comercio al por mayor de camarón congelado, otros procesos y exportación",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003008",
                        astr_description: "Comercio al por mayor de camarón, pescado y productos de la acuicultura (fresco o refrigerado)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003004",
                        astr_description: "Comercio al por mayor de cereales",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003024",
                        astr_description: "Comercio al por mayor de cigarrillos y productos del tabaco",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003027",
                        astr_description: "Comercio al por mayor de cuero y productos de cuero (excepto prendas de vestir)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003038",
                        astr_description: "Comercio al por mayor de electrodomésticos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003039",
                        astr_description: "Comercio al por mayor de equipos de computación",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003005",
                        astr_description: "Comercio al por mayor de flores",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003013",
                        astr_description: "Comercio al por mayor de harina de pescado",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003026",
                        astr_description: "Comercio al por mayor de hilos, hilados, tejidos, telas y confecciones con materiales textiles (excepto prendas de vestir)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003015",
                        astr_description: "Comercio al por mayor de leche procesada y productos lácteos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003009",
                        astr_description: "Comercio al por mayor de madera sin elaborar",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003006",
                        astr_description: "Comercio al por mayor de otros productos agrícolas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003021",
                        astr_description: "Comercio al por mayor de otros productos alimenticios diversos (incluye jugos de frutas y vegetales y sus conservas)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003030",
                        astr_description: "Comercio al por mayor de papel y cartón y productos de papel y cartón",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003012",
                        astr_description: "Comercio al por mayor de pescado congelado, seco y salado y otros productos de la pesca y acuicultura y conservas de productos acuáticos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003025",
                        astr_description: "Comercio al por mayor de prendas de vestir",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003010",
                        astr_description: "Comercio al por mayor de productos cárnicos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003036",
                        astr_description: "Comercio al por mayor de productos cerámicos (incluye cerámicos, vidrio y cemento)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003018",
                        astr_description: "Comercio al por mayor de productos de cacao elaborado y productos de confitería",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003034",
                        astr_description: "Comercio al por mayor de productos de caucho (incluye llantas)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003029",
                        astr_description: "Comercio al por mayor de productos de la madera aserrada, descortezada, tableros, paneles, hojas de madera, cajas, cajones y obras de madera para edificios",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003016",
                        astr_description: "Comercio al por mayor de productos de molinería, panadería, fideos y pastas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003031",
                        astr_description: "Comercio al por mayor de productos editoriales, imprentas y otros",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003032",
                        astr_description: "Comercio al por mayor de productos farmaceúticos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003037",
                        astr_description: "Comercio al por mayor de productos metálicos (incluye oro refinado y otros metales preciosos), excluye joyerías",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003035",
                        astr_description: "Comercio al por mayor de productos plásticos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35003033",
                        astr_description: "Comercio al por mayor de productos químicos (excepto farmaeúticos)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002001",
                        astr_description: "Comercio al por menor de alimentos (incluye productos agrícolas e industrializados)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002002",
                        astr_description: "Comercio al por menor de bebidas y tabaco",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002004",
                        astr_description: "Comercio al por menor de calzado",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002005",
                        astr_description: "Comercio al por menor de combustibles y lubricantes (gasolineras y distribución de gas)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002010",
                        astr_description: "Comercio al por menor de electrodomésticos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002011",
                        astr_description: "Comercio al por menor de equipos de computación",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002012",
                        astr_description: "Comercio al por menor de equipos médicos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002009",
                        astr_description: "Comercio al por menor de ferretería",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002008",
                        astr_description: "Comercio al por menor de fertilizantes, plaguicidas y fungicidas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002006",
                        astr_description: "Comercio al por menor de libros, periódicos, revistas y artículos de papelería",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002013",
                        astr_description: "Comercio al por menor de muebles en general (excluye muebles para uso médico)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002019",
                        astr_description: "Comercio al por menor de otros productos n.c.p.",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002003",
                        astr_description: "Comercio al por menor de prendas de vestir (boutique)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35002007",
                        astr_description: "Comercio al por menor de productos farmaceúticos (farmacias)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35001002",
                        astr_description: "Comercio de partes, piezas y accesorios de vehículos automotores y motocicletas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35001001",
                        astr_description: "Comercio vehículos automotores y motocicletas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "34001001",
                        astr_description: "Construcción de edificios",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001003",
                        astr_description: "Cría de caballos y otros equinos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001004",
                        astr_description: "Cría de cerdos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001005",
                        astr_description: "Cría de conejos y cuyes",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001001",
                        astr_description: "Cría de ganado vacuno",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001007",
                        astr_description: "Cría de otras aves de corral",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001008",
                        astr_description: "Cría de otros animales vivos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "8002002",
                        astr_description: "Cría de otros productos acuáticos ncp",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001002",
                        astr_description: "Cría de ovejas y cabras",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001006",
                        astr_description: "Cría de pollos (incluye gallinas)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "8002001",
                        astr_description: "Cría de tilapia",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4002010",
                        astr_description: "Cultivo de abacá",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001015",
                        astr_description: "cultivo de aguacate",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4002009",
                        astr_description: "Cultivo de algodón en rama",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "2001004",
                        astr_description: "Cultivo de arroz con cáscara (no incluye pilado)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001009",
                        astr_description: "Cultivo de arveja",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "2001006",
                        astr_description: "Cultivo de avena",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "1001001",
                        astr_description: "Cultivo de banano y plátano",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001004",
                        astr_description: "Cultivo de Brócoli",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "1001003",
                        astr_description: "Cultivo de cacao (en grano, crudo o tostado)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "1001002",
                        astr_description: "Cultivo de café (cereza, sin tostar, no descafeinado- incluye pilado-)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4002007",
                        astr_description: "Cultivo de caña de azúcar",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "2001005",
                        astr_description: "Cultivo de cebada",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001011",
                        astr_description: "cultivo de cebolla blanca y colorada",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "3001003",
                        astr_description: "Cultivo de claveles",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001007",
                        astr_description: "Cultivo de fréjol",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001023",
                        astr_description: "Cultivo de frutas cítricas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "3001002",
                        astr_description: "Cultivo de gypsophilas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001008",
                        astr_description: "Cultivo de haba",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001005",
                        astr_description: "Cultivo de lechuga",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001010",
                        astr_description: "Cultivo de lenteja",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "2001003",
                        astr_description: "Cultivo de maíz duro",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "2001002",
                        astr_description: "Cultivo de maíz suave",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001016",
                        astr_description: "Cultivo de mango",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4002003",
                        astr_description: "Cultivo de maní",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001022",
                        astr_description: "Cultivo de manzana",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001020",
                        astr_description: "Cultivo de maracuyá",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001021",
                        astr_description: "Cultivo de mora",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001029",
                        astr_description: "Cultivo de otras frutas n.c.p",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4002006",
                        astr_description: "Cultivo de otras oleaginosas n.c.p.",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "2001009",
                        astr_description: "Cultivo de otros cereales n.c.p.",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4002019",
                        astr_description: "Cultivo de otros productos agrícolas n.c.p.",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001003",
                        astr_description: "Cultivo de otros tubérculos y raíces",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001014",
                        astr_description: "Cultivo de otros vegetales y melones n.c.p.",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4002001",
                        astr_description: "Cultivo de palma africana",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001001",
                        astr_description: "Cultivo de papa",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001017",
                        astr_description: "Cultivo de papaya",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4002011",
                        astr_description: "Cultivo de pasto y plantas forrajeras",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001013",
                        astr_description: "Cultivo de pimiento",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001018",
                        astr_description: "Cultivo de piña",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "3001001",
                        astr_description: "Cultivo de rosas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001012",
                        astr_description: "Cultivo de sandía",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4002002",
                        astr_description: "Cultivo de soya",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4002008",
                        astr_description: "Cultivo de tabaco en rama",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001006",
                        astr_description: "Cultivo de tomate",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001019",
                        astr_description: "Cultivo de tomate de árbol",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "2001001",
                        astr_description: "Cultivo de trigo",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4001002",
                        astr_description: "Cultivo de yuca",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "3001004",
                        astr_description: "Cultivos de otras flores",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "21003001",
                        astr_description: "Curtido y adobo de cueros; adobo y teñido de pieles",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "37001007",
                        astr_description: "Depósito y almacenaje",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "20002001",
                        astr_description: "Elaboración bebidas no alcohólicas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "14001001",
                        astr_description: "Elaboración de aceites y grasas origen vegetal y animal",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "19001001",
                        astr_description: "Elaboración de alimento para animales",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "16001003",
                        astr_description: "Elaboración de almidones y productos elaborados de almidón",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "18001001",
                        astr_description: "Elaboración de cacao, chocolate y productos confitería",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "19002001",
                        astr_description: "Elaboración de café",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "20001001",
                        astr_description: "Elaboración de cerveza y bebidas de malta",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "13002001",
                        astr_description: "Elaboración de conservas de atún",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "13002002",
                        astr_description: "Elaboración de conservas de otras especies acuáticas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "16003001",
                        astr_description: "Elaboracion de fideos, pastas de fideo y otros productos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "15001001",
                        astr_description: "Elaboración de leche fresca líquida",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "20001009",
                        astr_description: "Elaboración de otras bebidas alcohólicas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "19003001",
                        astr_description: "Elaboración de otros productos alimenticios diversos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "15001002",
                        astr_description: "Elaboracion de otros productos lácteos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "13001001",
                        astr_description: "Elaboración de pescado y otros productos acuáticos elaborados excepto harina de pescado",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "16002001",
                        astr_description: "Elaboración de productos de la panadería y pastelería",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "20003001",
                        astr_description: "Elaboración de productos de tabaco",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "3001005",
                        astr_description: "Elaboración de ramilletes, coronas, arreglos florales y artículos similares",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "22001009",
                        astr_description: "Elaboración de recipientes de madera y de otros productos de madera; fabricación de artículos de corcho, paja y materiales trenzables",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "12001001",
                        astr_description: "Elaboración y conservación de camarón",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "17001001",
                        astr_description: "Elaboración y refinación de azúcar",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "000000S05",
                        astr_description: "Empleado Privado",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "000000S04",
                        astr_description: "Empleado Público",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "44001004",
                        astr_description: "Enseñanza de posgrado",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "44001001",
                        astr_description: "Enseñanza pre primaría y primaria",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "44001002",
                        astr_description: "Enseñanza secundaria",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "44001003",
                        astr_description: "Enseñanza superior",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "000000S02",
                        astr_description: "Estudiante",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "10001002",
                        astr_description: "Explotación de minerales de cobre y sus concentrados",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "10001001",
                        astr_description: "Explotación de minerales de metales preciosos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "10002002",
                        astr_description: "Explotación de otras minas y canteras ncp",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "10001003",
                        astr_description: "Explotación de otros minerales metalíferos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "6001001",
                        astr_description: "Extracción de madera",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "9001001",
                        astr_description: "Extracción de petróleo y gas natural",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "10002001",
                        astr_description: "Extracción de piedra, arena y arcilla",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "25001001",
                        astr_description: "Fabricación de abonos; fabricación de pesticidas y de otros productos químicos de uso agropecuario",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "29001002",
                        astr_description: "Fabricación de aparatos de uso doméstico",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "32001003",
                        astr_description: "Fabricación de artículos de deporte",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "21003003",
                        astr_description: "Fabricación de calzado de cualquier material",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "27002001",
                        astr_description: "Fabricación de cemento, cal y yeso; y fabricación de artículos de hormigón, cemento y yeso",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "29001004",
                        astr_description: "Fabricación de equipo de oficina (excepto computadoras)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "29001003",
                        astr_description: "Fabricación de equipo eléctrico (excepto de uso doméstico)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "21001001",
                        astr_description: "Fabricación de hilos, hilados; tejidos y confecciones",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "22001002",
                        astr_description: "Fabricación de hojas de madera para enchapado y paneles a base de madera",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "32001002",
                        astr_description: "Fabricación de instrumentos musicales",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "32001005",
                        astr_description: "Fabricación de instrumentos y suministros médicos y dentales",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "25002002",
                        astr_description: "Fabricación de jabones y detergentes, preparados para limpiar y pulir, perfumes y preparados de tocador",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "32001001",
                        astr_description: "Fabricación de joyas y artículos conexos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "32001004",
                        astr_description: "Fabricación de juegos y juguetes",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "29001001",
                        astr_description: "Fabricación de los productos informáticos, electrónicos y ópticos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "21003002",
                        astr_description: "Fabricación de maletas, bolsos de mano y artículos de talabartería y guarnicionería",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "29001005",
                        astr_description: "Fabricación de maquinaria y equipo ncp",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "31001001",
                        astr_description: "Fabricación de muebles de cualquier material",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "28002009",
                        astr_description: "Fabricación de otros productos de metal ncp",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "27002009",
                        astr_description: "Fabricación de otros productos minerales no metálicos ncp",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "25002009",
                        astr_description: "Fabricación de otros productos químicos ncp",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "30001002",
                        astr_description: "Fabricación de otros tipos de equipo de transporte",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "23001001",
                        astr_description: "Fabricación de papel y productos de papel",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "22001003",
                        astr_description: "Fabricación de partes y piezas de carpintería para edificios y construcciones",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "25002001",
                        astr_description: "Fabricación de pinturas, barnices y productos de revestimiento similares, tintas de imprenta y masillas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "21002001",
                        astr_description: "Fabricación de prendas de vestir y tejidos de ganchillo (incluso de cuero y piel)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "26001001",
                        astr_description: "Fabricación de productos de caucho",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "27001002",
                        astr_description: "Fabricación de productos de cerámica y porcelana; productos refractarios",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "28001002",
                        astr_description: "Fabricación de productos de metales preciosos (excepto joyas)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "28001009",
                        astr_description: "Fabricación de productos de otros metales (excepto preciosos)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "26002001",
                        astr_description: "Fabricación de productos de plástico",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "25002003",
                        astr_description: "Fabricación de productos farmacéuticos, sustancias químicas medicinales y de productos botánicos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "28002001",
                        astr_description: "Fabricación de productos metálicos para uso estructural",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "24001001",
                        astr_description: "Fabricación de productos refinados de petróleo y de otros productos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "25001002",
                        astr_description: "Fabricación de sustáncias químicas básicas, excepto abonos y plaguicidas; plásticos y cauchos primarios",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "30001001",
                        astr_description: "Fabricación de vehículos automotores",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "27001001",
                        astr_description: "Fabricación de vidrio y productos de vidrio",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "33001001",
                        astr_description: "Generación, captación y distribución de energía eléctrica",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "47001001",
                        astr_description: "Hogares privados con servicio doméstico",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "28001001",
                        astr_description: "Industrias básicas de hierro y acero básicos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "34001002",
                        astr_description: "Ingeniería civil",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "45001004",
                        astr_description: "Instituciones residenciales de cuidado; y servicios sociales sin alojamiento",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001001",
                        astr_description: "Investigación y desarrollo científico",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "000000S01",
                        astr_description: "Jubilado",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "46001009",
                        astr_description: "Otras actividades de servicios",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "39001010",
                        astr_description: "Otras actividades financieras",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001009",
                        astr_description: "Otras actividades profesionales, científicas y técnicas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "45001003",
                        astr_description: "Otras actividades relacionadas con la salud humana",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "32001009",
                        astr_description: "Otras industrias manufactureras ncp",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001019",
                        astr_description: "Otros servicios empresariales n.c.p.",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "44001009",
                        astr_description: "Otros tipos de enseñanza",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "8001002",
                        astr_description: "Pesca comercial excepto atún",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "8001001",
                        astr_description: "Pesca de atún",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "8001003",
                        astr_description: "Pesca de otros productos acuáticos ncp",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "16001001",
                        astr_description: "Producción de arroz (pilado, blanqueado y pulido)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "13001002",
                        astr_description: "Producción de harina de pescado comestible",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "16001002",
                        astr_description: "Producción de harinas vegetales, sémolas, almidones y otros productos: glucosa (dextrosa) y jarabe de glucosa, fructosa y otros jarabes del azúcar",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001010",
                        astr_description: "Producción de huevos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001012",
                        astr_description: "Producción de lana",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001009",
                        astr_description: "Producción de leche cruda o fresca de cualquier tipo",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001011",
                        astr_description: "Producción de otros productos comestibles de animales",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "5001019",
                        astr_description: "Producción de otros productos de animales ncp",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "11001001",
                        astr_description: "Producción, procesamiento y conservación de carne y productos cárnicos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001005",
                        astr_description: "Publicidad e investigación de mercados",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "6001002",
                        astr_description: "Recolección de productos forestales diferentes a la madera",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "46001003",
                        astr_description: "Reparación de computadoras y enseres de uso personal o doméstico",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "40001004",
                        astr_description: "Seguros (de vida y generales) y reaseguros",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "36001001",
                        astr_description: "Servicio de alojamiento",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "36002001",
                        astr_description: "Servicios de alimentos, bebidas y otros servicios de comidas móviles",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "6001009",
                        astr_description: "Servicios de apoyo a la silvicultura",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "42001016",
                        astr_description: "Servicios de concesión de licencias para el derecho de uso de activos intangibles",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "38002002",
                        astr_description: "Servicios de informática y servicios conexos",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "32001010",
                        astr_description: "Servicios de reparación e instalación de maquinaria y equipo",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "35004001",
                        astr_description: "Servicios de reparación y mantenimiento de vehículos de motor y motocicletas",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "4003001",
                        astr_description: "Servicios relacionados con la agricultura",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "10003001",
                        astr_description: "Servicios relacionados con la minería (excepto petróleo)",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "8003001",
                        astr_description: "Servicios relacionados con pesca",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "38002001",
                        astr_description: "Telecomunicaciones",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "37001004",
                        astr_description: "Transporte de carga por vía acuática",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "37001006",
                        astr_description: "Transporte de carga por vía aérea",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "37001002",
                        astr_description: "Transporte de carga por vía terrestre",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "37001003",
                        astr_description: "Transporte de pasajeros por vía acuática",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "37001005",
                        astr_description: "Transporte de pasajeros por vía aérea",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        astr_id: "37001001",
                        astr_description: "Transporte de pasajeros por vía terrestre",
                        is_active: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
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
        await queryInterface.bulkDelete('economic_activities', null, { truncate: true });
    }
};
