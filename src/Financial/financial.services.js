import { Sequelize } from "sequelize";
import { SORTING } from "../../config/constants";
export default class Financial {
    async init(db) {
        this.Models = db.models;
        this.sql = db.sqlClient
    };
    /* get financial list */
    getFinancialList = async (query, detail) => {
        return await this.Models.Transactions.findAll({
            having: query,
            offset: detail.start,
            limit: detail.length == 0 ? null : detail.length,
            order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
            attributes: ["id", "user_id", "payment_type", "quote_id", "proposal_id", "doc_type", "total_gross_written_premium", "broker_commission", "astr_poliza",
                //[Sequelize.literal('(SELECT policy_id FROM proposals WHERE proposals.id = transactions.proposal_id  LIMIT 1)'), 'policy_id'],
                [Sequelize.literal('(SELECT company_name FROM companies WHERE companies.id = (SELECT company_id FROM quotes WHERE quotes.id = transactions.quote_id LIMIT 1) LIMIT 1)'), 'quote_company_name'],
                [Sequelize.literal('(SELECT name FROM insurance_types WHERE insurance_types.id = (SELECT insurance_type_id FROM quotes WHERE quotes.id = transactions.quote_id LIMIT 1) LIMIT 1)'), 'policy_type'],
                [Sequelize.literal('(SELECT payment_type FROM proposals WHERE proposals.id = transactions.proposal_id  LIMIT 1)'), 'proposal_payment_type'],
            ],
            include: [
                {
                    model: this.Models.Quotes,
                    as: "quote_report",
                    attributes: ['is_calculation_personalized'],
                    include: [
                        {
                            model: this.Models.QuoteCalculations,
                            as: "quote_calculation",
                            attributes: ['standard_commission_percentage', 'personalized_commission_percentage', 'standard_total_premium', 'personalized_total_premium'],
                        },
                        {
                            model: this.Models.TransportGoods,
                            as: "transport_good",
                            attributes: ['currency']
                        }
                    ]
                }
            ]
        })
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

    getFinancialList11 = async (query, detail) => {
        return await this.Models.Proposals.findAll({
            having: query,
            offset: detail.start,
            limit: detail.length == 0 ? null : detail.length,
            order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
            attributes: ["id", "user_id", "deleted_at", "proposal_payment_status", "quote_id", "policy_id", "payment_type",
                [Sequelize.literal('(SELECT company_name FROM companies WHERE companies.id = (SELECT company_id FROM quotes WHERE quotes.id = proposals.quote_id LIMIT 1) LIMIT 1)'), 'quote_company_name'],
                [Sequelize.literal('(SELECT name FROM insurance_types WHERE insurance_types.id = (SELECT insurance_type_id FROM quotes WHERE quotes.id = proposals.quote_id LIMIT 1) LIMIT 1)'), 'policy_type'],
            ],
            include: [
                {
                    model: this.Models.Quotes,
                    as: "quote",
                    attributes: ['is_calculation_personalized'],
                    include: [
                        {
                            model: this.Models.QuoteCalculations,
                            as: "quote_calculation",
                            attributes: ['standard_commission_percentage', 'personalized_commission_percentage', 'standard_total_premium', 'personalized_total_premium'],
                        },
                        {
                            model: this.Models.TransportGoods,
                            as: "transport_good",
                            attributes: ['currency']
                        }
                    ]
                }
            ]
        })
    }
}