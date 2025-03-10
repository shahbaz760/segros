import { Sequelize } from "sequelize";
import { SORTING } from '../../config/constants';
const Op = Sequelize.Op;
export default class SubAdmin {
  async init(db) {
    this.Models = db.models;
    this.sql = db.sqlClient
  };
  /* get user by email */
  getUserByEmail = async (email) => {
    return await this.Models.Users.findOne({ where: { email: email, deleted_at: null }, attributes: ["id", "email"], raw: true })
  };
  /* end */

  /* create user */
  createUser = async (payload) => {
    return await this.Models.Users.create(payload);
  };
  /* end */

  /* create user address */
  createUserAddress = async (payload) => {
    return await this.Models.UserAddresses.create(payload);
  };
  /* end */

  /* create user detail */
  createUserDetail = async (payload) => {
    return await this.Models.UserDetails.create(payload);
  };
  /* end */

  /* get user by id */
  getUserById = async (userId) => {
    return await this.Models.Users.findOne({
      where: {
        id: userId,
        deleted_at: null
      },
      include: [
        {
          model: this.Models.AuthorityLevels,
          as: "authority_level",
          attributes: ['id', 'imp_exp_limit']
        },
        {
          model: this.Models.Companies,
          as: "company",
          include: [
            // {
            //   model: this.Models.AuthorityLevels,
            //   as: "authority_levels",
            //   attributes: ['id', 'imp_exp_limit']
            // },
            {
              model: this.Models.CompanyAddresses,
              as: "company_address",
            },
            {
              model: this.Models.CompanyBanks,
              as: "company_bank",
            },
            {
              model: this.Models.CompanySettings,
              as: "company_setting"
            },
          ]
        },
      ],
      attributes: { exclude: ['password'] }
    })
  };

  /* get user by query */
  getUser = async (query) => {
    return await this.Models.Users.findOne({
      where: query,
      include: [
        {
          model: this.Models.AuthorityLevels,
          as: "authority_level",
          attributes: ['id', 'imp_exp_limit']
        },
        {
          model: this.Models.Companies,
          as: "company",
          // include: [
          // {
          //   model: this.Models.AuthorityLevels,
          //   as: "authority_levels",
          //   attributes: ['id', 'imp_exp_limit']
          // },
          // ]
        },
      ],
      attributes: { exclude: ['password'] }
    })
  };
  /* end */

  /* update user address */
  updateUserAddress = async (query, payload) => {
    return await this.Models.UserAddresses.update(payload, { where: query })
  };
  /* end */

  /* update user detail */
  updateUserDetail = async (payload, query) => {
    return await this.Models.Companies.update(payload, { where: query })
  };
  /* end */

  /* update user */
  updateUser = async (payload, query) => {
    return await this.Models.Users.update(payload, { where: query })
  };
  /* end */

  /* get sub admin count*/
  getsubAdminCount = async (query) => {
    return await this.Models.Users.count({
      where: query,
    })
  };
  /* end */

  /* get all sub admin list*/
  getAllSubAdminList = async (query, detail) => {
    if (detail && detail.search && detail.search.value != "") {
      query = {
        [Op.or]: [
          { email: { [Op.like]: "%" + detail.search.value + "%" } },
          { name: { [Op.like]: "%" + detail.search.value + "%" } },
          { company_name: { [Op.like]: "%" + detail.search.value + "%" } },
          { company_ruc: { [Op.like]: "%" + detail.search.value + "%" } },
          { phone: { [Op.like]: "%" + detail.search.value + "%" } },
        ],
        ...query
      }
    }
    return await this.Models.Users.findAll({
      having: query,
      attributes: ['id', 'uuid', 'email', 'phone', 'status', "name", "deleted_at", "role_id",
        [Sequelize.literal("(SELECT company_name FROM companies WHERE companies.id = users.company_id limit 1)"),
          "company_name"],
        [Sequelize.literal("(SELECT ruc FROM companies WHERE companies.id = users.company_id limit 1)"),
          "company_ruc"]],
      order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
      offset: detail.start,
      limit: detail.length == 0 ? null : detail.length,
    })
  };
  /* end */

  /* get quote detail */
  getQuoteDetail = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id'],
      include: [
        {
          model: this.Models.TransportGoods,
          as: 'transport_good',
          attributes: ['total_limit', 'currency']
        },
      ]
    })
  }
  /* end */

  /* get authority level */
  getAuthorityLevelIds = async (query) => {
    const result = await this.Models.AuthorityLevels.findAll({
      where: query,
      attributes: ['id']
    })
    return await result.map(({ id }) => id);
  }
  /* end */

  /* get sub admins list */
  getSubAdmins = async (query) => {
    return await this.Models.Users.findAll({
      having: query,
      attributes: ['id', 'name', 'deleted_at', 'role_id', "authority_level_id",
        // [Sequelize.literal("(SELECT authority_level_id FROM companies WHERE companies.id = users.company_id limit 1)"), "authority_level_id"],
      ],
    })
  }
  /* end */

  /* get old proposal */
  getProposal = async (query) => {
    return await this.Models.Proposals.findOne({
      where: query,
      attributes: ['id', 'proposal_no']
    });
  }
  /* end */

  /* get renewed proposals */
  getRenewedProposal = async (query) => {
    return await this.Models.RenewProposals.findOne({
      where: query,
      // attributes:['id']
    });
  }
  /* end */

  /* update proposal */
  updateProposal = async (payload, query) => {
    return await this.Models.Proposals.update(payload, { where: query });
  }
  /* end */

  /* create new proposal */
  createNewProposal = async (payload) => {
    return await this.Models.RenewProposals.create(payload);
  }
  /* end */

  /* get renewed policies */
  getRenewedPolicies = async () => {
    return await this.Models.RenewProposals.findAll({ attributes: ['id', 'new_proposal_id', 'proposal_id'] });
  }
  /* end */

  /* get policy ids */
  getPolicyIds = async (query, detail) => {
    return await this.Models.Proposals.findAll({
      where: query,
      offset: detail.start,
      limit: detail.length == 0 ? null : detail.length,
      order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
      attributes: ['id', 'proposal_no', 'policy_id']
    });
  }
  /* end */

  /* get quote details for sub admin */
  getQuoteDetailsForSubadmin = async (query) => {
    return await this.Models.Quotes.findOne({
      where: query,
      attributes: ['id', 'product_id', 'insurance_type_id', 'status_reason', 'customer_id'],
      include: [
        {
          model: this.Models.Products,
          as: 'product_details',
          attributes: ['name']
        },
        {
          model: this.Models.InsuranceTypes,
          as: 'insurance_type',
          attributes: ['name']
        },
        {
          model: this.Models.TransportGoods,
          as: 'transport_good',
          attributes: ['total_limit']
        },
        {
          model: this.Models.Companies,
          as: "quote_company",
          attributes: ['company_name']
        }
      ]
    });
  }
  /* end */

  /* get sub admin list by id */
  getSubAdminById = async (query) => {
    return await this.Models.Users.findOne({
      where: query,
      attributes: ['id', 'name', 'email']
    });
  }
  /* end */

  /* update quote details */
  updateQuote = async (payload, query) => {
    return await this.Models.Quotes.update(payload, { where: query });
  }
  /* end */
}
