const { v4: uuidv4 } = require('uuid');
import { BlobServiceClient, logger } from "@azure/storage-blob";
import jsRender from 'jsrender';
import moment from 'moment';
import pdfToBase64 from 'pdf-to-base64';
import puppeteer from 'puppeteer';
import request from 'request';
import axios from 'axios';
import { API_LOG_MESSAGES, PARENT_LOG_TYPE, CHILD_LOG_TYPE, DEFAULT_ENUM, INSURANCE_TYPE_ID, PREMIUM_CALCULATION_TYPE, PRODUCT_ID, QUOTE_STATUS } from '../../../config/constants';
import { convertToBrazilCurrency, get2Decimal, getUUID, saveApilogs, updateApilogs, uploadFileToServer } from "../../helpers/commonFunction";

const PDFDocument = require('pdf-lib').PDFDocument;
const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER_NAME
);

// import { getDB } from '../../src/helpers/db';
import DB from '../../helpers/db';
// const dbInstance = new DB();

const db = new DB();

/*  get the approved proposal pdf */
export const downloadPolicyPdf = async (isQuoteExist) => {
    try {
        let currency = isQuoteExist &&
            isQuoteExist.transport_good &&
            isQuoteExist.transport_good.currency &&
            isQuoteExist.transport_good.currency == DEFAULT_ENUM.TRUE ?
            'BRL' : 'USD';
        if (isQuoteExist.is_calculation_personalized == DEFAULT_ENUM.TRUE) {
            /* personalized calculation */
            isQuoteExist.deductible_name = isQuoteExist &&
                isQuoteExist.quote_calculation &&
                isQuoteExist.quote_calculation.personalized_deductible &&
                isQuoteExist.quote_calculation.personalized_deductible.name ?
                isQuoteExist.quote_calculation.personalized_deductible.name :
                null;
            isQuoteExist.insuranceRate = isQuoteExist &&
                isQuoteExist.quote_calculation &&
                isQuoteExist.quote_calculation.personalized_insurance_rate ?
                isQuoteExist.quote_calculation.personalized_insurance_rate :
                null;
            isQuoteExist.nicWithCommission = isQuoteExist &&
                isQuoteExist.quote_calculation &&
                isQuoteExist.quote_calculation.personalized_gross_written_premium ?
                isQuoteExist.quote_calculation.personalized_gross_written_premium :
                null;
            isQuoteExist.totalInsuranceCost = isQuoteExist
                && isQuoteExist.quote_calculation &&
                isQuoteExist.quote_calculation.personalized_total_insurance_cost ?
                isQuoteExist.quote_calculation.personalized_total_insurance_cost :
                null;
        } else {
            /* standard calculation */
            isQuoteExist.deductible_name = isQuoteExist &&
                isQuoteExist.quote_calculation &&
                isQuoteExist.quote_calculation.standard_deductible &&
                isQuoteExist.quote_calculation.standard_deductible.name ?
                isQuoteExist.quote_calculation.standard_deductible.name :
                null;
            isQuoteExist.insuranceRate = isQuoteExist &&
                isQuoteExist.quote_calculation &&
                isQuoteExist.quote_calculation.standard_insurance_rate ?
                isQuoteExist.quote_calculation.standard_insurance_rate :
                null;
            isQuoteExist.nicWithCommission = isQuoteExist &&
                isQuoteExist.quote_calculation &&
                isQuoteExist.quote_calculation.standard_gross_written_premium ?
                isQuoteExist.quote_calculation.standard_gross_written_premium :
                null;
            isQuoteExist.totalInsuranceCost = isQuoteExist &&
                isQuoteExist.quote_calculation &&
                isQuoteExist.quote_calculation.standard_total_insurance_cost ?
                isQuoteExist.quote_calculation.standard_total_insurance_cost :
                null;
        }
        let basic_coverages = isQuoteExist.quote_basic_coverages;
        let additional_coverages = isQuoteExist.quote_additional_coverages;
        let total_coverage =
            basic_coverages.length +
            additional_coverages.length;
        let clause_amount = get2Decimal(
            isQuoteExist.totalInsuranceCost / total_coverage
        );
        let clause_total_amount =
            isQuoteExist.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL &&
                isQuoteExist.premium_calculation_type == PREMIUM_CALCULATION_TYPE.AVERBAVEL
                ? '-'
                : await convertToBrazilCurrency(clause_amount, currency);
        let revert_clause_amount = '-';
        if (clause_total_amount != '-') {
            revert_clause_amount = clause_amount * total_coverage;
            revert_clause_amount = await convertToBrazilCurrency(
                get2Decimal(
                    clause_amount +
                    isQuoteExist.totalInsuranceCost -
                    revert_clause_amount
                ),
                currency
            );
        }
        const payload = {
            revert_clause_amount: revert_clause_amount,
            proposal_created_at: moment(isQuoteExist &&
                isQuoteExist.proposal_detail &&
                isQuoteExist.proposal_detail.createdAt).format('DD/MM/YYYY'),
            policy_start_date: isQuoteExist &&
                isQuoteExist.proposal_detail &&
                isQuoteExist.proposal_detail.policy_start_date ?
                isQuoteExist.proposal_detail.policy_start_date :
                null,
            policy_end_date: isQuoteExist &&
                isQuoteExist.proposal_detail &&
                isQuoteExist.proposal_detail.policy_end_date ?
                isQuoteExist.proposal_detail.policy_end_date :
                null,
            ramo: isQuoteExist &&
                isQuoteExist.product &&
                isQuoteExist.product.ramo ?
                isQuoteExist.product.ramo :
                54,
            susep: isQuoteExist &&
                isQuoteExist.product &&
                isQuoteExist.product.susep_code ?
                isQuoteExist.product.susep_code :
                0,
            /* need to disscuss */
            proposal_installments: isQuoteExist &&
                isQuoteExist.proposal_detail ?
                isQuoteExist.proposal_detail :
                0,
            taxa: isQuoteExist.product_id == PRODUCT_ID.IMP || isQuoteExist.product_id == PRODUCT_ID.EXP
                ? 0
                : valorIof,
            clause_total_amount: clause_total_amount,
            policy_no: isQuoteExist &&
                isQuoteExist.proposal_detail &&
                isQuoteExist.proposal_detail.policy_id ?
                isQuoteExist.proposal_detail.policy_id :
                null,
            proposal_no: isQuoteExist &&
                isQuoteExist.proposal_detail &&
                isQuoteExist.proposal_detail.proposal_no ?
                isQuoteExist.proposal_detail.proposal_no :
                null,
            endosso_no: '-',
            minimum_award: isQuoteExist &&
                isQuoteExist.insurance_type_id &&
                isQuoteExist.insurance_type_id == INSURANCE_TYPE_ID.SINGLE ?
                '-' :
                isQuoteExist.minimum_prize,
            is_currency_real: isQuoteExist &&
                isQuoteExist.transport_good.currency ?
                isQuoteExist.transport_good.currency :
                null,
            broker_company_name: isQuoteExist &&
                isQuoteExist.user &&
                isQuoteExist.user.company &&
                isQuoteExist.user.company.company_name ?
                isQuoteExist.user.company.company_name :
                '-',
            broker_company_reg_no: isQuoteExist &&
                isQuoteExist.user &&
                isQuoteExist.user.company &&
                isQuoteExist.user.company.company_reg_no ?
                isQuoteExist.user.company.company_reg_no :
                '-',
            customer_name: isQuoteExist &&
                isQuoteExist.quote_company &&
                isQuoteExist.quote_company.company_name ?
                isQuoteExist.quote_company.company_name :
                '-',
            customer_ruc: isQuoteExist &&
                isQuoteExist.quote_company &&
                isQuoteExist.quote_company.ruc ?
                isQuoteExist.quote_company.ruc :
                '-',
            customer_address: isQuoteExist &&
                isQuoteExist.quote_company &&
                isQuoteExist.quote_company.company_address &&
                isQuoteExist.quote_company.company_address.address ?
                isQuoteExist.quote_company.company_address.address :
                '-',
            customer_address_info: isQuoteExist &&
                isQuoteExist.quote_company &&
                isQuoteExist.quote_company.company_address &&
                isQuoteExist.quote_company.company_address.complement ?
                isQuoteExist.quote_company.company_address.complement :
                '-',
            customer_district: isQuoteExist &&
                isQuoteExist.quote_company &&
                isQuoteExist.quote_company.company_address &&
                isQuoteExist.quote_company.company_address.neighborhood ?
                isQuoteExist.quote_company.company_address.neighborhood :
                '-',
            customer_address_no: isQuoteExist &&
                isQuoteExist.quote_company &&
                isQuoteExist.quote_company.company_address &&
                isQuoteExist.quote_company.company_address.address_number ?
                isQuoteExist.quote_company.company_address.address_number :
                '-',
            customer_zipcode: isQuoteExist &&
                isQuoteExist.quote_company &&
                isQuoteExist.quote_company.company_address &&
                isQuoteExist.quote_company.company_address.zipcode ?
                isQuoteExist.quote_company.company_address.zipcode :
                '-',
            customer_city: isQuoteExist &&
                isQuoteExist.quote_company &&
                isQuoteExist.quote_company.company_address &&
                isQuoteExist.quote_company.company_address.city ?
                isQuoteExist.quote_company.company_address.city :
                '-',
            customer_state: isQuoteExist &&
                isQuoteExist.quote_company &&
                isQuoteExist.quote_company.company_address &&
                isQuoteExist.quote_company.company_address.state ?
                isQuoteExist.quote_company.company_address.state :
                '-',
            customer_phone: isQuoteExist &&
                isQuoteExist.quote_company &&
                isQuoteExist.quote_company.company_phone ?
                isQuoteExist.quote_company.company_phone :
                '-',
            customer_email: isQuoteExist &&
                isQuoteExist.quote_company &&
                isQuoteExist.quote_company.company_email ?
                isQuoteExist.quote_company.company_email :
                '-',
            total_insurance_cost: await convertToBrazilCurrency(
                isQuoteExist.totalInsuranceCost,
                currency
            ),
            product_type: isQuoteExist &&
                isQuoteExist.product &&
                isQuoteExist.product.name ?
                isQuoteExist.product.name :
                '-',
            product_id: isQuoteExist &&
                isQuoteExist.product_id ?
                isQuoteExist.product_id :
                null,
            insurance_type: isQuoteExist &&
                isQuoteExist.insurance_type_id == INSURANCE_TYPE_ID.SINGLE ?
                isQuoteExist.insurance_type.name.toUpperCase() :
                isQuoteExist &&
                    isQuoteExist.premium_calculation_type == PREMIUM_CALCULATION_TYPE.AJUSTAVEL ?
                    isQuoteExist.insurance_type.name.toUpperCase() :
                    isQuoteExist.insurance_type.name.toUpperCase(),
            insurance_type_id: isQuoteExist &&
                isQuoteExist.insurance_type_id ?
                isQuoteExist.insurance_type_id :
                null,
            total_amount: isQuoteExist &&
                isQuoteExist.insurance_type_id == INSURANCE_TYPE_ID.SINGLE ?
                await convertToBrazilCurrency(
                    isQuoteExist.transport_good.transport_good_details.total_amount,
                    currency
                )
                : await convertToBrazilCurrency(
                    isQuoteExist.transport_good.estimated_for_next_12_months,
                    currency
                ),
            deductible_name: isQuoteExist.deductible_name,
            deductible_details: isQuoteExist.deductible_details,
            net_insurance_cost_with_commission: await convertToBrazilCurrency(
                isQuoteExist.nicWithCommission,
                currency
            ),
            basicCoverages: isQuoteExist &&
                isQuoteExist.quote_basic_coverages ?
                isQuoteExist.quote_basic_coverages.map(obj => obj.dataValues) :
                null,
            additionalCoverages: isQuoteExist &&
                isQuoteExist.quote_additional_coverages ?
                isQuoteExist.quote_additional_coverages.map(obj => obj.dataValues) :
                null,
            premium_calculation_type: isQuoteExist &&
                isQuoteExist.premium_calculation_type,
            desired_policy_limit: isQuoteExist &&
                isQuoteExist.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL ?
                await convertToBrazilCurrency(
                    isQuoteExist.transport_good.total_limit,
                    currency
                ) :
                '-',
            insurance_rate: isQuoteExist.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL ?
                // isQuoteExist.product_id != PRODUCT_ID.RCTR_C &&
                //     isQuoteExist.product_id != PRODUCT_ID.RCTR_C_AND_RCF_DC ?
                `${parseFloat(isQuoteExist.insuranceRate)} %` :
                // isQuoteExist.is_rctrc_rate ?
                //     `${isQuoteExist.rctrc_rate} %` :
                parseInt(isQuoteExist.insuranceRate) < 0 ?
                    `Tarifa com  ${Math.abs(parseInt(isQuoteExist.insuranceRate))} % de desconto` :
                    parseInt(isQuoteExist.insuranceRate) > 0 ?
                        `Tarifa com  ${Math.abs(parseInt(isQuoteExist.insuranceRate))} % de agravo` :
                        '-',
            deductible_amount:
                isQuoteExist.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL ? isQuoteExist.deductible_amount : '-',
        };

        let template = jsRender.templates('./public/pdfs/policy.html');
        let html = template.render(payload);
        const opts = {
            headless: true,
            // timeout: 15000,
            args: ['--no-sandbox', '--disabled-setupid-sandbox'],
        };
        const browser = await puppeteer.launch(opts);
        const page = await browser.newPage();
        await page.setContent(html);
        //const policyPdf = await policyHeaderFooter(page, susep);
        const policyPdf = await page.pdf({
            // path: 'policy.pdf',
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: `<div style="width:100%; height: 60px; margin-top:-20px;">
      <div style="-webkit-print-color-adjust: exact; display:flex; padding-top: 0px; padding-bottom:10px; justify-content: space-between; background-color: #0A1728;">
      
       <div>
           <h2 style="-webkit-print-color-adjust: exact; font-size:16px; padding-top: 17px;  font-family: Open Sans, sans-serif; color:#fff;padding-left:20px">SEGURO DE TRANSPORTE
           </h2>
       </div>
       <div style="-webkit-print-color-adjust: exact; padding-top: 17px;  padding-right: 20px;">
           <p
               style="-webkit-print-color-adjust: exact; color: #fff; font-size: 7px; font-family: Open Sans, sans-serif; font-weight: 600; background-color: #7BA3DF; padding-top: 8px; padding-bottom: 8px; padding-left: 15px; padding-right: 15px; border-radius: 30px;">
               PROPOSTA NO. ${payload.proposal_no}</p>
       </div>
   </div>
   </div>`,
            footerTemplate: `<div style="-webkit-print-color-adjust: exact; padding: 7px 0;
              border-top: 1px solid #A1A1A1;
              width: 95%;
              margin-top: auto;
              margin-left: auto;
              margin-right: auto; font-family: Open Sans, sans-serif; margin-left: 20px; margin-right: 20px;">
        <div style=" display: flex; width:100%">
        <div style="display: flex; display: flex; justify-content: space-between; width:60%">
          <span style=" color: #A1A1A1;
               font-size: 8px;">PROCESSO SUSEP
         </span>
        <span style=" color: #A1A1A1;
            font-size: 8px;">${payload.susep}
        </span>
        </div>
         <div class=\"page-footer\" style=\"width:40%; text-align:right; color: #A1A1A1;  font-size: 8px; \">Página <span class=\"pageNumber\" "></span></div>
        </div>`,
            margin: {
                top: '27mm',
                bottom: '2cm',
            },
        });
        await browser.close();
        let quoteBase64 = null
        try {
            quoteBase64 = await pdfToBase64(isQuoteExist.quote_pdf);
        } catch (error) {
            quoteBase64 = null
        }
        var pdfsToMerge = [policyPdf];
        if (quoteBase64) {
            pdfsToMerge.push(quoteBase64)
        }
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
        let buf = await mergedPdf.save();
        buf = Buffer.from(buf, 'base64');
        let params = {
            Key: Date.now() + '-policy-' + isQuoteExist.id + '.pdf',
            Body: buf,
            folderName: `proposals/${payload.proposal_no}`,
        };
        const result = await uploadFileToServer(params);
        // await Models.proposals.update(
        //   { policy_pdf: result.Location, createPolicyPDF: 1 },
        //   { where: { quote_id: policy.quote_id } }
        // );
        return result;
    } catch (error) {
        console.log(error);
        logger.error('download Policy Pdf Error', error);
    }
}
/* end */

