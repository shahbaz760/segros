import { Sequelize } from "sequelize";
import { SORTING } from '../../config/constants';

const Op = Sequelize.Op;
export default class Common {
  async init(db) {
    this.Models = db.models;
    this.sql = db.sqlClient
  };

  /* get responsible list */
  getResponsibleList = async (query) => {
    return await this.Models.Users.findAll({
      where: query,
      attributes: ['id', 'name'],
    });
  };
  /* end */

  /* get broker category list */
  getBrokerCategoryList = async (query) => {
    return await this.Models.AuthorityLevels.findAll({ where: query, attributes: { exclude: ['createdAt', 'updatedAt'] } })
  };
  /* end */

  /* get all banks */
  getAllBanks = async () => {
    return await this.Models.Banks.findAll({ where: { is_active: 1 }, raw: true })
  };
  /* end */

  /* get user by query */
  getUser = async (query) => {
    return await this.Models.Users.findOne({
      where: query,
      include: [
        {
          model: this.Models.UserAccesses,
          as: "user_access"
        },
        {
          model: this.Models.Users,
          as: "created_by_detail",
          attributes: ['company_id'],
          include: [
            {
              model: this.Models.Companies,
              as: "company",
              attributes: ['company_name', 'company_reg_no', 'ruc'],
            },
          ]
        },
        {
          model: this.Models.Companies,
          as: "company",
          attributes: ['company_name', 'company_reg_no', 'ruc'],
        },
      ],
      attributes: { exclude: ['password'] }
    })
  };
  /* end */

  /* get user by id */
  getUserById = async (query) => {
    return await this.Models.UserAddresses.findOne({
      where: query,
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
      attributes: { exclude: ['password'] }
    })
  }
  /* end */

  /* update user */
  updateUser = async (query, payload) => {
    return await this.Models.Users.update(payload, { where: query })
  };
  /* end */

  /* create user */
  createUser = async (payload) => {
    return await this.Models.Users.create(payload);
  };
  /* end */

  /* create user access */
  createUserAccess = async (payload) => {
    return await this.Models.UserAccesses.create(payload);
  };
  /* end */

  /* create user detail */
  createUserDetail = async (payload) => {
    return await this.Models.UserDetails.create(payload);
  };
  /* end */

  /* get lower broker category */
  getLowerBrokerCategory = async (query) => {
    return await this.Models.AuthorityLevels.findAll({
      limit: 1,
      order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
      raw: true,
    })
  };
  /* end */

  /* get sub broker or sub agency list */
  subBrokerOrSubAgencyList = async (query, detail) => {
    if (detail && detail.search && detail.search.value != "") {
      query = {
        [Op.or]: [
          { id: { [Op.like]: "%" + detail.search.value + "%" } },
          { name: { [Op.like]: "%" + detail.search.value + "%" } },
          { company_name: { [Op.like]: "%" + detail.search.value + "%" } },
          { phone: { [Op.like]: "%" + detail.search.value + "%" } },
          { email: { [Op.like]: "%" + detail.search.value + "%" } },
          { company_reg_no: { [Op.like]: "%" + detail.search.value + "%" } },
          { ruc: { [Op.like]: "%" + detail.search.value + "%" } },
        ],
        ...query
      }
    }
    return await this.Models.Users.findAll({
      having: query,
      attributes: ['id', 'uuid', 'ruc', 'last_login', 'name', 'created_by_id', 'email', 'phone', 'status', "role_id", "deleted_at",
        [Sequelize.literal("(SELECT company_name FROM companies WHERE companies.id = users.company_id limit 1)"), "company_name"]],
      include: [
        {
          model: this.Models.Users,
          as: "created_by_detail",
          attributes: ['company_id'],
          include: [
            {
              model: this.Models.Companies,
              as: "company",
              attributes: ['company_name', 'company_reg_no'],
              include: [
                {
                  model: this.Models.CompanyRoles,
                  as: "company_roles",
                  attributes: ['company_id', 'role_id']
                },
              ]
            },
          ]
        },
      ],
      offset: detail.start,
      limit: detail.length == 0 ? null : detail.length,
      order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
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

  /* create user address */
  createUserAddress = async (payload) => {
    return await this.Models.UserAddresses.create(payload);
  };
  /* end */

  /* update user access */
  updateUserAccess = async (query, payload) => {
    return await this.Models.UserAccesses.update(payload, { where: query })
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

  /* get api log list */
  getApilogList = async (query, detail) => {
    return await this.Models.ApiLogs.findAll({
      having: query,
      attributes: ['uuid', 'request_id', 'type', 'log_type', 'message', 'createdAt'],
      offset: detail.start,
      limit: detail.length == 0 ? null : detail.length,
      order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
    });
  }
  /* end */

  /* get api log by uuid */
  getApilogByUuid = async (query) => {
    return await this.Models.ApiLogs.findOne({
      where: query,
      attributes: ['request_id', 'ip_address', 'login_user_id', 'uuid', 'type', 'log_type', 'message', 'response', 'request_payload',
        [Sequelize.literal("(SELECT name FROM users WHERE users.id = api_logs.login_user_id limit 1)"), "login_user_name"],
        [Sequelize.literal("(SELECT email FROM users WHERE users.id = api_logs.login_user_id limit 1)"), "login_user_email"],
      ]
    });
  }
  /* end */

  /* get distinct request IDs */
  getRequestIds = async () => {
    return this.Models.ApiLogs.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('request_id')), 'request_id'],
      ],
      raw: true,
    });
  }
  /* end */

  /* get distinct parent types */
  getParentTypeList = async () => {
    return this.Models.ApiLogs.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('type')), 'type']],
      raw: true,
    });
  }
  /* end */

  /* get distinct child types */
  getChildTypeList = () => {
    return this.Models.ApiLogs.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('log_type')), 'log_type']],
      raw: true,
    });
  }
  /* end */

  /*get broker by uuid */
  getBrokerByUuid = (query) => {
    return this.Models.Users.findOne({
      where: query,
      attributes: ['id', 'name', 'email', 'ruc', 'phone']
    })
  }
  /*end */
}