import { Sequelize } from "sequelize";
import { ROLES, SORTING } from '../../config/constants';
const Op = Sequelize.Op;
export default class Company {
    async init(db) {
        this.Models = db.models;
        this.sql = db.sqlClient
    };
    /* get companies list */
    getCompaniesList = async (query, detail) => {
        return await this.Models.Companies.findAll({
            where: query,
            offset: detail.start,
            limit: detail.length == 0 ? null : detail.length,
            order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
            attributes: ['id', 'uuid', 'company_name', 'company_email', 'ruc', 'status'],
            include: [
                {
                    model: this.Models.CompanyRoles,
                    as: "company_roles",
                    attributes: ['company_id', 'role_id'],
                    required: true,
                    where: { role_id: ROLES.BROKER }
                }
            ]
        });
    }
    /* end */

    /* get company broker and sub broker list */
    getCompanyUsersList = async (query, detail) => {
        return await this.Models.Users.findAll({
            having: query,
            attributes: ['id', 'company_id', 'uuid', 'ruc', 'last_login', 'name', 'created_by_id', 'email', 'phone', 'status', "role_id", "deleted_at",
                [Sequelize.literal("(SELECT company_name FROM companies WHERE companies.id = users.company_id limit 1)"), "company_name"]],
            offset: detail.start,
            limit: detail.length == 0 ? null : detail.length,
            order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
        })
    }
    /* end */

    /* update user */
    updateUser = async (query, payload) => {
        return await this.Models.Users.update(payload, { where: query })
    };
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

    /* update company bank details */
    updateCompanyBankDetails = async (payload, query) => {
        return await this.Models.CompanyBanks.update(payload, { where: query });
    }
    /* end */

    /* update company setting */
    updateCompanySetting = async (payload, query) => {
        return await this.Models.CompanySettings.update(payload, { where: query })
    };
    /* end */

    /* get company details */
    getCompanyDetails = async (query) => {
        return await this.Models.Companies.findOne({
            where: query,
            attributes: ['id', 'ruc', 'company_email', 'company_name', /*'authority_level_id', 'agency_id',*/ 'responsible_id'],
            include: [
                // {
                //     model: this.Models.AuthorityLevels,
                //     as: "authority_level",
                //     attributes: ['id', 'imp_exp_limit']
                // },
                {
                    model: this.Models.CompanyAddresses,
                    as: "company_address",
                    attributes: ['address', 'address_number', 'neighborhood', 'city', 'state', 'zipcode']
                },
                {
                    model: this.Models.CompanyBanks,
                    as: "company_bank",
                    attributes: ['bank_number', 'bank_agency_number', 'bank_account_number', 'bank_account_code']
                },
                {
                    model: this.Models.CompanySettings,
                    as: 'company_setting',
                    attributes: ['moderation_notification', 'moderation_notification_emails', 'billing_endorsement_notification', 'billing_endorsement_notification_emails', 'sporadic_notification', 'sporadic_notification_emails']
                }
            ]
        })
    }
    /* end */

    /* get company by ruc */
    getCompanyRuc = async (query) => {
        return await this.Models.Companies.findOne({
            where: query,
            attributes: ['ruc', 'uuid']
        });
    }
    /* end */

    /* get company by uuid */
    getCompanyByUUID = async (query) => {
        return await this.Models.Companies.findOne({ where: query, attributes: ['id', 'uuid'] });
    }
    /* end */
}