/* get customer score */
export const getCustomerScore = async (companyId, models) => {
    try {
        /* query for get all quotes which is associated with the company id */
        const allCompanyQuotes = await models.Quotes.findAll({
            where: {
                company_id: companyId, deleted_at: null, status: QUOTE_STATUS.EMITIDO
            },
            attributes: ['id', 'is_calculation_personalized', 'insurance_type_id'],
            include: [
                {
                    model: models.QuoteCalculations,
                    as: 'quote_calculation',
                    attributes: ['personalized_total_premium', 'standard_total_premium']
                },
                {
                    model: models.Proposals,
                    as: 'proposal_detail',
                    attributes: ['adjustment_percentage']
                },
                {
                    model: models.Claims,
                    as: 'claims',
                    attributes: ['quote_id', 'total_indemnity']
                }
            ]
        });
        /* end */
        /* variable initialization */
        let totalPremium = 0;
        let totalClaimAmount = 0;
        let totalClaimCount = 0;
        let totalProposalCount = 0;
        for (let companyQuote of allCompanyQuotes) {
            let companyQuoteTotalPremium = 0;
            if (companyQuote.is_calculation_personalized == DEFAULT_ENUM.TRUE) {
                /* personalized total premium */
                companyQuoteTotalPremium = companyQuote &&
                    companyQuote.dataValues &&
                    companyQuote.dataValues.quote_calculation &&
                    companyQuote.dataValues.quote_calculation.personalized_total_premium ?
                    companyQuote.dataValues.quote_calculation.personalized_total_premium :
                    null;
            } else {
                /* standard total premium */
                companyQuoteTotalPremium = companyQuote &&
                    companyQuote.dataValues &&
                    companyQuote.dataValues.quote_calculation &&
                    companyQuote.dataValues.quote_calculation.standard_total_premium ?
                    companyQuote.dataValues.quote_calculation.standard_total_premium :
                    null;
            }
            /* calculate adjustment percentage from proposals */
            const adjustmentPercentage = companyQuote &&
                companyQuote.dataValues &&
                companyQuote.dataValues.proposal_detail &&
                companyQuote.dataValues.proposal_detail.adjustment_percentage ?
                companyQuote.dataValues.proposal_detail.adjustment_percentage :
                90;
            /* if insurance type id is annual */
            if (companyQuote.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL) {
                companyQuoteTotalPremium = (adjustmentPercentage * companyQuoteTotalPremium) / 100;
            }
            /* total premium */
            totalPremium += companyQuoteTotalPremium;
            /* total claim amount from claim table */
            const companyQuoteTotalClaims = companyQuote.claims.reduce((sum, claims) => {
                return sum + claims.total_indemnity
            }, 0);
            /* total claim amount */
            totalClaimAmount += companyQuoteTotalClaims;
            /* claim count */
            const companyQuoteTotalCount = companyQuote.claims.length;
            totalClaimCount += companyQuoteTotalCount;
            /* TODO: need to implement for the endorsement that is premium calculation type 2 */
        }
        /* total proposal count */
        const companyQuoteProposalCount = allCompanyQuotes.length;
        totalProposalCount += companyQuoteProposalCount;
        /* calculate the customer score */
        const customerScore = (!totalPremium) ? 0 : get2Decimal((totalClaimAmount / totalPremium) * 100);
        const customer_score =
            totalProposalCount > 0 && totalClaimCount == 0
                ? '0'
                : totalProposalCount > 0 &&
                    totalPremium == 0 &&
                    totalClaimCount == 0
                    ? '0'
                    : totalProposalCount > 0 &&
                        totalPremium != 0 &&
                        totalClaimCount == 0
                        ? '0'
                        : totalProposalCount > 0 &&
                            totalPremium == 0 &&
                            totalClaimCount != 0 && totalClaimCount != 0
                            ? '100'
                            : totalProposalCount == 0
                                ? null
                                : customerScore;
        /* payload to update in the companies table */
        const payload = {
            total_claim_amount: totalClaimAmount,
            total_premium: totalPremium,
            customer_score: customer_score
        }
        /* update values in company table */
        await models.Companies.update(payload, { where: { id: companyId } });
    } catch (error) {
        console.log('error', error);
        logger.error('get Customer Score Error', error);
    }
}
/* end */

