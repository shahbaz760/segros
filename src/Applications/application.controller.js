import puppeteer from 'puppeteer';
import { APPLICATION_STATUS, CHILD_LOG_TYPE, DEFAULT_ENUM, PARENT_LOG_TYPE, RESPONSE_CODES, INSURANCE_TYPE_ID, PRODUCT_ID } from "../../config/constants";
import { errorResponse, successResponse, successResponseWithPagination } from "../../config/responseHandlers";
import { logo } from "../../public/images/logos";
import authServices from "../Auth/auth.services";
//import { getUUID, saveApilogs, updateApilogs } from "../helpers/commonFunction";
import logger from '../helpers/logger';
import Services from "./application.services";
import jsRender from 'jsrender';
import { Op } from 'sequelize';
import quoteController from "../Quote/quote.controller";
import { deleteFileFromServer, getFileFromServer, getMonthName, getUUID, saveApilogs, updateApilogs, uploadFileToServer, convertToBrazilCurrency, get6Decimal, get2Decimal, insuranceCompanyPayload, getAccessTokenForOFAC } from "../helpers/commonFunction";
import { addApplicationToInsuranceCompany, getAccessToken } from "../services/insuranceCompany/application";
import { getAnnualProposalPayload } from "../services/insuranceCompany/proposal";

const PDFDocument = require('pdf-lib').PDFDocument;

export default class Application {
    async init(db) {
        /* initializing classes to be used */
        this.services = new Services();
        this.authServices = new authServices();
        this.Models = db.models;
        this.db = db;
        await this.services.init(db);
        await this.authServices.init(db);
        this.quoteInstance = new quoteController();
    }

