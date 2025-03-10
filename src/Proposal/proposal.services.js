import { Sequelize } from "sequelize";
import { SORTING } from "../../config/constants";
const Op = Sequelize.Op;
export default class Proposal {
  async init(db) {
    this.Models = db.models;
    this.sql = db.sqlClient
  };
  /* get quote detail to create proposal */
  getQuoteForCreateProposal = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'uuid', 'user_id', 'company_id', 'premium_calculation_type', 'created_by_id', 'is_calculation_personalized', 'insurance_type_id', /*'tax_scvs', 'tax_ssc', 'tax_emission', 'tax_iva',*/
        [Sequelize.literal('(SELECT name FROM products WHERE products.id = quotes.product_id limit 1)'), 'product_name'],
      ],
      include: [
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['standard_commission_percentage', 'personalized_commission_percentage', 'standard_is_discount_load', 'personalized_is_discount_load', 'standard_discount_aggravate_percentage', 'personalized_discount_aggravate_percentage', 'standard_gross_written_premium', 'personalized_gross_written_premium',
            'standard_insurance_rate', 'personalized_insurance_rate', 'standard_total_premium', 'personalized_total_premium', 'standard_total_insurance_cost', 'personalized_total_insurance_cost', 'personalized_tax_scvs', 'personalized_tax_ssc', 'personalized_tax_emission', 'personalized_tax_iva', 'standard_tax_scvs', 'standard_tax_ssc', 'standard_tax_emission', 'standard_tax_iva'],
        },
        {
          model: this.Models.Companies,
          as: 'quote_company',
          attributes: ['id', 'ruc', 'company_email', 'company_phone', 'company_name',
            [Sequelize.literal('(SELECT address FROM company_addresses WHERE company_addresses.company_id = quote_company.id limit 1)'), 'address'],
            [Sequelize.literal('(SELECT address_number FROM company_addresses WHERE company_addresses.company_id = quote_company.id limit 1)'), 'address_no'],
            [Sequelize.literal('(SELECT city FROM company_addresses WHERE company_addresses.company_id = quote_company.id limit 1)'), 'city'],
          ]
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['id', 'total_limit', 'estimated_for_next_12_months', 'currency'],
          include: [
            {
              model: this.Models.TransportGoodsDetails,
              as: "transport_good_details",
              attributes: ['id', 'good_id'
                // [Sequelize.literal('(SELECT name FROM goods WHERE goods.id = transport_good_details.good_id limit 1)'), 'good_name'],
              ],
            },
          ]
        },
        {
          model: this.Models.QuoteClaims,
          as: "quote_claim",
          attributes: ['id'],
        },
        {
          model: this.Models.QuoteShipments,
          as: "quote_shipment",
          attributes: ['id'],
          include: [
            {
              model: this.Models.SingleShipmentDetails,
              as: "single_shipment_detail",
              attributes: ['id', 'quote_shipment_id', 'boarding_document_number', 'boarding_document_type']
            },
            {
              model: this.Models.ShipmentDocuments,
              as: "shipment_documents",
              attributes: ['id', 'quote_shipment_id', 'name']
            },
            {
              model: this.Models.ShipmentRouteDetails,
              as: "shipment_route_details",
              attributes: ['id', 'source', 'destiny',
                // [Sequelize.literal('(SELECT name FROM countries WHERE countries.id = shipment_route_details.source limit 1)'), 'source_name'],
                // [Sequelize.literal('(SELECT name FROM countries WHERE countries.id = shipment_route_details.destiny limit 1)'), 'destination_name'],
              ],
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
      ]
    })
  }
  /* end */

  /* create proposal */
  createProposal = async (payload) => {
    return await this.Models.Proposals.create(payload);
  }
  /* end */

  /* get all quote list to create proposal */
  getQuotesListForProposal = async (query, detail) => {
    return await this.Models.Quotes.findAll({
      having: query,
      offset: detail.start,
      limit: detail.length == 0 ? null : detail.length,
      order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
      attributes: ["id", "uuid", "product_id", "user_id", "insurance_type_id", "status", "deleted_at",
        [Sequelize.literal('(SELECT name FROM products WHERE products.id = quotes.product_id limit 1)'), 'product_name'],
        [Sequelize.literal('(SELECT name FROM insurance_types WHERE insurance_types.id = quotes.insurance_type_id limit 1)'), 'insurance_type_name'],
        [Sequelize.literal('(SELECT company_name FROM companies WHERE companies.id = quotes.company_id limit 1)'), 'company_name'],
        [Sequelize.literal('(SELECT ruc FROM companies WHERE companies.id = quotes.company_id limit 1)'), 'ruc']],
    });
  };
  /* end */

  /* get proposal list */
  getProposalList = async (query, detail) => {
    return await this.Models.Proposals.findAll({
      having: query,
      offset: detail.start,
      limit: detail.length == 0 ? null : detail.length,
      order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
      attributes: ["id", "company_id", "user_id", "deleted_at", "status", "quote_id", "proposal_no", "policy_id", 'policy_pdf', "policy_end_date", "policy_start_date", "createdAt",
        [Sequelize.literal('(SELECT name FROM products WHERE products.id = (SELECT product_id FROM quotes WHERE quotes.id = proposals.quote_id LIMIT 1) LIMIT 1)'), 'product_name'],
        [Sequelize.literal('(SELECT description FROM products WHERE products.id = (SELECT product_id FROM quotes WHERE quotes.id = proposals.quote_id LIMIT 1) LIMIT 1)'), 'product_description'],
        [Sequelize.literal('(SELECT company_name FROM companies WHERE companies.id = (SELECT company_id FROM quotes WHERE quotes.id = proposals.quote_id LIMIT 1) LIMIT 1)'), 'quote_company_name'],
        [Sequelize.literal('(SELECT ruc FROM companies WHERE companies.id = (SELECT company_id FROM quotes WHERE quotes.id = proposals.quote_id LIMIT 1) LIMIT 1)'), 'quote_company_ruc'],
        [Sequelize.literal('(SELECT company_name FROM companies WHERE companies.id = (SELECT company_id FROM users WHERE users.id = (SELECT user_id FROM quotes WHERE quotes.id = proposals.quote_id LIMIT 1) LIMIT 1) LIMIT 1)'), 'broker_company_name']
      ],
      include: [
        {
          model: this.Models.Quotes,
          attributes: ['is_calculation_personalized', 'status', 'product_id', 'insurance_type_id', 'premium_calculation_type'],
          as: "quote",
          include: [
            {
              model: this.Models.QuoteCalculations,
              as: "quote_calculation",
              attributes: ['standard_commission_value', 'personalized_commission_value'],
            },
            {
              model: this.Models.TransportGoods,
              as: "transport_good",
              attributes: ['total_limit', 'currency']
            }
          ]
        }
      ]
    })
  }
  /* end */

  /* get broker list to create proposal */
  getBrokerList = async (query) => {
    return await this.Models.Users.findAll({
      where: query,
      attributes: ['id', 'name']
    });
  }
  /* end */

  /* get particular quote detail to create proposal*/
  getQuoteDetailToCreateProposal = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'uuid', 'company_id', 'premium_calculation_type', 'minimum_prize', 'status', 'is_calculation_personalized', 'insurance_type_id', 'product_id', /*'proposal_no',*/],
      include: [
        {
          model: this.Models.Companies,
          as: "quote_company",
          attributes: ['id', 'company_name']
        },
        {
          model: this.Models.TransportGoods,
          as: "transport_good",
          attributes: ['quote_id', 'estimated_for_next_12_months', 'total_limit', 'currency'],
        },
        {
          model: this.Models.QuoteClaims,
          as: "quote_claim",
          attributes: ['id'],
          include: [
            {
              model: this.Models.QuoteClaimDetails,
              as: "quote_claim_details",
              attributes: ['id', 'franchise']
            },
          ]
        },
        {
          model: this.Models.Products,
          as: "product",
          attributes: ["name"]
        },
        {
          model: this.Models.QuoteCalculations,
          as: "quote_calculation",
          attributes: ['id', 'standard_insurance_rate', 'personalized_insurance_rate', 'standard_deductible_id', 'personalized_deductible_id', 'standard_total_insurance_cost', 'personalized_total_insurance_cost', 'standard_insurance_rate', 'personalized_insurance_rate', 'standard_gross_written_premium', 'personalized_gross_written_premium', 'standard_commission_percentage', 'personalized_commission_percentage', 'standard_total_premium', 'personalized_total_premium'],
        },
        {
          model: this.Models.Users,
          attributes: ["id", "name"],
          as: "user",
        },
        {
          model: this.Models.QuoteShipments,
          attributes: ['id'],
          as: "quote_shipment",
          include: [
            {
              model: this.Models.SingleShipmentDetails,
              as: "single_shipment_detail",
              attributes: ['id', 'boarding_document_number', 'complementary_land_route', 'shipping_company', 'boarding_document_type', 'landing_city', 'landing_place', 'destination_city', 'destination_place']
            }
          ]
        }
      ]
    });
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
        'imp_exp_percentage'
      ],
      order: [['group', 'asc']],
      raw: true,
    })
  };
  /* end */

  /* get broker category */
  // getBrokerCategory = async (query) => {
  //   return await this.Models.AuthorityLevels.findOne({
  //     where: query,
  //     attributes: ['imp_exp_limit', 'discount_load'],
  //   });
  // };
  /* end */

  /* get goods for moderation */
  getGoodsForModeration = async (query) => {
    return await this.Models.Goods.findAll({
      where: query,
      attributes: [
        'name',
      ],
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
      ],
      raw: true,
    })
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

  /* get proposal details for updating proposal status*/
  getProposalDetail = async (query) => {
    return await this.Models.Proposals.findOne({
      where: query,
      attributes: ['id', 'quote_id', 'status', 'proposal_no']
    });
  }
  /* end */

  /* update proposal status */
  updateProposal = async (payload, query) => {
    return await this.Models.Proposals.update(payload, { where: query });
  }
  /* end */

  /* update quote */
  updateQuote = async (payload, query) => {
    return await this.Models.Quotes.update(payload, {
      where: query
    });
  };
  /* end */

  /* create customer */
  createCustomer = async (payload) => {
    return await this.Models.Users.create(payload);
  }
  /* end */

  /* get user by email */
  getUserByEmail = async (email) => {
    return await this.Models.Users.findOne({ where: email, attributes: ["id", "email"], raw: true })
  };
  /* end */

  /* get quote shipment documents */
  getShipmentDocuments = async (query) => {
    return await this.Models.ShipmentDocuments.findAll({
      where: query,
      attributes: ['id', 'quote_shipment_id', 'name'],
      raw: true,
    });
  }
  /** end */

  /* get occupations for proposal */
  getOccupations = async (query) => {
    return await this.Models.Occupations.findAll({
      where: query,
      attributes: ['id', 'astr_id', 'astr_description'],
      // raw: true,
    });
  }
  /* end */

  /* get heritage ranks for proposal */
  getHeritageRanks = async (query) => {
    return await this.Models.HeritageRanks.findAll({
      where: query,
      attributes: ['id', 'astr_id', 'astr_description'],
      // raw: true,
    });
  }
  /* end */

  /* get economic ranges for proposal */
  getEconomicRanges = async (query) => {
    return await this.Models.EconomicActivities.findAll({
      where: query,
      attributes: ['id', 'astr_id', 'astr_description'],
      // raw: true,
    });
  }
  /* end */

  /* get income range values for proposal */
  getIncomeRanges = async (query) => {
    return await this.Models.IncomeRanges.findAll({
      where: query,
      attributes: ['id', 'astr_id', 'astr_description'],
      // raw: true,
    });
  }
  /* end */

  /* get heritage rang value for proposal */
  getHeritageRankValue = async (query) => {
    return await this.Models.HeritageRanks.findOne({
      where: query,
      attributes: ['id', 'astr_id']
    });
  }
  /* end */

  /* get economic activities values for proposal */
  getEconomicActivityValue = async (query) => {
    return await this.Models.EconomicActivities.findOne({
      where: query,
      attributes: ['id', 'astr_id']
    })
  }
  /* end */

  /* get occupation value based on occupation id for proposal */
  getOccupationValue = async (query) => {
    return await this.Models.Occupations.findOne({
      where: query,
      attributes: ['id', 'astr_id']
    })
  }
  /* end */

  /* get income range value based on the income range value id for proposal */
  getIncomeRangeValue = async (query) => {
    return await this.Models.IncomeRanges.findOne({
      where: query,
      attributes: ['id', 'astr_id']
    })
  }
  /* end */

  /* get agencies for proposal */
  getAgencies = async (query) => {
    return await this.Models.Agencies.findAll({
      where: query,
      attributes: ['id', 'astr_id', 'astr_description']
    })
  }
  /* end */

  /* get agency by id for proposal */
  getAgencyById = async (query) => {
    return await this.Models.Agencies.findOne({
      where: query,
      attributes: ['id', 'astr_id', 'astr_description']
    })
  }
  /* end */

  /* create transactions after creating proposal */
  createTransaction = async (payload) => {
    return await this.Models.Transactions.create(payload);
  }
  /* end */
}