/* function for get access token */
export const getAccessToken = async (ipAddress, models) => {
    let addApiLogResponse;
    try {
        return new Promise(async (resolve, reject) => {
            const options = {
                method: 'GET',
                // url: `${process.env.INSURANCE_COMPANY_BASE_URL}api/v1/Auth/login-url?appId=${process.env.INSURANCE_COMPANY_APP_ID}`
                url: 'https://seguridadcert.segurosdelpichincha.com/api/v1/Auth/login-url?appId=dfasf4dd'
            };
            /* generate uuid for api logs */
            const apilog_uuid = await getUUID();
            /* create api log payload  */
            const addApilogPayload = {
                log_type: CHILD_LOG_TYPE.GET_INSURANCE_COMPANY_ACCESS_TOKEN,
                ip_address: ipAddress,
                uuid: apilog_uuid,
                request_payload: JSON.stringify(options),
            };
            addApiLogResponse = await saveApilogs(addApilogPayload, models);
            request(options, async (error, response, body) => {
                let result;
                try {
                    result = JSON.parse(body);
                } catch (error) {
                    result = null;
                };
                /* update api log payload */
                const updateApiLogPayload = {
                    query: { id: addApiLogResponse.id },
                }
                if (error) {
                    updateApiLogPayload.payload = { response: error, message: API_LOG_MESSAGES.FAILED };
                    await updateApilogs(updateApiLogPayload, models.ApiLogs);
                    reject(error);
                } else {
                    updateApiLogPayload.payload = { response: body, message: result && result.success != false ? API_LOG_MESSAGES.SUCCESS : API_LOG_MESSAGES.FAILED };
                    await updateApilogs(updateApiLogPayload, models.ApiLogs);
                    resolve(result);
                }
                return result;
            });
        })
    } catch (error) {
        console.log('error', error);
        logger.error('get Access Token Error', error);
    }
}
/* end */

