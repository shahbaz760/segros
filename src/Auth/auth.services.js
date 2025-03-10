import { Sequelize } from "sequelize";
const Op = Sequelize.Op;
class Auth {
  async init(db) {
    this.Models = db.models;
    this.sql = db.sqlClient
  };

  /* get user by email */
  getUserByEmail = async (email) => {
    return await this.Models.Users.findOne({ where: { email }, attributes: ["id", "email", "uuid", "role_id"], raw: true })
  };
  /* end */

  /* get user by ruc */
  getUserByRuc = async (ruc) => {
    return await this.Models.Users.findOne({ where: { ruc }, attributes: ["id", "uuid"], raw: true })
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
          model: this.Models.UserDetails,
          as: "user_detail"
        },
        {
          model: this.Models.Companies,
          as: "company",
          include: [
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
  /* end */

  /* get user by query */
  getUser = async (query) => {
    return await this.Models.Users.findOne({
      where: query,
      raw: true,
      nest: true,
      include: [
        {
          model: this.Models.UserAccesses,
          as: "user_access"
        },
        {
          model: this.Models.AuthorityLevels,
          as: "authority_level",
          attributes: ['id', 'microsoft_group_id', 'imp_exp_limit', 'access_type', 'type']
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
        {
          model: this.Models.Users,
          as: "created_by_detail",
          //  attributes: ["id", "name", "email"],
          include: [

            {
              model: this.Models.Companies,
              as: "company",
              // attributes: ["id", "company_name", "ruc", "company_phone", "authority_level_id", 'agency_id'],
              // include: [
              //   {
              //     model: this.Models.AuthorityLevels,
              //     as: "authority_levels",
              //     attributes: ['id', 'imp_exp_limit']
              //   },
              // ]
            },
          ]
        },
      ]
    })
  };
  /* end */

  /* update user */
  updateUser = async (query, payload) => {
    return await this.Models.Users.update(payload, { where: query })
  };
  /* end */

  /* get user company existence */
  getUserCompanyExistence = async (query) => {
    return await this.Models.Companies.findOne({
      where: query,
      attributes: ["id"],
      include: [
        {
          model: this.Models.CompanyAddresses,
          as: "company_address",
          attributes: ["id"],
        },
        {
          model: this.Models.CompanyBanks,
          as: "company_bank",
        },
      ]
    })
  };
  /* end */

  /* get user company */
  getUserCompany = async (query) => {
    return await this.Models.Companies.findOne({
      where: query,
      include: [
        {
          model: this.Models.CompanyRoles,
          as: "company_roles"
        },
        {
          model: this.Models.CompanyAddresses,
          as: "company_address",
        },
        {
          model: this.Models.CompanyBanks,
          as: "company_bank",
        },
      ]
    })
  };
  /* end */

  /* update company */
  updateUserCompany = async (payload, query) => {
    return await this.Models.Companies.update(payload, { where: query })
  };
  /* end */

  /* create company */
  createUserCompany = async (payload) => {
    return await this.Models.Companies.create(payload)
  };
  /* end */

  /* create company address */
  createUserCompanyAddress = async (payload) => {
    return await this.Models.CompanyAddresses.create(payload)
  };
  /* end */

  /* update user company address */
  updateUserCompanyAddress = async (payload, query) => {
    return await this.Models.CompanyAddresses.update(payload, { where: query })
  };
  /* end */

  /* get agency details */
  getAgency = async (query) => {
    return await this.Models.Users.findOne({ query });
  }
  /* end */

  /* get microsoft group data from authority table */
  getMicrosoftGroupId = async (query) => {
    return await this.Models.AuthorityLevels.findOne({
      where: query,
      attributes: ['id', 'type', 'microsoft_group_id', 'imp_exp_limit', 'access_type', 'commission',]
    });
  }
  /* end */


  getAuthorityLevels = async (query) => {
    return await this.Models.AuthorityLevels.findOne({ where: query });
  }

  createCompanyRoles = async (payload) => {
    return await this.Models.CompanyRoles.create(payload);
  }

  getCompanyRoles = async (query) => {
    return await this.Models.CompanyRoles.findOne({ where: query, attributes: ['id'] });
  }
}

module.exports = Auth;