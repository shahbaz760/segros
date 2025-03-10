import moment from 'moment';
import { Op } from 'sequelize';
import { CHILD_LOG_TYPE, DEFAULT_ENUM, IS_ACTIVE, PARENT_LOG_TYPE, PROPOSAL_NEW_STATUS, PROPOSAL_STATUS, QUOTE_STATUS, RESPONSE_CODES, ROLES, USER_STATUS, SOCKET_EVENTS, INSURANCE_TYPE_ID, PREMIUM_CALCULATION_TYPE, TRANSACTION_DOC_TYPE, TRANSACTION_PAYMENT_TYPE } from "../../config/constants";
import { errorResponse, successResponse, successResponseWithPagination } from "../../config/responseHandlers";
import { getAssociatedUsers, getUUID, saveApilogs, updateApilogs, getAccessTokenForOFAC, get2Decimal, insuranceCompanyPayload } from "../helpers/commonFunction";
import logger from '../helpers/logger';
import Services from "./proposal.services";
import quoteController from "../Quote/quote.controller";
import { addSinglePolicyToInsuranceCompany, addAnnualPolicyToInsuranceCompany, getPolicyNumberFromInsuranceCompany, getAccessToken } from "../services/insuranceCompany/proposal";
import { emitSocketEvent } from '../services/socket.io';
export default class Proposal {
    async init(db) {
        /* initializing classes to be used */
        this.services = new Services();
        this.Models = db.models;
        await this.services.init(db);
        this.quoteInstance = new quoteController();

    }
    /* get quote details */
    async getQuoteList(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { query, user } = req;
            const length = parseInt(query.length);
            const start = parseInt(length * (query.page - 1));
            let quoteQuery = {
                deleted_at: null,
                status: QUOTE_STATUS.ACTIVE
            };
            let userIds = [];
            /* get the sub users of all roles except admin and sub admin */
            if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN) {
                userIds = await getAssociatedUsers(this.Models, user);
                quoteQuery.user_id = userIds;
            }
            /* get search value from body */
            let search_query = [];
            if (query.id_like) {
                search_query.push({ id: { [Op.like]: `%${query.id_like}%` } })
            };
            if (query.company_name_like) {
                search_query.push({ company_name: { [Op.like]: `%${query.company_name_like}%` } })
            };
            if (query.ruc_like) {
                search_query.push({ ruc: { [Op.like]: `%${query.ruc_like}%` } })
            };
            if (query.product_name_like) {
                search_query.push({ product_name: { [Op.like]: `%${query.product_name_like}%` } })
            };
            if (query.insurance_type_name_like) {
                search_query.push({ insurance_type_name: { [Op.like]: `%${query.insurance_type_name_like}%` } })
            };
            if (search_query.length > 0) {
                quoteQuery[Op.and] = search_query;
            };
            /* get quote list */
            const quoteDetail = await this.services.getQuotesListForProposal(quoteQuery, { start, length });
            const resultWithoutPagination = await this.services.getQuotesListForProposal(quoteQuery, { start: 0, length: 0 });
            const recordsTotal = resultWithoutPagination.length;
            const recordsFiltered = resultWithoutPagination.length;
            return res
                .send(successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, quoteDetail, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('get Quote List Error', error);
            console.log(error);
            return res
                .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* create proposals */
    async createProposals(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const QuoteMessages = req.CommonMessages.quote;
        const ProposalMessages = req.CommonMessages.proposal;
        let addApiLogResponse;
        try {
            const { user, body, ip_address } = req;
            const {
                quote_id,
                policy_start_date,
                policy_end_date,
                //due_date,
                no_of_installment,
                payment_type,
                endorsement,
                responsible_name,
                responsible_email,
                responsible_phone,
                is_co_broker_exist,
                adjustment_percentage,
                is_co_insurar_exist,
                co_brokers,
                co_insurance,
            } = body;
            const query = {
                id: quote_id,
                status: QUOTE_STATUS.ACTIVE
            }
            /* get quote detail */
            const quoteDetail = await this.services.getQuoteForCreateProposal(query);
            const selectedGoodIdsName = [];
            const selectedDocuments = [];
            //console.log('good_name11111111111111111', quoteDetail);
            // console.log('good_name22222222222', quoteDetail.dataValues.quote_shipment.dataValues.shipment_documents[0].name);
            // console.log('good_name3333333333', quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail.dataValues.boarding_document_number);
            const transportGoods = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.transport_good && quoteDetail.dataValues.transport_good.dataValues && quoteDetail.dataValues.transport_good.dataValues.transport_good_details ? quoteDetail.dataValues.transport_good.dataValues.transport_good_details : null;
            /* return good names corresponding to the quote transport good details  */
            if (transportGoods) {
                const processedDetails = transportGoods.map(async (ele) => {
                    const goodsDetail = await this.services.getGoodsForModeration({ id: JSON.parse(ele.good_id) });
                    const goodNames = goodsDetail.map(obj => obj.name);
                    ele.dataValues.good_name = goodNames;
                    selectedGoodIdsName.push(ele.dataValues.good_name);
                }
                );
                await Promise.all(processedDetails);
            }
            /* Flatten the array to get the list of IDs */
            const flatGoodNames = selectedGoodIdsName.flat() || [];
            //  console.log('flatGoodNames121121', flatGoodNames);
            const shipmentDocuments = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_shipment && quoteDetail.dataValues.quote_shipment.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.shipment_documents ? quoteDetail.dataValues.quote_shipment.dataValues.shipment_documents : 0;
            if (shipmentDocuments && shipmentDocuments.length > 0) {
                const shipmentDetails = shipmentDocuments.map(async (ele) => {
                    const singleShipmentDetail = await this.services.getShipmentDocuments({ quote_shipment_id: ele.quote_shipment_id });
                    const documentNames = singleShipmentDetail.map(obj => obj.name);
                    ele.dataValues.document_names = documentNames;
                    selectedDocuments.push(ele.dataValues.document_names);
                }
                );
                await Promise.all(shipmentDetails);
            }
            /* Flatten the array to get the list of IDs */
            const flatShipmentDocumentName = selectedDocuments.flat() || [];
            //return;
            let grossWrittenPremium;
            let insurance_rate;
            let total_Premium;
            let total_insurance_cost;
            if (quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.is_calculation_personalized == 0) {
                grossWrittenPremium = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_gross_written_premium ? quoteDetail.dataValues.quote_calculation.dataValues.standard_gross_written_premium : 0;
                insurance_rate = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_insurance_rate ? quoteDetail.dataValues.quote_calculation.dataValues.standard_insurance_rate : 0;
                total_Premium = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_total_premium ? quoteDetail.dataValues.quote_calculation.dataValues.standard_total_premium : 0;
                total_insurance_cost = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_total_insurance_cost ? quoteDetail.dataValues.quote_calculation.dataValues.standard_total_insurance_cost : 0;
            } else {
                grossWrittenPremium = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_gross_written_premium ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_gross_written_premium : 0;
                insurance_rate = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_insurance_rate ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_insurance_rate : 0;
                total_Premium = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_total_premium ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_total_premium : 0;
                total_insurance_cost = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_total_insurance_cost ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_total_insurance_cost : 0;
            }
            const result = await this.quoteInstance.calculateTaxes(total_Premium);
            if (!quoteDetail) {
                return res.send(errorResponse(
                    QuoteMessages.QUOTE_NOT_FOUND,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ));
            };
            /* generate uuid for api logs */
            const apilog_uuid = await getUUID();
            /* create api log payload  */
            const addApilogPayload = {
                request_id: quoteDetail.proposal_no,
                type: PARENT_LOG_TYPE.PROPOSAL,
                log_type: CHILD_LOG_TYPE.CREATE_PROPOSAL,
                ip_address: ip_address,
                login_user_id: user.id,
                uuid: apilog_uuid,
                request_payload: JSON.stringify(body),
            };
            addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
            const document_boarding_number = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_shipment && quoteDetail.dataValues.quote_shipment.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail && quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail.dataValues.boarding_document_number ? quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail.dataValues.boarding_document_number : 0;
            // Ensure all required variables are set to default empty strings if undefined
            const goodNamesString = flatGoodNames.length > 0 ? flatGoodNames.join(', ') : ''; // Default to empty string
            const boardingDocumentNumber = document_boarding_number || ''; // Default to empty string
            const firstShipmentDocumentName = flatShipmentDocumentName[0] || ''; // Default to empty string
            const quoteIdString = quote_id || ''; // Default to empty string
            /* Prepare the astr_detalle field */
            // const astr_detalle = `${flatGoodNames.join(', ')}/${document_boarding_number}/${flatShipmentDocumentName[0]}/${quote_id}`;
            // Prepare the astr_detalle field
            const astr_detalle = `${goodNamesString} / ${boardingDocumentNumber} / ${firstShipmentDocumentName} / ${quoteIdString}`;
            //console.log('astr_detalle111111111', astr_detalle);
            /* generate uuid for user */
            const uuid = await getUUID();
            /* create payload to create proposal */
            const payload = {
                uuid,
                user_id: quoteDetail.user_id,
                quote_id: quoteDetail.id,
                company_id: quoteDetail.company_id,
                proposal_no: quoteDetail.proposal_no,
                // policy_id: quoteDetail.proposal_no,
                created_by_id: quoteDetail.created_by_id,
                policy_start_date,
                policy_end_date,
                //due_date,
                //no_of_installment,
                payment_type,
                endorsement,
                responsible_name,
                responsible_email,
                responsible_phone,
                // is_co_broker_exist,
                adjustment_percentage,
                //is_co_insurar_exist,
                co_brokers: JSON.stringify(co_brokers),
                co_insurance: JSON.stringify(co_insurance),
                status: PROPOSAL_STATUS.EM_EMISSAO,
                created_on: Date.now(),
                // bank_name: bank_name,
                // account_no: account_no,
            };
            // const policyPayload = await insuranceCompanyPayload(quoteDetail, result, ip_address, this.Models);
            // policyPayload.gross_written_premium = grossWrittenPremium;
            // policyPayload.insurance_rate = insurance_rate;
            // policyPayload.total_Premium = total_Premium;
            // policyPayload.total_insurance_cost = total_insurance_cost;
            // policyPayload.policy_start_date = new Date(policy_start_date).toISOString().split('.')[0];
            // policyPayload.policy_end_date = new Date(policy_end_date).toISOString().split('.')[0];
            // policyPayload.astr_detalle = astr_detalle;
            // console.log('policyPayload1211212', policyPayload);

            const policyPayloadToInsuranceCompany = {
                ip_address: ip_address,
                proposal_no: quoteDetail.proposal_no,
                gross_written_premium: grossWrittenPremium,
                insurance_rate: insurance_rate,
                total_Premium: total_Premium,
                total_insurance_cost: total_insurance_cost,
                total_limit: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.transport_good && quoteDetail.dataValues.transport_good.dataValues.total_limit ? quoteDetail.dataValues.transport_good.dataValues.total_limit : null,
                product_name: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.product_name ? quoteDetail.dataValues.product_name : null,
                company_ruc: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.ruc ? quoteDetail.dataValues.quote_company.dataValues.ruc : null,
                company_name: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.company_name ? quoteDetail.dataValues.quote_company.dataValues.company_name : null,
                company_email: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.company_email ? quoteDetail.dataValues.quote_company.dataValues.company_email : null,
                company_phone: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.company_phone ? quoteDetail.dataValues.quote_company.dataValues.company_phone : null,
                company_address: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.address ? quoteDetail.dataValues.quote_company.dataValues.address : null,
                company_address_no: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.address_no ? quoteDetail.dataValues.quote_company.dataValues.address_no : null,
                city: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.city ? quoteDetail.dataValues.quote_company.dataValues.city : null,
                source: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_shipment && quoteDetail.dataValues.quote_shipment.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0] && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.source_detail && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.source_detail.astr_id ? quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.source_detail.astr_id : null,
                destination: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_shipment && quoteDetail.dataValues.quote_shipment.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0] && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.source_detail && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.source_detail.astr_id ? quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.destiny_detail.astr_id : null,
                policy_start_date: new Date(policy_start_date).toISOString().split('.')[0],
                policy_end_date: new Date(policy_end_date).toISOString().split('.')[0],
                tax_emmssion: result.tax_emmssion ? result.tax_emmssion : 0,
                CSSC: result.tax_ssc ? get2Decimal(result.tax_ssc) : 0,
                CSCVS: result.tax_scvs ? get2Decimal(result.tax_scvs) : 0,
                IVA: result.tax_iva ? get2Decimal(result.tax_iva) : 0,
                astr_detalle: astr_detalle,
            };
            // console.log('policyPayloadToInsuranceCompany89898989', policyPayloadToInsuranceCompany);
            //return
            /* get token */
            const getAccessTokenForOfac = await getAccessTokenForOFAC({ ip_address }, this.Models);
            let addPolicyResult;
            let updateApiLogPayload;
            let response;
            if (quoteDetail.dataValues.insurance_type_id == INSURANCE_TYPE_ID.SINGLE) {
                /* add policy to insurance company for flow 1 */
                addPolicyResult = await addSinglePolicyToInsuranceCompany(policyPayloadToInsuranceCompany, getAccessTokenForOfac, this.Models);
                if (addPolicyResult && addPolicyResult.status && addPolicyResult.status == 200) {
                    /* creating proposal */
                    const createProposal = await this.services.createProposal(payload);
                    console.log("createProposal", createProposal);
                    /* update quote status */
                    await this.services.updateQuote({ status: QUOTE_STATUS.EM_EMISSÃO }, { id: quote_id });
                    /* Update the API logs with the result and success message */
                    updateApiLogPayload = {
                        payload: {
                            response: null,
                            message: ProposalMessages.PROPOSAL_CREATED_SUCCESS
                        },
                        query: { id: addApiLogResponse.id }
                    };
                    /* socket emission */
                    emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                    emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
                    /* end */
                    // const getPolicyNumberResult = await getPolicyNumberFromInsuranceCompany({ proposal_no: quoteDetail.proposal_no, ip_address }, getAccessTokenForOfac, this.Models)
                    // if (getPolicyNumberResult && getPolicyNumberResult.status == 200 && getPolicyNumberResult.astr_poliza) {
                    //     await this.services.updateProposal({ policy_id: getPolicyNumberResult.astr_poliza, status: PROPOSAL_STATUS.EMITIDO }, { id: createProposal.id });
                    //     await this.services.updateQuote({ status: QUOTE_STATUS.EMITIDO }, { id: quote_id });
                    //     /* socket emission */
                    //     emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                    //     /* end */
                    // }
                    response = successResponse(ProposalMessages.PROPOSAL_CREATED_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization);
                    /* Execute the following logic after a 90-second delay in the background */
                    setTimeout(async () => {
                        try {
                            const getPolicyNumberResult = await getPolicyNumberFromInsuranceCompany(
                                { proposal_no: quoteDetail.proposal_no, ip_address },
                                getAccessTokenForOfac,
                                this.Models
                            );
                            console.log("getPolicyNumberResult", getPolicyNumberResult);

                            if (getPolicyNumberResult && getPolicyNumberResult.status == 200 && getPolicyNumberResult.astr_poliza) {
                                await this.services.updateProposal(
                                    { policy_id: getPolicyNumberResult.astr_poliza, status: PROPOSAL_STATUS.EMITIDO },
                                    { id: createProposal.id }
                                );
                                await this.services.updateQuote(
                                    { status: QUOTE_STATUS.EMITIDO },
                                    { id: quote_id }
                                );

                                /* socket emission */
                                emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                                emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
                                /* end */
                            }
                        } catch (error) {
                            console.error("Error during delayed get policy number execution:", error);
                            logger.error('Error during delayed get policy number execution', error, addApiLogResponse?.id || null, this.Models.ApiLogs)
                            // Optionally log the error or handle failure scenarios
                        }
                    }, 90 * 1000);
                } else {
                    /* Update the API logs with the result and success message */
                    updateApiLogPayload = {
                        payload: {
                            response: null,
                            message: ProposalMessages.PROPOSAL_CREATED_FAILED
                        },
                        query: { id: addApiLogResponse.id }
                    };
                    response = errorResponse(ProposalMessages.PROPOSAL_CREATED_FAILED, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization);

                }
            }
            if (quoteDetail.dataValues.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL) {
                /* add policy to insurance company for flow 2 */
                addPolicyResult = await addAnnualPolicyToInsuranceCompany(policyPayloadToInsuranceCompany, getAccessTokenForOfac, this.Models);
                if (addPolicyResult && addPolicyResult.status && addPolicyResult.status == 200) {
                    /* creating proposal */
                    const createProposal = await this.services.createProposal(payload);
                    console.log("createProposal", createProposal);
                    /* update quote status */
                    await this.services.updateQuote({ status: QUOTE_STATUS.EM_EMISSÃO }, { id: quote_id });
                    /* Update the API logs with the result and success message */
                    updateApiLogPayload = {
                        payload: {
                            response: null,
                            message: ProposalMessages.PROPOSAL_CREATED_SUCCESS
                        },
                        query: { id: addApiLogResponse.id }
                    };
                    /* socket emission */
                    emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                    emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
                    /* end */
                    // const getPolicyNumberResult = await getPolicyNumberFromInsuranceCompany({ proposal_no: quoteDetail.proposal_no, ip_address }, getAccessTokenForOfac, this.Models)
                    // if (getPolicyNumberResult && getPolicyNumberResult.status == 200 && getPolicyNumberResult.astr_poliza) {
                    //     await this.services.updateProposal({ policy_id: getPolicyNumberResult.astr_poliza, status: PROPOSAL_STATUS.EMITIDO }, { id: createProposal.id });
                    //     await this.services.updateQuote({ status: QUOTE_STATUS.EMITIDO }, { id: quote_id });
                    //     /* socket emission */
                    //     emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                    //     /* end */
                    // }
                    response = successResponse(ProposalMessages.PROPOSAL_CREATED_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization);
                    /* Execute the following logic after a 90-second delay in the background */
                    setTimeout(async () => {
                        try {
                            const getPolicyNumberResult = await getPolicyNumberFromInsuranceCompany(
                                { proposal_no: quoteDetail.proposal_no, ip_address },
                                getAccessTokenForOfac,
                                this.Models
                            );
                            console.log("getPolicyNumberResult", getPolicyNumberResult);

                            if (getPolicyNumberResult && getPolicyNumberResult.status == 200 && getPolicyNumberResult.astr_poliza) {
                                await this.services.updateProposal(
                                    {
                                        policy_id: getPolicyNumberResult.astr_poliza,
                                        status: PROPOSAL_STATUS.EMITIDO
                                    },
                                    { id: createProposal.id }
                                );
                                await this.services.updateQuote(
                                    { status: QUOTE_STATUS.EMITIDO },
                                    { id: quote_id }
                                );

                                /* socket emission */
                                emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                                emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
                                /* end */
                            }
                        } catch (error) {
                            console.error("Error during delayed get policy number execution:", error);
                            logger.error('Error during delayed get policy number execution', error, addApiLogResponse?.id || null, this.Models.ApiLogs)
                            // Optionally log the error or handle failure scenarios
                        }
                    }, 90 * 1000);
                } else {
                    /* Update the API logs with the result and success message */
                    updateApiLogPayload = {
                        payload: {
                            response: null,
                            message: ProposalMessages.PROPOSAL_CREATED_FAILED
                        },
                        query: { id: addApiLogResponse.id }
                    };
                    response = errorResponse(ProposalMessages.PROPOSAL_CREATED_FAILED, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization);

                }
            }
            await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
            return res.send(response);
        } catch (error) {
            logger.error('create Proposals Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs)
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* get proposal list */
    async getProposalList(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body, user, params } = req;
            if (user.role_id == ROLES.SUB_AGENCY || user.role_id == ROLES.SUB_BROKER) {
                if (user.user_access.proposals == DEFAULT_ENUM.FALSE) {
                    return res.send(errorResponse(CommonMessages.UNAUTHORIZED_USER, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
                }
            };
            const policyId = params.policy_id;
            /* create conditions for getting proposals */
            let proposalCondition = {
                deleted_at: null,
                status: body.status ? body.status : [
                    PROPOSAL_STATUS.EMITIDO,
                    PROPOSAL_STATUS.EXPIRADO,
                    PROPOSAL_STATUS.EM_EMISSAO,
                    PROPOSAL_STATUS.CANCELDO
                ],
            };
            /* if policy id is given which is optional params */
            if (policyId) {
                proposalCondition.policy_id = policyId;
            }
            /* if company_id is given which is used for client proposal list */
            if (body.company_id) {
                proposalCondition.company_id = body.company_id;
            }
            let userIds = [];
            /* get the sub users of all roles except admin and sub admin */
            if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN) {
                userIds = await getAssociatedUsers(this.Models, user);
                proposalCondition.user_id = userIds
            }
            /* get the search value from body */
            if (body && body.search && body.search.value != "") {
                proposalCondition[Op.or] = [
                    { id: { [Op.like]: "%" + body.search.value + "%" } },
                    { proposal_no: { [Op.eq]: body.search.value } },
                    { policy_id: { [Op.like]: '%' + body.search.value + '%' } },
                    { policy_end_date: { [Op.like]: '%' + body.search.value + '%' } },
                    { quote_company_name: { [Op.like]: '%' + body.search.value + '%' } },
                    { broker_company_name: { [Op.like]: '%' + body.search.value + '%' } },
                    { product_name: { [Op.like]: '%' + body.search.value + '%' } },
                ]
            };
            if (body.new_status) {
                if (body.new_status == PROPOSAL_NEW_STATUS.ACTIVO) {
                    proposalCondition.policy_end_date = { [Op.gte]: moment().format('YYYY-MM-DD') }
                }
                if (body.new_status == PROPOSAL_NEW_STATUS.GANADO) {
                    proposalCondition.policy_end_date = { [Op.lt]: moment().format('YYYY-MM-DD') }
                }
            }
            /* get proposal list */
            const proposalDetails = await this.services.getProposalList(proposalCondition, body);
            body.start = DEFAULT_ENUM.FALSE;
            body.length = DEFAULT_ENUM.FALSE;
            const resultWithoutPagination = await this.services.getProposalList(proposalCondition, body);
            const recordsTotal = resultWithoutPagination.length;
            const recordsFiltered = resultWithoutPagination.length;
            return res
                .send(successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, proposalDetails, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('get Proposal List ', error)
            return res
                .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* get broker list */
    async getBrokerList(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { user } = req;
            let query = {
                role_id: ROLES.BROKER,
                status: USER_STATUS.ACTIVE
            };
            let userIds = [];
            /* get associated user ids */
            if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN) {
                userIds = await getAssociatedUsers(this.Models, user);
                query.id = userIds
            }
            /* get broker list which is active */
            const brokerList = await this.services.getBrokerList(query);
            return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, brokerList, RESPONSE_CODES.POST, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('get Broker List Error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* get quote details */
    async getQuoteDetail(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const QuoteMessages = req.CommonMessages.quote;
        try {
            const { quote_id, } = req.params;
            const user = req.body;
            /* get quote detail */
            const result = await this.services.getQuoteDetailToCreateProposal({ id: quote_id });
            // if (!(user.role_id == ROLES.ADMIN || user.role_id == ROLES.SUB_ADMIN)) {
            //     if (user.id != result.user_id) {
            //         return res.send(errorResponse(CommonMessages.UNAUTHORIZED_USER, null, RESPONSE_CODES.BAD_REQUEST));
            //     }
            // }
            return res
                .send(
                    successResponse(QuoteMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
                );
        } catch (error) {
            logger.error('get Quote Detail Error, ', error);
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        };
    }
    /* end */

    /* get policy number from insurance company through api */
    async getPolicyNumberThroughApi(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const QuoteMessages = req.CommonMessages.quote;
        try {
            const { proposal_no, } = req.params;
            const token = await getAccessTokenForOFAC();
            const result = await getPolicyNumberFromInsuranceCompany({ proposal_no, ip_address: req.ip_address }, token, this.Models)
            return res
                .send(
                    successResponse(QuoteMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
                );
        } catch (error) {
            logger.error('get Policy Number Through Api Error, ', error);
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        };
    }
    /* end */

    /* update proposal status */
    async updateProposalStatus(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const ProposalMessages = req.CommonMessages.proposal;
        let addApiLogResponse;
        try {
            const { user, ip_address } = req;
            /* type : 1 for proposal, 2 for endorsement */
            const { type, proposal_no } = req.body;
            const proposalDetail = await this.services.getProposalDetail({ proposal_no: proposal_no });
            /* if proposal detail is not found */
            if (!proposalDetail) {
                return res.send(errorResponse(
                    ProposalMessages.PROPOSAL_NOT_FOUND,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ))
            };
            /* generate uuid for api logs */
            const apilog_uuid = await getUUID();
            /* create api log payload  */
            const addApilogPayload = {
                request_id: proposalDetail.proposal_no,
                type: PARENT_LOG_TYPE.PROPOSAL,
                log_type: CHILD_LOG_TYPE.UPDATE_PROPOSAL_STATUS,
                ip_address: ip_address,
                login_user_id: user.id,
                uuid: apilog_uuid,
                request_payload: JSON.stringify(req.body),
            };
            addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
            /* check for proposal status */
            if (proposalDetail.status != PROPOSAL_STATUS.EMITIDO && proposalDetail.status != PROPOSAL_STATUS.CANCELDO) {
                return res.send(errorResponse(
                    ProposalMessages.THE_PROPOSAL_IS_NOT_ISSUED,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ))
            };
            const proposalStatus = proposalDetail.status == PROPOSAL_STATUS.EMITIDO ? PROPOSAL_STATUS.CANCELDO : PROPOSAL_STATUS.EMITIDO;
            const quoteStatus = proposalDetail.status == PROPOSAL_STATUS.EMITIDO ? QUOTE_STATUS.CANCELADO : QUOTE_STATUS.EMITIDO;
            /* update proposal status */
            await this.services.updateProposal({ status: proposalStatus }, { id: proposalDetail.id });
            /* update quote status according to the proposal status */
            await this.services.updateQuote({ status: quoteStatus }, { id: proposalDetail.quote_id });
            /* response message according to the proposal status */
            const finalResponseMessage = proposalStatus == PROPOSAL_STATUS.CANCELDO
                ? ProposalMessages.PROPOSAL_SUCCESSFULLY_CANCELLED
                : ProposalMessages.PROPOSAL_SUCCESSFULLY_CONVEYED;
            /* Update the API logs with the result and success message */
            const updateApiLogPayload = {
                payload: {
                    response: null,
                    message: finalResponseMessage
                },
                query: { id: addApiLogResponse.id }
            };
            await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
            /* socket emission */
            //emitSocketEvent(SOCKET_EVENTS.PROPOSAL_STATUS_UPDATED_SUCCESS, { proposal_id: proposal_no });
            /* end */
            return res.send(successResponse(finalResponseMessage, null, RESPONSE_CODES.POST, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('update Proposal Status Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs)
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization))
        }
    }
    /* end */

    async getDropdownData(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const ProposalMessages = req.CommonMessages.proposal;
        let addApiLogResponse;
        try {
            const { user, ip_address } = req;
            const getOccupations = await this.services.getOccupations({ is_active: DEFAULT_ENUM.TRUE });
            const getHeritageRanks = await this.services.getHeritageRanks({ is_active: DEFAULT_ENUM.TRUE });
            const getEconomicActivities = await this.services.getEconomicRanges({ is_active: DEFAULT_ENUM.TRUE });
            const getIncomeRanges = await this.services.getIncomeRanges({ is_active: DEFAULT_ENUM.TRUE });
            const agencies = await this.services.getAgencies({ is_active: DEFAULT_ENUM.TRUE });
            const data = {
                occupations: getOccupations,
                heritageRanks: getHeritageRanks,
                economicactivities: getEconomicActivities,
                incomeranges: getIncomeRanges,
                agencies: agencies
            }
            return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, data, RESPONSE_CODES.POST, req.headers.tokenization));

        } catch (error) {
            console.log(error);
            logger.error('get Dropdown Data Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs)
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization))
        }
    }

    /* create proposals */
    async createProposalsV1(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const QuoteMessages = req.CommonMessages.quote;
        const ProposalMessages = req.CommonMessages.proposal;
        let addApiLogResponse;
        try {
            const { user, body, ip_address } = req;
            const {
                quote_id,
                policy_start_date,
                policy_end_date,
                //due_date,
                payment_type,
                heritage_rank_id,
                economic_activity_id,
                occupation_id,
                income_range_id,
                average_income_value,
                average_equity_value,
                agency_id
            } = body;
            const query = {
                id: quote_id,
                status: QUOTE_STATUS.ACTIVE
            }
            /* get quote detail */
            const quoteDetail = await this.services.getQuoteForCreateProposal(query);
            if (!quoteDetail) {
                return res.send(errorResponse(
                    QuoteMessages.QUOTE_NOT_FOUND,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ));
            };
            const selectedGoodIdsName = [];
            const selectedDocuments = [];
            const transportGoods = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.transport_good && quoteDetail.dataValues.transport_good.dataValues && quoteDetail.dataValues.transport_good.dataValues.transport_good_details ? quoteDetail.dataValues.transport_good.dataValues.transport_good_details : null;
            /* return good names corresponding to the quote transport good details  */
            if (transportGoods) {
                const processedDetails = transportGoods.map(async (ele) => {
                    const goodsDetail = await this.services.getGoodsForModeration({ id: JSON.parse(ele.good_id) });
                    const goodNames = goodsDetail.map(obj => obj.name);
                    ele.dataValues.good_name = goodNames;
                    selectedGoodIdsName.push(ele.dataValues.good_name);
                }
                );
                await Promise.all(processedDetails);
            }
            /* Flatten the array to get the list of IDs */
            const flatGoodNames = selectedGoodIdsName.flat() || [];
            //  console.log('flatGoodNames121121', flatGoodNames);
            const shipmentDocuments = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_shipment && quoteDetail.dataValues.quote_shipment.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.shipment_documents ? quoteDetail.dataValues.quote_shipment.dataValues.shipment_documents : 0;
            if (shipmentDocuments && shipmentDocuments.length > 0) {
                const shipmentDetails = shipmentDocuments.map(async (ele) => {
                    const singleShipmentDetail = await this.services.getShipmentDocuments({ quote_shipment_id: ele.quote_shipment_id });
                    const documentNames = singleShipmentDetail.map(obj => obj.name);
                    ele.dataValues.document_names = documentNames;
                    selectedDocuments.push(ele.dataValues.document_names);
                }
                );
                await Promise.all(shipmentDetails);
            }
            /* Flatten the array to get the list of IDs */
            const flatShipmentDocumentName = selectedDocuments.flat() || [];
            //return;
            let grossWrittenPremium;
            let insurance_rate;
            let total_Premium;
            let total_insurance_cost;
            let tax_scvs;
            let tax_ssc;
            let tax_emmssion;
            let tax_iva;
            if (quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.is_calculation_personalized == 0) {
                grossWrittenPremium = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_gross_written_premium ? quoteDetail.dataValues.quote_calculation.dataValues.standard_gross_written_premium : 0;
                insurance_rate = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_insurance_rate ? quoteDetail.dataValues.quote_calculation.dataValues.standard_insurance_rate : 0;
                total_Premium = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_total_premium ? quoteDetail.dataValues.quote_calculation.dataValues.standard_total_premium : 0;
                total_insurance_cost = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_total_insurance_cost ? quoteDetail.dataValues.quote_calculation.dataValues.standard_total_insurance_cost : 0;
                tax_scvs = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_tax_scvs ? quoteDetail.dataValues.quote_calculation.dataValues.standard_tax_scvs : 0;
                tax_ssc = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_tax_ssc ? quoteDetail.dataValues.quote_calculation.dataValues.standard_tax_ssc : 0;
                tax_emmssion = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_tax_emission ? quoteDetail.dataValues.quote_calculation.dataValues.standard_tax_emission : 0;
                tax_iva = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.standard_tax_iva ? quoteDetail.dataValues.quote_calculation.dataValues.standard_tax_iva : 0;

            } else {
                grossWrittenPremium = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_gross_written_premium ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_gross_written_premium : 0;
                insurance_rate = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_insurance_rate ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_insurance_rate : 0;
                total_Premium = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_total_premium ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_total_premium : 0;
                total_insurance_cost = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_total_insurance_cost ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_total_insurance_cost : 0;
                tax_scvs = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_tax_scvs ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_tax_scvs : 0;
                tax_ssc = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_tax_ssc ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_tax_ssc : 0;
                tax_emmssion = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_tax_emission ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_tax_emission : 0;
                tax_iva = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_calculation.dataValues && quoteDetail.dataValues.quote_calculation.dataValues.personalized_tax_iva ? quoteDetail.dataValues.quote_calculation.dataValues.personalized_tax_iva : 0;

            }
            //  const result = await this.quoteInstance.calculateTaxes(total_Premium);

            /* generate uuid for api logs */
            const apilog_uuid = await getUUID();
            /* create api log payload  */
            const addApilogPayload = {
                // request_id: quoteDetail.proposal_no,
                type: PARENT_LOG_TYPE.PROPOSAL,
                log_type: CHILD_LOG_TYPE.CREATE_PROPOSAL,
                ip_address: ip_address,
                login_user_id: user.id,
                uuid: apilog_uuid,
                request_payload: JSON.stringify(body),
            };
            addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
            const document_boarding_number = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_shipment && quoteDetail.dataValues.quote_shipment.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail && quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail.dataValues.boarding_document_number ? quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail.dataValues.boarding_document_number : 0;
            const document_boarding_type = quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_shipment && quoteDetail.dataValues.quote_shipment.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail && quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail.dataValues.boarding_document_type ? quoteDetail.dataValues.quote_shipment.dataValues.single_shipment_detail.dataValues.boarding_document_type : 0;

            // Ensure all required variables are set to default empty strings if undefined
            const goodNamesString = flatGoodNames.length > 0 ? flatGoodNames.join(', ') : ''; // Default to empty string
            const boardingDocumentNumber = document_boarding_number || ''; // Default to empty string
            const boardingDocumentType = document_boarding_type || '';
            const firstShipmentDocumentName = flatShipmentDocumentName[0] || ''; // Default to empty string
            const quoteIdString = quote_id || ''; // Default to empty string
            /* Prepare the astr_detalle field */
            // const astr_detalle = `${flatGoodNames.join(', ')}/${document_boarding_number}/${flatShipmentDocumentName[0]}/${quote_id}`;
            // Prepare the astr_detalle field
            const astr_detalle = `${goodNamesString} / ${boardingDocumentNumber} / ${boardingDocumentType} / ${quoteIdString}`;
            // console.log('astr_detalle111111111', astr_detalle);
            // return
            /* generate uuid for user */
            const uuid = await getUUID();
            /* create payload to create proposal */
            const payload = {
                uuid,
                user_id: quoteDetail.user_id,
                quote_id: quoteDetail.id,
                company_id: quoteDetail.company_id,
                // proposal_no: quoteDetail.proposal_no,
                created_by_id: quoteDetail.created_by_id,
                policy_start_date,
                policy_end_date,
                // due_date,
                payment_type,
                status: PROPOSAL_STATUS.EM_EMISSAO,
                created_on: Date.now(),
                heritage_rank_id,
                economic_activity_id,
                occupation_id,
                income_range_id,
                average_income_value,
                average_equity_value,
                agency_id
            };
            // console.log('payload1221112', payload);
            /* creating proposal */
            const createProposal = await this.services.createProposal(payload);
            // quoteId = createQuote.id;
            /* proposal number is a unique number for the our reference */
            /* Construct sequence based on quoteId */
            const sequence = String(quoteDetail.id).padStart(13, '0');
            const proposalNo = await this.getUniqueProposalNo(sequence);
            await this.services.updateProposal({ proposal_no: proposalNo }, { id: createProposal.id });
            const getHeritageAstrId = await this.services.getHeritageRankValue({ id: body.heritage_rank_id });
            const getEconomicActivityAstrId = await this.services.getEconomicActivityValue({ id: body.economic_activity_id });
            const getOccupationAstrId = await this.services.getOccupationValue({ id: body.occupation_id });
            const getIncomeRangeAstrId = await this.services.getIncomeRangeValue({ id: body.income_range_id });
            const getAgencyAstrId = await this.services.getAgencyById({ id: body.agency_id });
            // const policyPayload = await insuranceCompanyPayload(quoteDetail, result, ip_address, this.Models);
            // policyPayload.gross_written_premium = grossWrittenPremium;
            // policyPayload.insurance_rate = insurance_rate;
            // policyPayload.total_Premium = total_Premium;
            // policyPayload.total_insurance_cost = total_insurance_cost;
            // policyPayload.policy_start_date = new Date(policy_start_date).toISOString().split('.')[0];
            // policyPayload.policy_end_date = new Date(policy_end_date).toISOString().split('.')[0];
            // policyPayload.astr_detalle = astr_detalle;
            // console.log('policyPayload1211212', policyPayload);
            let heritage_rank_value;
            let income_range_value;
            if (getHeritageAstrId && getHeritageAstrId.astr_id == 9) {
                heritage_rank_value = 10000;
            } else if (getHeritageAstrId && getHeritageAstrId.astr_id == 10) {
                heritage_rank_value = 50000;
            } else if (getHeritageAstrId && getHeritageAstrId.astr_id == 11) {
                heritage_rank_value = 200000
            } else {
                heritage_rank_value = body.average_equity_value
            }
            if (getIncomeRangeAstrId && getIncomeRangeAstrId.astr_id == 1) {
                income_range_value = 500;
            } else if (getIncomeRangeAstrId && getIncomeRangeAstrId.astr_id == 2) {
                income_range_value = 1000
            } else if (getIncomeRangeAstrId && getIncomeRangeAstrId.astr_id == 3) {
                income_range_value = 2000;
            } else {
                income_range_value = body.average_income_value;
            }
            const policyPayloadToInsuranceCompany = {
                ip_address: ip_address,
                // proposal_no: quoteDetail.proposal_no,
                proposal_no: proposalNo,
                gross_written_premium: grossWrittenPremium,
                insurance_rate: insurance_rate,
                total_Premium: total_Premium,
                total_insurance_cost: total_insurance_cost,
                total_limit: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.transport_good && quoteDetail.dataValues.transport_good.dataValues.total_limit ? quoteDetail.dataValues.transport_good.dataValues.total_limit : null,
                product_name: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.product_name ? quoteDetail.dataValues.product_name : null,
                company_ruc: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.ruc ? quoteDetail.dataValues.quote_company.dataValues.ruc : null,
                company_name: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.company_name ? quoteDetail.dataValues.quote_company.dataValues.company_name : null,
                company_email: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.company_email ? quoteDetail.dataValues.quote_company.dataValues.company_email : null,
                company_phone: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.company_phone ? quoteDetail.dataValues.quote_company.dataValues.company_phone : null,
                company_address: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.address ? quoteDetail.dataValues.quote_company.dataValues.address : null,
                company_address_no: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.address_no ? quoteDetail.dataValues.quote_company.dataValues.address_no : null,
                city: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_company && quoteDetail.dataValues.quote_company.dataValues && quoteDetail.dataValues.quote_company.dataValues.city ? quoteDetail.dataValues.quote_company.dataValues.city : null,
                source: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_shipment && quoteDetail.dataValues.quote_shipment.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0] && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.source_detail && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.source_detail.astr_id ? quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.source_detail.astr_id : null,
                destination: quoteDetail && quoteDetail.dataValues && quoteDetail.dataValues.quote_shipment && quoteDetail.dataValues.quote_shipment.dataValues && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0] && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.source_detail && quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.source_detail.astr_id ? quoteDetail.dataValues.quote_shipment.dataValues.shipment_route_details[0].dataValues.destiny_detail.astr_id : null,
                policy_start_date: new Date(policy_start_date).toISOString().split('.')[0],
                policy_end_date: new Date(policy_end_date).toISOString().split('.')[0],
                // tax_emmssion: result.tax_emmssion ? result.tax_emmssion : 0,
                // CSSC: result.tax_ssc ? get2Decimal(result.tax_ssc) : 0,
                // CSCVS: result.tax_scvs ? get2Decimal(result.tax_scvs) : 0,
                // IVA: result.tax_iva ? get2Decimal(result.tax_iva) : 0,
                // tax_emmssion: quoteDetail && quoteDetail.tax_emission ? quoteDetail.tax_emission : 0,
                // CSSC: quoteDetail && quoteDetail.tax_ssc ? get2Decimal(quoteDetail.tax_ssc) : 0,
                // CSCVS: quoteDetail && quoteDetail.tax_scvs ? get2Decimal(quoteDetail.tax_scvs) : 0,
                // IVA: quoteDetail && quoteDetail.tax_iva ? get2Decimal(quoteDetail.tax_iva) : 0,
                CSSC: tax_ssc,
                CSCVS: tax_scvs,
                IVA: tax_iva,
                tax_emmssion: tax_emmssion,
                astr_detalle: astr_detalle,
                heritage_rank_astrId: getHeritageAstrId && getHeritageAstrId.astr_id ? getHeritageAstrId.astr_id : 0,
                heritage_rank_value: heritage_rank_value,
                income_range_astrId: getIncomeRangeAstrId && getIncomeRangeAstrId.astr_id ? getIncomeRangeAstrId.astr_id : 0,
                income_range_value: income_range_value,
                occupation_astrId: getOccupationAstrId && getOccupationAstrId.astr_id ? getOccupationAstrId.astr_id : 0,
                economic_activity_astrId: getEconomicActivityAstrId && getEconomicActivityAstrId.astr_id ? getEconomicActivityAstrId.astr_id : 0,
                agency_id: getAgencyAstrId && getAgencyAstrId.astr_id ? getAgencyAstrId.astr_id : 0
            };
            /* get token */
            const getAccessTokenForOfac = await getAccessTokenForOFAC({ ip_address }, this.Models);
            let addPolicyResult;
            let updateApiLogPayload;
            let response;
            if (quoteDetail.dataValues.insurance_type_id == INSURANCE_TYPE_ID.SINGLE) {
                /* add policy to insurance company for flow 1 */
                addPolicyResult = await addSinglePolicyToInsuranceCompany(policyPayloadToInsuranceCompany, getAccessTokenForOfac, this.Models);
                if (addPolicyResult && addPolicyResult.status && addPolicyResult.status == 200) {
                    // /* creating proposal */
                    // const createProposal = await this.services.createProposal(payload);
                    /* update quote status */
                    await this.services.updateQuote({ status: QUOTE_STATUS.EM_EMISSÃO }, { id: quote_id });
                    /* Update the API logs with the result and success message */
                    updateApiLogPayload = {
                        payload: {
                            request_id: proposalNo,
                            response: null,
                            message: ProposalMessages.PROPOSAL_CREATED_SUCCESS
                        },
                        query: { id: addApiLogResponse.id }
                    };
                    /* socket emission */
                    // emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                    emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: proposalNo });
                    emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
                    /* end */
                    // const getPolicyNumberResult = await getPolicyNumberFromInsuranceCompany({ proposal_no: quoteDetail.proposal_no, ip_address }, getAccessTokenForOfac, this.Models)
                    // if (getPolicyNumberResult && getPolicyNumberResult.status == 200 && getPolicyNumberResult.astr_poliza) {
                    //     await this.services.updateProposal({ policy_id: getPolicyNumberResult.astr_poliza, status: PROPOSAL_STATUS.EMITIDO }, { id: createProposal.id });
                    //     await this.services.updateQuote({ status: QUOTE_STATUS.EMITIDO }, { id: quote_id });
                    //     /* socket emission */
                    //     emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                    //     /* end */
                    // }
                    response = successResponse(ProposalMessages.PROPOSAL_CREATED_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization);
                    /* Execute the following logic after a 90-second delay in the background */
                    setTimeout(async () => {
                        try {
                            const getPolicyNumberResult = await getPolicyNumberFromInsuranceCompany(
                                { proposal_no: proposalNo, ip_address },
                                getAccessTokenForOfac,
                                this.Models
                            );
                            //  console.log("getPolicyNumberResult", getPolicyNumberResult);
                            if (getPolicyNumberResult && getPolicyNumberResult.status == 200 && getPolicyNumberResult.astr_poliza) {
                                await this.services.updateProposal(
                                    { policy_id: getPolicyNumberResult.astr_poliza, status: PROPOSAL_STATUS.EMITIDO },
                                    { id: createProposal.id }
                                );
                                await this.services.updateQuote(
                                    { status: QUOTE_STATUS.EMITIDO },
                                    { id: quote_id }
                                );

                                /* socket emission */
                                // emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                                emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: proposalNo });
                                emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
                                /* end */
                                quoteDetail.proposal_id = createProposal.id;
                                quoteDetail.created_on = createProposal.created_on;
                                quoteDetail.astr_poliza = getPolicyNumberResult.astr_poliza;
                                await this.createProposalReport(quoteDetail);
                            }
                        } catch (error) {
                            console.error("Error during delayed get policy number execution:", error);
                            logger.error('Error during delayed get policy number execution', error, addApiLogResponse?.id || null, this.Models.ApiLogs)
                            // Optionally log the error or handle failure scenarios
                        }
                    }, 90 * 1000);
                } else {
                    /* Update the API logs with the result and success message */
                    updateApiLogPayload = {
                        payload: {
                            request_id: proposalNo,
                            response: null,
                            message: ProposalMessages.PROPOSAL_CREATED_FAILED
                        },
                        query: { id: addApiLogResponse.id }
                    };
                    response = errorResponse(ProposalMessages.PROPOSAL_CREATED_FAILED, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization);
                }
            }
            if (quoteDetail.dataValues.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL) {
                /* add policy to insurance company for flow 2 */
                addPolicyResult = await addAnnualPolicyToInsuranceCompany(policyPayloadToInsuranceCompany, getAccessTokenForOfac, this.Models);
                if (addPolicyResult && addPolicyResult.status && addPolicyResult.status == 200) {
                    /* creating proposal */
                    //const createProposal = await this.services.createProposal(payload);
                    /* update quote status */
                    await this.services.updateQuote({ status: QUOTE_STATUS.EM_EMISSÃO }, { id: quote_id });
                    /* Update the API logs with the result and success message */
                    updateApiLogPayload = {
                        payload: {
                            request_id: proposalNo,
                            response: null,
                            message: ProposalMessages.PROPOSAL_CREATED_SUCCESS
                        },
                        query: { id: addApiLogResponse.id }
                    };
                    /* socket emission */
                    // emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                    emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: proposalNo });
                    emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
                    /* end */
                    // const getPolicyNumberResult = await getPolicyNumberFromInsuranceCompany({ proposal_no: quoteDetail.proposal_no, ip_address }, getAccessTokenForOfac, this.Models)
                    // if (getPolicyNumberResult && getPolicyNumberResult.status == 200 && getPolicyNumberResult.astr_poliza) {
                    //     await this.services.updateProposal({ policy_id: getPolicyNumberResult.astr_poliza, status: PROPOSAL_STATUS.EMITIDO }, { id: createProposal.id });
                    //     await this.services.updateQuote({ status: QUOTE_STATUS.EMITIDO }, { id: quote_id });
                    //     /* socket emission */
                    //     emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                    //     /* end */
                    // }
                    response = successResponse(ProposalMessages.PROPOSAL_CREATED_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization);
                    /* Execute the following logic after a 90-second delay in the background */
                    setTimeout(async () => {
                        try {
                            const getPolicyNumberResult = await getPolicyNumberFromInsuranceCompany(
                                { proposal_no: proposalNo, ip_address },
                                getAccessTokenForOfac,
                                this.Models
                            );
                            if (getPolicyNumberResult && getPolicyNumberResult.status == 200 && getPolicyNumberResult.astr_poliza) {
                                await this.services.updateProposal(
                                    {
                                        policy_id: getPolicyNumberResult.astr_poliza,
                                        status: PROPOSAL_STATUS.EMITIDO
                                    },
                                    { id: createProposal.id }
                                );
                                await this.services.updateQuote(
                                    { status: QUOTE_STATUS.EMITIDO },
                                    { id: quote_id }
                                );
                                /* socket emission */
                                // emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                                emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: proposalNo });
                                emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
                                /* end */
                                quoteDetail.proposal_id = createProposal.id;
                                quoteDetail.created_on = createProposal.created_on;
                                quoteDetail.astr_poliza = getPolicyNumberResult.astr_poliza;
                                await this.createProposalReport(quoteDetail);

                            }
                        } catch (error) {
                            console.error("Error during delayed get policy number execution:", error);
                            logger.error('Error during delayed get policy number execution', error, addApiLogResponse?.id || null, this.Models.ApiLogs)
                            // Optionally log the error or handle failure scenarios
                        }
                    }, 90 * 1000);
                } else {
                    /* Update the API logs with the result and success message */
                    updateApiLogPayload = {
                        payload: {
                            request_id: proposalNo,
                            response: null,
                            message: ProposalMessages.PROPOSAL_CREATED_FAILED
                        },
                        query: { id: addApiLogResponse.id }
                    };
                    response = errorResponse(ProposalMessages.PROPOSAL_CREATED_FAILED, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization);
                }
            }
            await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
            return res.send(response);
        } catch (error) {
            logger.error('create Proposals Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs)
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */


    /* create proposal report */
    async createProposalReport(quote) {
        try {
            // let total_premium = quote.premium_calculation_type == PREMIUM_CALCULATION_TYPE.AJUSTAVEL ? quote.transport_good.total_limit : 0;
            let currency = quote.transport_good.currency;
            let total_gross_written_premium;
            let commission_percentage = 0;
            let payment_type = TRANSACTION_PAYMENT_TYPE.CHARGE;
            // if (quote.insurance_type_id == INSURANCE_TYPE_ID.SINGLE) {
            //     payment_type = TRANSACTION_PAYMENT_TYPE.AVULSA
            // } else {
            //     payment_type = quote.premium_calculation_type == PREMIUM_CALCULATION_TYPE.AJUSTAVEL ?
            //     TRANSACTION_PAYMENT_TYPE.ADJUSTABLE : TRANSACTION_PAYMENT_TYPE.AVERBAVEL;
            // }
            if (quote.is_calculation_personalized == DEFAULT_ENUM.TRUE) {
                commission_percentage = quote.dataValues.quote_calculation.dataValues.personalized_commission_percentage;
                total_gross_written_premium = quote.dataValues.quote_calculation.dataValues.personalized_total_premium;
            } else {
                commission_percentage = quote.dataValues.quote_calculation.dataValues.standard_commission_percentage;
                total_gross_written_premium = quote.dataValues.quote_calculation.dataValues.standard_total_premium;
            }
            // commission_percentage = quote.is_calculation_personalized == DEFAULT_ENUM.TRUE ?
            //     quote.dataValues.quote_calculation.dataValues.personalized_commission_percentage :
            //     quote.dataValues.quote_calculation.dataValues.standard_commission_percentage;
            /* report payload */
            const reportPayload = {
                user_id: quote.user_id,
                quote_id: quote.id,
                company_id: quote.company_id,
                proposal_id: quote.proposal_id,
                premium_calculation_type: quote.premium_calculation_type,
                currency,
                created_by_id: quote.created_by_id,
                created_on: quote.created_on,
                doc_type: TRANSACTION_DOC_TYPE.POLICY,
                payment_type,
                total_gross_written_premium,
                estimated_shipment: quote.transport_good.estimated_for_next_12_months,
                limit: quote.transport_good.total_limit,
                broker_commission: commission_percentage,
                astr_poliza: quote.astr_poliza
            };
            /*create proposal transaction */
            await this.services.createTransaction(reportPayload);
            return;
        } catch (error) {
            console.log('create Proposal Report Error', error);
            logger.error('create Proposal Report Error', error);
        }
    }
    /* billing List */
    async billingList(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const QuoteMessages = req.CommonMessages.quote;
        const ProposalMessages = req.CommonMessages.proposal;
        let addApiLogResponse;
        try {
            const { user } = req;
            const data = []
            const recordsTotal = 0;
            const recordsFiltered = 0;
            return res
                .send(
                    successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, data, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization)
                );
        } catch (error) {
            logger.error('billing List Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs)
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* get unique proposal number */
    async getUniqueProposalNo(sequence) {
        try {
            // Get current date and time
            const now = new Date();
            // Format components of the proposal number
            const year = now.getFullYear(); // 4 digits
            const month = String(now.getMonth() + 1).padStart(2, '0'); // 2 digits
            const day = String(now.getDate()).padStart(2, '0'); // 2 digits
            const hour = String(now.getHours()).padStart(2, '0'); // 2 digits
            const minutes = String(now.getMinutes()).padStart(2, '0'); // 2 digits
            const seconds = String(now.getSeconds()).padStart(2, '0'); // 2 digits
            const branchCode = '06'; // Static 2 digits
            const originTool = 'ABZ'; // Static 3 digits
            /* Construct the proposal number */
            const proposalNumber = `${year}${month}${day}${hour}${minutes}${seconds}${sequence}${branchCode}${originTool}`;
            return proposalNumber;
        } catch (error) {
            console.error('Error in getUniqueProposalNo:', error);
            throw error; // Rethrow the error for higher-level handling
        }
    }
    /* end */
}