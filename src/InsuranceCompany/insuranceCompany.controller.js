import jsRender from 'jsrender';
import moment from 'moment';
import puppeteer from 'puppeteer';
import { CHILD_LOG_TYPE, CURRENCY_ID, DEFAULT_ENUM, PARENT_LOG_TYPE, PROPOSAL_STATUS, QUOTE_STATUS, RESPONSE_CODES, SOCKET_EVENTS, TRANSACTION_DOC_TYPE, PREMIUM_CALCULATION_TYPE, INSURANCE_TYPE_ID, TRANSACTION_PAYMENT_TYPE } from "../../config/constants";
import { errorResponse, successResponse } from "../../config/responseHandlers";
import { convertToBrazilCurrency, getMonthName, getUUID, saveApilogs, updateApilogs, uploadFileToServer } from "../helpers/commonFunction";
import logger from '../helpers/logger';
import { downloadPolicyPdf, getAccessToken, getCustomerScore } from "../services/insuranceCompany/proposal";
import { emitSocketEvent } from "../services/socket.io";
import Services from "./insuranceCompany.services";
const PDFDocument = require('pdf-lib').PDFDocument;
export default class InsuranceCompany {
    async init(db) {
        /* initializing classes to be used */
        this.services = new Services();
        this.Models = db.models;
        await this.services.init(db);
    }

    /* get approved proposal pdf and gr book pdf  */
    async proposalApprovalFromInsuranceCompany(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const ProposalMessages = req.CommonMessages.proposal;
        const QuoteMessages = req.CommonMessages.quote;
        let addApiLogResponse;
        try {
            const { body, user, ip_address } = req;
            /* get quote detail for proposal */
            const isQuoteExist = await this.services.getQuoteDetailForProposal({ proposal_no: body.proposal_no });
            if (!isQuoteExist) {
                return res.send(errorResponse(
                    QuoteMessages.QUOTE_NOT_FOUND,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ));
            };
            if (isQuoteExist.dataValues.proposal_detail.dataValues.status == PROPOSAL_STATUS.EMITIDO) {
                return res.send(errorResponse(
                    ProposalMessages.PROPOSAL_IS_ALREADY_ISSUED,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ));
            }
            /* generate uuid for api logs */
            const apilog_uuid = await getUUID();
            /* create api log payload  */
            const addApilogPayload = {
                request_id: isQuoteExist.proposal_no,
                type: PARENT_LOG_TYPE.PROPOSAL,
                log_type: CHILD_LOG_TYPE.PROPOSAL_APPROVAL_FROM_INSURANCE_COMPANY,
                ip_address: ip_address,
                login_user_id: user.id,
                uuid: apilog_uuid,
                request_payload: JSON.stringify(body),
            };
            addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
            /* end */
            let proposalPayload = {};
            /* get the policy pdf */
            const policyPdfResult = await downloadPolicyPdf(isQuoteExist);
            proposalPayload = {
                policy_pdf: policyPdfResult && policyPdfResult.Location ? policyPdfResult.Location : null
            };
            proposalPayload.status = PROPOSAL_STATUS.EMITIDO;
            /* update quote */
            await this.services.updateQuote({ status: QUOTE_STATUS.EMITIDO }, { id: isQuoteExist.id });
            /* update proposal */
            await this.services.updateProposal(proposalPayload, { proposal_no: body.proposal_no });
            /* socket emission */
            emitSocketEvent(SOCKET_EVENTS.PROPOSAL_APPROVAL_SUCCESS, { proposal_id: body.proposal_no });
            /* end */
            await this.createProposalReport(isQuoteExist);
            /*calculate customer score */
            getCustomerScore(isQuoteExist.company_id, this.Models);
            /* Update the API logs with the result and success message */
            const updateApiLogPayload = {
                payload: {
                    response: null,
                    message: ProposalMessages.PROPOSAL_APPROVED_SUCCESS
                },
                query: { id: addApiLogResponse.id }
            };
            await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
            return res.send(successResponse(ProposalMessages.PROPOSAL_APPROVED_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('proposal Approval From Insurance Company Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    // /* create proposal report */
    // async createProposalReport(quote) {
    //     try {
    //         let total_premium = quote.premium_calculation_type == PREMIUM_CALCULATION_TYPE.AJUSTAVEL ? quote.transport_good.total_limit : 0;
    //         let currency = quote.transport_good.currency;
    //         let nicwc = total_premium;
    //         let commission_percentage = 0;
    //         let payment_type;
    //         // if (quote.insurance_type_id == INSURANCE_TYPE_ID.SINGLE) {
    //         //     payment_type = TRANSACTION_PAYMENT_TYPE.AVULSA
    //         // } else {
    //         //     payment_type = quote.premium_calculation_type == PREMIUM_CALCULATION_TYPE.AJUSTAVEL ?
    //         //     TRANSACTION_PAYMENT_TYPE.ADJUSTABLE : TRANSACTION_PAYMENT_TYPE.AVERBAVEL;
    //         // }
    //         commission_percentage = quote.is_calculation_personalized == DEFAULT_ENUM.TRUE ?
    //             quote.dataValues.quote_calculation.dataValues.personalized_commission_percentage :
    //             quote.dataValues.quote_calculation.dataValues.standard_commission_percentage;
    //         /* report payload */
    //         const reportPayload = {
    //             user_id: quote.user_id,
    //             quote_id: quote.id,
    //             company_id: quote.company_id,
    //             proposal_id: quote.proposal_detail.id,
    //             agency_id: quote.quote_company.agency_id,
    //             premium_calculation_type: quote.premium_calculation_type,
    //             currency,
    //             created_by_id: quote.created_by_id,
    //             created_on: quote.proposal_detail.createdAt,
    //             doc_type: TRANSACTION_DOC_TYPE.POLICY,
    //             payment_type,
    //             nicwc,
    //             estimated_shipment: quote.transport_good.estimated_for_next_12_months,
    //             limit: quote.transport_good.total_limit,
    //             broker_commission: commission_percentage
    //         };
    //         /*create proposal reports */
    //         await this.services.createReport(reportPayload);
    //         return;
    //     } catch (error) {
    //         console.log('create Proposal Report Error', error);
    //         logger.error('create Proposal Report Error', error);
    //     }
    // }
    // /* end */

    /* get access token */
    async getAccessToken(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { ip_address } = req;
            const result = await getAccessToken(ip_address, this.Models);
            return res.send(result);
        } catch (error) {
            console.log(error);
            logger.error('get Access Token Error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

}