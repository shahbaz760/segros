import { Sequelize } from "sequelize";
export default class Transaction {
    async init(db) {
        this.Models = db.models;
        this.sql = db.sqlClient
    };
    /* get agency list */
    getAgencyList = async (query) => {
        return await this.Models.Users.findAll({
            where: query,
            attributes: ['id', 'name'],
        });
    }
    /* end */

    /* get companies list */
    getCompaniesList = async (query) => {
        return await this.Models.Companies.findAll({
            where: query,
            attributes: ['id', 'company_name'],
        });
    }
    /* end */

    /* get broker list */
    getBrokerList = async (query) => {
        return await this.Models.Users.findAll({
            where: query,
            attributes: ['id', 'name'],
        })
    }
    /* end */

    /* get production report data */
    getProductionReport = async (query) => {
        return await this.Models.Transactions.findAll({
            having: query,
            attributes: ['id', 'currency', 'total_gross_written_premium', 'premium_calculation_type', 'company_id', 'user_id', 'created_on', 'doc_type',
                [Sequelize.literal("(SELECT company_name FROM companies WHERE companies.id = transactions.company_id limit 1)"),
                    "company_name"],
            ],
        });
    }
    /* end */

    /* get sum and count of production report */
    getProductionReportSumAndCount = async (query) => {
        return await this.Models.Transactions.findAll(query);
    }
    /* end */

    /* get production report graph data */
    getGraphReportData = async (query) => {
        return await this.Models.Transactions.findAll({
            where: query,
            attributes: ['total_gross_written_premium', 'created_on']
        })
    }
    /* end */

    /* get claim report data */
    getClaimsReportData = async (query) => {
        return await this.Models.Transactions.findAll({
            having: query,
            attributes: ['user_id', 'converted_to_R$_amount', 'proposal_id', 'created_on', 'company_id', 'user_id', 'quote_id', 'astr_poliza',
                [Sequelize.literal("(SELECT insurance_type_id FROM quotes WHERE quotes.id = transactions.quote_id limit 1)"), "insurance_type_id"],
                [Sequelize.literal("(SELECT product_id FROM quotes WHERE quotes.id = transactions.quote_id limit 1)"), "product_id"],
                [Sequelize.literal("(SELECT name FROM users WHERE users.id = transactions.user_id limit 1)"), "broker_name"],
                [Sequelize.literal("(SELECT policy_start_date FROM proposals WHERE proposals.id = transactions.proposal_id limit 1)"), "start_date"],
                [Sequelize.literal("(SELECT policy_end_date FROM proposals WHERE proposals.id = transactions.proposal_id limit 1)"), "end_date"],
                //  [Sequelize.literal("(SELECT policy_id FROM proposals WHERE proposals.id = transactions.proposal_id limit 1)"), "policy_id"],
                [Sequelize.literal("(SELECT company_name FROM companies WHERE companies.id = transactions.company_id limit 1)"), "company_name"],
                [Sequelize.literal("(SELECT name FROM products WHERE products.id = (SELECT product_id FROM quotes WHERE quotes.id = transactions.quote_id limit 1) limit 1)"), "product_name"],
                [Sequelize.literal("(SELECT name FROM insurance_types WHERE insurance_types.id = (SELECT insurance_type_id FROM quotes WHERE quotes.id = transactions.quote_id limit 1) limit 1)"), "insurance_type_name"],
            ]
        });
    }
    /* end */

    /* get claims total indemnity sum */
    getClaimsIndemnitySum = async (query) => {
        return await this.Models.Claims.findOne(query);
    }
    /* end */

    /* get claim report graph data */
    getProductReportGraphData = async (query) => {
        return await this.Models.Transactions.findAll({
            having: query,
            attributes: ['quote_id', 'company_id', 'converted_to_R$_amount', 'created_on',
                [Sequelize.literal("(SELECT product_id FROM quotes WHERE quotes.id = transactions.quote_id limit 1)"), "product_id"],
                [Sequelize.literal("(SELECT insurance_type_id FROM quotes WHERE quotes.id = transactions.quote_id limit 1)"), "insurance_type_id"],
            ]
        })
    }
    /* end */

}