/* api for add policy to insurance company for flow 1*/
export const addSinglePolicyToInsuranceCompany = async (detail, token, models) => {
    let addApiLogResponse;
    const body = await getSingleProposalPayload(detail);
    //console.log('body1212121', body);
    try {
        const options = {
            method: 'POST',
            //url: 'https://busservicioscert.segurosdelpichincha.com:5370/rest/jwt/emite',
            url: `${process.env.INSURANCE_COMPANY_BASE_URL}emite`,
            data: body,
            headers: {
                authorization: token,
                'Content-Type': 'application/json', // Set content type
                'Cookie': 'cookiesession1=678A8C43D76AD9103A796BED912A7E68'
            },
        };
        /* generate uuid for api logs */
        const apilog_uuid = await getUUID();
        /* create api log payload  */
        const addApilogPayload = {
            request_id: detail.proposal_no,
            type: PARENT_LOG_TYPE.PROPOSAL,
            log_type: CHILD_LOG_TYPE.ADD_SINGLE_POLICY_TO_INSURANCE_COMPANY,
            ip_address: detail.ip_address,
            uuid: apilog_uuid,
            request_payload: JSON.stringify(options),
        };
        addApiLogResponse = await saveApilogs(addApilogPayload, models);
        const response = await axios.request(options);
        const updateApiLogPayload = {
            query: { id: addApiLogResponse.id },
            payload: { response: JSON.stringify(response.data), message: API_LOG_MESSAGES.SUCCESS }
        };
        await updateApilogs(updateApiLogPayload, models.ApiLogs);
        return response.data;
    } catch (error) {
        const updateApiLogPayload = {
            query: { id: addApiLogResponse.id },
            payload: { response: JSON.stringify(error), message: API_LOG_MESSAGES.FAILED }
        };
        await updateApilogs(updateApiLogPayload, models.ApiLogs);
        console.error('Error in addSinglePolicyToInsuranceCompany:', error);
        return error;
    }
}

