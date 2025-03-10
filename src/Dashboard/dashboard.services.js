import { Sequelize } from "sequelize";
import { ROLES } from "../../config/constants";
const Op = Sequelize.Op;
export default class Dashboard {
    async init(db) {
        this.Models = db.models;
        this.sql = db.sqlClient
    };

    /* get company user's quote ids */
    getCompanyUsersIds = async (query) => {
        const result = await this.Models.Users.findAll({
            where: query,
            attributes: ['id', 'company_id']
        });
        /* Map the quote_id values into an array */
        const quoteIds = result.map(user => user.id);
        /* Return the array of quote_ids */
        return quoteIds;
    }
    /* end */

    /* all quote count */
    getAllQuoteCount = async (query) => {
        return await this.Models.Quotes.count({ where: query });
    }
    /* end */

    /* all proposal count  */
    getAllProposalCount = async (query) => {
        return await this.Models.Proposals.count({ where: query });
    }
    /* end */

    /* get all quote details for dashboard */
    getAllQuoteDetails = async (query) => {
        return await this.Models.Quotes.findAll({
            where: query,
            attributes: ['id', 'status', 'product_id', 'premium_calculation_type']
        })
    }
    /* end */

    /* get proposal detail for dashboard */
    getProposalsDetails = async (query) => {
        return await this.Models.Proposals.findAll({
            where: query,
            attributes: ['id', 'status', 'quote_id']
        });
    }
    /* end */

    /* get claim count for dashboard */
    getClaimCount = async (query) => {
        return await this.Models.Claims.count({ where: query });
    }
    /* end */

    /* get quote graph data for every quote status */
    getQuoteGraphData = async (totalQuery) => {
        return await this.Models.Quotes.findAll(totalQuery);
    }
    /* end */

    /* get quote calculation sun for quote commission */
    getQuoteCalculationSumForQuoteCommission = async (query) => {
        return await this.Models.Quotes.findAll({
            where: query,
            attributes: [
                [
                    Sequelize.literal('SUM(quote_calculation.standard_gross_written_premium + quote_calculation.personalized_gross_written_premium)'),
                    'total_gross_written_premium',
                ],
                [
                    Sequelize.literal('SUM(quote_calculation.standard_net_written_premium + quote_calculation.personalized_net_written_premium)'),
                    'total_net_written_premium',
                ]
            ],
            include: [
                {
                    model: this.Models.QuoteCalculations,
                    as: 'quote_calculation',
                    attributes: [],
                }
            ],
            raw: true,
        });
    }
    /* end */

