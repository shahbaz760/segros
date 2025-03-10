import moment from 'moment';
import sequelize, { Op } from "sequelize";
import { COMPANY_STATUS, INSURANCE_TYPE_ID, PREMIUM_CALCULATION_TYPE, PRODUCT_ID, RESPONSE_CODES, ROLES, USER_STATUS, TRANSACTION_DOC_TYPE } from "../../config/constants";
import { errorResponse, successResponse } from "../../config/responseHandlers";
import { get2Decimal } from '../helpers/commonFunction';
import logger from '../helpers/logger';
import Services from "./transaction.services";
export default class Transaction {
    async init(db) {
        this.services = new Services();
        this.Models = db.models;
        await this.services.init(db);
    }
    /* get filters data list */
    async filtersData(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            /* get agency list */
            const agencyList = await this.services.getAgencyList({ role_id: ROLES.AGENCY, status: USER_STATUS.ACTIVE, deleted_at: null })
            /* get companies list */
            const companiesList = await this.services.getCompaniesList({ status: COMPANY_STATUS.ACTIVE, deleted_at: null })
            /* get customer list */
            const customerList = await this.services.getBrokerList({ status: USER_STATUS.ACTIVE, role_id: ROLES.BROKER, deleted_at: null });
            const data = {
                agencyList,
                companiesList,
                customerList
            }
            return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, data, RESPONSE_CODES.POST, req.headers.tokenization))
        } catch (error) {
            console.log(error);
            logger.error('filters Data Error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* production report */
    async productionReport(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body } = req;
            let query = {};
            if (body.company_id && body.company_id.length > 0) {
                query.company_id = { [Op.in]: body.company_id };
            }
            if (body.agency_id && body.agency_id.length > 0) {
                query.agency_id = { [Op.in]: body.agency_id };
            }
            if (body.user_id && body.user_id.length > 0) {
                query.user_id = { [Op.in]: body.user_id };
            }
            /* return if start date is not given */
            if (!body.start_date) {
                return res.send(errorResponse(CommonMessages.START_DATE_IS_REQUIRED, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
            };
            /* add the date filter in the proposal and endorsement query */
            let start_date = null;
            let end_date = null;
            if (body.start_date) {
                query.created_on = { [Op.gte]: body.start_date };
            };
            if (body.end_date) {
                start_date = moment(
                    new Date(body.start_date).setHours(0, 0, 0, 0)
                ).format("YYYY-MM-DD HH:mm:ss");
                end_date = moment(
                    new Date(body.end_date).setHours(23, 59, 59, 59)
                ).format("YYYY-MM-DD HH:mm:ss");
                query.created_on = {
                    [Op.between]: [start_date, end_date],
                };
            };
            /*  get report list */
            const reportList = await this.services.getProductionReport(query);
            /* where and attribute query for proposal and endorsement */
            let sumQuery;
            sumQuery = {
                where: query,
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('total_gross_written_premium')), 'total_gwp'],
                ],
            };
            /* get total real sum of reports */
            const totalRealSum = await this.services.getProductionReportSumAndCount(sumQuery);
            let total_gwp_amount = totalRealSum[0].dataValues.total_gwp || 0;
            /* push count attribute for proposal and endorsement count */
            sumQuery.attributes.push([sequelize.fn('COUNT', sequelize.col('doc_type')), 'proposal_count']);
            query.doc_type = TRANSACTION_DOC_TYPE.POLICY;
            sumQuery.where = query;
            /* get total adjustable premium amount from the reports table */
            const totalAdjustablePremiumAmount = await this.services.getProductionReportSumAndCount(sumQuery);
            let total_proposal_gwp_amount = totalAdjustablePremiumAmount[0].dataValues.total_gwp || 0;
            let total_proposal_count = totalAdjustablePremiumAmount[0].dataValues.proposal_count || 0;
            query.doc_type = {
                [sequelize.Op.in]: [
                   // TRANSACTION_DOC_TYPE.POLICY,
                    TRANSACTION_DOC_TYPE.FACTURA
                    // TRANSACTION_DOC_TYPE.BILLING_OR_ADDITIONAL_CHARGE,
                    // TRANSACTION_DOC_TYPE.CANCELLED,
                    // TRANSACTION_DOC_TYPE.NO_CHARGE
                ]
            };
            sumQuery.where = query;
            /* get total averbavel premium amount from the reports table */
            const totalAverbavelPremiumAmount = await this.services.getProductionReportSumAndCount(sumQuery);
            let total_endorsement_gwp_amount = totalAverbavelPremiumAmount[0].dataValues.total_gwp || 0;
            let total_endorsement_count = totalAverbavelPremiumAmount[0].dataValues.proposal_count || 0;
            return res.send({
                total_gwp_amount,
                total_proposal_gwp_amount,
                total_proposal_count,
                total_endorsement_gwp_amount,
                total_endorsement_count,
                ...successResponse(CommonMessages.DATA_LOADED_SUCCESS, reportList, RESPONSE_CODES.POST, req.headers.tokenization)
            });
        } catch (error) {
            console.log(error);
            logger.error('production Report Error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* production report graph data */
    async reportGraphData(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body } = req;
            let query = {};
            if (body.company_id && body.company_id.length > 0) {
                query.company_id = { [Op.in]: body.company_id };
            }
            if (body.agency_id && body.agency_id.length > 0) {
                query.agency_id = { [Op.in]: body.agency_id };
            }
            if (body.user_id && body.user_id.length > 0) {
                query.user_id = { [Op.in]: body.user_id };
            }
            const current_year = new Date().getFullYear()
            const previous_year = current_year - 1
            const past_three_year = current_year - 2
            query.created_on = { [Op.gte]: `${past_three_year}-01-01` };
            const data = await this.services.getGraphReportData(query);
            const current_year_result = {};
            const previous_year_result = {};
            const past_three_year_result = {};
            data.forEach((item) => {
                /* Extract the month and year from the date */
                const [year, month] = item.created_on.toISOString().split('-').map(Number);
                const key = `${month}`;
                /* Create a key in the result object for each month and year combination */
                if (year == current_year) {
                    /* If the key doesn't exist in the result object, initialize it with the value */
                    if (!current_year_result[key]) {
                        current_year_result[key] = item.total_gross_written_premium;
                    } else {
                        /* If the key already exists, add the amount to the existing sum */
                        current_year_result[key] += item.total_gross_written_premium;
                    }
                } else if (year == previous_year) {
                    /* If the key doesn't exist in the result object, initialize it with the value */
                    if (!previous_year_result[key]) {
                        previous_year_result[key] = item.total_gross_written_premium;
                    } else {
                        /* If the key already exists, add the amount to the existing sum */
                        previous_year_result[key] += item.total_gross_written_premium;
                    }
                } else if (year == past_three_year) {
                    /* If the key doesn't exist in the result object, initialize it with the value */
                    if (!past_three_year_result[key]) {
                        past_three_year_result[key] = item.total_gross_written_premium;
                    } else {
                        /* If the key already exists, add the amount to the existing sum */
                        past_three_year_result[key] += item.total_gross_written_premium;
                    }
                }
            });
            /* Convert the result object into an array of objects */
            const current_year_graph = Object.keys(current_year_result).map((key) => ({
                month: key,
                amount: get2Decimal(current_year_result[key]),
            }));
            const previous_year_graph = Object.keys(previous_year_result).map((key) => ({
                month: key,
                amount: get2Decimal(previous_year_result[key]),
            }));
            const past_three_year_graph = Object.keys(past_three_year_result).map((key) => ({
                month: key,
                amount: get2Decimal(past_three_year_result[key]),
            }));
            const result = {
                current_year_graph,
                previous_year_graph,
                past_three_year_graph
            }
            return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('report Graph Data error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* claims report data */
    async claimsReport(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body } = req;
            let query = {};
            if (body.company_id && body.company_id.length > 0) {
                query.company_id = { [Op.in]: body.company_id };
            }
            if (body.policy_id && body.policy_id.length > 0) {
                query.policy_id = { [Op.in]: body.policy_id };
            }
            if (body.user_id && body.user_id.length > 0) {
                query.user_id = { [Op.in]: body.user_id };
            }
            if (body.product_id && body.product_id.length > 0) {
                query.product_id = { [Op.in]: body.product_id };
            }
            if (body.insurance_type_id && body.insurance_type_id.length > 0) {
                query.insurance_type_id = { [Op.in]: body.insurance_type_id };
            }
            /* return if start date is not given */
            if (!body.start_date) {
                return res.send(errorResponse(CommonMessages.START_DATE_IS_REQUIRED, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
            };
            /* add the date filter in the proposal and endorsement query */
            let start_date = null;
            let end_date = null;
            if (body.start_date) {
                query.created_on = { [Op.gte]: body.start_date };
            };
            if (body.end_date) {
                start_date = moment(
                    new Date(body.start_date).setHours(0, 0, 0, 0)
                ).format("YYYY-MM-DD HH:mm:ss");
                end_date = moment(
                    new Date(body.end_date).setHours(23, 59, 59, 59)
                ).format("YYYY-MM-DD HH:mm:ss");
                query.created_on = {
                    [Op.between]: [start_date, end_date],
                };
            };
            const reportData = await this.services.getClaimsReportData(query);
            /* get broker and proposal detail */
            const brokerDetail = [];
            const policyDetail = [];
            /* filter data */
            const brokers = [];
            const companies = [];
            const policies = [];
            /* for check the existence of ids */
            const brokerIds = new Set();
            const companyIds = new Set();
            const policyIds = new Set();

            let totalIndemnity = 0;
            let claimCount = 0;
            let estimatedLoss = 0;
            for (const obj of reportData) {
                /* Add unique brokers */
                if (!brokerIds.has(obj.dataValues.user_id)) {
                    brokerIds.add(obj.dataValues.user_id);
                    brokers.push({
                        id: obj.dataValues.user_id,
                        name: obj.dataValues.broker_name
                    });
                }
                /* end */
                /* Add unique companies */
                if (!companyIds.has(obj.dataValues.company_id)) {
                    companyIds.add(obj.dataValues.company_id);
                    companies.push({
                        id: obj.dataValues.company_id,
                        name: obj.dataValues.company_name
                    });
                }
                /* end */
                /* Add unique policies */
                if (!policyIds.has(obj.dataValues.proposal_id)) {
                    policyIds.add(obj.dataValues.proposal_id);
                    policies.push({
                        id: obj.dataValues.proposal_id,
                        name: obj.dataValues.policy_id
                    });
                }
                /* end */
                let whereQuery = {};
                let sumQuery;
                /* get broker claims sum */
                const existingUser = brokerDetail.find(row => row.user_id === obj.user_id);
                if (existingUser) {
                    existingUser.total_premium += obj.converted_to_R$_amount;
                } else {
                    /* where and attribute query for proposal and endorsement */
                    whereQuery.user_id = obj.user_id;
                    sumQuery = {
                        attributes: [
                            [sequelize.fn('SUM', sequelize.col('total_indemnity')), 'total_indemnity'],
                            [sequelize.fn('SUM', sequelize.col('estimativa_prejuizo')), 'estimated_loss'],
                            [sequelize.fn('COUNT', sequelize.col('user_id')), 'user_count']
                        ],
                    };
                    sumQuery.where = whereQuery;
                    /* get brokers claim sum */
                    const userClaimsSum = await this.services.getClaimsIndemnitySum(sumQuery);
                    brokerDetail.push({
                        user_id: obj.user_id,
                        broker_name: obj.dataValues.broker_name,
                        total_premium: obj.converted_to_R$_amount,
                        user_claims_amount: userClaimsSum.total_indemnity,
                        count: userClaimsSum.dataValues.user_count,
                    });
                    /* to get overall total value of brokers */
                    totalIndemnity += userClaimsSum.total_indemnity;
                    claimCount += userClaimsSum.dataValues.user_count;
                    estimatedLoss += userClaimsSum.dataValues.estimated_loss;
                    /* Attributes to remove by alias names */
                    const attributesToRemove = ['estimated_loss', 'user_count'];
                    /* Filter out attributes to remove */
                    sumQuery.attributes.filter(attr => !attributesToRemove.includes(attr[1]));
                    /* get proposal claims sum */
                    const existingProposal = policyDetail.find(row => row.proposal_id === obj.proposal_id);
                    if (existingProposal) {
                        existingProposal.total_premium += obj.converted_to_R$_amount;
                    } else {
                        sumQuery.where = whereQuery;
                        /* get total proposal claim sum */
                        const proposalClaimSum = await this.services.getClaimsIndemnitySum(sumQuery);
                        policyDetail.push({
                            proposal_id: obj.proposal_id,
                            total_premium: obj.converted_to_R$_amount,
                            proposal_claims_amount: proposalClaimSum.total_indemnity,
                            start_date: obj.dataValues.start_date,
                            end_date: obj.dataValues.end_date,
                            policy_id: obj.dataValues.policy_id,
                            company_name: obj.dataValues.company_name
                        })
                    }
                }
            };
            const result = {
                filter_detail: {
                    brokers,
                    companies,
                    policies,
                    products: [
                        {
                            name: 'Importação - Embarque Avulso',
                            product_id: PRODUCT_ID.IMP,
                            insurance_type_id: INSURANCE_TYPE_ID.SINGLE
                        },
                        {
                            name: 'Importação - Apólice Anual',
                            product_id: PRODUCT_ID.IMP,
                            insurance_type_id: INSURANCE_TYPE_ID.ANNUAL
                        },
                        {
                            name: ' Exportação - Embarque Avulso,',
                            product_id: PRODUCT_ID.EXP,
                            insurance_type_id: INSURANCE_TYPE_ID.SINGLE
                        },
                        {
                            name: ' Exportação - Apólice Anual,',
                            product_id: PRODUCT_ID.EXP,
                            insurance_type_id: INSURANCE_TYPE_ID.ANNUAL
                        }
                    ]
                },
                broker_detail: brokerDetail,
                policy_detail: policyDetail,
            }
            res.send({
                total_indemnity: totalIndemnity || 0,
                claim_count: claimCount || 0,
                estimated_loss: estimatedLoss || 0,
                total_claim_amount: totalIndemnity + estimatedLoss,
                ...successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization)
            });
        } catch (error) {
            console.log(error);
            logger.error('claims Report error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* claims report graph data */
    async claimsReportGraph(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body } = req;
            let query = {};
            if (body.company_id && body.company_id.length > 0) {
                query.company_id = { [Op.in]: body.company_id };
            }
            if (body.policy_id && body.policy_id.length > 0) {
                query.policy_id = { [Op.in]: body.policy_id };
            }
            if (body.user_id && body.user_id.length > 0) {
                query.user_id = { [Op.in]: body.user_id };
            }
            const current_year = new Date().getFullYear();
            const previous_year = current_year - 1;
            const past_three_year = current_year - 2;
            query.created_on = { [Op.gte]: `${past_three_year}-01-01` };
            /* get the claims report graph */
            const data = await this.services.getGraphReportData(query);
            /* to store data of each years */
            const current_year_result = {};
            const previous_year_result = {};
            const past_three_year_result = {};
            /* to store the count of each year */
            const current_year_count = {};
            const previous_year_count = {};
            const past_three_year_count = {};
            /* iteration of data */
            data.forEach((item) => {
                /* Extract the month and year from the date */
                const [year, month] = item.created_on.toISOString().split('-').map(Number);
                const key = `${month}`;
                /* Create a key in the result object for each month and year combination */
                if (year == current_year) {
                    /* If the key doesn't exist in the result object, initialize it with the value */
                    if (!current_year_result[key]) {
                        current_year_result[key] = item.converted_to_R$_amount;
                        current_year_count[key] = 1;
                    } else {
                        /* If the key already exists, add the amount to the existing sum */
                        current_year_result[key] += item.converted_to_R$_amount;
                        current_year_count[key] += 1;
                    }
                } else if (year == previous_year) {
                    /* If the key doesn't exist in the result object, initialize it with the value */
                    if (!previous_year_result[key]) {
                        previous_year_result[key] = item.converted_to_R$_amount;
                        previous_year_count[key] = 1;
                    } else {
                        /* If the key already exists, add the amount to the existing sum */
                        previous_year_result[key] += item.converted_to_R$_amount;
                        previous_year_count[key] += 1;
                    }
                } else if (year == past_three_year) {
                    /* If the key doesn't exist in the result object, initialize it with the value */
                    if (!past_three_year_result[key]) {
                        past_three_year_result[key] = item.converted_to_R$_amount;
                        past_three_year_count[key] = 1;
                    } else {
                        /* If the key already exists, add the amount to the existing sum */
                        past_three_year_result[key] += item.converted_to_R$_amount;
                        past_three_year_count[key] += 1;
                    }
                }
            });
            /* Convert the result object into an array of objects */
            const current_year_graph = Object.keys(current_year_result).map((key) => ({
                month: key,
                amount: get2Decimal(current_year_result[key]),
                count: current_year_count[key]
            }));
            const previous_year_graph = Object.keys(previous_year_result).map((key) => ({
                month: key,
                amount: get2Decimal(previous_year_result[key]),
                count: previous_year_count[key]
            }));
            const past_three_year_graph = Object.keys(past_three_year_result).map((key) => ({
                month: key,
                amount: get2Decimal(past_three_year_result[key]),
                count: past_three_year_count[key]
            }));
            const result = {
                current_year_graph,
                previous_year_graph,
                past_three_year_graph
            }
            return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('claims Report Graph error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* claims report graph 2 for product data */
    async claimsReportGraph2(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body } = req;
            let query = {};
            /* return if start date is not given */
            if (!body.start_date) {
                return res.send(errorResponse(CommonMessages.START_DATE_IS_REQUIRED, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
            };
            /* add the date filter in the proposal and endorsement query */
            let start_date = null;
            let end_date = null;
            if (body.start_date) {
                query.created_on = { [Op.gte]: body.start_date };
            };
            if (body.end_date) {
                start_date = moment(
                    new Date(body.start_date).setHours(0, 0, 0, 0)
                ).format("YYYY-MM-DD HH:mm:ss");
                end_date = moment(
                    new Date(body.end_date).setHours(23, 59, 59, 59)
                ).format("YYYY-MM-DD HH:mm:ss");
                query.created_on = {
                    [Op.between]: [start_date, end_date],
                };
            };
            /* get the products data according to the dates */
            const data = await this.services.getProductReportGraphData(query);
            const productsDetail = [];
            const productMapping = {
                '2-1': "Importação - Embarque Avulso",
                '3-1': "Exportação - Embarque Avulso",
                '2-2': "Importação - Apólice Anual",
                '3-2': "Exportação - Apólice Anual"
            };
            /* iteration of data */
            data.forEach(obj => {
                const key = `${obj.dataValues.product_id}-${obj.dataValues.insurance_type_id}`;
                /* Check if the combination already exists in the array */
                let existingEntry = productsDetail.find(row =>
                    row.product_id === obj.dataValues.product_id && row.insurance_type_id === obj.dataValues.insurance_type_id);
                if (existingEntry) {
                    /* If the combination exists, add the amount to the existing total */
                    existingEntry.value += obj.converted_to_R$_amount;
                    existingEntry.count += 1;
                } else {
                    const productName = productMapping[key] || "Unknown Product";
                    /* If the combination does not exist, create a new entry */
                    productsDetail.push({
                        product_id: obj.dataValues.product_id,
                        insurance_type_id: obj.dataValues.insurance_type_id,
                        value: obj.converted_to_R$_amount,
                        count: 1,
                        name: productName
                    });
                }
            });
            return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, productsDetail, RESPONSE_CODES.GET, req.headers.tokenization))
        } catch (error) {
            console.log(error);
            logger.error('claims Report Graph2 error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */
}