import { ROLES, SORTING } from "../../config/constants";
export default class Client {
    async init(db) {
        this.Models = db.models;
        this.sql = db.sqlClient
    };
    /* get client list */
    getClientList = async (query, detail) => {
        return await this.Models.Companies.findAll({
            where: query,
            order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
            offset: detail.start,
            limit: detail.length == 0 ? null : detail.length,
            attributes: ["id", "uuid", "company_name", "ruc", "customer_score", "total_premium", "total_claim_amount", "company_email", "company_phone", "deleted_at",
            ],
            include: [
                {
                    model: this.Models.CompanyRoles,
                    as: "company_roles",
                    attributes: ['company_id', 'role_id'],
                    required: true,
                    where: { role_id: ROLES.CUSTOMER }
                }
            ]
        });
    }
    /* end */

    /*  get quote company ids to get customer  */
    getQuoteCompanyIds = async (query) => {
        return await this.Models.Quotes.findAll({
            where: query,
            attributes: ['company_id']
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

    /* get user by email */
    getUserByEmail = async (query) => {
        return await this.Models.Companies.findOne({ where: query, attributes: ["id", "company_email"] })
    };
    /* end */

    /* create customer */
    addCustomer = async (payload) => {
        return await this.Models.Companies.create(payload);
    }
    /* end */

    /*add customer address */
    addCustomerAddress = async (payload) => {
        return await this.Models.CompanyAddresses.create(payload)
    }
    /* end */

    /* add customer roles */
    addCompanyRoles = async (payload) => {
        return await this.Models.CompanyRoles.create(payload);
    }
    /* end */

    /* get company details */
    getCompanyDetails = async (query) => {
        return await this.Models.Companies.findOne({
            where: query,
            include: [
                {
                    model: this.Models.CompanyAddresses,
                    as: 'company_address'
                }
            ]
        })
    }
    /* end */

    /* update company details */
    updateCompany = async (payload, query) => {
        return await this.Models.Companies.update(payload, { where: query });
    }
    /* end */

    /* update company address */
    updateCompanyAddress = async (payload, query) => {
        return await this.Models.CompanyAddresses.update(payload, { where: query });
    }
    /* end */

    /* get user by ruc */
    getUserByRuc = async (query) => {
        return await this.Models.Companies.findOne({ where: query, attributes: ["id", "uuid", "ruc"], raw: true })
    };
    /* end */
}