const getSingleProposalPayload = async (detail) => {
    try {
        const payload = {
            "astr_id_proveedor": detail.proposal_no,
            "cotizacion": {
                "coberturas": [
                    {
                        "aint_grupo": 999,
                        "astr_codigo_cob": "00000",
                        "astr_cob_bd_inc_sa": "S",
                        "adbl_vm_sa": detail.total_limit,
                        "astr_obtener_prima": null,
                        "adbl_vm_pri": detail.total_Premium, /* total premium from quote calculation */
                        "adbl_qt_tasa": detail.insurance_rate,
                        "astr_cob_descrip_print": null,
                        "astr_descripcion": null,
                        "astr_seleccion": null,
                        "astr_bloqueado": null,
                        "adbl_vm_prima_riesgo": 0,
                        "adbl_qt_tasa_riesgo": 0
                    }
                ],
                "adbl_vm_prima_neta_anual": detail.total_Premium, /* total premium from quote calculation */
                "adbl_vm_prima_total_anual": detail.total_insurance_cost, /* total insurance rate from quote calculation for flow 1 */
                "adbl_vm_sa": detail.total_limit,
                "adbl_vm_de": detail.tax_emmssion,
                "adbl_vm_sc": detail.CSSC,
                "adbl_vm_scvs": detail.CSCVS,
                "adbl_vm_iva": detail.IVA,
                "adbl_valor_ahorro": 0,
                "adbl_valor_cargo_admin": 0,
                "astr_frec_pago": "A",
                "astr_codigo_producto": "00001",
                "astr_tipo_producto": "I",
                "astr_ramo": "06",
                "astr_id_plan": "00001",
                "astr_desc_plan": null,
                "adt_fecha_ini_vig": detail.policy_start_date,
                "adt_fecha_fin_vig": detail.policy_end_date,
                "adbl_vm_prima_anual": 0,
                "astr_tipo_facturacion": "I", // static
                "astr_tipo_transportacion": detail.product_name // “IMP” for Import or “EXP” for Export
            },
            "cliente": {
                "astr_tipo_persona": "J",
                "astr_tipo_identificacion": "02",
                "astr_identificacion": detail.company_ruc,
                "astr_nombre1": detail.company_name,
                "astr_nombre2": "",
                "astr_apellido1": "",
                "astr_apellido2": "",
                "astr_genero": "2",
                "astr_estado_civil": null,
                "adt_fecha_nacimiento": null,
                "astr_estado_migratorio": null,
                "adt_fecha_exp_pasaporte": null,
                "adt_fecha_ing_pais": null,
                "adt_fecha_cad_pasaporte": null,
                "astr_dec_salud_tit": null,
                "astr_dec_salud_ben": null,
                "astr_per_politicamente_expuesta": "NO",
                "astr_pais_residencia_fiscal": null,
                "astr_cliente_fumador": null,
                "astr_razon_social": detail.company_name,
                "contacto": {
                    "astr_pais_ori": " 327",
                    "astr_nacionalidad": "ECU",
                    "astr_nom_familiar": null,
                    "astr_tel_familiar": null,
                    "astr_email": detail.company_email,
                    "astr_envio_corrrespondencia": "D",
                    "astr_prov_dom": null,
                    "astr_ciudad_dom": null,
                    "astr_calle_prin_dom": detail.company_address,
                    "astr_num_dom": null,                           //detail.company_address_no we passed this value as dynamically
                    "astr_tras_dom": null,
                    "astr_ref_dom": null,                           //detail.city we passed this dyanmically
                    "astr_casa_depart_dom": null,
                    "astr_piso_dom": null,
                    "astr_barrio_dom": null,
                    "astr_tel_dom": detail.company_phone,
                    "astr_celular": null,                         //0968184002 we passed this as static
                    "astr_hora_desde_dom": "0000",
                    "astr_hora_hasta_dom": "0000",
                    "astr_prov_trab": null,
                    "astr_ciudad_trab": null,
                    "astr_calle_prin_trab": null,
                    "astr_num_trab": null,
                    "astr_tras_trab": null,
                    "astr_barrio_trab": null,
                    "astr_ref_trab": null,
                    "astr_local_trab": null,
                    "astr_piso_trab": null,
                    "astr_tel_trab": null,
                    "astr_ext_trab": "",
                    "astr_nom_empresa": null,
                    "astr_hora_desde_trab": "0000",
                    "astr_hora_hasta_trab": "0000"
                }
            },
            "financiero": {
                "astr_tit_cuenta": "S",
                "astr_tipo_id_tit": "",
                "astr_id_tit": "",
                "astr_nomb_tit": "",
                "astr_paren_tit": "",
                "astr_ran_ingreso": detail.income_range_astrId,                      //  "2" we passed this value static,
                "adbl_med_ingreso": detail.income_range_value,   //we passef the income_range value in this field
                "astr_ran_patrimonio": detail.heritage_rank_astrId,              //"9" we passed this value static,
                "adbl_med_patrimonio": detail.heritage_rank_value,           //10000 we passed this value as staic
                "astr_ocupacion": detail.occupation_astrId,                      //800045 we passed this value static
                "astr_act_economica": detail.economic_activity_astrId            //002001004 wepassed this value static
            },
            "formaPago": {
                "astr_tip_forma_pago": "15",
                "astr_banco": null,               //"10" we passed this value as static
                "astr_numero_cuenta": null,       //"9999999999" we passed this value as static
                "astr_tipo_tarjeta": "",
                "astr_pais_emisor": null,
                "aint_ano_caducidad": null,
                "aint_mes_caducidad": null,
                "astr_cvv": null,
                "astr_tip_cuenta_reembolso": null,
                "astr_banco_reembolso": null,
                "astr_num_reembolso": null
            },
            "factura": {
                "astr_tipo_ident_fact": "00",
                "astr_ident_fact": detail.company_ruc,
                "astr_nombre_fact": detail.company_name,
                "astr_email_fact": detail.company_email,
                "astr_tel_fact": detail.company_phone,
                "astr_dir_fact": detail.company_address
            },
            "ubicaInmueble": {
                "astr_prov": "",          //01 we passed this value as static
                "astr_ciudad": "",        //03 we passed this value as static
                "astr_calle_prin": "",
                "astr_tras": "",
                "astr_numeracion": "",
                "astr_ref": "",
                "astr_barrio": "",
                "astr_tel": null,
                "astr_piso": null,
                "astr_detalle": detail.astr_detalle   //"NUEVO/100125/FACTURA/FRANCISCO LOPEZ/1716217581001 => good name / shipment document namber / document name / quote number"
            },
            "aplicacion": {
                "astr_medio": "04",
                "astr_tipo_fecha": "E",
                "adt_fecha_embarque": detail.policy_start_date,
                "astr_incoterm": "F",
                "astr_embalaje": "01",
                "astr_pais_desde": (detail.source).toString(),
                "astr_region_desde": "",
                "astr_provincia_desde": "",
                "astr_ciudad_desde": "",
                "astr_comentario_desde": "",            //"MERCADERIA EN BUEN ESTADO",
                "astr_puerto_desde": "S",
                "astr_pais_hasta": (detail.destination).toString(),
                "astr_region_hasta": "",
                "astr_provincia_hasta": "",
                "astr_ciudad_hasta": "",
                "astr_comentario_hasta": "",          //"MERCADERIA EN BUEN ESTADO",
                "astr_puerto_hasta": "N",
                "astr_consignatario": null,      // 1715978014 passed this value as static
                "astr_embarcador": null,        // 1804455762 passed this value as static
                "astr_comisario": "",
                "sobreseguro": null,        //10 passed this value as static
                "astr_moneda_org": "USD",
                "astr_item": "01"
            },
            "beneficiario": [],
            "colapago": [],
            "usuario": {
                "astr_tipo_usuario": "B",
                "astr_userId": null,
                "astr_agencia": detail.agency_id,
                "astr_subage_id": "1",
                "astr_punto_id": null,
                "astr_tipo_identificacion": "02",
                "astr_identificacion": "1791268458001",
                "astr_nombre_usuario": "elow",
                "astr_apellido_usuario": "musk",
                "astr_correo_usuario": "user@aon.com"
            },
            "datos_adicionales": []
        }
        return payload;
    } catch (error) {
        console.log(error);
    }
}

