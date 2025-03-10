import { Sequelize } from "sequelize";
import { SORTING } from '../../config/constants';
const Op = Sequelize.Op;
export default class Agency {
  async init(db) {
    this.Models = db.models;
    this.sql = db.sqlClient
  };

  /* get user by email */
  getUserByEmail = async (email) => {
    return await this.Models.Users.findOne({ where: { email: email }, attributes: ["id", "email"], raw: true })
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

  /* get user by query */
  getUser = async (query) => {
    return await this.Models.Users.findOne({
      where: query,
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

  /* update user */
  updateUser = async (query, payload) => {
    return await this.Models.Users.update(payload, { where: query })
  };
  /* end */

  /* update user address */
  updateUserAddress = async (query, payload) => {
    return await this.Models.UserAddresses.update(payload, { where: query })
  };
  /* end */

  /* update user detail */
  updateUserDetail = async (query, payload) => {
    return await this.Models.UserDetails.update(payload, { where: query })
  };
  /* end */

  /* get agency count*/
  getAgencyCount = async (query) => {
    return await this.Models.Users.count({
      where: query,
    })
  };
  /* end */

  /* get all agency */
  getAgencyList = async (query, detail) => {
    if (detail && detail.search && detail.search.value != "") {
      query = {
        [Op.or]: [
          { id: { [Op.like]: "%" + detail.search.value + "%" } },
          { email: { [Op.like]: "%" + detail.search.value + "%" } },
          { name: { [Op.like]: "%" + detail.search.value + "%" } },
          { company_name: { [Op.like]: "%" + detail.search.value + "%" } },
          { ruc: { [Op.like]: "%" + detail.search.value + "%" } },
          { company_ruc: { [Op.like]: "%" + detail.search.value + "%" } },
        ],
        ...query
      }
    }
    return await this.Models.Users.findAll({
      having: query,
      attributes: ['id', 'uuid', 'email', 'phone', 'status', "name", "ruc", "deleted_at", "role_id",
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
}