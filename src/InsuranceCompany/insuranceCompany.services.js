import { Sequelize } from "sequelize";
const Op = Sequelize.Op;
export default class InsuranceCompany {
    async init(db) {
        this.Models = db.models;
        this.sql = db.sqlClient
    };

    /* get quote details for proposal */
    getQuoteDetailForProposal = async (query) => {
        return await this.Models.Quotes.findOne({
            having: query,
            attributes: ['id', 'insurance_type_id', 'user_id', 'product_id', 'is_calculation_personalized', 'company_id','proposal_no', 'premium_calculation_type', 'insurance_type_id', 'minimum_prize', 'deductible_amount', 'quote_pdf', 'created_by_id'],
            include: [
                {
                    model: this.Models.InsuranceTypes,
                    as: "insurance_type",
                    attributes: ['name']
                },
                {
                    model: this.Models.Companies,
                    as: "quote_company",
                    attributes: ["ruc", "company_name", "company_phone", "company_email", "agency_id"],
                    include: [
                        {
                            model: this.Models.CompanyAddresses,
                            as: "company_address",
                        }
                    ]
                },
                {
                    model: this.Models.Products,
                    as: "product",
                    attributes: ["name", "ramo", "susep_code"]
                },
                {
                    model: this.Models.Proposals,
                    as: 'proposal_detail',
                    attributes: ['id', 'createdAt', 'policy_start_date', 'policy_end_date', 'policy_id', 'proposal_no', 'no_of_installment', 'due_date', 'adjustment_percentage', 'status', 'payment_type']
                },
                {
                    model: this.Models.Claims,
                    as: 'claims',
                    attributes: ['quote_id', 'total_indemnity']
                },
                {
                    model: this.Models.Users,
                    as: "user",
                    attributes: ['id', 'company_id'],
                    include: [
                        {
                            model: this.Models.Companies,
                            as: "company",
                            attributes: ['company_name', 'ruc', 'company_reg_no', 'agency_id'],
                        },
                    ],
                },
                {
                    model: this.Models.Products,
                    as: "product",
                    attributes: ["name"]
                },
                {
                    model: this.Models.TransportGoods,
                    as: "transport_good",
                    attributes: ['currency', 'estimated_for_next_12_months', 'total_limit'],
                    include: [
                        {
                            model: this.Models.TransportGoodsDetails,
                            as: "transport_good_details",
                            attributes: ['total_amount', 'good_id']
                        },
                    ]
                },
                {
                    model: this.Models.QuoteCalculations,
                    as: "quote_calculation",
                    // include: [
                    //     {
                    //         model: this.Models.Deductibles,
                    //         as: "standard_deductible",
                    //         attributes: ['discount', 'name', 'details'],
                    //     },
                    //     {
                    //         model: this.Models.Deductibles,
                    //         as: "personalized_deductible",
                    //         attributes: ['discount', 'name', 'details'],
                    //     },
                    // ]
                },
                {
                    model: this.Models.QuoteBasicCoverages,
                    as: "quote_basic_coverages",
                    attributes: [["coverage_id", "id"],
                    [Sequelize.literal("(SELECT name FROM basic_coverages WHERE basic_coverages.id = quote_basic_coverages.coverage_id limit 1)"), "name"]],
                },
                {
                    model: this.Models.QuoteAdditionalCoverages,
                    as: "quote_additional_coverages",
                    attributes: [["coverage_id", "id"],
                    [Sequelize.literal("(SELECT name FROM additional_coverages WHERE additional_coverages.id = quote_additional_coverages.coverage_id limit 1)"), "name"],
                    [Sequelize.literal("(SELECT product_id FROM additional_coverages WHERE additional_coverages.id = quote_additional_coverages.coverage_id limit 1)"), "product_id"]],
                },
            ]
        });
    }
    /* end */

    /* get goods */
    getGoods = async (query) => {
        return await this.Models.Goods.findAll({
            where: query,
            attributes: [
                'id',
                'name',
                'group',
                'percentage',
                'imp_exp_percentage',
                //'rct_rcf_percentage',
            ],
            order: [['group', 'asc']],
            raw: true,
        })
    };
    /* end */

    /* update quote */
    updateQuote = async (payload, query) => {
        return await this.Models.Quotes.update(payload, {
            where: query
        });
    };
    /* end */

    /* update proposal status */
    updateProposal = async (payload, query) => {
        return await this.Models.Proposals.update(payload, { where: query });
    }
    /* end */

    /*create reports */
    createReport = async (payload) => {
        return await this.Models.Transactions.create(payload);
    }
    /* end */

}