import { Sequelize } from "sequelize";
import { SORTING } from '../../config/constants';
const Op = Sequelize.Op;
export default class Claims {
  async init(db) {
    this.Models = db.models;
    this.sql = db.sqlClient
  };

  /* get claim partner by email */
  getClaimPartnerByEmail = async (query) => {
    return await this.Models.ClaimPartners.findOne({
      where: query,
      attributes: ["id", "email", "name", "password"],
      raw: true
    })
  };
  /* end */

  /* create claim partner */
  createClaimPartner = async (payload) => {
    return await this.Models.ClaimPartners.create(payload);
  };
  /* end */

  /* get claim partner by username */
  getProposals = async (query) => {
    return await this.Models.Proposals.findOne({
      where: query,
      attributes: ["id", "user_id", "quote_id", "company_id", 'created_by_id', 'proposal_no'],
      raw: true
    })
  };
  /* end */

  /* get claims  */
  getClaims = async (query) => {
    return await this.Models.Claims.findOne({ where: query, attributes: ["id", "user_id", "quote_id"], raw: true })
  };
  /* end */

  /* get claims  */
  createClaims = async (payload) => {
    return await this.Models.Claims.create(payload)
  };
  /* end */

  /* get agency count*/
  getClaimsCount = async (query) => {
    return await this.Models.Claims.count({
      where: query,
    })
  };
  /* end */

  /* get claim list  */
  getClaimList = async (query, detail) => {
    return await this.Models.Claims.findAll({
      having: query,
      order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
      offset: detail.start,
      limit: detail.length == 0 ? null : detail.length,
      attributes: ['id', 'user_id', 'claim_partner_id', 'quote_id', 'nr_sinistro', 'aviso_numero', 'total_indemnity', 'insurance_status', "estimativa_prejuizo", "proposal_id", "deleted_at",
        [Sequelize.literal('(SELECT policy_id FROM proposals WHERE proposals.id=claims.proposal_id  limit 1)'), 'policy_id'],
        [Sequelize.literal('(SELECT company_name FROM companies WHERE companies.id = (SELECT company_id FROM quotes WHERE quotes.id = claims.quote_id LIMIT 1) LIMIT 1)'), 'quote_company_name'],
        [Sequelize.literal('(SELECT name FROM products WHERE products.id = (SELECT product_id FROM quotes WHERE quotes.id = claims.quote_id LIMIT 1) LIMIT 1)'), 'product_name'],
      ],
      include: [
        {
          model: this.Models.Proposals,
          attributes: ['id', 'proposal_no', "policy_id"],
          as: 'proposal_details',
          //required: false
        },
        {
          model: this.Models.Quotes,
          attributes: ['id', 'company_id'],
          as: 'quotes_details',
          //required: false,
          include: [
            {
              model: this.Models.Companies,
              attributes: ['id', 'company_name'],
              as: "quote_company",
            },
            {
              model: this.Models.Products,
              attributes: ["id", "name",],
              as: "product",
              required: false,
              where: { deleted_at: null }
            },
          ]
        },
      ],
    })
  }
  /* end */

  /* get policy */
  getPolicy = async (query) => {
    return await this.Models.Proposals.findOne({
      where: query,
      attributes: ["id", "proposal_no", "policy_id", "user_id", "quote_id"],
      include: [
        {
          model: this.Models.Users,
          as: 'user_details',
          attributes: ['id', 'name'],
          where: { deleted_at: null },
          required: false
        },
        {
          model: this.Models.Quotes,
          as: 'proposals_quotes_details',
          attributes: ['id', 'company_id', "product_id", "user_id"],
          where: { deleted_at: null },
          required: false,
          include: [
            {
              model: this.Models.Products,
              as: "product_details",
              attributes: ["id", "name",],
              required: false,
              where: { deleted_at: null }
            },
          ]
        },
      ],
    })
  };
  /* end */

  /* update claims partner  */
  updateClaimPartner = async (payload, query) => {
    return await this.Models.ClaimPartners.update(payload, { where: query })
  };
  /* end */

  /*get claim partner list */
  getClaimPartner = async (query) => {
    return await this.Models.ClaimPartners.findAll({
      query,
      attributes: ['id', 'name']
    });
  }
  /* end */

  /* get client quote list */
  getClientQuoteList = async (query) => {
    return await this.Models.Quotes.findAll({
      where: query,
      attributes: ['id', 'company_id', 'user_id']
    })
  }
  /* end */
}
