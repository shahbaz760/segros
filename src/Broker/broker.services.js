import { Sequelize, } from "sequelize";
import { SORTING } from "../../config/constants";
const Op = Sequelize.Op;

export default class Broker {
  async init(db) {
    this.Models = db.models;
    this.sql = db.sqlClient
  };

  /* get user by query */
  getUser = async (query) => {
    return await this.Models.Users.findOne({
      where: query,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: this.Models.UserDetails,
          as: "user_detail"
        },
        {
          model: this.Models.UserAccesses,
          as: "user_access"
        },
      ],
    })
  };
  /* end */

  /* get broker  */
  getBroker = async (query) => {
    return await this.Models.Users.findOne({
      where: query,
      include: [
        {
          model: this.Models.Companies,
          as: "company",
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

  /* get broker count */
  getBrokerCount = async (query) => {
    return await this.Models.Users.count({
      where: query,
    })
  };
  /* end */

  /* get broker list */
  getBrokerList = async (query, detail) => {
    if (detail && detail.search && detail.search.value != "") {
      query = {
        [Op.or]: [
          { id: { [Op.like]: "%" + detail.search.value + "%" } },
          { company_name: { [Op.like]: "%" + detail.search.value + "%" } },
          { phone: { [Op.like]: "%" + detail.search.value + "%" } },
          { email: { [Op.like]: "%" + detail.search.value + "%" } },
          { company_reg_no: { [Op.like]: "%" + detail.search.value + "%" } },
        ],
        ...query
      }
    }
    return await this.Models.Users.findAll({
      having: query,
      attributes: ['id', 'uuid', 'email', 'company_id', 'phone', 'status', "role_id", "deleted_at",
        [Sequelize.literal("(SELECT agency_id FROM companies WHERE companies.id = users.company_id limit 1)"),
          "agency_id"],
        [Sequelize.literal("(SELECT company_reg_no FROM companies WHERE companies.id = users.company_id limit 1)"),
          "company_reg_no"],
        [Sequelize.literal("(SELECT company_name FROM companies WHERE companies.id = users.company_id limit 1)"),
          "company_name"]],
      offset: detail.start,
      limit: detail.length == 0 ? null : detail.length,
      order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
    })
  };
  /* end */

  /* update user address */
  updateUserAddress = async (query, payload) => {
    return await this.Models.UserAddresses.update(payload, { where: query })
  };
  /* end */

  updateUser = async (payload, query) => {
    return await this.Models.Users.update(payload, { where: query })

  }
  /* update user detail */
  updateUserDetail = async (payload, query) => {
    return await this.Models.UserDetails.update(payload, { where: query })
  };
  /* end */
  /* get user by ruc */
  getUserByRuc = async (query) => {
    return await this.Models.Users.findOne({ where: query, attributes: ["id", "uuid"] })
  };
  /* end */
};