/* api for add policy to insurance company for flow 2*/
export const addAnnualPolicyToInsuranceCompany = async (detail, token, models) => {
    let addApiLogResponse;
    const body = await getAnnualProposalPayload(detail);
    // console.log('body111111111111', body);
    try {
        const options = {
            method: 'POST',
            //url: 'https://busservicioscert.segurosdelpichincha.com:5370/rest/jwt/emite',
            url: `${process.env.INSURANCE_COMPANY_BASE_URL}emite`,
            data: body,
            headers: {
                authorization: token,
                'Content-Type': 'application/json', // Set content type
                'Cookie': 'cookiesession1=678A8C43D76AD9103A796BED912A7E68'
            },
        };
        /* generate uuid for api logs */
        const apilog_uuid = await getUUID();
        /* create api log payload  */
        const addApilogPayload = {
            request_id: detail.proposal_no,
            type: PARENT_LOG_TYPE.PROPOSAL,
            log_type: CHILD_LOG_TYPE.ADD_ANNUAL_POLICY_TO_INSURANCE_COMPANY,
            ip_address: detail.ip_address,
            uuid: apilog_uuid,
            request_payload: JSON.stringify(options),
        };
        addApiLogResponse = await saveApilogs(addApilogPayload, models);
        const response = await axios.request(options);
        const updateApiLogPayload = {
            query: { id: addApiLogResponse.id },
            payload: { response: JSON.stringify(response.data), message: API_LOG_MESSAGES.SUCCESS }
        };
        await updateApilogs(updateApiLogPayload, models.ApiLogs);
        return response.data;
    } catch (error) {
        const updateApiLogPayload = {
            query: { id: addApiLogResponse.id },
            payload: { response: JSON.stringify(error), message: API_LOG_MESSAGES.FAILED }
        };
        await updateApilogs(updateApiLogPayload, models.ApiLogs);
        console.error('Error in addAnnualPolicyToInsuranceCompany:', error);
        return error;
    }
}