    /* get unique proposal number */
    async getUniqueApplicationNo(sequence, type) {
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

    /* create application */
    async createApplication(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const ApplicationMessages = req.CommonMessages.application;
        let addApiLogResponse;
        try {
            const { user, ip_address, body } = req;
            const query = {
                id: body.proposal_id
            }
            const proposalDetails = await this.services.getProposalDetailForAddApplication(query);
            // return
            /* generate uuid for api logs */
            const apilog_uuid = await getUUID();
            /* create api log payload  */
            const addApilogPayload = {
                request_id: proposalDetails.proposal_no,
                type: PARENT_LOG_TYPE.APPLICATION,
                log_type: CHILD_LOG_TYPE.CREATE_APPLICATION,
                ip_address: ip_address,
                uuid: apilog_uuid,
                request_payload: JSON.stringify(body),
            };
            addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
            /* generate uuid for user */
            const uuid = await getUUID();
            // body.uuid = uuid;
            let endorsement_id;
            let totalInsuranceRate;
            if (proposalDetails.is_calculation_personalized == 0) {
                totalInsuranceRate = proposalDetails.standard_insurance_rate
            } else {
                totalInsuranceRate = proposalDetails.personalized_insurance_rate
            }
            /* calculate net insurance cost with commission/ gross written premium  */
            const grossWrittenPremium = get6Decimal(body.shipment_limit * (totalInsuranceRate / 100));
            /* Construct sequence based on quoteId */
            const quoteId = proposalDetails && proposalDetails.quote_id ? proposalDetails.quote_id : '';
            const taxCalculation = await this.quoteInstance.calculateTaxes(grossWrittenPremium);
            const applicationPayload = {
                uuid: uuid,
                proposal_id: body.proposal_id,
                endorsement_id: endorsement_id,
                start_date: body.start_date,
                end_date: body.end_date,
                source: body.source,
                destiny: body.destiny,
                shipping_document_number: body.shipping_document_number,
                shipment_limit: body.shipment_limit,
                good_id: JSON.stringify(body.good_id),
                gross_written_premium: grossWrittenPremium,
                total_premium: taxCalculation.total_amount,
                tax_scvs: taxCalculation.tax_scvs,
                tax_ssc: taxCalculation.tax_ssc,
                tax_emission: taxCalculation.tax_emmssion,
                tax_iva: taxCalculation.tax_iva,
                application_no: applicationNo
            }
            /* create application */
            const result = await this.services.createApplication(applicationPayload);
            // const sequence = String(result.id).padStart(13, '0');
            const sequence = '1' + String(result.id).padStart(12, '0');
            // console.log('sequence121212121', sequence);
            // Use sequence in your application logic
            const applicationNo = await this.getUniqueApplicationNo(sequence);
            /* creating proposal */
            let application_id = result.id;
            await this.services.updateApplication({ application_no: applicationNo }, { id: result.id });
            if (body.application_documents && body.application_documents.length > 0) {
                body.application_documents.map(ele => {
                    return ele.application_id = application_id;
                });
                await this.services.bulkCreateApplicationDocuments(body.application_documents);
            };
            let goodNames = {};
            // Fetch details for all goods in parallel
            const processedDetails = await Promise.all(
                body.good_id.map(async (ele) => {
                    const goodsDetail = await this.services.getGoodsForModeration({ id: JSON.parse(ele) });
                    return goodsDetail.map(obj => obj.name); // Extract names
                })
            );
            goodNames = processedDetails.flat();
            //const astr_detalle = `${goodNames} / aplicacion / ${result.id}`;
            const boardingDocumentNumber = proposalDetails['quote.quote_shipment.single_shipment_detail.boarding_document_number'] || ''; // Default to empty string
            const boardingDocumentType = proposalDetails['quote.quote_shipment.single_shipment_detail.boarding_document_type'] || '';
            const astr_detalle = `${goodNames} / ${boardingDocumentNumber} /  ${boardingDocumentType} / ${quoteId}`;
            // console.log('astr_detalle121212121', astr_detalle);
            //  return
            const complete_address = `${proposalDetails.company_state} / ${proposalDetails.company_address_city} / ${proposalDetails.company_neighborhood} / ${proposalDetails.quote_company_address}`;
            //return
            let heritage_rank_value;
            let income_range_value;
            if (proposalDetails && proposalDetails.heritage_rank_astrId == 9) {
                heritage_rank_value = 10000;
            } else if (proposalDetails && proposalDetails.heritage_rank_astrId == 10) {
                heritage_rank_value = 50000;
            } else if (proposalDetails && proposalDetails.heritage_rank_astrId == 11) {
                heritage_rank_value = 200000
            } else {
                heritage_rank_value = proposalDetails && proposalDetails.average_equity_value ? proposalDetails.average_equity_value : 0;
            }
            if (proposalDetails && proposalDetails.income_range_astrId == 1) {
                income_range_value = 500;
            } else if (proposalDetails && proposalDetails.income_range_astrId == 2) {
                income_range_value = 1000
            } else if (proposalDetails && proposalDetails.income_range_astrId == 3) {
                income_range_value = 2000;
            } else {
                income_range_value = proposalDetails && proposalDetails.average_income_value ? proposalDetails.average_income_value : 0;
            }
            const policyPayload = {
                ip_address: ip_address,
                proposal_no: proposalDetails.proposal_no,
                application_no: applicationNo,
                start_date: new Date(body.start_date).toISOString().split('.')[0],
                end_date: new Date(body.end_date).toISOString().split('.')[0],
                shipment_limit: body.shipment_limit,
                gross_written_premium: grossWrittenPremium,
                total_premium: taxCalculation.total_amount,
                insurance_rate: totalInsuranceRate,
                tax_scvs: taxCalculation.tax_scvs,
                tax_ssc: taxCalculation.tax_ssc,
                tax_emission: taxCalculation.tax_emmssion,
                tax_iva: taxCalculation.tax_iva,
                product_name: proposalDetails.product_name,
                policy_id: proposalDetails && proposalDetails.policy_id ? proposalDetails.policy_id : null,
                company_name: proposalDetails.quote_company_name,
                company_ruc: proposalDetails.quote_company_ruc,
                company_email: proposalDetails.quote_company_email,
                company_address: proposalDetails.quote_company_address,
                company_address_no: proposalDetails.company_address_number,
                city: proposalDetails.company_address_city,
                company_phone: proposalDetails.company_address_phone,
                source: proposalDetails['quote.quote_shipment.shipment_route_details.source_detail.astr_id'],
                destiny: proposalDetails['quote.quote_shipment.shipment_route_details.destiny_detail.astr_id'],
                astr_detalle: astr_detalle,
                complete_address: complete_address,
                heritage_rank_astrId: proposalDetails && proposalDetails.heritage_rank_astrId ? proposalDetails.heritage_rank_astrId : 0,
                heritage_rank_value: heritage_rank_value,
                income_range_astrId: proposalDetails && proposalDetails.income_range_astrId ? proposalDetails.income_range_astrId : 0,
                income_range_value: income_range_value,
                economic_activity_astrId: proposalDetails && proposalDetails.economic_activity_astrId ? proposalDetails.economic_activity_astrId : 0,
                occupation_astrId: proposalDetails && proposalDetails.occupation_astrId ? proposalDetails.occupation_astrId : 0,
                agency_astrId: proposalDetails && proposalDetails.agency_astrId ? proposalDetails.agency_astrId : 0
                //average_income_value: proposalDetails && proposalDetails.average_income_value ? proposalDetails.average_income_value : 0,
                //average_equity_value: proposalDetails && proposalDetails.average_equity_value ? proposalDetails.average_equity_value : 0
            }
            // return
            /* get token */
            const getAccessTokenForOfac = await getAccessTokenForOFAC({ ip_address }, this.Models);
            let addPolicyResult;
            let updateApiLogPayload;
            let response;

            /* add policy to insurance company for flow 2 */
            addPolicyResult = await addApplicationToInsuranceCompany(policyPayload, getAccessTokenForOfac, this.Models);
            if (addPolicyResult && addPolicyResult.status && addPolicyResult.status == 200) {
                // /* creating proposal */
                // let application_id = result.id;
                // await this.services.updateApplication({ application_no: applicationNo }, { id: result.id });
                // if (body.application_documents && body.application_documents.length > 0) {
                //     body.application_documents.map(ele => {
                //         return ele.application_id = application_id;
                //     });
                //     await this.services.bulkCreateApplicationDocuments(body.application_documents);
                // };
                /* Update the API logs with the result and success message */
                updateApiLogPayload = {
                    payload: {
                        log_type: `${CHILD_LOG_TYPE.CREATE_APPLICATION}-${applicationNo}`,
                        response: null,
                        message: ApplicationMessages.APPLICATION_CREATED_SUCCESS
                    },
                    query: { id: addApiLogResponse.id }
                };
                /* socket emission */
                // emitSocketEvent(SOCKET_EVENTS.PROPOSAL_CREATED_SUCCESS, { proposal_id: quoteDetail.proposal_no });
                // emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
                /* end */

                response = successResponse(ApplicationMessages.APPLICATION_CREATED_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization);
            } else {
                /* Update the API logs with the result and success message */
                updateApiLogPayload = {
                    payload: {
                        response: null,
                        message: ApplicationMessages.APPLICATION_CREATED_FAILED
                    },
                    query: { id: addApiLogResponse.id }
                };
                response = errorResponse(ApplicationMessages.APPLICATION_CREATED_FAILED, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization);
            }
            await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
            return res.send(response);
        } catch (error) {
            logger.error('create Application Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* get application list */
    async getApplicationList(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body } = req;
            let query = {
                proposal_id: body.proposal_id,
                status: body.status ? body.status : [
                    APPLICATION_STATUS.CANCELADO,
                    APPLICATION_STATUS.EMITIDO
                ],
            };
            /* get the search value in the body */
            if (body && body.search && body.search.value != "") {
                query[Op.or] = [
                    { id: { [Op.like]: "%" + body.search.value + "%" } },
                    { product_name: { [Op.like]: body.search.value } },
                    { application_no: { [Op.like]: body.search.value } },
                    { source: { [Op.like]: '%' + body.search.value + '%' } },
                    { destination: { [Op.like]: '%' + body.search.value + '%' } },
                    { shipping_document_number: { [Op.like]: '%' + body.search.value + '%' } }
                ]
            };
            const applicationList = await this.services.getApplicationList(query, body);
            body.start = DEFAULT_ENUM.FALSE;
            body.length = DEFAULT_ENUM.FALSE;
            /* get application list based on the query condition for pagination and record filtering */
            const resultWithoutPagination = await this.services.getApplicationList(query, body);
            const recordsTotal = resultWithoutPagination.length;
            const recordsFiltered = resultWithoutPagination.length;
            return res.send(successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, applicationList, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization));
        } catch (error) {
            logger.error('get Application List Error', error);
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* get application by uuid */
    async getApplicationByUuid(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const ApplicationMessages = req.CommonMessages.application;
        try {
            const { uuid } = req.params;
            let good_Names = {};
            const applicationDetails = await this.services.getApplicationDetailsForCertificate({ uuid: uuid });
            if (!applicationDetails) {
                return res.send(errorResponse(ApplicationMessages.APPLICATION_NOT_FOUND, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
            };
            // /* return good names corresponding to the quote transport good details  */
            // if (applicationDetails && applicationDetails.good_id) {
            //     for (let ele of applicationDetails.good_id) {

            //         const goodsDetail = await this.services.getGoodsForModeration({ id: JSON.parse(ele) });
            //         goodsDetail.map(obj => {
            //             goodNames.push(obj.name);
            //         });
            //         ele.dataValues.good_name = goodNames;
            //     };
            // };
            const applicationgoodIds = applicationDetails && applicationDetails.good_id ? JSON.parse(applicationDetails.good_id) : [];
            const selectedGoodIdsName = [];
            if (applicationgoodIds) {
                const processedDetails = applicationgoodIds.map(async (ele) => {
                    const goodsDetail = await this.services.getGoodsForModeration({ id: ele });
                    // console.log('goodsDetail1212', goodsDetail);
                    const goodNames = goodsDetail.map(obj => obj.name);
                    //console.log('goodNames1221', goodNames);
                    // ele.good_Names = goodNames;
                    selectedGoodIdsName.push(goodNames);
                }
                );
                await Promise.all(processedDetails);
            }
            /* Flatten the array to get the list of IDs */
            const flatGoodNames = selectedGoodIdsName.flat() || [];
            //   console.log('flatGoodNames12121', flatGoodNames);
            const total_tax = get2Decimal(applicationDetails.tax_scvs + applicationDetails.tax_ssc + applicationDetails.tax_emission + applicationDetails.tax_iva);
            const data = {
                applicationDetails,
                total_tax,
                flatGoodNames
            }
            return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, data, RESPONSE_CODES.GET, req.headers.tokenization));
        } catch (error) {
            logger.error('get Application By Uuid Error', error);
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* get dropdown data */
    async getDropdownData(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            let goodNames = {};
            // const countriesList = await this.services.getCountriesList({ is_active: DEFAULT_ENUM.TRUE });
            const getSourceDestination = await this.services.getQuoteSourceDestination({ id: req.body.quote_id });
            let countryDetails = [];
            if (getSourceDestination?.quote_shipment?.shipment_route_details?.length > 0) {
                const sourceDestinationDetails = getSourceDestination.quote_shipment.shipment_route_details.flatMap(route => [
                    route.source_detail ? { id: route.source_detail.id, name: route.source_detail.name } : null,
                    route.destiny_detail ? { id: route.destiny_detail.id, name: route.destiny_detail.name } : null
                ])
                // Remove duplicates using a Map
                const uniqueCountries = Array.from(new Map(sourceDestinationDetails.map(country => [country.id, country])).values());
                countryDetails = uniqueCountries;
            }
            const goodsList = await this.services.getTransportGood({ quote_id: req.body.quote_id });
            if (goodsList && goodsList.dataValues && goodsList.dataValues.transport_good_details) {
                // Fetch details for all goods in parallel
                const processedDetails = await Promise.all(
                    goodsList.dataValues.transport_good_details.map(async (ele) => {
                        const goodsDetail = await this.services.getGoodsForModeration({ id: JSON.parse(ele.good_id) });
                        return goodsDetail.map(obj => ({ good_id: obj.id, name: obj.name })); // Extract names
                    })
                );
                goodNames = processedDetails.flat();
            }
            const data = {
                countries_list: countryDetails,  // Include structured country details
                goods_list: goodNames,         // Include extracted good names
                total_limit: getSourceDestination && getSourceDestination.dataValues.total_limit
            };
            return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, data, RESPONSE_CODES.GET, req.headers.tokenization));
        } catch (error) {
            logger.error('get Drop down Error', error);
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* cancel application status */
    async cancelApplicationStatus(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const ApplicationMessages = req.CommonMessages.application;
        try {
            const { uuid } = req.params;
            const { body } = req;
            const applicationDetails = await this.services.getApplicationDetails({ uuid: uuid });
            if (!applicationDetails) {
                return res.send(errorResponse(
                    ApplicationMessages.APPLICATION_NOT_FOUND,
                    null,
                    RESPONSE_CODES.SERVER_ERROR,
                    req.headers.tokenization
                ));
            };
            await this.services.updateApplicationStatus({ status: APPLICATION_STATUS.CANCELADO, cancel_reason: body.cancel_reason }, { id: applicationDetails.id });
            return res.send(successResponse(ApplicationMessages.APPLICATION_STATUS_UPDATED_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization));
        } catch (error) {
            logger.error('cancel Application Status Error', error);
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* download application certificate */
    async getApplicationCertificate(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const ApplicationMessages = req.CommonMessages.application;
        try {
            const { uuid } = req.params;
            const applicationDetail = await this.services.getApplicationDetailsForCertificate({ uuid: uuid });
            if (!applicationDetail) {
                return res.send(errorResponse(
                    ApplicationMessages.APPLICATION_NOT_FOUND,
                    null,
                    RESPONSE_CODES.SERVER_ERROR,
                    req.headers.tokenization
                ));
            };
            if (applicationDetail.certificate_pdf) {
                try {
                    await getFileFromServer(applicationDetail.certificate_pdf);
                    await deleteFileFromServer(applicationDetail.certificate_pdf);
                } catch (error) {
                    console.log('error :>> ', error);
                }
            };
            let currency = applicationDetail.dataValues.proposal.dataValues.currency == DEFAULT_ENUM.TRUE ? 'BRL' : 'USD';
            let source;
            let destination;
            if (applicationDetail.dataValues.proposal.dataValues.product_id == PRODUCT_ID.IMP || applicationDetail.dataValues.proposal.dataValues.product_id == PRODUCT_ID.EXP) {
                source = applicationDetail && applicationDetail.dataValues && applicationDetail.dataValues.source ? applicationDetail.dataValues.source : null;
                destination = applicationDetail && applicationDetail.dataValues && applicationDetail.dataValues.destination ? applicationDetail.dataValues.destination : null;
            }
            const applicationgoodIds = applicationDetail && applicationDetail.good_id ? JSON.parse(applicationDetail.good_id) : [];
            const selectedGoodIdsName = [];
            if (applicationgoodIds) {
                const processedDetails = applicationgoodIds.map(async (ele) => {
                    const goodsDetail = await this.services.getGoodsForModeration({ id: ele });
                    // console.log('goodsDetail1212', goodsDetail);
                    const goodNames = goodsDetail.map(obj => obj.name);
                    //console.log('goodNames1221', goodNames);
                    // ele.good_Names = goodNames;
                    selectedGoodIdsName.push(goodNames);
                }
                );
                await Promise.all(processedDetails);
            }
            /* Flatten the array to get the list of IDs */
            const flatGoodNames = selectedGoodIdsName.flat() || [];
            const payload = {
                company_name: applicationDetail.proposal.dataValues.quote_company_name,
                policy_id: applicationDetail.proposal.dataValues.policy_id,
                source: source,
                destination: destination,
                shipment_limit: convertToBrazilCurrency(applicationDetail.shipment_limit, currency),
                gross_written_premium: convertToBrazilCurrency(get2Decimal(applicationDetail.gross_written_premium), currency),
                total_premium: convertToBrazilCurrency(get2Decimal(applicationDetail.total_premium), currency),
                good_names: flatGoodNames,
                total_tax: convertToBrazilCurrency(get2Decimal(applicationDetail.tax_scvs + applicationDetail.tax_ssc + applicationDetail.tax_emission + applicationDetail.tax_iva), currency)
            };
            //console.log('payload1221', payload);
            // return
            let template = jsRender.templates('./public/pdfs/application-pdf.html')
            let html = template.render(payload);
            const opts = {
                headless: true,
                args: ['--no-sandbox', '--disabled-setupid-sandbox'],
            };
            const browser = await puppeteer.launch(opts);
            const page = await browser.newPage();
            await page.setContent(html);
            const applicationCertificate = await page.pdf({
                // path: 'application.pdf',
                format: 'A4',
                printBackground: true,
                displayHeaderFooter: true,
                headerTemplate: `
              <div style="-webkit-print-color-adjust: exact;margin-top:-20px;box-sizing:border-box;background-color:#001689;height: 120px;width:1124cm; padding-left: 24px;display:flex;align-items:center;">
              <img src= ${logo} alt="" style="height:40px">
              </div>
              `,
                footerTemplate: ``,
                margin: {
                    top: '37mm',
                    bottom: '0cm',
                },
            });
            await browser.close();
            // return
            let buf = applicationCertificate;
            let pdfsToMerge = null;
            pdfsToMerge = [applicationCertificate];
            if (pdfsToMerge) {
                const mergedPdf = await PDFDocument.create();
                for (const pdfBytes of pdfsToMerge) {
                    const pdf = await PDFDocument.load(pdfBytes);
                    const copiedPages = await mergedPdf.copyPages(
                        pdf,
                        pdf.getPageIndices()
                    );
                    copiedPages.forEach((page) => {
                        mergedPdf.addPage(page);
                    });
                }
                buf = await mergedPdf.save();
                buf = Buffer.from(buf, 'base64');
            };
            let filePayload = {
                Key: applicationDetail && applicationDetail.proposal && applicationDetail.proposal.dataValues && applicationDetail.proposal.dataValues.quote_company_name ? `${applicationDetail.proposal.dataValues.quote_company_name}_${applicationDetail.id}_${Date.now()}_application.pdf` : `${applicationDetail.id}_${Date.now()}_application.pdf`,
                Body: buf,
                folderName: `proposals/${applicationDetail.proposal.policy_id}/applications`,
            };
            let fileUploadResult = await uploadFileToServer(filePayload);
            const applicationPayload = {
                certificate_pdf: fileUploadResult && fileUploadResult.Location ? fileUploadResult.Location : null,
            }
            await this.services.updateApplication(applicationPayload, { id: applicationDetail.id });
            const data = fileUploadResult && fileUploadResult.Location ? fileUploadResult.Location : null;
            return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, data, RESPONSE_CODES.POST, req.headers.tokenization))
        } catch (error) {
            logger.error('get Application Certificate Error', error);
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */
}