import { Sequelize } from "sequelize";
import { SORTING } from "../../config/constants";
const Op = Sequelize.Op;
export default class Quote {
  async init(db) {
    this.Models = db.models;
    this.sql = db.sqlClient
  };
  /* get currency exchange rate */
  // getCurrencyExchangeRate = async (query) => {
  //   return await this.Models.CurrencyExchangeRates.findOne({ where: query, attributes: ['id', 'rate'], })
  // };
  /* end */

  /* get cities */
  getCities = async (query) => {
    return await this.Models.Cities.findAll({ where: query, attributes: ['id', 'name', 'state_id'], order: [['name', 'ASC']] })
  };
  /* end */

  /* get countries */
  getCountries = async (query) => {
    return await this.Models.Countries.findAll({ where: query, attributes: ['id', 'name'], order: [['name', 'ASC']] })
  };
  /* end */

  /* get claim currencies */
  getClaimCurrencies = async (query) => {
    return await this.Models.ClaimCurrencies.findAll({ where: query, attributes: ['id', 'name'] })
  };
  /* end */

  /* get deductibles */
  getDeductibles = async (query) => {
    return await this.Models.ImportExportCalculations.findAll({ where: query, attributes: ['id', 'coverage_id', 'deductible'] })
  };
  /* end */

  /* get deductible */
  // getDeductible = async (query) => {
  //   return await this.Models.Deductibles.findOne({ where: query, attributes: ['discount'] })
  // };
  /* end */

  /* get line of businesses */
  getLineOfBusinesses = async (query) => {
    return await this.Models.LinesOfBusinesses.findAll({ where: query, attributes: ['id', 'name', 'is_active'] })
  };
  /* end */

  /* get insurance segments */
  getInsuranceSegments = async (query) => {
    return await this.Models.InsuranceSegments.findAll({ where: query, attributes: ['id', 'name', 'line_of_business_id', 'is_active'] })
  };
  /* end */

  /* get insurance types */
  getInsuranceTypes = async (query) => {
    return await this.Models.InsuranceTypes.findAll({ where: query, attributes: ['id', 'name', 'description', 'is_active'] })
  };
  /* end */

  /* get claim Status */
  getClaimStatues = async (query) => {
    return await this.Models.ClaimStatues.findAll({ where: query, attributes: ['id', 'name'] })
  }
  /* end */

  /* get states */
  getEcuadorStates = async (query) => {
    return await this.Models.States.findAll({ where: query, attributes: ['id', 'name'] });
  }
  /* end */

  /* get products */
  getProducts = async (query) => {
    return await this.Models.Products.findAll({
      where: query,
      attributes: [
        'id',
        'description',
        'name',
        "line_of_business_id",
        "insurance_segment_id",
        "is_active",
      ],
    })
  };
  /* end */

  /* get basic coverages */
  getBasicCoverages = async () => {
    return await this.Models.BasicCoverages.findAll({
      //  where: query,
      attributes: [
        'id',
        'product_id',
        'name',
        'standard',
        'is_moderate',
      ],
    })
  };
  /* end */

  /* get additional coverages */
  getAdditionalCoverages = async () => {
    return await this.Models.AdditionalCoverages.findAll({
      // where: query,
      attributes: [
        'id',
        'product_id',
        'name',
        'standard',
        'is_moderate',
      ],
    })
  };
  /* end */

  /* get goods */
  getGoods = async (query) => {
    return await this.Models.Goods.findAll({
      where: query,
      attributes: [
        'id',
        'name',
        'group',
        'percentage',
        'imp_exp_percentage',
      ],
      order: [['group', 'asc']],
      raw: true,
    })
  };
  /* end */

  /* get goods for moderation */
  getGoodsForModeration = async (query) => {
    return await this.Models.Goods.findAll({
      where: query,
      attributes: [
        'name',
        'obs',
        'type_of_risk'
      ],
      raw: true,
    })
  };
  /* end */

  /* get claim causes */
  getClaimCauses = async (query) => {
    return await this.Models.ClaimCauses.findAll({
      where: query,
      attributes: [
        'id',
        'name',
      ],
    })
  };
  /* end */

  /* create quote */
  createQuote = async (payload) => {
    return await this.Models.Quotes.create(payload);
  };
  /* end */

  /* get product by id */
  getProduct = async (query) => {
    return await this.Models.Products.findOne({
      where: query,
      attributes: ['product_number']
    });
  };
  /* end */

  /* quote list */
  getQuoteList = async (query, detail) => {
    return await this.Models.Quotes.findAll({
      having: query,
      offset: detail.start,
      limit: detail.length == 0 ? null : detail.length,
      order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
      attributes: ["id", "company_id", "uuid", "createdAt", "product_id", "insurance_type_id", "user_id", "is_calculation_personalized", "status", "deleted_at", "review_user_id",
        [Sequelize.literal("(SELECT name FROM users WHERE users.id = quotes.user_id limit 1)"), "broker_name"],
        [Sequelize.literal("(SELECT name FROM products WHERE products.id = quotes.product_id limit 1)"), "product_name"],
        [Sequelize.literal("(SELECT name FROM insurance_types WHERE insurance_types.id = quotes.insurance_type_id limit 1)"), "insurance_type_name"],
        [Sequelize.literal("(SELECT ruc FROM companies WHERE companies.id = quotes.company_id limit 1)"), "ruc"],
        [Sequelize.literal("(SELECT company_email FROM companies WHERE companies.id = quotes.company_id limit 1)"), "email"],
        [Sequelize.literal("(SELECT company_name FROM companies WHERE companies.id = quotes.company_id limit 1)"), "company_name"],
        [Sequelize.literal("(SELECT company_phone FROM companies WHERE companies.id = quotes.company_id limit 1)"), "company_phone"],
        [Sequelize.literal("(SELECT first_name FROM companies WHERE companies.id = quotes.company_id limit 1)"), "first_name"],
        [Sequelize.literal("(SELECT last_name FROM companies WHERE companies.id = quotes.company_id limit 1)"), "last_name"]],

      include: [
        {
          model: this.Models.Users,
          as: "user",
          attributes: ['id', 'company_id', 'authority_level_id'],
          include: [
            {
              model: this.Models.Companies,
              as: "company",
              attributes: ['id', 'company_name', 'ruc', 'responsible_id', /*'authority_level_id'*/],
              include: [
                {
                  model: this.Models.Users,
                  as: "responsible_detail",
                  attributes: ['id', 'name'],
                },
              ]
            }
          ]
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['standard_commission_percentage', 'personalized_commission_percentage'],
        },
      ],
    },

    )
  };
  /* end */

