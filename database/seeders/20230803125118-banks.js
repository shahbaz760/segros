'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'banks',
        [
          {
            "id": 1,
            "cd": "332",
            "name": "332 - Acesso Soluções de Pagamento S.A.",
            "description": "Acesso Soluções de Pagamento S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 2,
            "cd": "117",
            "name": "117 - Advanced Cc Ltda",
            "description": "Advanced Cc Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 3,
            "cd": "272",
            "name": "272 - AGK Corretora de Câmbio S.A.",
            "description": "AGK Corretora de Câmbio S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 4,
            "cd": "349",
            "name": "349 - AL5 S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO",
            "description": "AL5 S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 5,
            "cd": "172",
            "name": "172 - Albatross Ccv S.A.",
            "description": "Albatross Ccv S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 6,
            "cd": "313",
            "name": "313 - AMAZÔNIA CORRETORA DE CÂMBIO LTDA.",
            "description": "AMAZÔNIA CORRETORA DE CÂMBIO LTDA.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 7,
            "cd": "188",
            "name": "188 - Ativa S.A Investimentos",
            "description": "Ativa S.A Investimentos",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 8,
            "cd": "280",
            "name": "280 - Avista S.A.",
            "description": "Avista S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 9,
            "cd": "080",
            "name": "080 - B&T Cc Ltda",
            "description": "B&T Cc Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 10,
            "cd": "654",
            "name": "654 - Banco A.J. Renner S.A.",
            "description": "Banco A.J. Renner S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 11,
            "cd": "246",
            "name": "246 - Banco Abc Brasil S.A.",
            "description": "Banco Abc Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 12,
            "cd": "121",
            "name": "121 - Banco Agibank S.A.",
            "description": "Banco Agibank S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 13,
            "cd": "025",
            "name": "025 - Banco Alfa S.A.",
            "description": "Banco Alfa S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 14,
            "cd": "641",
            "name": "641 - Banco Alvorada S.A.",
            "description": "Banco Alvorada S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 15,
            "cd": "065",
            "name": "065 - Banco Andbank S.A.",
            "description": "Banco Andbank S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 16,
            "cd": "096",
            "name": "096 - Banco B3 S.A.",
            "description": "Banco B3 S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 17,
            "cd": "024",
            "name": "024 - Banco Bandepe S.A.",
            "description": "Banco Bandepe S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 18,
            "cd": "021",
            "name": "021 - Banco Banestes S.A.",
            "description": "Banco Banestes S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 19,
            "cd": "330",
            "name": "330 - Banco Bari de Investimentos e Financiamentos S.A.",
            "description": "Banco Bari de Investimentos e Financiamentos S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 20,
            "cd": "250",
            "name": "250 - Banco Bcv",
            "description": "Banco Bcv",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 21,
            "cd": "318",
            "name": "318 - Banco BMG S.A.",
            "description": "Banco BMG S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 22,
            "cd": "752",
            "name": "752 - Banco BNP Paribas Brasil S.A.",
            "description": "Banco BNP Paribas Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 23,
            "cd": "107",
            "name": "107 - Banco Bocom BBM S.A.",
            "description": "Banco Bocom BBM S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 24,
            "cd": "063",
            "name": "063 - Banco Bradescard",
            "description": "Banco Bradescard",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 25,
            "cd": "036",
            "name": "036 - Banco Bradesco BBI S.A.",
            "description": "Banco Bradesco BBI S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 26,
            "cd": "122",
            "name": "122 - Banco Bradesco BERJ S.A.",
            "description": "Banco Bradesco BERJ S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 27,
            "cd": "204",
            "name": "204 - Banco Bradesco Cartoes S.A.",
            "description": "Banco Bradesco Cartoes S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 28,
            "cd": "394",
            "name": "394 - Banco Bradesco Financiamentos S.A.",
            "description": "Banco Bradesco Financiamentos S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 29,
            "cd": "218",
            "name": "218 - Banco Bs2 S.A.",
            "description": "Banco Bs2 S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 30,
            "cd": "208",
            "name": "208 - Banco BTG Pactual S.A.",
            "description": "Banco BTG Pactual S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 31,
            "cd": "626",
            "name": "626 - BANCO C6 CONSIGNADO S.A.",
            "description": "BANCO C6 CONSIGNADO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 32,
            "cd": "336",
            "name": "336 - Banco C6 S.A – C6 Bank",
            "description": "Banco C6 S.A – C6 Bank",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 33,
            "cd": "473",
            "name": "473 - Banco Caixa Geral Brasil S.A.",
            "description": "Banco Caixa Geral Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 34,
            "cd": "412",
            "name": "412 - Banco Capital S.A.",
            "description": "Banco Capital S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 35,
            "cd": "040",
            "name": "040 - Banco Cargill S.A.",
            "description": "Banco Cargill S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 36,
            "cd": "266",
            "name": "266 - Banco Cedula S.A.",
            "description": "Banco Cedula S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 37,
            "cd": "739",
            "name": "739 - Banco Cetelem S.A.",
            "description": "Banco Cetelem S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 38,
            "cd": "233",
            "name": "233 - Banco Cifra S.A.",
            "description": "Banco Cifra S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 39,
            "cd": "745",
            "name": "745 - Banco Citibank S.A.",
            "description": "Banco Citibank S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 40,
            "cd": "241",
            "name": "241 - Banco Classico S.A.",
            "description": "Banco Classico S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 41,
            "cd": "095",
            "name": "095 - Banco Confidence De Câmbio S.A.",
            "description": "Banco Confidence De Câmbio S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 42,
            "cd": "748",
            "name": "748 - Banco Cooperativa Sicredi S.A.",
            "description": "Banco Cooperativa Sicredi S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 43,
            "cd": "222",
            "name": "222 - Banco Crédit Agricole Br S.A.",
            "description": "Banco Crédit Agricole Br S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 44,
            "cd": "505",
            "name": "505 - Banco Credit Suisse (Brl) S.A.",
            "description": "Banco Credit Suisse (Brl) S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 45,
            "cd": "069",
            "name": "069 - Banco Crefisa S.A.",
            "description": "Banco Crefisa S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 46,
            "cd": "368",
            "name": "368 - Banco CSF S.A.",
            "description": "Banco CSF S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 47,
            "cd": "003",
            "name": "003 - Banco Da Amazônia S.A.",
            "description": "Banco Da Amazônia S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 48,
            "cd": "083",
            "name": "083 - Banco Da China Brasil S.A.",
            "description": "Banco Da China Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 49,
            "cd": "707",
            "name": "707 - Banco Daycoval S.A.",
            "description": "Banco Daycoval S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 50,
            "cd": "654",
            "name": "654 - BANCO DIGIMAIS S.A.",
            "description": "BANCO DIGIMAIS S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 51,
            "cd": "335",
            "name": "335 - Banco Digio S.A.",
            "description": "Banco Digio S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 52,
            "cd": "001",
            "name": "001 - Banco Do Brasil S.A (BB)",
            "description": "Banco Do Brasil S.A (BB)",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 53,
            "cd": "47",
            "name": "47 - Banco do Estado de Sergipe S.A.",
            "description": "Banco do Estado de Sergipe S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 54,
            "cd": "37",
            "name": "37 - Banco Do Estado Do Pará S.A.",
            "description": "Banco Do Estado Do Pará S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 55,
            "cd": "004",
            "name": "004 - Banco Do Nordeste Do Brasil S.A.",
            "description": "Banco Do Nordeste Do Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 56,
            "cd": "196",
            "name": "196 - Banco Fair Cc S.A.",
            "description": "Banco Fair Cc S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 57,
            "cd": "265",
            "name": "265 - Banco Fator S.A.",
            "description": "Banco Fator S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 58,
            "cd": "224",
            "name": "224 - Banco Fibra S.A.",
            "description": "Banco Fibra S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 59,
            "cd": "626",
            "name": "626 - Banco Ficsa S.A.",
            "description": "Banco Ficsa S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 60,
            "cd": "094",
            "name": "094 - Banco Finaxis",
            "description": "Banco Finaxis",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 61,
            "cd": "390",
            "name": "390 - BANCO GM S.A.",
            "description": "BANCO GM S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 62,
            "cd": "612",
            "name": "612 - Banco Guanabara S.A.",
            "description": "Banco Guanabara S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 63,
            "cd": "012",
            "name": "012 - Banco Inbursa",
            "description": "Banco Inbursa",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 64,
            "cd": "604",
            "name": "604 - Banco Industrial Do Brasil S.A.",
            "description": "Banco Industrial Do Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 65,
            "cd": "653",
            "name": "653 - Banco Indusval S.A.",
            "description": "Banco Indusval S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 66,
            "cd": "077",
            "name": "077 - Banco Inter S.A.",
            "description": "Banco Inter S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 67,
            "cd": "630",
            "name": "630 - Banco Intercap S.A.",
            "description": "Banco Intercap S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 68,
            "cd": "249",
            "name": "249 - Banco Investcred Unibanco S.A.",
            "description": "Banco Investcred Unibanco S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 69,
            "cd": "184",
            "name": "184 - Banco Itaú BBA S.A.",
            "description": "Banco Itaú BBA S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 70,
            "cd": "029",
            "name": "029 - Banco Itaú Consignado S.A.",
            "description": "Banco Itaú Consignado S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 71,
            "cd": "479",
            "name": "479 - Banco ItauBank S.A.",
            "description": "Banco ItauBank S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 72,
            "cd": "074",
            "name": "074 - Banco J. Safra S.A.",
            "description": "Banco J. Safra S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 73,
            "cd": "376",
            "name": "376 - Banco J.P. Morgan S.A.",
            "description": "Banco J.P. Morgan S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 74,
            "cd": "217",
            "name": "217 - Banco John Deere S.A.",
            "description": "Banco John Deere S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 75,
            "cd": "076",
            "name": "076 - Banco KDB Brasil S.A.",
            "description": "Banco KDB Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 76,
            "cd": "757",
            "name": "757 - Banco Keb Hana Do Brasil S.A.",
            "description": "Banco Keb Hana Do Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 77,
            "cd": "300",
            "name": "300 - Banco La Nacion Argentina",
            "description": "Banco La Nacion Argentina",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 78,
            "cd": "600",
            "name": "600 - Banco Luso Brasileiro S.A.",
            "description": "Banco Luso Brasileiro S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 79,
            "cd": "243",
            "name": "243 - Banco Máxima S.A.",
            "description": "Banco Máxima S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 80,
            "cd": "389",
            "name": "389 - Banco Mercantil Do Brasil S.A.",
            "description": "Banco Mercantil Do Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 81,
            "cd": "389",
            "name": "389 - Banco Mercantil Do Brasil S.A.",
            "description": "Banco Mercantil Do Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 82,
            "cd": "381",
            "name": "381 - BANCO MERCEDES-BENZ DO BRASIL S.A.",
            "description": "BANCO MERCEDES-BENZ DO BRASIL S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 83,
            "cd": "370",
            "name": "370 - Banco Mizuho S.A.",
            "description": "Banco Mizuho S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 84,
            "cd": "746",
            "name": "746 - Banco Modal S.A.",
            "description": "Banco Modal S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 85,
            "cd": "066",
            "name": "066 - Banco Morgan Stanley S.A.",
            "description": "Banco Morgan Stanley S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 86,
            "cd": "456",
            "name": "456 - Banco MUFG Brasil S.A.",
            "description": "Banco MUFG Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 87,
            "cd": "169",
            "name": "169 - Banco Olé Bonsucesso Consignado S.A.",
            "description": "Banco Olé Bonsucesso Consignado S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 88,
            "cd": "111",
            "name": "111 - Banco Oliveira Trust Dtvm S.A.",
            "description": "Banco Oliveira Trust Dtvm S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 89,
            "cd": "079",
            "name": "079 - Banco Original Do Agronegócio S.A.",
            "description": "Banco Original Do Agronegócio S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 90,
            "cd": "212",
            "name": "212 - Banco Original S.A.",
            "description": "Banco Original S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 91,
            "cd": "712",
            "name": "712 - Banco Ourinvest S.A.",
            "description": "Banco Ourinvest S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 92,
            "cd": "623",
            "name": "623 - Banco Pan S.A.",
            "description": "Banco Pan S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 93,
            "cd": "611",
            "name": "611 - Banco Paulista",
            "description": "Banco Paulista",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 94,
            "cd": "643",
            "name": "643 - Banco Pine S.A.",
            "description": "Banco Pine S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 95,
            "cd": "747",
            "name": "747 - Banco Rabobank Internacional Do Brasil S.A.",
            "description": "Banco Rabobank Internacional Do Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 96,
            "cd": "88",
            "name": "88 - BANCO RANDON S.A.",
            "description": "BANCO RANDON S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 97,
            "cd": "633",
            "name": "633 - Banco Rendimento S.A.",
            "description": "Banco Rendimento S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 98,
            "cd": "494",
            "name": "494 - Banco Rep Oriental Uruguay",
            "description": "Banco Rep Oriental Uruguay",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 99,
            "cd": "741",
            "name": "741 - Banco Ribeirão Preto S.A.",
            "description": "Banco Ribeirão Preto S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 100,
            "cd": "120",
            "name": "120 - Banco Rodobens S.A.",
            "description": "Banco Rodobens S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 101,
            "cd": "422",
            "name": "422 - Banco Safra S.A.",
            "description": "Banco Safra S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 102,
            "cd": "033",
            "name": "033 - Banco Santander Brasil S.A.",
            "description": "Banco Santander Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 103,
            "cd": "081",
            "name": "081 - Banco Seguro S.A.",
            "description": "Banco Seguro S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 104,
            "cd": "743",
            "name": "743 - Banco Semear S.A.",
            "description": "Banco Semear S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 105,
            "cd": "754",
            "name": "754 - Banco Sistema S.A.",
            "description": "Banco Sistema S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 106,
            "cd": "630",
            "name": "630 - Banco Smartbank S.A.",
            "description": "Banco Smartbank S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 107,
            "cd": "366",
            "name": "366 - Banco Societe Generale Brasil",
            "description": "Banco Societe Generale Brasil",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 108,
            "cd": "637",
            "name": "637 - Banco Sofisa S.A (Sofisa Direto)",
            "description": "Banco Sofisa S.A (Sofisa Direto)",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 109,
            "cd": "464",
            "name": "464 - Banco Sumitomo Mitsui Brasil S.A.",
            "description": "Banco Sumitomo Mitsui Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 110,
            "cd": "082",
            "name": "082 - Banco Topázio S.A.",
            "description": "Banco Topázio S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 111,
            "cd": "387",
            "name": "387 - Banco Toyota do Brasil S.A.",
            "description": "Banco Toyota do Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 112,
            "cd": "634",
            "name": "634 - Banco Triangulo S.A (Banco Triângulo)",
            "description": "Banco Triangulo S.A (Banco Triângulo)",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 113,
            "cd": "018",
            "name": "018 - Banco Tricury S.A.",
            "description": "Banco Tricury S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 114,
            "cd": "393",
            "name": "393 - Banco Volkswagen S.A.",
            "description": "Banco Volkswagen S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 115,
            "cd": "655",
            "name": "655 - Banco Votorantim S.A.",
            "description": "Banco Votorantim S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 116,
            "cd": "610",
            "name": "610 - Banco VR S.A.",
            "description": "Banco VR S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 117,
            "cd": "119",
            "name": "119 - Banco Western Union do Brasil S.A.",
            "description": "Banco Western Union do Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 118,
            "cd": "124",
            "name": "124 - Banco Woori Bank Do Brasil S.A.",
            "description": "Banco Woori Bank Do Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 119,
            "cd": "348",
            "name": "348 - Banco XP S/A",
            "description": "Banco XP S/A",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 120,
            "cd": "756",
            "name": "756 - Bancoob – Banco Cooperativo Do Brasil S.A.",
            "description": "Bancoob – Banco Cooperativo Do Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 121,
            "cd": "755",
            "name": "755 - Bank of America Merrill Lynch Banco Múltiplo S.A.",
            "description": "Bank of America Merrill Lynch Banco Múltiplo S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 122,
            "cd": "041",
            "name": "041 - Banrisul – Banco Do Estado Do Rio Grande Do Sul S.A.",
            "description": "Banrisul – Banco Do Estado Do Rio Grande Do Sul S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 123,
            "cd": "268",
            "name": "268 - Barigui Companhia Hipotecária",
            "description": "Barigui Companhia Hipotecária",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 124,
            "cd": "378",
            "name": "378 - BBC LEASING S.A. – Arrendamento Mercantil",
            "description": "BBC LEASING S.A. – Arrendamento Mercantil",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 125,
            "cd": "081",
            "name": "081 - Bbn Banco Brasileiro De Negocios S.A.",
            "description": "Bbn Banco Brasileiro De Negocios S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 126,
            "cd": "075",
            "name": "075 - Bco Abn Amro S.A.",
            "description": "Bco Abn Amro S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 127,
            "cd": "213",
            "name": "213 - Bco Arbi S.A.",
            "description": "Bco Arbi S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 128,
            "cd": "144",
            "name": "144 - Bexs Banco De Cambio S.A.",
            "description": "Bexs Banco De Cambio S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 129,
            "cd": "253",
            "name": "253 - Bexs Cc S.A.",
            "description": "Bexs Cc S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 130,
            "cd": "134",
            "name": "134 - BGC Liquidez Dtvm Ltda",
            "description": "BGC Liquidez Dtvm Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 131,
            "cd": "007",
            "name": "007 - BNDES (Banco Nacional Do Desenvolvimento Social)",
            "description": "BNDES (Banco Nacional Do Desenvolvimento Social)",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 132,
            "cd": "017",
            "name": "017 - Bny Mellon Banco S.A.",
            "description": "Bny Mellon Banco S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 133,
            "cd": "755",
            "name": "755 - Bofa Merrill Lynch Bm S.A.",
            "description": "Bofa Merrill Lynch Bm S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 134,
            "cd": "383",
            "name": "383 - BOLETOBANCÁRIO.COM TECNOLOGIA DE PAGAMENTOS LTDA.",
            "description": "BOLETOBANCÁRIO.COM TECNOLOGIA DE PAGAMENTOS LTDA.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 135,
            "cd": "408",
            "name": "408 - BÔNUSCRED SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "description": "BÔNUSCRED SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 136,
            "cd": "301",
            "name": "301 - BPP Instituição De Pagamentos S.A.",
            "description": "BPP Instituição De Pagamentos S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 137,
            "cd": "126",
            "name": "126 - BR Partners Banco de Investimento S.A.",
            "description": "BR Partners Banco de Investimento S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 138,
            "cd": "237",
            "name": "237 - Bradesco S.A.",
            "description": "Bradesco S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 139,
            "cd": "125",
            "name": "125 - Brasil Plural S.A Banco",
            "description": "Brasil Plural S.A Banco",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 140,
            "cd": "070",
            "name": "070 - BRB – Banco De Brasília S.A.",
            "description": "BRB – Banco De Brasília S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 141,
            "cd": "092",
            "name": "092 - BRK S.A.",
            "description": "BRK S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 142,
            "cd": "173",
            "name": "173 - BRL Trust Dtvm Sa",
            "description": "BRL Trust Dtvm Sa",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 143,
            "cd": "142",
            "name": "142 - Broker Brasil Cc Ltda",
            "description": "Broker Brasil Cc Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 144,
            "cd": "292",
            "name": "292 - BS2 Distribuidora De Títulos E Investimentos",
            "description": "BS2 Distribuidora De Títulos E Investimentos",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 145,
            "cd": "011",
            "name": "011 - C.Suisse Hedging-Griffo Cv S.A (Credit Suisse)",
            "description": "C.Suisse Hedging-Griffo Cv S.A (Credit Suisse)",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 146,
            "cd": "104",
            "name": "104 - Caixa Econômica Federal (CEF)",
            "description": "Caixa Econômica Federal (CEF)",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 147,
            "cd": "309",
            "name": "309 - CAMBIONET CORRETORA DE CÂMBIO LTDA.",
            "description": "CAMBIONET CORRETORA DE CÂMBIO LTDA.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 148,
            "cd": "288",
            "name": "288 - Carol Dtvm Ltda",
            "description": "Carol Dtvm Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 149,
            "cd": "324",
            "name": "324 - CARTOS SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "description": "CARTOS SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 150,
            "cd": "130",
            "name": "130 - Caruana Scfi",
            "description": "Caruana Scfi",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 151,
            "cd": "159",
            "name": "159 - Casa do Crédito S.A.",
            "description": "Casa do Crédito S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 152,
            "cd": "097",
            "name": "097 - Ccc Noroeste Brasileiro Ltda",
            "description": "Ccc Noroeste Brasileiro Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 153,
            "cd": "016",
            "name": "016 - Ccm Desp Trâns Sc E Rs",
            "description": "Ccm Desp Trâns Sc E Rs",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 154,
            "cd": "279",
            "name": "279 - Ccr De Primavera Do Leste",
            "description": "Ccr De Primavera Do Leste",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 155,
            "cd": "273",
            "name": "273 - Ccr De São Miguel Do Oeste",
            "description": "Ccr De São Miguel Do Oeste",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 156,
            "cd": "089",
            "name": "089 - Ccr Reg Mogiana",
            "description": "Ccr Reg Mogiana",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 157,
            "cd": "114",
            "name": "114 - Central Cooperativa De Crédito no Estado do Espírito Santo",
            "description": "Central Cooperativa De Crédito no Estado do Espírito Santo",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 158,
            "cd": "091",
            "name": "091 - Central De Cooperativas De Economia E Crédito Mútuo Do Estado Do Rio Grande Do S",
            "description": "Central De Cooperativas De Economia E Crédito Mútuo Do Estado Do Rio Grande Do S",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 159,
            "cd": "320",
            "name": "320 - China Construction Bank – Ccb Brasil S.A.",
            "description": "China Construction Bank – Ccb Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 160,
            "cd": "362",
            "name": "362 - CIELO S.A.",
            "description": "CIELO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 161,
            "cd": "477",
            "name": "477 - Citibank N.A.",
            "description": "Citibank N.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 162,
            "cd": "180",
            "name": "180 - Cm Capital Markets Cctvm Ltda",
            "description": "Cm Capital Markets Cctvm Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 163,
            "cd": "127",
            "name": "127 - Codepe Cvc S.A.",
            "description": "Codepe Cvc S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 164,
            "cd": "163",
            "name": "163 - Commerzbank Brasil S.A Banco Múltiplo",
            "description": "Commerzbank Brasil S.A Banco Múltiplo",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 165,
            "cd": "060",
            "name": "060 - Confidence Cc S.A.",
            "description": "Confidence Cc S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 166,
            "cd": "085",
            "name": "085 - Cooperativa Central de Créditos – Ailos",
            "description": "Cooperativa Central de Créditos – Ailos",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 167,
            "cd": "016",
            "name": "016 - COOPERATIVA DE CRÉDITO MÚTUO DOS DESPACHANTES DE TRÂNSITO DE SANTA CATARINA E RI",
            "description": "COOPERATIVA DE CRÉDITO MÚTUO DOS DESPACHANTES DE TRÂNSITO DE SANTA CATARINA E RI",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 168,
            "cd": "281",
            "name": "281 - Cooperativa de Crédito Rural Coopavel",
            "description": "Cooperativa de Crédito Rural Coopavel",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 169,
            "cd": "322",
            "name": "322 - Cooperativa de Crédito Rural de Abelardo Luz – Sulcredi/Crediluz",
            "description": "Cooperativa de Crédito Rural de Abelardo Luz – Sulcredi/Crediluz",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 170,
            "cd": "286",
            "name": "286 - Cooperativa de Crédito Rural de De Ouro",
            "description": "Cooperativa de Crédito Rural de De Ouro",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 171,
            "cd": "391",
            "name": "391 - COOPERATIVA DE CRÉDITO RURAL DE IBIAM – SULCREDI/IBIAM",
            "description": "COOPERATIVA DE CRÉDITO RURAL DE IBIAM – SULCREDI/IBIAM",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 172,
            "cd": "350",
            "name": "350 - Cooperativa De Crédito Rural De Pequenos Agricultores E Da Reforma Agrária Do Ce",
            "description": "Cooperativa De Crédito Rural De Pequenos Agricultores E Da Reforma Agrária Do Ce",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 173,
            "cd": "379",
            "name": "379 - COOPERFORTE – Cooperativa De Economia E Crédito Mútuo Dos Funcionários De Instit",
            "description": "COOPERFORTE – Cooperativa De Economia E Crédito Mútuo Dos Funcionários De Instit",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 174,
            "cd": "403",
            "name": "403 - CORA SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "description": "CORA SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 175,
            "cd": "098",
            "name": "098 - Credialiança Ccr",
            "description": "Credialiança Ccr",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 176,
            "cd": "010",
            "name": "010 - CREDICOAMO CRÉDITO RURAL COOPERATIVA",
            "description": "CREDICOAMO CRÉDITO RURAL COOPERATIVA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 177,
            "cd": "089",
            "name": "089 - CREDISAN COOPERATIVA DE CRÉDITO",
            "description": "CREDISAN COOPERATIVA DE CRÉDITO",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 178,
            "cd": "097",
            "name": "097 - Credisis – Central de Cooperativas de Crédito Ltda.",
            "description": "Credisis – Central de Cooperativas de Crédito Ltda.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 179,
            "cd": "342",
            "name": "342 - Creditas Sociedade de Crédito Direto S.A.",
            "description": "Creditas Sociedade de Crédito Direto S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 180,
            "cd": "321",
            "name": "321 - CREFAZ SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LT",
            "description": "CREFAZ SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LT",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 181,
            "cd": "133",
            "name": "133 - Cresol Confederação",
            "description": "Cresol Confederação",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 182,
            "cd": "182",
            "name": "182 - Dacasa Financeira S/A",
            "description": "Dacasa Financeira S/A",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 183,
            "cd": "289",
            "name": "289 - DECYSEO CORRETORA DE CAMBIO LTDA.",
            "description": "DECYSEO CORRETORA DE CAMBIO LTDA.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 184,
            "cd": "487",
            "name": "487 - Deutsche Bank S.A (Banco Alemão)",
            "description": "Deutsche Bank S.A (Banco Alemão)",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 185,
            "cd": "140",
            "name": "140 - Easynvest – Título Cv S.A.",
            "description": "Easynvest – Título Cv S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 186,
            "cd": "149",
            "name": "149 - Facta S.A. Cfi",
            "description": "Facta S.A. Cfi",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 187,
            "cd": "343",
            "name": "343 - FFA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA.",
            "description": "FFA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 188,
            "cd": "382",
            "name": "382 - FIDÚCIA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE L",
            "description": "FIDÚCIA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE L",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 189,
            "cd": "331",
            "name": "331 - Fram Capital Distribuidora de Títulos e Valores Mobiliários S.A.",
            "description": "Fram Capital Distribuidora de Títulos e Valores Mobiliários S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 190,
            "cd": "285",
            "name": "285 - Frente Cc Ltda",
            "description": "Frente Cc Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 191,
            "cd": "278",
            "name": "278 - Genial Investimentos Cvm S.A.",
            "description": "Genial Investimentos Cvm S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 192,
            "cd": "364",
            "name": "364 - GERENCIANET S.A.",
            "description": "GERENCIANET S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 193,
            "cd": "138",
            "name": "138 - Get Money Cc Ltda",
            "description": "Get Money Cc Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 194,
            "cd": "384",
            "name": "384 - GLOBAL FINANÇAS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO",
            "description": "GLOBAL FINANÇAS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 195,
            "cd": "064",
            "name": "064 - Goldman Sachs Do Brasil Bm S.A.",
            "description": "Goldman Sachs Do Brasil Bm S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 196,
            "cd": "177",
            "name": "177 - Guide Investimentos S.A. Corretora de Valores",
            "description": "Guide Investimentos S.A. Corretora de Valores",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 197,
            "cd": "146",
            "name": "146 - Guitta Cc Ltda",
            "description": "Guitta Cc Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 198,
            "cd": "078",
            "name": "078 - Haitong Bi Do Brasil S.A.",
            "description": "Haitong Bi Do Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 199,
            "cd": "062",
            "name": "062 - Hipercard Banco Múltiplo S.A.",
            "description": "Hipercard Banco Múltiplo S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 200,
            "cd": "189",
            "name": "189 - Hs Financeira",
            "description": "Hs Financeira",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 201,
            "cd": "269",
            "name": "269 - Hsbc Banco De Investimento",
            "description": "Hsbc Banco De Investimento",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 202,
            "cd": "396",
            "name": "396 - HUB PAGAMENTOS S.A.",
            "description": "HUB PAGAMENTOS S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 203,
            "cd": "271",
            "name": "271 - Ib Cctvm Ltda",
            "description": "Ib Cctvm Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 204,
            "cd": "157",
            "name": "157 - Icap Do Brasil Ctvm Ltda",
            "description": "Icap Do Brasil Ctvm Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 205,
            "cd": "132",
            "name": "132 - ICBC do Brasil Bm S.A.",
            "description": "ICBC do Brasil Bm S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 206,
            "cd": "492",
            "name": "492 - Ing Bank N.V.",
            "description": "Ing Bank N.V.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 207,
            "cd": "139",
            "name": "139 - Intesa Sanpaolo Brasil S.A.",
            "description": "Intesa Sanpaolo Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 208,
            "cd": "652",
            "name": "652 - Itaú Unibanco Holding Bm S.A.",
            "description": "Itaú Unibanco Holding Bm S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 209,
            "cd": "341",
            "name": "341 - Itaú Unibanco S.A.",
            "description": "Itaú Unibanco S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 210,
            "cd": "488",
            "name": "488 - Jpmorgan Chase Bank",
            "description": "Jpmorgan Chase Bank",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 211,
            "cd": "399",
            "name": "399 - Kirton Bank S.A. – Banco Múltiplo",
            "description": "Kirton Bank S.A. – Banco Múltiplo",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 212,
            "cd": "495",
            "name": "495 - La Provincia Buenos Aires Banco",
            "description": "La Provincia Buenos Aires Banco",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 213,
            "cd": "293",
            "name": "293 - Lastro Rdv Dtvm Ltda",
            "description": "Lastro Rdv Dtvm Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 214,
            "cd": "105",
            "name": "105 - Lecca Cfi S.A.",
            "description": "Lecca Cfi S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 215,
            "cd": "145",
            "name": "145 - Levycam Ccv Ltda",
            "description": "Levycam Ccv Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 216,
            "cd": "397",
            "name": "397 - LISTO SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "description": "LISTO SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 217,
            "cd": "113",
            "name": "113 - Magliano S.A.",
            "description": "Magliano S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 218,
            "cd": "323",
            "name": "323 - Mercado Pago – Conta Do Mercado Livre",
            "description": "Mercado Pago – Conta Do Mercado Livre",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 219,
            "cd": "274",
            "name": "274 - MONEY PLUS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORT",
            "description": "MONEY PLUS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORT",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 220,
            "cd": "259",
            "name": "259 - MONEYCORP BANCO DE CÂMBIO S.A.",
            "description": "MONEYCORP BANCO DE CÂMBIO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 221,
            "cd": "128",
            "name": "128 - Ms Bank S.A Banco De Câmbio",
            "description": "Ms Bank S.A Banco De Câmbio",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 222,
            "cd": "377",
            "name": "377 - MS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA",
            "description": "MS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 223,
            "cd": "137",
            "name": "137 - Multimoney Cc Ltda",
            "description": "Multimoney Cc Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 224,
            "cd": "014",
            "name": "014 - Natixis Brasil S.A.",
            "description": "Natixis Brasil S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 225,
            "cd": "354",
            "name": "354 - NECTON INVESTIMENTOS S.A. CORRETORA DE VALORES MOBILIÁRIOS E COMMODITIES",
            "description": "NECTON INVESTIMENTOS S.A. CORRETORA DE VALORES MOBILIÁRIOS E COMMODITIES",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 226,
            "cd": "655",
            "name": "655 - Neon Pagamentos S.A (Memso Código Do Banco Votorantim)",
            "description": "Neon Pagamentos S.A (Memso Código Do Banco Votorantim)",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 227,
            "cd": "191",
            "name": "191 - Nova Futura Ctvm Ltda",
            "description": "Nova Futura Ctvm Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 228,
            "cd": "753",
            "name": "753 - Novo Banco Continental S.A Bm",
            "description": "Novo Banco Continental S.A Bm",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 229,
            "cd": "260",
            "name": "260 - Nu Pagamentos S.A (Nubank)",
            "description": "Nu Pagamentos S.A (Nubank)",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 230,
            "cd": "319",
            "name": "319 - OM DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA",
            "description": "OM DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 231,
            "cd": "613",
            "name": "613 - Omni Banco S.A.",
            "description": "Omni Banco S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 232,
            "cd": "325",
            "name": "325 - Órama Distribuidora de Títulos e Valores Mobiliários S.A.",
            "description": "Órama Distribuidora de Títulos e Valores Mobiliários S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 233,
            "cd": "355",
            "name": "355 - ÓTIMO SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "description": "ÓTIMO SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 234,
            "cd": "290",
            "name": "290 - PagSeguro Internet S.A.",
            "description": "PagSeguro Internet S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 235,
            "cd": "254",
            "name": "254 - Paraná Banco S.A.",
            "description": "Paraná Banco S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 236,
            "cd": "326",
            "name": "326 - PARATI – CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.",
            "description": "PARATI – CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 237,
            "cd": "194",
            "name": "194 - Parmetal Dtvm Ltda",
            "description": "Parmetal Dtvm Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 238,
            "cd": "174",
            "name": "174 - PEFISA S.A. – CRÉDITO, FINANCIAMENTO E INVESTIMENTO",
            "description": "PEFISA S.A. – CRÉDITO, FINANCIAMENTO E INVESTIMENTO",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 239,
            "cd": "174",
            "name": "174 - Pernambucanas Financ S.A.",
            "description": "Pernambucanas Financ S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 240,
            "cd": "315",
            "name": "315 - PI Distribuidora de Títulos e Valores Mobiliários S.A.",
            "description": "PI Distribuidora de Títulos e Valores Mobiliários S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 241,
            "cd": "380",
            "name": "380 - PICPAY SERVICOS S.A.",
            "description": "PICPAY SERVICOS S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 242,
            "cd": "100",
            "name": "100 - Planner Corretora De Valores S.A.",
            "description": "Planner Corretora De Valores S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 243,
            "cd": "093",
            "name": "093 - PóloCred Scmepp Ltda",
            "description": "PóloCred Scmepp Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 244,
            "cd": "108",
            "name": "108 - Portocred S.A.",
            "description": "Portocred S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 245,
            "cd": "306",
            "name": "306 - PORTOPAR DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.",
            "description": "PORTOPAR DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 246,
            "cd": "329",
            "name": "329 - QI Sociedade de Crédito Direto S.A.",
            "description": "QI Sociedade de Crédito Direto S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 247,
            "cd": "283",
            "name": "283 - RB Capital Investimentos Dtvm Ltda",
            "description": "RB Capital Investimentos Dtvm Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 248,
            "cd": "374",
            "name": "374 - REALIZE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.",
            "description": "REALIZE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 249,
            "cd": "101",
            "name": "101 - Renascença Dtvm Ltda",
            "description": "Renascença Dtvm Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 250,
            "cd": "270",
            "name": "270 - Sagitur Cc Ltda",
            "description": "Sagitur Cc Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 251,
            "cd": "751",
            "name": "751 - Scotiabank Brasil",
            "description": "Scotiabank Brasil",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 252,
            "cd": "276",
            "name": "276 - Senff S.A.",
            "description": "Senff S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 253,
            "cd": "545",
            "name": "545 - Senso Ccvm S.A.",
            "description": "Senso Ccvm S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 254,
            "cd": "190",
            "name": "190 - Servicoop",
            "description": "Servicoop",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 255,
            "cd": "363",
            "name": "363 - SOCOPA SOCIEDADE CORRETORA PAULISTA S.A.",
            "description": "SOCOPA SOCIEDADE CORRETORA PAULISTA S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 256,
            "cd": "183",
            "name": "183 - Socred S.A.",
            "description": "Socred S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 257,
            "cd": "365",
            "name": "365 - SOLIDUS S.A. CORRETORA DE CAMBIO E VALORES MOBILIARIOS",
            "description": "SOLIDUS S.A. CORRETORA DE CAMBIO E VALORES MOBILIARIOS",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 258,
            "cd": "299",
            "name": "299 - SOROCRED CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.",
            "description": "SOROCRED CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 259,
            "cd": "118",
            "name": "118 - Standard Chartered Bi S.A.",
            "description": "Standard Chartered Bi S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 260,
            "cd": "014",
            "name": "014 - STATE STREET BRASIL S.A. – BANCO COMERCIAL",
            "description": "STATE STREET BRASIL S.A. – BANCO COMERCIAL",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 261,
            "cd": "197",
            "name": "197 - Stone Pagamentos S.A.",
            "description": "Stone Pagamentos S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 262,
            "cd": "404",
            "name": "404 - SUMUP SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "description": "SUMUP SOCIEDADE DE CRÉDITO DIRETO S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 263,
            "cd": "340",
            "name": "340 - Super Pagamentos S/A (Superdital)",
            "description": "Super Pagamentos S/A (Superdital)",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 264,
            "cd": "307",
            "name": "307 - Terra Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.",
            "description": "Terra Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 265,
            "cd": "352",
            "name": "352 - TORO CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA",
            "description": "TORO CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 266,
            "cd": "095",
            "name": "095 - Travelex Banco de Câmbio S.A.",
            "description": "Travelex Banco de Câmbio S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 267,
            "cd": "143",
            "name": "143 - Treviso Cc S.A.",
            "description": "Treviso Cc S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 268,
            "cd": "360",
            "name": "360 - TRINUS Capital Distribuidora De Títulos E Valores Mobiliários S.A.",
            "description": "TRINUS Capital Distribuidora De Títulos E Valores Mobiliários S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 269,
            "cd": "131",
            "name": "131 - Tullett Prebon Brasil Cvc Ltda",
            "description": "Tullett Prebon Brasil Cvc Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 270,
            "cd": "129",
            "name": "129 - UBS Brasil Bi S.A.",
            "description": "UBS Brasil Bi S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 271,
            "cd": "15",
            "name": "15 - UBS Brasil Cctvm S.A.",
            "description": "UBS Brasil Cctvm S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 272,
            "cd": "091",
            "name": "091 - Unicred Central Rs",
            "description": "Unicred Central Rs",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 273,
            "cd": "136",
            "name": "136 - Unicred Cooperativa LTDA",
            "description": "Unicred Cooperativa LTDA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 274,
            "cd": "099",
            "name": "099 - Uniprime Central Ccc Ltda",
            "description": "Uniprime Central Ccc Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 275,
            "cd": "084",
            "name": "084 - UNIPRIME NORTE DO PARANÁ – COOPERATIVA DE CRÉDITO LTDA",
            "description": "UNIPRIME NORTE DO PARANÁ – COOPERATIVA DE CRÉDITO LTDA",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 276,
            "cd": "373",
            "name": "373 - UP.P SOCIEDADE DE EMPRÉSTIMO ENTRE PESSOAS S.A.",
            "description": "UP.P SOCIEDADE DE EMPRÉSTIMO ENTRE PESSOAS S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 277,
            "cd": "298",
            "name": "298 - Vip’s Cc Ltda",
            "description": "Vip’s Cc Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 278,
            "cd": "296",
            "name": "296 - VISION S.A. CORRETORA DE CAMBIO",
            "description": "VISION S.A. CORRETORA DE CAMBIO",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 279,
            "cd": "367",
            "name": "367 - VITREO DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.",
            "description": "VITREO DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 280,
            "cd": "310",
            "name": "310 - VORTX Dtvm Ltda",
            "description": "VORTX Dtvm Ltda",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 281,
            "cd": "371",
            "name": "371 - WARREN CORRETORA DE VALORES MOBILIÁRIOS E CÂMBIO LTDA.",
            "description": "WARREN CORRETORA DE VALORES MOBILIÁRIOS E CÂMBIO LTDA.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 282,
            "cd": "102",
            "name": "102 - XP Investimentos S.A.",
            "description": "XP Investimentos S.A.",
            "is_active": 1,
            "createdAt": new Date(),
            "updatedAt": new Date()
          },
          {
            "id": 283,
            "cd": "359",
            "name": "359 - ZEMA CRÉDITO, FINANCIAMENTO E INVESTIMENTO S/A",
            "description": "ZEMA CRÉDITO, FINANCIAMENTO E INVESTIMENTO S/A",
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
    await queryInterface.bulkDelete('banks', null, { truncate: true });
  }
};