const getAnnualProposalPayload = async (detail) => {
    try {
        const payload =
        {
            "astr_id_proveedor": detail.proposal_no, // proposal number
            "cotizacion": {
                "coberturas": [
                    {
                        "aint_grupo": 999,
                        "astr_codigo_cob": "00000", // static
                        "astr_cob_bd_inc_sa": "S", // static
                        "adbl_vm_sa": detail.total_limit, // Limit
                        "astr_obtener_prima": null, // static
                        "adbl_vm_pri": 0.00,  // static
                        "adbl_qt_tasa": detail.insurance_rate, // quote rate
                        "astr_cob_descrip_print": null, // static
                        "astr_descripcion": null, // static
                        "astr_seleccion": null, // static
                        "astr_bloqueado": null, // static
                        "adbl_vm_prima_riesgo": 0, // static
                        "adbl_qt_tasa_riesgo": 0, // static
                        "adbl_qt_valor_perdida": 10.00,
                        "adbl_qt_valor_asegurado": 0.00,
                        "adbl_qt_valor_embarque": 1.00,
                        "adbl_valor_deducible": 500.00 // deductible value
                    }
                ],
                "adbl_vm_prima_neta_anual": 0.00,   //detail.gross_written_premium, Gross Written Premium
                "adbl_vm_prima_total_anual": 0.00,   //detail.total_Premium, // Total Premium
                "adbl_vm_sa": detail.total_limit,    // 0.00 passed static
                "adbl_vm_de": 0.00, // static
                "adbl_vm_sc": 0.00, // static
                "adbl_vm_scvs": 0.00, // static
                "adbl_vm_iva": 0.00, // static   
                "adbl_valor_ahorro": 0, // static
                "adbl_valor_cargo_admin": 0, // static
                "astr_frec_pago": "A", // static  
                "astr_codigo_producto": "00009", // static
                "astr_tipo_producto": "M", // static
                "astr_poliza_abierta": null, // static
                "astr_ramo": "06", // static
                "astr_id_plan": "00009", // static
                "astr_desc_plan": null, // static
                "adt_fecha_ini_vig": detail.policy_start_date, // policy start date
                "adt_fecha_fin_vig": detail.policy_end_date, // policy end date
                "adbl_vm_prima_anual": 0, // static
                "astr_tipo_facturacion": "A",
                "astr_tipo_transportacion": detail.product_name // “IMP” for Import or “EXP” for Export
            },
            "cliente": {
                "astr_tipo_persona": "J",// static
                "astr_tipo_identificacion": "02", // static
                "astr_identificacion": detail.company_ruc, // customer RUC NUMBER
                "astr_nombre1": detail.company_name, // customer name
                "astr_nombre2": "", // static
                "astr_apellido1": "", // static
                "astr_apellido2": "", // static
                "astr_genero": "2", // static 
                "astr_estado_civil": null,// static
                "adt_fecha_nacimiento": null, // static
                "astr_estado_migratorio": null, // static
                "adt_fecha_exp_pasaporte": null, // static
                "adt_fecha_ing_pais": null, // static
                "adt_fecha_cad_pasaporte": null, // static
                "astr_dec_salud_tit": null, // static
                "astr_dec_salud_ben": null, // static
                "astr_per_politicamente_expuesta": "NO", // static
                "astr_pais_residencia_fiscal": null, // static
                "astr_cliente_fumador": null, // static
                "astr_razon_social": detail.company_name, // customer name
                "contacto": {
                    "astr_pais_ori": " 327", // static
                    "astr_nacionalidad": "ECU", // static
                    "astr_nom_familiar": null, // static
                    "astr_tel_familiar": null, // static 
                    "astr_email": detail.company_email, // customer email
                    "astr_envio_corrrespondencia": "D", // static
                    "astr_prov_dom": null,
                    "astr_ciudad_dom": null,
                    "astr_calle_prin_dom": detail.company_address,   //"AV. BARCELONA S/N Y JOSE RODRIGUEZ BONIN",
                    "astr_num_dom": null, // static
                    "astr_tras_dom": null,
                    "astr_ref_dom": null,
                    "astr_casa_depart_dom": null, // static
                    "astr_piso_dom": null, // static
                    "astr_barrio_dom": null, // static
                    "astr_tel_dom": detail.company_phone, // customer phone number
                    "astr_celular": null, // static
                    "astr_hora_desde_dom": "0000", // static
                    "astr_hora_hasta_dom": "0000", // static
                    "astr_prov_trab": null, // static
                    "astr_ciudad_trab": null, // static
                    "astr_calle_prin_trab": null, // static
                    "astr_num_trab": null, // static
                    "astr_tras_trab": null, // static
                    "astr_barrio_trab": null, // static
                    "astr_ref_trab": null, // static
                    "astr_local_trab": null, // static
                    "astr_piso_trab": null, // static
                    "astr_tel_trab": null, // static
                    "astr_ext_trab": "", // static
                    "astr_nom_empresa": null, // static
                    "astr_hora_desde_trab": "0000", // static
                    "astr_hora_hasta_trab": "0000" // static
                }
            },
            "financiero": {
                "astr_tit_cuenta": "", // static
                "astr_tipo_id_tit": "", // static
                "astr_id_tit": "", // static
                "astr_nomb_tit": "", // static
                "astr_paren_tit": "", // static
                "astr_ran_ingreso": detail.income_range_astrId,                 //"2" we passed this value as static,
                "adbl_med_ingreso": detail.income_range_value,      //1000 we passed this value as static
                "astr_ran_patrimonio": detail.heritage_rank_astrId,      //"9" we passed this value as staic
                "adbl_med_patrimonio": detail.heritage_rank_value,      // 10000 we passed this value as static
                "astr_ocupacion": detail.occupation_astrId,              //"800045" we passed this value as static
                "astr_act_economica": detail.economic_activity_astrId,     // "002001004" we passed this value as static
            },
            "usuario": {
                "astr_tipo_usuario": "B", // static
                "astr_userId": null, // static
                "astr_agencia": detail.agency_id, // passed 00001 static
                "astr_subage_id": "1", // static
                "astr_punto_id": null, // static
                "astr_tipo_identificacion": "02", // static
                "astr_identificacion": "1791268458001", // static
                "astr_nombre_usuario": "elow", // static
                "astr_apellido_usuario": "musk", // static
                "astr_correo_usuario": "user@aon.com" // static
            },
            "datos_adicionales": []
        }

        return payload;
    } catch (error) {
        console.log(error);
    }
}