  /* get quote */
  getQuote = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      include: [
        {
          model: this.Models.Companies,
          as: "quote_company",
          include: [
            {
              model: this.Models.CompanyAddresses,
              as: "company_address",
            },
            {
              model: this.Models.CompanyBanks,
              as: "company_bank",
            },
          ]
        },
        {
          model: this.Models.QuoteAdditionalCustomers,
          as: "quote_additional_customers",
          attributes: {
            exclude: ['createdAt']
          },
        },
        {
          model: this.Models.QuoteDocuments,
          as: "quote_documents",
          attributes: {
            exclude: ['createdAt']
          },
        },
      ]
    });
  };
  /* end */

  /* get quote details for creating transport goods */
  getQuoteForCreateTransportGoods = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'insurance_type_id', 'product_id', 'status', 'is_moderate', 'is_calculation_personalized', 'display_moderation'],
      include: [
        {
          model: this.Models.Users,
          attributes: ["id", "authority_level_id"],
          as: "user",
          // include: [
          //   {
          //     model: this.Models.UserDetails,
          //     attributes: ['authority_level_id'],
          //     as: "user_detail",
          //   },
          // ]
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
              attributes: ['id'],
            },
          ]
        },
        {
          model: this.Models.QuoteClaims,
          as: "quote_claim",
          attributes: ['id'],
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['standard_commission_percentage', 'personalized_commission_percentage', 'standard_is_discount_load', 'personalized_is_discount_load', 'standard_discount_aggravate_percentage', 'personalized_discount_aggravate_percentage', 'standard_insurance_rate', 'personalized_insurance_rate'],
          // include: [
          //   {
          //     model: this.Models.Deductibles,
          //     as: "standard_deductible",
          //     attributes: ['discount'],
          //   },
          //   {
          //     model: this.Models.Deductibles,
          //     as: "personalized_deductible",
          //     attributes: ['discount'],
          //   },
          // ]
        },
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: ['id']
        },
      ]
    });
  };
  /* end */

  /* get customer */
  getCustomer = async (query) => {
    return await this.Models.Customers.findOne({
      where: query,
    });
  };
  /* end */

  /* update customer */
  updateCustomer = async (query, payload) => {
    return await this.Models.Customers.update(payload, {
      where: query,
    });
  };
  /* end */

  /* create customer */
  createCustomer = async (payload) => {
    return await this.Models.Customers.create(payload);
  };
  /* end */

  /* update quote */
  updateQuote = async (query, payload) => {
    return await this.Models.Quotes.update(payload, {
      where: query
    });
  };
  /* end */

  /* update quote calculation */
  updateQuoteCalculation = async (query, payload) => {
    return await this.Models.QuoteCalculations.update(payload, {
      where: query
    });
  };
  /* end */

  /* delete additional customer */
  deleteAdditionalCustomers = async (query) => {
    return await this.Models.QuoteAdditionalCustomers.destroy({
      where: query
    });
  };
  /* end */

  /* get quote additional customers */
  getQuoteAdditionalCustomers = async (query) => {
    return await this.Models.QuoteAdditionalCustomers.findAll({
      where: query
    });
  };
  /* end */

  /* get quote detail for gr book */
  getQuoteDetailForGrBook = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'is_calculation_personalized'],
      include: [
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['id', 'personalized_commission_percentage', 'standard_commission_percentage'],
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: {
            exclude: ['quote_id', 'createdAt', 'updatedAt']
          },
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            },
          ]
        },
      ]
    });
  };
  /* end */

  /* update additional customer */
  updateQuoteAdditionalCustomers = async (query, payload) => {
    return await this.Models.QuoteAdditionalCustomers.update(payload, {
      where: query
    });
  };
  /* end */

  /* bulk create quote additional customer */
  bulkCreateQuoteAdditionalCustomers = async (payload) => {
    return await this.Models.QuoteAdditionalCustomers.bulkCreate(payload);
  };
  /* end */

  /* broker list on behalf of  quote is created */
  quoteBrokerList = async (query, detail) => {
    return await this.Models.Users.findAll({
      having: query,
      attributes: ['id', 'name', 'role_id', 'deleted_at', 'status',
        [Sequelize.literal("(SELECT agency_id FROM companies WHERE companies.id = users.company_id limit 1)"),
          "agency_id"],
        [Sequelize.literal("(SELECT ruc FROM companies WHERE companies.id = users.company_id limit 1)"),
          "company_ruc"],
        [Sequelize.literal("(SELECT company_name FROM companies WHERE companies.id = users.company_id limit 1)"),
          "company_name"]],
      offset: detail.start,
      limit: detail.length == 0 ? null : detail.length,
      order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
    })
  };
  /* end */

  /* get transport goods */
  getTransportGood = async (query) => {
    return await this.Models.TransportGoods.findOne({ where: query });
  };
  /* end */

  /* create transport goods */
  createTransportGoods = async (payload) => {
    return await this.Models.TransportGoods.create(payload);
  };
  /* end */


  /* update transport goods */
  updateTransportGoods = async (payload, query) => {
    return await this.Models.TransportGoods.update(payload, {
      where: query
    });
  };
  /* end */

  /* delete transport good detail */
  deleteTransportGoodDetail = async (query) => {
    return await this.Models.TransportGoodsDetails.destroy({
      where: query
    });
  };
  /* end */

  /* update transport goods detail */
  updateTransportGoodsDetail = async (payload, query) => {
    return await this.Models.TransportGoodsDetails.update(payload, {
      where: query
    });
  };
  /* end */

  /* delete transport goods detail */
  deleteTransportGoodsDetail = async (query) => {
    return await this.Models.TransportGoodsDetails.destroy({
      where: query
    });
  };
  /* end */

  /* bulk create transport goods detail */
  bulkCreateTransportGoodsDetail = async (payload) => {
    return await this.Models.TransportGoodsDetails.bulkCreate(payload);
  };
  /* end */

  /* create transport goods detail */
  createTransportGoodDetail = async (payload) => {
    return await this.Models.TransportGoodsDetails.create(payload);
  };
  /* end */

  /* bulk create quote documents */
  bulkCreateQuoteDocuments = async (payload) => {
    return await this.Models.QuoteDocuments.bulkCreate(payload);
  };
  /* end */

  /* get transport good detail */
  getTransportGoodDetails = async (query) => {
    return await this.Models.TransportGoodsDetails.findAll({ where: query });
  };
  /* end */

  /* get transport good details */
  getTransportGoodDetailsToCalculateGoodsRate = async (query) => {
    return await this.Models.TransportGoodsDetails.findAll({ where: query, attributes: ['group_percentage', 'good_group_percentage'] });
  };
  /* end */

  /* get transport good detail to delete good */
  getTransportGoodDetailToDeleteGood = async (query) => {
    return await this.Models.TransportGoodsDetails.findOne({
      where: query,
      attributes: ['id', 'transport_good_id', 'total_amount'],
    });
  };
  /* end */

  /* get transport good to delete good */
  getTransportGoodToDeleteGood = async (query) => {
    return await this.Models.TransportGoods.findOne({ where: query, attributes: ['id', 'total_limit', 'currency'] });
  };
  /* end */

  /* get quote for delete good */
  getQuoteExistenceToDeleteGood = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'is_moderate', 'status', 'is_calculation_personalized', 'product_id', /* 'proposal_no'*/ 'insurance_type_id'],
      include: [
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['standard_commission_percentage', 'personalized_commission_percentage', 'standard_is_discount_load', 'personalized_is_discount_load', 'standard_discount_aggravate_percentage', 'personalized_discount_aggravate_percentage'],
          // include: [
          //   {
          //     model: this.Models.Deductibles,
          //     as: "standard_deductible",
          //     attributes: ['discount'],
          //   },
          //   {
          //     model: this.Models.Deductibles,
          //     as: "personalized_deductible",
          //     attributes: ['discount'],
          //   },
          // ]
        },
      ]
    });
  };
  /* end */

  /* get good detail */
  getGood = async (query) => {
    return await this.Models.Goods.findOne({ where: query });
  };
  /* end */

  /* get good name */
  getGoodName = async (query) => {
    return await this.Models.Goods.findOne({ where: query, attributes: ['name'] });
  };
  /* end */

  /* get all quote detail */
  getAllQuoteDetail = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      include: [
        {
          model: this.Models.Companies,
          as: "quote_company",
          include: [
            {
              model: this.Models.CompanyAddresses,
              as: "company_address",
              // attributes: {
              //   include: [
              //     [Sequelize.literal("(SELECT name FROM states WHERE states.id = company_addresses.state LIMIT 1)"), "company_state"],
              //     [Sequelize.literal("(SELECT name FROM ecuador_cities WHERE ecuador_cities.id = company_address.city LIMIT 1)"), "company_city"]
              //   ]
              // }
              include: [
                {
                  model: this.Models.States,
                  as: "ecuador_state",
                  attributes: ["id", "name"], // Fetch only the state name
                },
                {
                  model: this.Models.Cities,
                  as: "ecuador_city",
                  attributes: ["id", "name"], // Fetch only the city name
                }
              ]
            },
            {
              model: this.Models.CompanyBanks,
              as: "company_bank",
            },
          ]
        },
        {
          model: this.Models.QuoteAdditionalCustomers,
          as: "quote_additional_customers",
        },
        {
          model: this.Models.QuoteDocuments,
          as: "quote_documents",
          attributes: ['id', 'path', 'type', 'name', 'createdAt'],
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: {
            exclude: ['quote_id', 'createdAt', 'updatedAt']
          },
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              },
            },
          ]
        },
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: [
            {
              model: this.Models.ShipmentDocuments,
              as: "shipment_documents",
              attributes: ['id', 'path', 'type', 'name', 'createdAt'],
            },
            {
              model: this.Models.SingleShipmentDetails,
              as: "single_shipment_detail",
              attributes: {
                exclude: ["createAt", "updatedAt", "quote_shipment_id"]
              }
            },
            {
              model: this.Models.ShipmentRouteDetails,
              as: "shipment_route_details",
              attributes: {
                exclude: ["createAt", "updatedAt", "quote_shipment_id"]
              },
              include: [
                {
                  model: this.Models.Countries,
                  as: "source_detail",
                  attributes: ["name", "astr_id"]
                },
                {
                  model: this.Models.Countries,
                  as: "destiny_detail",
                  attributes: ["name", "astr_id"],
                }
              ]
            },
          ]
        },
        {
          model: this.Models.QuoteRisks,
          as: "quote_risk",
          include: [
            {
              model: this.Models.QuoteRiskDocuments,
              as: "quote_risk_documents",
            }
          ]
        },
        {
          model: this.Models.QuoteClaims,
          as: "quote_claim",
          include: [
            {
              model: this.Models.QuoteClaimDetails,
              as: "quote_claim_details",
            },
            {
              model: this.Models.QuoteClaimDocuments,
              as: "quote_claim_documents",
            }
          ]
        },
        {
          model: this.Models.Products,
          as: "product",
          attributes: ["name", "description", "susep_code"]
        },
        {
          model: this.Models.InsuranceTypes,
          as: "insurance_type",
          attributes: ["id", "name", "description"]
        },
        {
          model: this.Models.QuoteBasicCoverages,
          as: "quote_basic_coverages",
          attributes: [["coverage_id", "id"],
          [Sequelize.literal("(SELECT name FROM basic_coverages WHERE basic_coverages.id = quote_basic_coverages.coverage_id limit 1)"),
            "name"],
          [Sequelize.literal("(SELECT deductible FROM import_export_calculations WHERE import_export_calculations.coverage_id = quote_basic_coverages.coverage_id limit 1)"),
            "deductible"],
          ],
        },
        {
          model: this.Models.QuoteAdditionalCoverages,
          as: "quote_additional_coverages",
          attributes: [["coverage_id", "id"],
          [Sequelize.literal("(SELECT name FROM additional_coverages WHERE additional_coverages.id = quote_additional_coverages.coverage_id limit 1)"),
            "name"],
          [Sequelize.literal("(SELECT product_id FROM additional_coverages WHERE additional_coverages.id = quote_additional_coverages.coverage_id limit 1)"),
            "product_id"],
          ],
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          // include: [
          //   {
          //     model: this.Models.Deductibles,
          //     as: "standard_deductible",
          //     attributes: ['discount', 'name', 'details'],
          //   },
          //   {
          //     model: this.Models.Deductibles,
          //     as: "personalized_deductible",
          //     attributes: ['discount', 'name', 'details'],
          //   },
          // ]
        },
        {
          model: this.Models.Users,
          attributes: ["id", "name", "ruc", "email", "authority_level_id"],
          as: "user",
          include: [
            {
              model: this.Models.AuthorityLevels,
              as: 'authority_level',
              attributes: ['commission']
            },
            {
              model: this.Models.Companies,
              as: "company",
              attributes: ['company_name', 'ruc', 'company_reg_no', 'responsible_id',/* 'authority_level_id'*/],
              include: [
                {
                  model: this.Models.Users,
                  as: "responsible_detail",
                  attributes: ['name'],
                },
                // {
                //   model: this.Models.AuthorityLevels,
                //   as: 'authority_levels',
                //   attributes: ['commission']
                // }
              ]
            },
          ],
        },
      ]
    });
  };
  /* end */

  /* get all quote detail to check moderation of lmg notes */
  getQuoteDetailToCheckLmgNotesModeration = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['display_moderation', 'is_calculation_personalized'],
      include: [
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id'],
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['standard_commission_percentage'],
        },
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: ['id'],
          include: [
            {
              model: this.Models.SingleShipmentDetails,
              as: "single_shipment_detail",
              attributes: ["id"]
            },
          ]
        },
      ]
    })
  };
  /* end */

  /* get transport good */
  getTransportGoodExistence = async (query) => {
    return await this.Models.TransportGoods.findOne({
      where: query,
      attributes: ['id', 'quote_id',
        // [Sequelize.literal("(SELECT proposal_no FROM quotes WHERE quotes.id = transport_goods.quote_id limit 1)"),
        //   "proposal_no"],
      ]
    });
  };
  /* end */

  /* get quote risk existence */
  getQuoteRiskExistence = async (query) => {
    return await this.Models.QuoteRisks.findOne({
      where: query,
      attributes: ['id', 'quote_id']
    });
  };
  /* end */

  /* get quote detail for add customer detail */
  getQuoteDetailForAddCustomerDetail = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'is_moderate', 'product_id', 'insurance_type_id']
    });
  };
  /* end */

  /* get quote detail for adding shipment detail */
  getQuoteDetailForAddShipmentDetail = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'is_moderate', 'status', 'insurance_type_id'],
      include: [
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['standard_commission_percentage', 'personalized_commission_percentage', 'standard_is_discount_load', 'personalized_is_discount_load', 'standard_discount_aggravate_percentage', 'personalized_discount_aggravate_percentage', 'standard_insurance_rate', 'personalized_insurance_rate'],
          // include: [
          //   {
          //     model: this.Models.Deductibles,
          //     as: "standard_deductible",
          //     attributes: ['discount'],
          //   },
          //   {
          //     model: this.Models.Deductibles,
          //     as: "personalized_deductible",
          //     attributes: ['discount'],
          //   },
          // ]
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id', 'total_limit', 'currency'],
          // include: [
          //   {
          //     model: this.Models.TransportGoodsDetails,
          //     as: "transport_good_details",
          //     attributes: ['good_id', 'group_id', 'expenses_percentage']
          //   },
          // ]
        },
      ]
    });
  };
  /* end */

  /* get quote detail for adding quote risk */
  getQuoteDetailToAddQuoteRisks = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'is_moderate', 'status'],
      include: [
        {
          model: this.Models.QuoteRisks,
          as: "quote_risk",
          attributes: ['id'],
          include: [
            {
              model: this.Models.QuoteRiskDocuments,
              as: "quote_risk_documents",
              attributes: ['id'],
            }
          ]
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['id', 'standard_commission_percentage', 'personalized_commission_percentage'],
        },
      ]
    });
  };
  /* end */

  /* get quote existence */
  getQuoteExistence = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id']
    });
  };
  /* end */

  /* get user company existence */
  getUserCompanyExistence = async (query) => {
    return await this.Models.Companies.findOne({
      where: query,
      attributes: ['id']
    });
  };
  /* end */

  /* get shipment existence */
  getQuoteShipmentExistence = async (query) => {
    return await this.Models.QuoteShipments.findOne({
      where: query,
      attributes: ['id']
    });
  };
  /* end */

  /* create quote shipment */
  createQuoteShipment = async (payload) => {
    return await this.Models.QuoteShipments.create(payload);
  };
  /* end */

  /* update quote shipment */
  updateQuoteShipment = async (payload, query) => {
    return await this.Models.QuoteShipments.update(payload, { where: query });
  };
  /* end */

  /* create single shipment detail */
  createSingleShipmentDetail = async (payload) => {
    return await this.Models.SingleShipmentDetails.create(payload);
  };
  /* end */

  /* update single shipment detail */
  updateSingleShipmentDetail = async (payload, query) => {
    return await this.Models.SingleShipmentDetails.update(payload, { where: query });
  };
  /* end */

  /* get shipment route detail */
  getShipmentRouteDetail = async (query) => {
    return await this.Models.ShipmentRouteDetails.findOne({ where: query });
  };
  /* end */

  /* get all shipment route details */
  getShipmentRouteDetails = async (query) => {
    return await this.Models.ShipmentRouteDetails.findAll({ where: query });
  };
  /* end */

  /* create shipment route detail */
  createShipmentRouteDetail = async (payload) => {
    return await this.Models.ShipmentRouteDetails.create(payload);
  };
  /* end */

  /* update shipment route detail */
  updateShipmentRouteDetail = async (payload, query) => {
    return await this.Models.ShipmentRouteDetails.update(payload, { where: query });
  };
  /* end */

  /* bulk create shipment documents */
  bulkCreateShipmentDocuments = async (payload) => {
    return await this.Models.ShipmentDocuments.bulkCreate(payload);
  };
  /* end */

  /* get single shipment detail */
  getSingleShipmentDetail = async (query) => {
    return await this.Models.SingleShipmentDetails.findOne({ where: query });
  };
  /* end */

  /* get document */
  getDocumentExistence = async (model, query) => {
    return await model.findOne({
      where: query,
      attributes: ['path'],
    });
  };
  /* end */

  /* get quote data for checking whether quote will go to moderation or not on the basis of the routes selected */
  getQuoteDataForCheckingRouteModeration = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['product_id', 'is_calculation_personalized'],
      include: [
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['id', 'standard_commission_percentage', 'personalized_commission_percentage'],
        },
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: ['id'],
          include: [
            {
              model: this.Models.ShipmentRouteDetails,
              as: "shipment_route_details",
              attributes: ['id'],
              include: [
                {
                  model: this.Models.Countries,
                  as: "source_detail",
                  attributes: ['id', "name", "astr_id"]
                },
                {
                  model: this.Models.Countries,
                  as: "destiny_detail",
                  attributes: ['id', "name", "astr_id"],
                }
              ]
            },
          ]
        },
      ],
    });
  };
  /* end */

  /* delete document */
  deleteDocument = async (model, query) => {
    return await model.destroy({
      where: query,
    });
  };
  /* end */

  /* get quote data required for creating coverages for single flow */
  getQuoteDetailToCreateSingleCoverages = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'is_moderate', 'status', 'product_id', 'display_moderation', 'insurance_type_id', 'is_calculation_personalized', 'company_id'/*'proposal_no'*/],
      include: [
        {
          model: this.Models.Users,
          attributes: ["id", "name", "email", "authority_level_id"],
          as: "user",
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id', 'total_limit', 'currency'],
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
              attributes: ['good_id', 'group_id', 'expenses_percentage']
            },
          ]
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['standard_commission_percentage', 'personalized_commission_percentage', 'standard_is_discount_load', 'personalized_is_discount_load', 'standard_discount_aggravate_percentage', 'personalized_discount_aggravate_percentage'],
          // include: [
          //   {
          //     model: this.Models.Deductibles,
          //     as: "standard_deductible",
          //     attributes: ['discount'],
          //   },
          //   {
          //     model: this.Models.Deductibles,
          //     as: "personalized_deductible",
          //     attributes: ['discount'],
          //   },
          // ]
        },
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: ['id'],
          include: [
            {
              model: this.Models.ShipmentRouteDetails,
              as: "shipment_route_details",
              attributes: ['id'],
              include: [
                {
                  model: this.Models.Countries,
                  as: "source_detail",
                  attributes: ["name", "astr_id"]
                },
                {
                  model: this.Models.Countries,
                  as: "destiny_detail",
                  attributes: ["name", "astr_id"],
                }
              ]
            },
          ]
        },
      ]
    });
  };
  /* end */

  /* bulk create quote basic coverages */
  bulkCreateQuoteBasicCoverages = async (payload) => {
    return await this.Models.QuoteBasicCoverages.bulkCreate(payload);
  };
  /* end */

  /* bulk create quote additional coverages */
  bulkCreateQuoteAdditionalCoverages = async (payload) => {
    return await this.Models.QuoteAdditionalCoverages.bulkCreate(payload);
  };
  /* end */

  /* get basic coverages to check whether quote will be moderated or not */
  getBasicCoveragesToCheckModeration = async (query) => {
    return await this.Models.BasicCoverages.findAll({
      where: query,
      attributes: [
        'is_moderate',
      ],
    })
  };
  /* end */

  /* get additional coverages to check whether quote will be moderated or not */
  getAdditionalCoveragesToCheckModeration = async (query) => {
    return await this.Models.AdditionalCoverages.findAll({
      where: query,
      attributes: [
        'is_moderate',
      ],
    })
  };
  /* end */

  /* get broker category */
  getBrokerCategory = async (query) => {
    return await this.Models.AuthorityLevels.findOne({
      where: query,
      attributes: ['id', 'imp_exp_limit'],
    });
  };
  /* end */

  /* get quote basic coverages */
  getQuoteBasicCoverages = async (query) => {
    return await this.Models.QuoteBasicCoverages.findAll({
      where: query,
      attributes: ['coverage_id'],
    });
  };
  /* end */

  /* get quote additional coverages */
  getQuoteAdditionalCoverages = async (query) => {
    return await this.Models.QuoteAdditionalCoverages.findAll({
      where: query,
      attributes: ['coverage_id'],
    });
  };
  /* end */

  /* delete quote basic coverages */
  deleteQuoteBasicCoverages = async (query) => {
    return await this.Models.QuoteBasicCoverages.destroy({
      where: query,
    });
  };
  /* end */

  /* delete quote additional coverages */
  deleteQuoteAdditionalCoverages = async (query) => {
    return await this.Models.QuoteAdditionalCoverages.destroy({
      where: query,
    });
  };
  /* end */

  /* get quote detail for single import quote calculation */
  getQuoteDetailForSingleImportCalculation = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id'],
      include: [
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: ['id']
        },
      ]
    });
  };
  /* end */

  /* get quote detail after adding coverages */
  getQuoteDetailAfterAddingSingleCoverages = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'product_id', 'insurance_type_id', 'status', 'is_moderate', 'moderation_reasons'],
      include: [
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['currency', 'total_limit']
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ["id", "standard_deductible_id"],
        },
      ],
    });
  };
  /* end */

  /* get quote detail after adding calculation */
  getQuoteDetailAfterAddingCalculation = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'product_id', 'insurance_type_id', 'status', 'is_moderate', 'moderated_by_sub_admin_limit', 'is_calculation_personalized', 'minimum_prize'],
      include: [
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id', 'currency', 'total_limit'],
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
              attributes: ['group_id', 'good_id', 'expenses_percentage', 'additional_information']
            },
          ]
        },
        {
          model: this.Models.Products,
          as: "product",
          attributes: ["name", "description", "susep_code", "ramo", "product_code", "branch_code"]
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
        },
        {
          model: this.Models.Users,
          as: "user",
        },
        {
          model: this.Models.Customers,
          as: "customer",
          attributes: {
            exclude: ['credit_score']
          },
        },
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: ['id'],
          include: [
            {
              model: this.Models.ShipmentRouteDetails,
              as: "shipment_route_details",
              attributes: ['id'],
              include: [
                {
                  model: this.Models.Countries,
                  as: "source_detail",
                  attributes: ["name", "astr_id"]
                },
                {
                  model: this.Models.Countries,
                  as: "destiny_detail",
                  attributes: ["name", "astr_id"],
                }
              ]
            },
          ]
        },
      ]
    });
  };
  /* end */

  /* get quote for add and update quote calculation */
  getQuoteForAddUpdateQuoteCalculation = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'is_moderate', 'status', 'product_id', 'display_moderation', 'insurance_type_id', 'moderation_reasons', 'is_calculation_personalized'],
      include: [
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['id', 'personalized_commission_percentage', 'personalized_deductible_id', 'personalized_discount_aggravate_percentage', 'standard_commission_percentage', 'standard_deductible_id', 'standard_discount_aggravate_percentage'],
        },
        {
          model: this.Models.Companies,
          as: "quote_company",
        },
        {
          model: this.Models.Products,
          as: "product",
          attributes: ["name"]
        },
        {
          model: this.Models.Users,
          as: "user",
          include: [
            {
              model: this.Models.AuthorityLevels,
              as: 'authority_level',
              attributes: ['id', 'commission']
            },
            {
              model: this.Models.Companies,
              as: "company",
              attributes: ['company_name', 'ruc', 'company_reg_no', 'responsible_id'],
              include: [
                {
                  model: this.Models.Users,
                  as: "responsible_detail",
                  attributes: ['id', 'name'],
                },
                // {
                //   model: this.Models.AuthorityLevels,
                //   as: 'authority_levels',
                //   attributes: ['commission']
                // }
              ]
            },
          ],
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
            },
          ]
        },
      ]
    });
  };
  /* end */

  /* add quote calculation */
  createQuoteCalculation = async (payload) => {
    return await this.Models.QuoteCalculations.create(payload);
  };
  /* end */

  /* delete shipment route details */
  deleteShipmentRouteDetails = async (query) => {
    return await this.Models.ShipmentRouteDetails.destroy({
      where: query,
    });
  };
  /* end */

  /* bulk create shipment route details */
  bulkCreateShipmentRouteDetails = async (payload) => {
    return await this.Models.ShipmentRouteDetails.bulkCreate(payload);
  };
  /* end */

  /* create quote risks */
  createQuoteRisk = async (payload) => {
    return await this.Models.QuoteRisks.create(payload);
  };
  /* end */

  /* update quote risks */
  updateQuoteRisk = async (payload, query) => {
    return await this.Models.QuoteRisks.update(payload, {
      where: query,
    });
  };
  /* end */

  /* bulk create quote risk documents */
  bulkCreateQuoteRiskDocuments = async (payload) => {
    return await this.Models.QuoteRiskDocuments.bulkCreate(payload);
  };
  /* end */

  /* get quote detail for adding quote claims */
  getQuoteDetailToAddQuoteClaims = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'is_moderate', 'status', 'user_id', 'is_calculation_personalized'],
      include: [
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['id', 'standard_commission_percentage', 'personalized_commission_percentage', 'standard_is_discount_load', 'personalized_is_discount_load', 'standard_discount_aggravate_percentage', 'personalized_discount_aggravate_percentage'],
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id', 'estimated_for_next_12_months', 'goods_rate'],
        },
      ]
    });
  };
  /* end */

  /* get quote claim existence */
  getQuoteClaimExistence = async (query) => {
    return await this.Models.QuoteClaims.findOne({
      where: query,
      attributes: ['id']
    });
  };
  /* end */

  /* create quote claim */
  createQuoteClaim = async (payload) => {
    return await this.Models.QuoteClaims.create(payload);
  };
  /* end */

  /* update quote claim */
  updateQuoteClaim = async (payload, query) => {
    return await this.Models.QuoteClaims.update(payload, {
      where: query,
    });
  };
  /* end */

  /* bulk create quote claim documents */
  bulkCreateQuoteClaimDocuments = async (payload) => {
    return await this.Models.QuoteClaimDocuments.bulkCreate(payload);
  };
  /* end */

  /* update quote claim detail */
  updateQuoteClaimDetail = async (payload, query) => {
    return await this.Models.QuoteClaimDetails.update(payload, {
      where: query,
    });
  };
  /* end */

  /* get all quote claim details */
  getQuoteClaimDetails = async (query) => {
    return await this.Models.QuoteClaimDetails.findAll({ where: query });
  };
  /* end */

  /* delete quote claim details */
  deleteQuoteClaimDetails = async (query) => {
    return await this.Models.QuoteClaimDetails.destroy({
      where: query,
    });
  };
  /* end */

  /* bulk create quote claim details */
  bulkCreateQuoteClaimDetails = async (payload) => {
    return await this.Models.QuoteClaimDetails.bulkCreate(payload);
  };
  /* end */

  /* get quote detail for adding quote claims by sheet */
  getQuoteDetailToAddQuoteClaimsBySheet = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'is_moderate', 'status'],
      include: [
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id', 'currency'],
        },
      ]
    });
  };
  /* end */

  /* add quote message sent from the quote moderation popup in the last tab */
  createMessage = async (payload) => {
    return await this.Models.Messages.create(payload);
  };
  /* end */

  /* get quote message list sent from the quote moderation popup in the last tab */
  getMessages = async (query) => {
    return await this.Models.Messages.findAll({
      where: query,
      attributes: ["id", "sender_id", "message", "deleted_at", "createdAt",
        [Sequelize.literal("(SELECT name FROM users WHERE users.id = messages.sender_id limit 1)"),
          "sender_name"]],
    });
  };
  /* end */

  /* get quote data required for creating coverages for single flow */
  getQuoteDetailToAddCoverages = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'user_id', 'is_moderate', 'status', 'product_id', 'display_moderation', 'insurance_type_id', 'is_calculation_personalized', 'company_id', /*'proposal_no'*/],
      include: [
        {
          model: this.Models.Users,
          attributes: ["id"],
          as: "user",
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id', 'total_limit', 'currency'],
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
              attributes: ['good_id', 'group_id', 'expenses_percentage']
            },
          ]
        },
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: ['id'],
          include: [
            {
              model: this.Models.ShipmentRouteDetails,
              as: "shipment_route_details",
              attributes: ['id'],
              include: [
                {
                  model: this.Models.Countries,
                  as: "source_detail",
                  attributes: ["name", "astr_id"]
                },
                {
                  model: this.Models.Countries,
                  as: "destiny_detail",
                  attributes: ["name", "astr_id"],
                }
              ]
            },
          ]
        },
        {
          model: this.Models.QuoteClaims,
          as: "quote_claim",
          attributes: ['id'],
        },
      ]
    });
  };
  /* end */

  /* get quote detail after adding coverages */
  getQuoteDetailAfterAddingCoverages = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'product_id', 'insurance_type_id', 'status', 'is_moderate', 'is_calculation_personalized', 'moderation_reasons'],
      include: [
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['currency', ['estimated_for_next_12_months', 'total_limit']]
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ["id", "standard_deductible_id"],
        },
      ],
    });
  };
  /* end */

  /* get quote details for accept and reject quote */
  getQuoteDetailForApproveReject = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'activated_at', 'is_calculation_personalized', 'status', 'product_id', 'insurance_type_id'],
      include: [
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['standard_commission_percentage', 'personalized_commission_percentage'],
        },
        {
          model: this.Models.Products,
          as: "product",
          attributes: ['id', "name"]
        },
        {
          model: this.Models.Companies,
          as: "quote_company",
        },
        {
          model: this.Models.Users,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: this.Models.Companies,
              as: "company",
              attributes: ['id', 'company_name', 'ruc', 'company_reg_no', 'responsible_id'],
              include: [
                {
                  model: this.Models.CompanySettings,
                  as: "company_setting",
                  attributes: ['id', 'moderation_notification', 'moderation_notification_emails']
                },
                {
                  model: this.Models.Users,
                  as: "responsible_detail",
                  attributes: ['id', 'name', 'email'],
                },
              ],
            },
          ]
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id', 'total_limit', 'currency'],
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
              attributes: ['good_id', 'group_id', 'expenses_percentage']
            },
          ]
        },
      ]
    })
  }
  /* end */

  /* get quote detail for calculating insurance rate */
  getQuoteDetailToInsuranceRate = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id'],
      include: [
        {
          model: this.Models.QuoteClaims,
          as: "quote_claim",
          attributes: ['approximate_value'],
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id', 'goods_rate'],
        },
      ]
    });
  };
  /* end */

  /* get quote detail for update quote status */
  getQuoteDetailForUpdateQuoteStatus = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'product_id', 'insurance_type_id', 'company_id'],
      include: [
        {
          model: this.Models.Users,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: this.Models.Proposals,
          as: 'proposal_detail',
          attributes: ['id', 'quote_id']
        }
      ]
    });
  };
  /* end */

  /* get quote proposal */
  getQuoteProposal = async (query) => {
    return await this.Models.Proposals.findOne({
      where: query,
      attributes: ['id', 'quote_id']
    })
  }
  /* end */

  /* get quote detail to create duplicate quote */
  getQuoteToDuplicateQuote = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'quote_pdf'] },
      include: [
        {
          model: this.Models.Companies,
          as: 'quote_company',
          attributes: ['company_name']
        },
        {
          model: this.Models.QuoteAdditionalCoverages,
          as: 'quote_additional_coverages',
          attributes: { exclude: ['id', 'quote_id', 'createdAt', 'updatedAt'] }
        },
        {
          model: this.Models.QuoteBasicCoverages,
          as: 'quote_basic_coverages',
          attributes: { exclude: ['id', 'quote_id', 'createdAt', 'updatedAt'] }
        },
        {
          model: this.Models.QuoteAdditionalCustomers,
          as: 'quote_additional_customers',
          attributes: { exclude: ['id', 'quote_id', 'createdAt', 'updatedAt'] }
        },
        {
          model: this.Models.QuoteCalculations,
          as: 'quote_calculation',
          attributes: { exclude: ['id', 'quote_id', 'createdAt', 'updatedAt'] }
        },
        {
          model: this.Models.TransportGoods,
          as: 'transport_good',
          attributes: {
            exclude: ['id', 'quote_id', 'createdAt', 'updatedAt']
          },
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: 'transport_good_details',
              attributes: { exclude: ['id', 'transport_good_id', 'createdAt', 'updatedAt'] }
            }
          ]
        },
        {
          model: this.Models.QuoteShipments,
          as: 'quote_shipment',
          attributes: {
            exclude: ['id', 'quote_id', 'createdAt', 'updatedAt']
          },
          include: [
            {
              model: this.Models.ShipmentRouteDetails,
              as: 'shipment_route_details',
              attributes: { exclude: ['id', 'quote_shipment_id', 'createdAt', 'updatedAt'] }
            },
            {
              model: this.Models.SingleShipmentDetails,
              as: 'single_shipment_detail',
              attributes: { exclude: ['id', 'quote_shipment_id', 'createdAt', 'updatedAt'] }
            },
            {
              model: this.Models.ShipmentDocuments,
              as: 'shipment_documents',
              attributes: { exclude: ['id', 'quote_shipment_id', 'createdAt', 'updatedAt'] }
            }
          ]
        },
        {
          model: this.Models.QuoteClaims,
          as: 'quote_claim',
          attributes: {
            exclude: ['id', 'quote_id', 'createdAt', 'updatedAt']
          },
          include: [
            {
              model: this.Models.QuoteClaimDetails,
              as: 'quote_claim_details',
              attributes: { exclude: ['id', 'quote_claim_id', 'createdAt', 'updatedAt'] }
            },
            {
              model: this.Models.QuoteClaimDocuments,
              as: 'quote_claim_documents',
              attributes: { exclude: ['id', 'quote_claim_id', 'createdAt', 'updatedAt'] }
            }
          ]
        },
        {
          model: this.Models.QuoteRisks,
          as: 'quote_risk',
          attributes: {
            exclude: ['id', 'quote_id', 'createdAt', 'updatedAt']
          },
          include: [
            {
              model: this.Models.QuoteRiskDocuments,
              as: 'quote_risk_documents',
              attributes: { exclude: ['id', 'quote_risk_id', 'createdAt', 'updatedAt'] }
            }
          ]
        },
        {
          model: this.Models.QuoteDocuments,
          as: 'quote_documents',
          attributes: { exclude: ['id', 'quote_id', 'createdAt', 'updatedAt'] }
        },
        {
          model: this.Models.Products,
          as: 'product',
          attributes: ['id', 'product_number']
        }
      ]
    })
  }
  /* end */

  /* get quote detail for moderation popup */
  quoteDetailForModeration = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'status', 'stipulation_policy_checkbox', 'premium_calculation_type', 'is_moderate', 'is_calculation_personalized', 'insurance_type_id', 'product_id', 'minimum_prize', 'of_adjustment', 'of_claims', 'moderation_reasons', 'minimum_prize'],
      include: [
        {
          model: this.Models.QuoteDocuments,
          as: "quote_documents",
          attributes: {
            exclude: ['createdAt']
          },
        },
        {
          model: this.Models.Companies,
          as: "quote_company",
          attributes: ['company_name']
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['currency', 'total_limit', 'estimated_for_next_12_months'],
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
              attributes: ['good_id', 'group_id', 'expenses_percentage']
            },
          ]
        },
        {
          model: this.Models.QuoteBasicCoverages,
          as: "quote_basic_coverages",
          attributes: ['id', 'quote_id', 'coverage_id',
            [Sequelize.literal("(SELECT deductible FROM import_export_calculations WHERE import_export_calculations.coverage_id = quote_basic_coverages.coverage_id limit 1)"), "deductible"],
          ]
        },
        {
          model: this.Models.Users,
          attributes: ["id", "name", "email"],
          as: "user",
        },
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: ['id'],
          include: [
            {
              model: this.Models.ShipmentDocuments,
              as: "shipment_documents",
              attributes: ['id', 'path', 'type', 'name', 'createdAt'],
            },
          ]
        },
        {
          model: this.Models.QuoteRisks,
          as: "quote_risk",
          attributes: ['id'],
          include: [
            {
              model: this.Models.QuoteRiskDocuments,
              as: "quote_risk_documents",
              attributes: ['id', 'path', 'type', 'name', 'createdAt'],
            }
          ]
        },
        {
          model: this.Models.QuoteClaims,
          as: "quote_claim",
          attributes: ['id'],
          include: [
            {
              model: this.Models.QuoteClaimDocuments,
              as: "quote_claim_documents",
            }
          ]
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          // attributes: ['id', 'quote_id','standard_total_insurance_cost','personalized_total_insurance_cost','standard_commission_percentage', 'personalized_commission_percentage', 'standard_net_written_premium', 'personalized_net_written_premium', 'standard_discount_aggravate_percentage', 'personalized_discount_aggravate_percentage', 'standard_total_premium', 'personalized_total_premium', 'standard_deductible_id', 'personalized_deductible_id', 'standard_is_discount_load', 'personalized_is_discount_load', 'standard_insurance_rate', 'personalized_insurance_rate'],
        },
      ]
    })
  }
  /* end */

  /* quote detail for moderation conditions */
  quoteModerationDetails = async (query) => {
    return this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'display_moderation', 'insurance_type_id', 'company_id', 'product_id', 'status', 'is_moderate', 'minimum_prize', 'is_calculation_personalized'],
      include: [
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id', 'total_limit', 'currency'],
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
              attributes: ['good_id', 'group_id', 'expenses_percentage']
            },
          ]
        },
        {
          model: this.Models.Users,
          attributes: ["id", "name", "ruc", "email", "authority_level_id"],
          as: "user",
          include: [
            {
              model: this.Models.AuthorityLevels,
              as: 'authority_level',
              attributes: ['commission']
            },
            {
              model: this.Models.Companies,
              as: "company",
              attributes: ['company_name', 'ruc', 'company_reg_no', 'responsible_id'],
              include: [
                {
                  model: this.Models.Users,
                  as: "responsible_detail",
                  attributes: ['name'],
                },
                // {
                //   model: this.Models.AuthorityLevels,
                //   as: 'authority_levels',
                //   attributes: ['commission']
                // }
              ]
            },
          ],
        },
        {
          model: this.Models.QuoteClaims,
          as: "quote_claim",
          attributes: ['id'],
        },
        {
          model: this.Models.QuoteRisks,
          as: "quote_risk",
          attributes: ['id'],
          include: [
            {
              model: this.Models.QuoteRiskDocuments,
              as: "quote_risk_documents",
              attributes: ['id']
            }
          ]
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['id', 'personalized_commission_percentage', 'personalized_deductible_id', 'personalized_discount_aggravate_percentage', 'standard_commission_percentage', 'standard_deductible_id', 'standard_discount_aggravate_percentage'],
        },
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: ['id'],
          include: [
            {
              model: this.Models.ShipmentRouteDetails,
              as: "shipment_route_details",
              attributes: ['id'],
              include: [
                {
                  model: this.Models.Countries,
                  as: "source_detail",
                  attributes: ["name", "astr_id"]
                },
                {
                  model: this.Models.Countries,
                  as: "destiny_detail",
                  attributes: ["name", "astr_id"],
                }
              ]
            },
          ]
        },
      ]
    })
  }
  /* end */

  /* quote detail for add message */
  quoteDetailForAddMessage = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id']
    })
  }
  /* end */

  /* delete quote */
  deleteQuote = async (query) => {
    return await this.Models.Quotes.destroy({ where: query });
  }
  /* end */

  /* get quote detail for price distribution  */
  getQuoteDetailsForPriceDistribution = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'insurance_type_id',
        [Sequelize.literal("(SELECT coverage_id FROM quote_basic_coverages WHERE quote_basic_coverages.quote_id = quotes.id limit 1)"), "coverage_id"],
        [Sequelize.literal("(SELECT total_limit FROM transport_goods WHERE transport_goods.quote_id = quotes.id limit 1)"), "total_limit"],
        [Sequelize.literal("(SELECT standard_insurance_rate FROM quote_calculations WHERE quote_calculations.quote_id = quotes.id limit 1)"), "standard_insurance_rate"],
      ],
      include: [
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: ['id', 'quote_id', 'road_used', 'road_percentage', 'air_used', 'air_percentage', 'maritime_used', 'maritime_percentage']
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id', 'total_limit', 'currency'],
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
              attributes: ['good_id', 'group_id', 'expenses_percentage']
            },
          ]
        },
      ]
    })
  }
  /* end */

  /* get Single imp exp quote calculations */
  getImpExpCalculation = async (query) => {
    return await this.Models.ImportExportCalculations.findAll({ where: query })
  }
  /* end */

}
