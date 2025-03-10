import { Sequelize } from "sequelize";
import { SORTING } from '../../config/constants';
import { query } from "express";
const Op = Sequelize.Op;
export default class Application {
    async init(db) {
        this.Models = db.models;
        this.sql = db.sqlClient
    };

    /* create application */
    createApplication = async (payload) => {
        return await this.Models.Applications.create(payload);
    }
    /* end */

    /* get application list */
    getApplicationList = async (query, detail) => {
        return await this.Models.Applications.findAll({
            having: query,
            offset: detail.start,
            limit: detail.length == 0 ? null : detail.length,
            order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
            attributes: ['id', 'uuid', 'proposal_id', 'endorsement_id', 'manual_filling', 'document_upload', 'start_date', 'end_date', 'source', 'destiny', 'good_id', 'shipping_document_number', 'copy_of_shipping_document', 'total_premium', 'status', 'shipment_limit', 'gross_written_premium', 'application_no',
                [Sequelize.literal('(SELECT name FROM products WHERE products.id = (SELECT product_id FROM quotes WHERE quotes.id = (SELECT quote_id FROM proposals WHERE proposals.id = applications.proposal_id LIMIT 1) LIMIT 1) LIMIT 1)'), 'product_name'],
                [Sequelize.literal('(SELECT name FROM countries WHERE countries.id =applications.source LIMIT 1)'), 'source'],
                [Sequelize.literal('(SELECT name FROM countries WHERE countries.id =applications.destiny LIMIT 1)'), 'destination'],
            ],
            order: [[SORTING.COMMON_SORTING, SORTING.TYPE]],
            offset: detail.start,
            limit: detail.length == 0 ? null : detail.length
        });
    }
    /* end */

    /* get application details */
    getApplicationDetails = async (query) => {
        return await this.Models.Applications.findOne({ where: query });
    }
    /* end */

    /* get countries list */
    getCountriesList = async (query) => {
        return await this.Models.Countries.findAll({ where: query, attributes: ['id', 'name'] });
    }
    /* end */

    /* get goods list */
    // getGoodsList = async (query) => {
    //     return await this.Models.TransportGoods.findOne({
    //         where: query,
    //         attributes: ['id', 'quote_id',
    //             // include: [
    //             //     {
    //             //         model: this.Models.TransportGoodsDetails,
    //             //         as: "transport_good_details",
    //             //         attributes: ['id', 'good_id',
    //             //             [Sequelize.literal(`(SELECT name FROM goods WHERE goods.id = transport_good_details.good_id LIMIT 1))`), 'good_name']
    //             //         ],
    //             //     },

    //             // ]
    //             [Sequelize.literal(`(SELECT name FROM goods WHERE goods.id = (SELECT good_id FROM transport_good_details WHERE transport_good_details.transport_good_id = transport_goods.id LIMIT 1))`), 'good_name']
    //         ]
    //     })
    // }
    /* end */
    // getAllQuoteDetail = async (query) => {
    //     return await this.Models.Quotes.findOne({
    //         where: query,
    //         attr
    // {
    //             model: this.Models.TransportGoods,
    //             as: "transport_good",
    //             attributes: {
    //                 exclude: ['quote_id', 'createdAt', 'updatedAt']
    //             },
    //             include: [
    //                 {
    //                     model: this.Models.TransportGoodsDetails,
    //                     as: "transport_good_details",
    //                     attributes: {
    //                         exclude: ['createdAt', 'updatedAt']
    //                     },
    //                 },
    //             ]
    //         },

    getTransportGood = async (query) => {
        return await this.Models.TransportGoods.findOne({
            where: query,
            attributes: ['id', 'quote_id'],
            include: [
                {
                    model: this.Models.TransportGoodsDetails,
                    as: "transport_good_details",
                    attributes: ['id', 'transport_good_id', 'good_id']
                },
            ]
        })
    }

    /* get goods for moderation */
    getGoodsForModeration = async (query) => {
        return await this.Models.Goods.findAll({
            where: query,
            attributes: [
                'id',
                'name',
                'obs'
            ],
            raw: true,
        })
    };
    /* end */