/* get policy number from insurance company */
export const getPolicyNumberFromInsuranceCompany = async (detail, token, models) => {
    let addApiLogResponse;
    try {
        console.log("detail.proposal_no", detail.proposal_no);
        const options = {
            method: 'POST',
            url: `${process.env.INSURANCE_COMPANY_BASE_URL}buscaemision`,
            data: {
                "IdProveedor": detail.proposal_no // proposal number 
            },
            headers: {
                authorization: token,
                'Content-Type': 'application/json',
            },
        };
        /* generate uuid for api logs */
        const apilog_uuid = await getUUID();
        /* create api log payload  */
        const addApilogPayload = {
            request_id: detail.proposal_no,
            type: PARENT_LOG_TYPE.PROPOSAL,
            log_type: CHILD_LOG_TYPE.GET_POLICY_NUMBER_FROM_INSURANCE_COMPANY,
            ip_address: detail.ip_address,
            uuid: apilog_uuid,
            request_payload: JSON.stringify(options),
        };
        addApiLogResponse = await saveApilogs(addApilogPayload, models);
        console.log("addApiLogResponse", addApiLogResponse);
        let response;
        let updateApiLogPayload;
        try {
            response = await axios.request(options);
            updateApiLogPayload = {
                query: { id: addApiLogResponse.id },
                payload: { response: JSON.stringify(response.data), message: API_LOG_MESSAGES.SUCCESS }
            };
            await updateApilogs(updateApiLogPayload, models.ApiLogs);

        } catch (error) {
            updateApiLogPayload = {
                query: { id: addApiLogResponse.id },
                payload: { response: JSON.stringify(error), message: API_LOG_MESSAGES.FAILED }
            };
            await updateApilogs(updateApiLogPayload, models.ApiLogs);
            return error
        }
        return response.data;
    } catch (error) {
        logger.error('get Policy Number From Insurance Company Error', error);
        const updateApiLogPayload = {
            query: { id: addApiLogResponse.id },
            payload: { response: JSON.stringify(error), message: API_LOG_MESSAGES.FAILED }
        };
        await updateApilogs(updateApiLogPayload, models.ApiLogs);
        console.error('Error in getPolicyNumberFromInsuranceCompany:', error);
        return error;
    }
}
/* end */