    /* get graph calculation for previous year */
    graphCalculatePreviousYear = async (yearGraph, previousYearQuery) => {
        return await this.Models.Transactions.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('created_on')), yearGraph],
                [Sequelize.literal(`
                    SUM(CASE 
                        WHEN \`quote_report\`.\`is_calculation_personalized\` = 0 
                        THEN \`quote_report->quote_calculation\`.\`standard_total_premium\` 
                        ELSE 0 
                    END)`), 'total_standard_premium'],
                [Sequelize.literal(`
                    SUM(CASE 
                        WHEN \`quote_report\`.\`is_calculation_personalized\` = 1 
                        THEN \`quote_report->quote_calculation\`.\`personalized_total_premium\` 
                        ELSE 0 
                    END)`), 'total_personalized_premium'],
            ],
            include: [
                {
                    model: this.Models.Quotes,
                    as: 'quote_report',
                    attributes: ['id', 'is_calculation_personalized'],
                    include: [
                        {
                            model: this.Models.QuoteCalculations,
                            as: 'quote_calculation',
                            attributes: ['standard_total_premium', 'personalized_total_premium'],
                        }
                    ]
                }
            ],
            group: [yearGraph, 'quote_report.id', 'quote_report.quote_calculation.id'],
            // group: [yearGraph],
            where: previousYearQuery,
        });
    };
    /* end */

    /* get graph calculate for current year */
    graphCalculateCurrentYear = async (yearGraph, currentYearQuery) => {
        return await this.Models.Transactions.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('created_on')), yearGraph],
                [Sequelize.literal(`
                    SUM(CASE 
                        WHEN \`quote_report\`.\`is_calculation_personalized\` = 0 
                        THEN \`quote_report->quote_calculation\`.\`standard_total_premium\` 
                        ELSE 0 
                    END)`), 'total_standard_premium'],
                [Sequelize.literal(`
                    SUM(CASE 
                        WHEN \`quote_report\`.\`is_calculation_personalized\` = 1 
                        THEN \`quote_report->quote_calculation\`.\`personalized_total_premium\` 
                        ELSE 0 
                    END)`), 'total_personalized_premium'],
            ],
            include: [
                {
                    model: this.Models.Quotes,
                    as: 'quote_report',
                    attributes: ['id', 'is_calculation_personalized'],
                    include: [
                        {
                            model: this.Models.QuoteCalculations,
                            as: 'quote_calculation',
                            attributes: ['standard_total_premium', 'personalized_total_premium'],

                        }
                    ]
                }
            ],
            group: [yearGraph, 'quote_report.id', 'quote_report.quote_calculation.id'],
            // group: [yearGraph],
            where: currentYearQuery,
        });
    };
    /* end */

    /* get sub admin moderate quote count */
    getSubAdminModerateCount = async (query) => {
        return await this.Models.Quotes.count({ where: query });
    }
    /* end */

    /* get sub admin brokers */
    getSubAdminBrokers = async (query) => {
        const result = await this.Models.Companies.findAll({
            where: query,
            attributes: ['id', 'responsible_id'],
            include: [
                {
                    model: this.Models.Users,
                    attributes: ["id", "company_id", 'role_id'],
                    as: "company_detail",
                    where: {
                        role_id: ROLES.BROKER
                    }
                },
            ],
        });
        return await result.flatMap(company =>
            company.company_detail.map(user => user.id) // Extract user id from company_detail
        );
    }
    /* end */

    getSubAdminAgency = async (query) => {
        const result = await this.Models.Users.findAll({
            where: query,
            attributes: ['id', 'company_id', "role_id", "created_by_id"],
            include: [
                {
                    model: this.Models.Companies,
                    attributes: ["id", "responsible_id"],
                    as: "company",
                    where: {
                        id: Sequelize.col('users.company_id')
                    }
                },
            ],
        });
        return await result.map(({ id }) => id);
    }

    /* get count of policy ending in current month */
    getPoliciesEndingInCurrentMonth = async (query) => {
        return await this.Models.Proposals.findAll({
            where: query,
            attributes: ['id', 'policy_id', 'policy_end_date', 'is_renewed'],
            include: [
                {
                    model: this.Models.Claims,
                    as: 'proposal_claims',
                    attributes: ['id', 'proposal_id', 'total_indemnity']
                },
                {
                    model: this.Models.Quotes,
                    as: 'quote',
                    attributes: ['id', 'uuid', 'company_id', 'user_id', 'is_calculation_personalized'],
                    include: [
                        {
                            model: this.Models.Companies,
                            as: 'quote_company',
                            attributes: ['company_name']
                        },
                        {
                            model: this.Models.Users,
                            as: 'user',
                            attributes: ['name']
                        },
                        {
                            model: this.Models.QuoteCalculations,
                            as: "quote_calculation",
                            attributes: ['standard_commission_percentage', 'personalized_commission_percentage', 'standard_total_premium', 'personalized_total_premium'],
                        },
                    ]
                },
            ]
        });
    }
    /* end */

    /* get companies data from reports according to the current month*/
    getCompaniesFromReports = async (query) => {
        return await this.Models.Transactions.findAll({
            where: query,
            attributes: [
                [Sequelize.fn('sum', Sequelize.col('total_gross_written_premium')), 'total_gross_written_premium']]
        });
    }
    /* end */

    /* total claims of the company in the current month */
    totalClaimsInCurrentMonth = async (query) => {
        return await this.Models.Claims.findAll({
            where: query,
            attributes: [
                [Sequelize.fn('sum', Sequelize.col('total_indemnity')), 'total_indemnity']]
        })
    }
    /* end */

    /* get company user's quote total commission */
    totalCompanyUsersQuoteCommission = async (query) => {
        return await this.Models.Transactions.sum('broker_commission', {
            where: query
        });
    }
    /* end */
}