    getGoodsList = async (query) => {
        return await this.Models.TransportGoods.findOne({
            where: query,
            include: [
                {
                    model: this.Models.TransportGoodsDetails,
                    as: 'transport_good_details',
                    attributes: ['id', 'transport_good_id', 'good_id'],
                    include: [
                        {
                            model: this.Models.Goods,
                            as: 'goods',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ],
            attributes: ['id', 'quote_id']
        });
    };



    /* update application status */
    updateApplicationStatus = async (payload, query) => {
        return await this.Models.Applications.update(payload, { where: query });
    }
    /* end */

    /* get application details for quote */
    getApplicationDetailsForCertificate = async (query) => {
        return await this.Models.Applications.findOne({
            having: query,
            attributes: ['id', 'uuid', 'certificate_pdf', 'shipment_limit', 'tax_scvs', 'tax_ssc', 'tax_emission', 'tax_iva', 'total_premium', 'gross_written_premium', 'good_id',
                [Sequelize.literal('(SELECT name FROM countries WHERE countries.id =applications.source LIMIT 1)'), 'source'],
                [Sequelize.literal('(SELECT name FROM countries WHERE countries.id =applications.destiny LIMIT 1)'), 'destination'],
                // [Sequelize.literal(`( SELECT STRING_AGG(goods.name, ', ') FROM goods WHERE goods.id = ANY(string_to_array(REPLACE(applications.good_id, '[', '{'), ',')::integer[]) )`), 'good_names',],
                [Sequelize.literal(`( SELECT GROUP_CONCAT(goods.name) FROM goods WHERE FIND_IN_SET(goods.id, REPLACE(REPLACE(applications.good_id, '[', ''), ']', '')) )` > 0), 'good_names',],
            ],
            include: [
                {
                    model: this.Models.Proposals,
                    as: "proposal",
                    attributes: ['id', 'quote_id', 'policy_id', 'company_id', 'policy_id',
                        [Sequelize.literal('(SELECT insurance_type_id FROM quotes WHERE quotes.id =proposal.quote_id LIMIT 1)'), 'insurance_type_id'],
                        [Sequelize.literal('(SELECT product_id FROM quotes WHERE quotes.id =proposal.quote_id LIMIT 1)'), 'product_id'],
                        [Sequelize.literal('(SELECT company_name FROM companies WHERE companies.id =proposal.company_id LIMIT 1)'), 'quote_company_name'],
                        [Sequelize.literal('(SELECT total_limit FROM transport_goods WHERE transport_goods.quote_id =proposal.quote_id LIMIT 1)'), 'total_limit'],
                        [Sequelize.literal('(SELECT currency FROM transport_goods WHERE transport_goods.quote_id =proposal.quote_id LIMIT 1)'), 'currency'],
                    ]
                },
            ]
        });
    }
    /* end */

    /* bulk create application documents */
    bulkCreateApplicationDocuments = async (payload) => {
        return await this.Models.ApplicationDocuments.bulkCreate(payload);
    };
    /* end */

    /* update application */
    updateApplication = async (payload, query) => {
        return await this.Models.Applications.update(payload, { where: query });
    }
    /* end */

    getProposalDetailForAddApplication = async (query) => {
        return await this.Models.Proposals.findOne({
            having: query,
            attributes: ['id', 'quote_id', 'policy_id', 'company_id', 'policy_id', 'proposal_no', 'heritage_rank_id', 'income_range_id', 'economic_activity_id', 'occupation_id', 'average_income_value', 'average_equity_value', 'agency_id',
                [Sequelize.literal('(SELECT astr_id FROM heritage_ranks WHERE heritage_ranks.id =proposals.heritage_rank_id LIMIT 1)'), 'heritage_rank_astrId'],
                [Sequelize.literal('(SELECT astr_id FROM income_ranges WHERE income_ranges.id =proposals.income_range_id LIMIT 1)'), 'income_range_astrId'],
                [Sequelize.literal('(SELECT astr_id FROM economic_activities WHERE economic_activities.id =proposals.economic_activity_id LIMIT 1)'), 'economic_activity_astrId'],
                [Sequelize.literal('(SELECT astr_id FROM occupations WHERE occupations.id =proposals.occupation_id LIMIT 1)'), 'occupation_astrId'],
                [Sequelize.literal('(SELECT astr_id FROM agencies WHERE agencies.id =proposals.agency_id LIMIT 1)'), 'agency_astrId'],

                [Sequelize.literal('(SELECT is_calculation_personalized FROM quotes WHERE quotes.id =proposals.quote_id LIMIT 1)'), 'is_calculation_personalized'],
                [Sequelize.literal('(SELECT standard_insurance_rate FROM quote_calculations WHERE quote_calculations.quote_id =proposals.quote_id LIMIT 1)'), 'standard_insurance_rate'],
                [Sequelize.literal('(SELECT personalized_insurance_rate FROM quote_calculations WHERE quote_calculations.quote_id =proposals.quote_id LIMIT 1)'), 'personalized_insurance_rate'],
                [Sequelize.literal('(SELECT start_date FROM applications WHERE applications.proposal_id =proposals.id LIMIT 1)'), 'start_date'],
                [Sequelize.literal('(SELECT end_date FROM applications WHERE applications.proposal_id =proposals.id LIMIT 1)'), 'end_date'],
                [Sequelize.literal('(SELECT name FROM products WHERE products.id = (SELECT product_id FROM quotes WHERE quotes.id =  proposals.quote_id LIMIT 1) LIMIT 1)'), 'product_name'],
                [Sequelize.literal('(SELECT company_name FROM companies WHERE companies.id =proposals.company_id LIMIT 1)'), 'quote_company_name'],
                [Sequelize.literal('(SELECT ruc FROM companies WHERE companies.id =proposals.company_id LIMIT 1)'), 'quote_company_ruc'],
                [Sequelize.literal('(SELECT company_email FROM companies WHERE companies.id =proposals.company_id LIMIT 1)'), 'quote_company_email'],
                [Sequelize.literal('(SELECT address FROM company_addresses WHERE company_addresses.company_id =proposals.company_id LIMIT 1)'), 'quote_company_address'],
                [Sequelize.literal('(SELECT address_number FROM company_addresses WHERE company_addresses.company_id =proposals.company_id LIMIT 1)'), 'company_address_number'],
                // [Sequelize.literal('(SELECT city FROM company_addresses WHERE company_addresses.company_id =proposals.company_id LIMIT 1)'), 'company_address_city'],
                [
                    Sequelize.literal(
                        `(SELECT name FROM cities 
                    WHERE cities.id = 
                      (SELECT city FROM company_addresses 
                        WHERE company_addresses.company_id = proposals.company_id 
                        LIMIT 1)
                    LIMIT 1)`
                    ),
                    'company_address_city'
                ],
                [Sequelize.literal('(SELECT company_phone FROM companies WHERE companies.id =proposals.company_id LIMIT 1)'), 'company_address_phone'],
                [Sequelize.literal('(SELECT state FROM company_addresses WHERE company_addresses.company_id =proposals.company_id LIMIT 1)'), 'company_state'],
                [Sequelize.literal('(SELECT neighborhood FROM company_addresses WHERE company_addresses.company_id =proposals.company_id LIMIT 1)'), 'company_neighborhood'],

                // [Sequelize.literal("(SELECT total_limit FROM transport_goods WHERE transport_goods.quote_id = proposals.quote_id limit 1)"), "total_limit"],

            ],
            include: [
                {
                    model: this.Models.Quotes,
                    attributes: ['id'],
                    as: "quote",
                    include: [
                        {
                            model: this.Models.QuoteShipments,
                            as: "quote_shipment",
                            attributes: ['id'],
                            include: [
                                {
                                    model: this.Models.SingleShipmentDetails,
                                    as: "single_shipment_detail",
                                    attributes: ['id', 'quote_shipment_id', 'boarding_document_number', 'boarding_document_type']
                                },
                                {
                                    model: this.Models.ShipmentDocuments,
                                    as: "shipment_documents",
                                    attributes: ['id', 'quote_shipment_id', 'name']
                                },
                                {
                                    model: this.Models.ShipmentRouteDetails,
                                    as: "shipment_route_details",
                                    attributes: ['id', 'source', 'destiny',
                                        // [Sequelize.literal('(SELECT name FROM countries WHERE countries.id = shipment_route_details.source limit 1)'), 'source_name'],
                                        // [Sequelize.literal('(SELECT name FROM countries WHERE countries.id = shipment_route_details.destiny limit 1)'), 'destination_name'],

                                    ],
                                    include: [
                                        {
                                            model: this.Models.Countries,
                                            as: "source_detail",
                                            attributes: ['id', "name", "astr_id"]
                                        },
                                        {
                                            model: this.Models.Countries,
                                            as: "destiny_detail",
                                            attributes: ['id', "name", "astr_id"],
                                        }
                                    ]
                                },
                            ]
                        },
                    ]
                }
            ],
            raw: true
        },
        );
    }


    getQuoteSourceDestination = async (query) => {
        return await this.Models.Quotes.findOne({
            where: query,
            attributes: ['id',
                [Sequelize.literal("(SELECT total_limit FROM transport_goods WHERE transport_goods.quote_id = quotes.id limit 1)"), "total_limit"],

            ],
            include: [
                {
                    model: this.Models.QuoteShipments,
                    as: "quote_shipment",
                    attributes: ['id', 'quote_id'],
                    include: [
                        {
                            model: this.Models.ShipmentRouteDetails,
                            as: "shipment_route_details",
                            attributes: ['id', 'source', 'destiny',
                                // [Sequelize.literal('(SELECT name FROM countries WHERE countries.id = shipment_route_details.source limit 1)'), 'source_name'],
                                // [Sequelize.literal('(SELECT name FROM countries WHERE countries.id = shipment_route_details.destiny limit 1)'), 'destination_name'],
                            ],
                            include: [
                                {
                                    model: this.Models.Countries,
                                    as: "source_detail",
                                    attributes: ['id', "name", "astr_id"]
                                },
                                {
                                    model: this.Models.Countries,
                                    as: "destiny_detail",
                                    attributes: ['id', "name", "astr_id"],
                                }
                            ]
                        },
                    ],
                },
            ]
        })
    }
}