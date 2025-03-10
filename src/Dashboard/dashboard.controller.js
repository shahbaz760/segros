import moment from 'moment';
import sequelize, { Op } from "sequelize";
import { DEFAULT_ENUM, INSURANCE_STATUS, PREMIUM_CALCULATION_TYPE, PRODUCT_ID, PROPOSAL_STATUS, QUOTE_STATUS, TRANSACTION_DOC_TYPE, RESPONSE_CODES, ROLES } from "../../config/constants";
import { errorResponse, successResponse } from "../../config/responseHandlers";
import { get3Decimal, get6Decimal, getAssociatedUsers, getSubUserIds } from "../helpers/commonFunction";
import logger from '../helpers/logger';
import Services from "./dashboard.services";
import { log } from 'winston';
export default class Dashboard {
    async init(db) {
        this.services = new Services();
        this.Models = db.models;
        await this.services.init(db);
    }
    /* get data for the dashboard */
    async dashboardData(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body, user } = req;
            let graphData = true;
            let whereGraphQuery = {
                deleted_at: null,
            };
            let quoteQuery = {
                ...whereGraphQuery
            };
            let userIds = [];
            /* check if admin or sub admin is logged in or not */
            if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN) {
                userIds = await getAssociatedUsers(this.Models, user);
            } else if (
                (user.role_id == ROLES.ADMIN && body.user_id != 'All') ||
                (user.role_id == ROLES.SUB_ADMIN && body.user_id != 'All')
            ) {
                graphData = false;
                userIds = await getSubUserIds(this.Models, body.user_id);
                userIds.push(body.user_id);
            }
            if (userIds.length > 0) {
                quoteQuery.user_id = userIds
            };
            /* get all quotes details */
            const allQuotesCount = await this.services.getAllQuoteCount(quoteQuery);
            /* proposal count */
            const getAllProposalCount = await this.services.getAllProposalCount({ status: PROPOSAL_STATUS.EMITIDO, ...quoteQuery });
            /* get claim count */
            const claimCount = await this.services.getClaimCount(quoteQuery);
            /* calculate commission */
            const getQuoteCommission = await this.services.getQuoteCalculationSumForQuoteCommission({ premium_calculation_type: PREMIUM_CALCULATION_TYPE.AJUSTAVEL, ...quoteQuery })
            let commission;
            if (getQuoteCommission) {
                const gross_written_premium = getQuoteCommission &&
                    getQuoteCommission[0] &&
                    getQuoteCommission[0].total_gross_written_premium ?
                    getQuoteCommission[0].total_gross_written_premium :
                    0;
                const net_written_premium = getQuoteCommission &&
                    getQuoteCommission[0] &&
                    getQuoteCommission[0].total_net_written_premium ?
                    getQuoteCommission[0].total_net_written_premium :
                    0;
                commission = gross_written_premium - net_written_premium;
            };
            /* get the data according to the quote status and month wise quote count */
            const currentYear = new Date().getFullYear();
            let previousYear = parseInt(currentYear) - 1;
            var fromDate = new Date(`${previousYear}-01-01`);
            /* get the month */
            let fromMonth = fromDate.getMonth() + 1 < 10
                ? '0' + (fromDate.getMonth() + 1)
                : fromDate.getMonth() + 1;

            let graphCalculatePreviousYear = null;
            let graphCalculateCurrentYear = null;
            if (graphData) {
                /* where graph query for creating previous graph calculation */
                whereGraphQuery = {
                    created_on: sequelize.where(
                        sequelize.fn('YEAR', sequelize.col('created_on')),
                        previousYear
                    ),
                };
                /* check if login user is admin or sub admin */
                if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN) {
                    whereGraphQuery.user_id = userIds;
                };
                /* for previous year */
                let previousYearQuery = whereGraphQuery;
                fromMonth = JSON.stringify(fromMonth);
                const yearGraph = "mesGrafico";
                /* get data for graph calculate previous year */
                graphCalculatePreviousYear = await this.services.graphCalculatePreviousYear(yearGraph, previousYearQuery);
                whereGraphQuery = {
                    created_on: sequelize.where(
                        sequelize.fn('YEAR', sequelize.col('created_on')),
                        currentYear
                    ),
                };
                /* check if login user is admin or sub admin */
                if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN) {
                    whereGraphQuery.user_id = userIds;
                };
                /* for current year */
                let currentYearQuery = whereGraphQuery;
                /* get data for graph calculate current year */
                graphCalculateCurrentYear = await this.services.graphCalculateCurrentYear(yearGraph, currentYearQuery);
            }
            /* response values */
            const getQuoteCount = {
                quote_count: allQuotesCount,
                proposal_count: getAllProposalCount,
                claim_count: claimCount,
                total_commission: commission,
                graph_calculate_previous_year: graphCalculatePreviousYear,
                graph_calculate_current_year: graphCalculateCurrentYear
            };
            return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, getQuoteCount, RESPONSE_CODES.POST, req.headers.tokenization));
        } catch (error) {
            console.log('dashboard Data error', error);
            logger.error('dashboard Data error', error);
            return res
                .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /*end*/

    /* get the dashboard data for sub admin */
    async subAdminDashboardData(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { user } = req;
            /* get the today date */
            const today = new Date();
            /* get the current month start date */
            const currentMonthStartDate = moment(new Date(today.getFullYear(), today.getMonth(), 1)).format('YYYY-MM-DD');
            /* get the current month end date */
            const currentMonthEndDate = moment(new Date(today.getFullYear(), today.getMonth() + 1, 0)).format('YYYY-MM-DD');
            /* get the sub admin brokers */
            const subAdminBrokers = await this.services.getSubAdminBrokers({
                deleted_at: null,
                responsible_id: user.id
            });
            /* get the moderated quote which is created by sub admin or sub admin users */
            const subAdminModerateQuoteCount = await this.services.getSubAdminModerateCount({
                status: QUOTE_STATUS.MODERAÇÃO,
                deleted_at: null,
                [Op.or]: [
                    { user_id: { [Op.in]: subAdminBrokers } },
                    { created_by_id: { [Op.eq]: user.id } }
                ]
            });
            /* get the policy list which is supposed to end in the current month */
            const policiesEndInCurrentMonth = await this.services.getPoliciesEndingInCurrentMonth({ policy_end_date: { [Op.between]: [currentMonthStartDate, currentMonthEndDate] }, is_renewed: DEFAULT_ENUM.FALSE });
            let policyListEndInCurrentMonth = [];
            let subAdminReviewPolicyList = [];
            for (const ele of policiesEndInCurrentMonth) {
                /* Calculate total indemnity from proposal_claims */
                let totalIndemnity = 0;
                totalIndemnity = ele.proposal_claims.reduce((sum, claim) => {
                    return sum + claim.total_indemnity;
                }, 0);
                let total_premium;
                let commission_percentage;
                if (ele.dataValues.quote.is_calculation_personalized == DEFAULT_ENUM.FALSE) {
                    total_premium = ele.dataValues.quote.dataValues.quote_calculation.standard_total_premium;
                    commission_percentage = ele.dataValues.quote.dataValues.quote_calculation.standard_commission_percentage;
                } else {
                    total_premium = ele.dataValues.quote.dataValues.quote_calculation.personalized_total_premium;
                    commission_percentage = ele.dataValues.quote.dataValues.quote_calculation.personalized_commission_percentage;
                }
                const claims_rate = (totalIndemnity / total_premium) * 100;
                /* create payload */
                const policyPayload = {
                    id: ele.id,
                    uuid: ele.dataValues.quote.uuid,
                    policy_id: ele.policy_id,
                    policy_end_date: ele.policy_end_date,
                    claim_total: totalIndemnity,
                    claims_rate: claims_rate,
                    company_id: ele.quote.company_id,
                    user_id: ele.quote.user_id,
                    is_calculation_personalized: ele.dataValues.quote.is_calculation_personalized,
                    company_name: ele.quote.quote_company.company_name,
                    user: ele.quote.user.name,
                    commission_percentage: commission_percentage,
                    total_premium: total_premium,
                    user_name: ele.quote.user.name
                };
                policyListEndInCurrentMonth.push(policyPayload);
                /* check if claims rate is greater then 60 % */
                if (claims_rate > 60) {
                    subAdminReviewPolicyList.push(policyPayload);
                };
                /* set the static data values until the third party is not integrated */
                // subAdminReviewPolicyList = [{
                //     "id": 2,
                //     "uuid": "80e5d715-247e-4042-bb35-07e3d3ac2aa2",
                //     "policy_id": "232323232322",
                //     "policy_end_date": "2024-06-10T10:28:42.000Z",
                //     "claim_total": 3300,
                //     "claims_rate": 0.002434420925822896,
                //     "company_id": 16,
                //     "user_id": 22,
                //     "is_calculation_personalized": 0,
                //     "company_name": "ahgjhgjghj",
                //     "user": "dfasds",
                //     "commission_percentage": 5,
                //     "total_premium": 135555850.88,
                //     "user_name": "dfasds"
                // }]
            };
            /* sub admin companies data according to the reports */
            const companiesTotalUS$Amount = await this.services.getCompaniesFromReports({
                created_on: { [Op.between]: [currentMonthStartDate, currentMonthEndDate] }
            });
            /* end */
            const totalClaimsInCurrentMonth = await this.services.totalClaimsInCurrentMonth({
                createdAt: { [Op.between]: [currentMonthStartDate, currentMonthEndDate] },
                insurance_status: INSURANCE_STATUS.SETTLED
            });
            const totalClaimRate = get6Decimal((totalClaimsInCurrentMonth[0].dataValues.total_indemnity / companiesTotalUS$Amount[0].dataValues.US_amount) * 100);
            /* response data */
            const subAdminDashboardData = {
                sub_admin_moderation_quote_count: subAdminModerateQuoteCount,
                sub_admin_ending_policy_count: policyListEndInCurrentMonth.length,
                sub_admin_review_policy_list: subAdminReviewPolicyList,
                sub_admin_ending_policy_list: policyListEndInCurrentMonth,
                company_premium: companiesTotalUS$Amount[0].dataValues.US_amount,
                company_claims_total: totalClaimsInCurrentMonth[0].dataValues.total_indemnity,
                company_total_claims_rate: totalClaimRate
            };
            return res
                .send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, subAdminDashboardData, RESPONSE_CODES.POST, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('sub Admin Dashboard Data Error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /*end */

    /* companies dashboard data */
    async companyDashboardData(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body, user } = req;
            let whereGraphQuery = {
                deleted_at: null,
            };
            let quoteQuery = {
                ...whereGraphQuery,
            };
            /* declare variables */
            let countByStatus = {
                totalQuoteCount: 0,
                quote_pi_chart_EMBARCADOR: 0,
                quotes_tn_imp_exp_ids: [],
            };
            /* get quote ids which is associated with that company */
            const userIds = await this.services.getCompanyUsersIds({ company_id: body.company_id, role_id: ROLES.BROKER });
            quoteQuery.user_id = userIds;
            /* get all quotes details */
            const allQuotes = await this.services.getAllQuoteDetails(quoteQuery);
            /* iterate through quotes and update count by status */
            allQuotes.forEach(quote => {
                if (allQuotes.length > 0) {
                    countByStatus.totalQuoteCount++;
                };
                if (![QUOTE_STATUS.EMITIDO, QUOTE_STATUS.EM_EMISSÃO, QUOTE_STATUS.CANCELADO].includes(quote.status) && [PRODUCT_ID.EXP, PRODUCT_ID.IMP].includes(quote.product_id)) {
                    countByStatus.quote_pi_chart_EMBARCADOR++;
                };
                if ([PRODUCT_ID.EXP, PRODUCT_ID.IMP].includes(quote.product_id)) {
                    countByStatus.quotes_tn_imp_exp_ids.push(quote.id);
                };
            });
            /* initialize counts */
            const proposalCount = {
                totalProposalCount: 0,
                isEmbarcadorProposal: 0
            };
            const getAllProposals = await this.services.getProposalsDetails(quoteQuery);
            /* iterate through quotes and update proposal count */
            getAllProposals.forEach(proposal => {
                if (proposal.status === PROPOSAL_STATUS.EMITIDO) {
                    proposalCount.totalProposalCount++;
                };
                if (countByStatus.quotes_tn_imp_exp_ids.includes(proposal.quote_id)) {
                    proposalCount.isEmbarcadorProposal++;
                };
            });
            /* get claim count */
            const claimCount = await this.services.getClaimCount(quoteQuery);
            /* calculate commission */
            const getQuoteCommission = await this.services.getQuoteCalculationSumForQuoteCommission({ premium_calculation_type: PREMIUM_CALCULATION_TYPE.AJUSTAVEL, ...quoteQuery });
            let commission;
            if (getQuoteCommission) {
                const gross_written_premium = getQuoteCommission &&
                    getQuoteCommission[0] &&
                    getQuoteCommission[0].total_gross_written_premium ?
                    getQuoteCommission[0].total_gross_written_premium :
                    0;
                const net_written_premium = getQuoteCommission &&
                    getQuoteCommission[0] &&
                    getQuoteCommission[0].total_net_written_premium ?
                    getQuoteCommission[0].total_net_written_premium :
                    0;
                commission = gross_written_premium - net_written_premium;
            };
            /* get the data according to the quote status and month wise quote count */
            const currentYear = new Date().getFullYear();
            let previousYear = parseInt(currentYear) - 1;
            var fromDate = new Date(`${previousYear}-01-01`);
            /* get the month */
            let fromMonth =
                fromDate.getMonth() + 1 < 10
                    ? '0' + (fromDate.getMonth() + 1)
                    : fromDate.getMonth() + 1;
            whereGraphQuery = {
                ...quoteQuery,
                activated_at: sequelize.where(
                    sequelize.fn('YEAR', sequelize.col('activated_at')),
                    currentYear
                )
            };
            /* graph query for the month and total quote count */
            let graphQuery = {
                attributes: [
                    [sequelize.fn('MONTH', sequelize.col('activated_at')), fromMonth],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total_quotes']
                ],
                group: [fromMonth],
                raw: true,
            };
            /* for active quotes */
            whereGraphQuery.status = QUOTE_STATUS.ACTIVE;
            graphQuery.where = whereGraphQuery;
            const activeData = await this.services.getQuoteGraphData(graphQuery);
            //console.log('activeData', activeData);
            delete whereGraphQuery.activated_at;
            whereGraphQuery.updatedAt = sequelize.where(
                sequelize.fn('YEAR', sequelize.col('updatedAt')),
                currentYear
            );
            graphQuery = {
                attributes: [
                    [sequelize.fn('MONTH', sequelize.col('updatedAt')), fromMonth],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total_quotes'],
                ],
                group: [fromMonth],
                raw: true,
            };
            /* new code */
            /* Define an array of all the quote statuses */
            const quoteStatuses = [
                { status: QUOTE_STATUS.INACTIVE, key: 'inactiveData' },
                { status: QUOTE_STATUS.EMITIDO, key: 'emitidoData' },
                { status: QUOTE_STATUS.RASCUNHO, key: 'raschunoData' },
                { status: QUOTE_STATUS.MODERAÇÃO, key: 'moderateData' },
                { status: QUOTE_STATUS.EM_EMISSÃO, key: 'emissionData' },
                { status: QUOTE_STATUS.DECLINADA, key: 'declineData' },
                { status: QUOTE_STATUS.CANCELADO, key: 'canceledData' },
                { status: QUOTE_STATUS.PENDENTE, key: 'pendingData' }
            ];
            /* Initialize an object to store the results */
            const quoteData = {};
            /* Loop through the statuses and fetch data dynamically */
            for (const { status, key } of quoteStatuses) {
                whereGraphQuery.status = status;
                graphQuery.where = whereGraphQuery;
                quoteData[key] = await this.services.getQuoteGraphData(graphQuery);
            }
            /* end */
            /* get data for quote pi chart */
            const quotePiChart = {
                EMBARCADOR: countByStatus.quote_pi_chart_EMBARCADOR
            };
            /* get data for proposal pi chart */
            const proposalPiChart = {
                EMBARCADOR: proposalCount.isEmbarcadorProposal
            };
            /* response values */
            const getQuoteCount = {
                quote_count: countByStatus.totalQuoteCount,
                proposal_count: proposalCount.totalProposalCount,
                claim_count: claimCount,
                total_commission: commission,
                quote_data: quoteData,
                active_data: activeData,
                quote_pi_chart: quotePiChart,
                proposal_pi_chart: proposalPiChart,
            };
            return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, getQuoteCount, RESPONSE_CODES.POST, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('company Dashboard Data error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */
}