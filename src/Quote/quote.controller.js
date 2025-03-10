import fs from 'fs';
import jsRender from 'jsrender';
import moment from 'moment';
import pdfToBase64 from 'pdf-to-base64';
import puppeteer from 'puppeteer';
import readXlsxFile from 'read-excel-file/node';
import { Op } from 'sequelize';
import { CHILD_LOG_TYPE, CURRENCY_EXCHANGE_RATE, CURRENCY_ID, DEFAULT_ENUM, DOCUMENT_TYPE, INSURANCE_TYPE_ID, IS_ACTIVE, IS_MODERATE, PARENT_LOG_TYPE, PRODUCT_ID, QUOTE_STATUS, RESPONSE_CODES, ROLES, SOCKET_EVENTS, USER_STATUS, TRANSPOTATION_TYPE } from "../../config/constants";
import { errorResponse, successResponse, successResponseWithPagination } from "../../config/responseHandlers";
import { logo } from "../../public/images/logos";
import { addUpdateCompanyDetail, checkUserQuoteLimit, convertToBrazilCurrency, convertToNumber, deleteFileFromServer, get2Decimal, get6Decimal, getAssociatedUsers, getFileFromServer, getMonthName, getUUID, saveApilogs, updateApilogs, uploadFileToServer, checkValidRuc } from "../helpers/commonFunction";
import logger from '../helpers/logger';
import { sendMail } from "../services/sendGrid";
import { emitSocketEvent } from "../services/socket.io";
import Services from "./quote.services";
import { json } from 'body-parser';
import e from 'cors';
const PDFDocument = require('pdf-lib').PDFDocument;
export default class Quote {
  async init(db) {
    this.services = new Services();
    this.Models = db.models;
    await this.services.init(db);
  }

  /* dropdown data */
  async dropdownData(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const query = { is_active: 1 };
      /* get cities */
      const cities = await this.services.getCities(query);
      /* get countries */
      const countries = await this.services.getCountries(query);
      /* get currencies */
      const claim_currencies = await this.services.getClaimCurrencies(query);
      /* get claim status */
      const claim_statues = await this.services.getClaimStatues(query);
      /* get states */
      const ecuador_states = await this.services.getEcuadorStates(query);

      /* get deductibles */
      query.id = { [Op.notIn]: [1, 20, 22, 24, 26] }
      const deductibles = await this.services.getDeductibles(query);
      delete query.id;
      const result = {
        cities,
        countries,
        claim_currencies,
        deductibles,
        claim_statues,
        ecuador_states,
      };
      return res
        .send(
          successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('dropdown Data Error, ', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get products */
  async getProducts(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const products = await this.services.getProducts({ is_active: 1, is_display: 1 });
      const line_of_businesses = await this.services.getLineOfBusinesses({ is_display: 1, is_active: DEFAULT_ENUM.TRUE });
      const insurance_segments = await this.services.getInsuranceSegments({ is_display: 1 });
      const insurance_types = await this.services.getInsuranceTypes({ is_display: 1 });
      const result = {
        products,
        line_of_businesses,
        insurance_segments,
        insurance_types,
      };
      return res
        .send(
          successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('get Products Error, ', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get coverages */
  async getCoverages(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { product_id, insurance_type_id } = req.params;
      // const coverageQuery = { is_default: IS_ACTIVE.TRUE, product_id };
      const basic_coverages = await this.services.getBasicCoverages();
      const additional_coverages = await this.services.getAdditionalCoverages();
      const goods = await this.services.getGoods({ is_active: IS_ACTIVE.TRUE });
      const group1_length = goods.filter((ele) => ele.group == '1').length;
      if (insurance_type_id != INSURANCE_TYPE_ID.SINGLE) {
        for (const ele of goods) {
          if (ele.group == '1') {
            ele.percentage =
              product_id == PRODUCT_ID.IMP
                ? ele.imp_exp_percentage
                : ele.imp_exp_percentage;
            ele.name_length = group1_length;
            ele.groupName = `Grupo ${ele.group}`;
            ele.Id = ele.id;
            delete ele.id;
            delete ele.imp_exp_percentage;
            //delete ele.rct_rcf_percentage;
          }
        }
      };
      let claim_causes = await this.services.getClaimCauses({ is_active: IS_ACTIVE.TRUE });
      if (product_id >= PRODUCT_ID.EXP) {
        claim_causes = claim_causes.filter(
          (ele) =>
            ele.id != 4 &&
            ele.id != 5 &&
            ele.id != 7 &&
            ele.id != 9 &&
            ele.id != 10 &&
            ele.id != 14
        );
      } else {
        claim_causes = claim_causes.filter((ele) => ele.id != 15);
      };
      const result = {
        basic_coverages,
        additional_coverages,
        goods,
        claim_causes,
      }
      return res
        .send(
          successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('get Coverages Error, ', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get quote list */
  async getQuoteList(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      //  const decryptedData = await decryptData(req);
      // const { email, password } = decryptedData;
      const { body, user } = req;
      const quoteId = req.params.id;
      if (user.role_id == ROLES.SUB_AGENCY || user.role_id == ROLES.SUB_BROKER) {
        if (user.user_access.quotes == DEFAULT_ENUM.FALSE) {
          return res.send(errorResponse(CommonMessages.UNAUTHORIZED_USER, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
        }
      }
      let quoteCondition = {
        deleted_at: null,
        status: body.status ? body.status : [
          QUOTE_STATUS.ACTIVE,
          QUOTE_STATUS.INACTIVE,
          QUOTE_STATUS.EMITIDO,
          QUOTE_STATUS.RASCUNHO,
          QUOTE_STATUS.MODERAÇÃO,
          QUOTE_STATUS.EM_EMISSÃO,
          QUOTE_STATUS.DECLINADA,
          QUOTE_STATUS.CANCELADO,
          QUOTE_STATUS.PENDENTE,
          QUOTE_STATUS.REVISÃO,
        ],
      };
      /* review user id in get only when sub admin is logged in */
      if (body.review_user_id) {
        quoteCondition.review_user_id = body.review_user_id,
          quoteCondition.status = QUOTE_STATUS.REVISÃO
      }
      /* if company id is provided*/
      if (body.company_id) {
        quoteCondition.company_id = body.company_id
      }
      if (quoteId) {
        quoteCondition.id = quoteId
      }
      let userIds = [];
      /* get the sub users of all roles except admin and sub admin */
      if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN) {
        userIds = await getAssociatedUsers(this.Models, user);
      }
      if (userIds.length > 0) {
        quoteCondition.user_id = userIds
      }
      /* get the search value in the body */
      if (body && body.search && body.search.value != "") {
        quoteCondition[Op.or] = [
          { id: { [Op.like]: "%" + body.search.value + "%" } },
          { ruc: { [Op.eq]: body.search.value } },
          { email: { [Op.like]: '%' + body.search.value + '%' } },
          { company_phone: { [Op.like]: '%' + body.search.value + '%' } },
          { company_name: { [Op.like]: '%' + body.search.value + '%' } },
          { broker_name: { [Op.like]: '%' + body.search.value + '%' } },
          { product_name: { [Op.like]: '%' + body.search.value + '%' } },
          { insurance_type_name: { [Op.like]: '%' + body.search.value + '%' } },
        ]
      };
      /* get quote list based on query condition */
      const result = await this.services.getQuoteList(quoteCondition, body);
      body.start = DEFAULT_ENUM.FALSE;
      body.length = DEFAULT_ENUM.FALSE;
      /* get quote list based on the query condition for pagination and record filtering */
      const resultWithoutPagination = await this.services.getQuoteList(quoteCondition, body);
      const recordsTotal = resultWithoutPagination.length;
      const recordsFiltered = resultWithoutPagination.length;
      return res
        .send(
          successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('get Quote List Error, ', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* create quote at step 2 */
  async createQuote(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      const {
        customer_type,
        quote_id,
        ruc,
        company_name,
        company_phone,
        company_email,
        address,
        address_number,
        neighborhood,
        city,
        state,
        same_group_companies,
        additional_customer,
        quote_documents,
        first_name,
        last_name,
        gender,
        marital_status,
        date_of_birth,
        home_telephone,
        reference,
        cross,
        floor,
        country_of_origin,
        reference_country
      } = req.body;
      let quoteId = quote_id;
      let addUpdateCompanyResult;
      // if (!quote_id) {
      /* create user company payload */
      const companyPayload = {
        role_id: ROLES.CUSTOMER,
        ruc,
        company_name: req.body.customer_type == 1 ? company_name : `${first_name} ${last_name}`,
        company_email,
        company_phone,
        address,
        address_number,
        neighborhood,
        city,
        state,
        first_name,
        last_name,
        gender,
        marital_status,
        date_of_birth,
        home_telephone,
        reference,
        cross,
        floor,
        customer_type,
        country_of_origin,
        reference_country
      };
      console.log('companyPayload121221', companyPayload);
      /* add update user company and its address */
      addUpdateCompanyResult = await addUpdateCompanyDetail(companyPayload, this.Models);
      req.body.company_id = addUpdateCompanyResult && addUpdateCompanyResult.company_id ? addUpdateCompanyResult.company_id : null;
      if (!quote_id) {
        /* generate uuid for user */
        const uuid = await getUUID();
        req.body.created_by_id = user.id;
        req.body.uuid = uuid;
        // req.body.company_id = addUpdateCompanyResult && addUpdateCompanyResult.company_id ? addUpdateCompanyResult.company_id : null;
        const createQuote = await this.services.createQuote(req.body);
        quoteId = createQuote.id;
        /* proposal number is a unique number for the our reference */
        /* Construct sequence based on quoteId */
        // const sequence = String(quoteId).padStart(13, '0');
        // const proposalNo = await this.getUniqueProposalNo(sequence);
        // await this.services.updateQuote({ id: createQuote.id }, { proposal_no: proposalNo });
        /*end */
        emitSocketEvent(SOCKET_EVENTS.QUOTE_CREATE_SUCCESS, { quote_id: createQuote.id });
        const payload = {
          ip_address: ip_address,
          ruc: req.body.ruc,
          company_name: req.body.company_name,
        }
        const ip_list = process.env.OFAC_BYPASS_IP.split(',').map(ip => ip.trim());
        if (req.body.customer_type == 1) {
          if (!ip_list.includes(ip_address)) {
            // Get current India time
            const currentIndiaTime = moment().tz('Asia/Kolkata');
            const restrictedStartHour = 10; // 10 AM India time
            const restrictedEndHour = 20; // 7 PM India time
            // Check if the current time is outside the restricted range
            if (currentIndiaTime.hour() < restrictedStartHour || currentIndiaTime.hour() >= restrictedEndHour) {
              const rucValidation = await checkValidRuc(payload, this.Models);
              //const rucValidation = { Info: "FAILED" }
              if (rucValidation && rucValidation.Info && rucValidation.Info != "OK") {
                await this.services.updateQuote({ id: quoteId }, { status: QUOTE_STATUS.DECLINADA });

                return res.send(errorResponse(
                  QuoteMessages.QUOTE_IS_DECLINED,
                  null,
                  RESPONSE_CODES.GET,
                  req.headers.tokenization
                ))
              }
            }
          }
        }
      }
      const quoteDetail = await this.services.getQuoteDetailForAddCustomerDetail({ id: quoteId });
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.CREATE_QUOTE,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body)
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* check if the quote with same ruc and product id already exists if broker is creating the quote */
      if (
        user.role_id != ROLES.ADMIN &&
        user.role_id != ROLES.SUB_ADMIN &&
        quoteDetail.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL
      ) {
        /* check if the user company exists by ruc */
        const isUserCompany = await this.services.getUserCompanyExistence({ ruc });
        if (isUserCompany) {
          const isSameRUCProductQuoteExist = await this.services.getQuoteExistence({
            id: {
              [Op.ne]: quoteDetail.id
            },
            company_id: isUserCompany.id,
            product_id: quoteDetail.product_id,
            insurance_type_id: INSURANCE_TYPE_ID.ANNUAL,
            status: [
              QUOTE_STATUS.ACTIVE,
              QUOTE_STATUS.EMITIDO,
              QUOTE_STATUS.RASCUNHO,
              QUOTE_STATUS.MODERAÇÃO,
              QUOTE_STATUS.EM_EMISSÃO,
              QUOTE_STATUS.PENDENTE
            ],
            deleted_at: null,
          });
          if (isSameRUCProductQuoteExist) {
            await this.services.updateQuote({ id: quoteDetail.id }, { deleted_at: new Date() });
            return res.send(errorResponse(
              QuoteMessages.RUC_ALREADY_EXIST,
              {
                is_ruc_exist: DEFAULT_ENUM.TRUE
              },
              RESPONSE_CODES.POST,
              req.headers.tokenization
            ));
          }
        };
      };

      const quotePayload = {
        same_group_companies,
        company_id: addUpdateCompanyResult && addUpdateCompanyResult.company_id ? addUpdateCompanyResult.company_id : null
      };
      await this.services.updateQuote({ id: quoteDetail.id }, quotePayload);
      /* add update additional customer */
      if (same_group_companies == DEFAULT_ENUM.FALSE) {
        await this.services.deleteAdditionalCustomers({ quote_id: quoteDetail.id });
      } else if (
        additional_customer &&
        additional_customer.length > 0
      ) {
        const existingQuoteAdditionalCustomers = await this.services.getQuoteAdditionalCustomers({ quote_id: quoteDetail.id });
        await this.addUpdateQuoteAdditionalCustomer(
          quoteId,
          existingQuoteAdditionalCustomers,
          additional_customer
        );
      };
      /* upload quote documents */
      if (quote_documents && quote_documents.length > 0) {
        quote_documents.map(ele => {
          return ele.quote_id = quoteDetail.id;
        })
        await this.services.bulkCreateQuoteDocuments(quote_documents);
      };
      /* end */
      const result = await this.services.getQuote({ id: quoteDetail.id });
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: QuoteMessages.QUOTE_ADDED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.QUOTE_ADDED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization))
    } catch (error) {
      logger.error('create Quote Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* add update quote additional customers */
  async addUpdateQuoteAdditionalCustomer(quoteId, existingQuoteAdditionalCustomers, additionalCustomer) {
    try {
      const new_customer = [];
      const missing_customer = [];
      for (const ele of additionalCustomer) {
        /* if the quote additional customer id is given then update */
        if (ele.id) {
          await this.services.updateQuoteAdditionalCustomers({ id: ele.id }, ele);
        } else {
          /* if the new quote additional customer is given in payload */
          ele.quote_id = quoteId;
          new_customer.push(ele);
        }
      };
      if (new_customer.length > 0) {
        await this.services.bulkCreateQuoteAdditionalCustomers(new_customer);
      }
      /* find and remove missing customer */
      for (const ele of existingQuoteAdditionalCustomers) {
        if (!additionalCustomer.find((customer) => customer.id == ele.id))
          missing_customer.push(ele.id);
      }
      if (missing_customer.length > 0) {
        await this.services.deleteAdditionalCustomers({ id: missing_customer });
      };
      /* end */
      return;
    } catch (error) {
      logger.error('add Update Quote Additional Customer Error, ', error);
    };
  }
  /* end */

  /* broker list on behalf of which quote is created */
  async quoteBrokerList(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { query, user } = req;
      const length = parseInt(query.length);
      const start = parseInt(length * (query.page - 1));
      let broker_query = {
        role_id: ROLES.BROKER,
        deleted_at: null,
        status: USER_STATUS.ACTIVE,
      };
      /* if the agency is accessing the broker list */
      if (user.role_id == ROLES.AGENCY) {
        broker_query.agency_id = user.id;
      };
      /* if the sub agency is accessing the broker list */
      if (user.role_id == ROLES.SUB_AGENCY) {
        broker_query.agency_id = user.created_by_id;
      };
      /* get search value from body */
      let search_query = []
      if (query.company_name_like) {
        search_query.push({ company_name: { [Op.like]: `%${query.company_name_like}%` } })
      }
      if (query.name_like) {
        search_query.push({ name: { [Op.like]: `%${query.name_like}%` } })
      }
      if (query.company_ruc_like) {
        search_query.push({ company_ruc: { [Op.like]: `%${query.company_ruc_like}%` } })
      }

      if (search_query.length > 0) {
        broker_query[Op.and] = search_query
      }
      /* get broker list based on the broker query and user logged in*/
      const result = await this.services.quoteBrokerList(broker_query, { start, length });
      /* get broker list for pagination */
      const resultWithoutPagination = await this.services.quoteBrokerList(broker_query, { start: 0, length: 0 });
      const recordsTotal = resultWithoutPagination.length;
      const recordsFiltered = resultWithoutPagination.length;
      return res
        .send(
          successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('quote Broker List Error, ', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* create single transport goods */
  async createSingleTransportGoods(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      const {
        quote_id,
        goods_change,
        good,
      } = req.body;
      let newTotalLimit = 0;
      let previousTotalLimit = 0;
      /* check quote exists */
      const quoteDetail = await this.services.getQuoteForCreateTransportGoods({ id: quote_id });
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
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.CREATE_SINGLE_TRANSPORT_GOODS,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      if (quoteDetail.quote_calculation) {
        /* standard calculation */
        quoteDetail.commission = quoteDetail.quote_calculation.standard_commission_percentage;
        quoteDetail.discount = quoteDetail.quote_calculation.standard_deductible && quoteDetail.quote_calculation.standard_deductible.discount != null ? quoteDetail.quote_calculation.standard_deductible.discount : null;
        quoteDetail.is_discount_load = quoteDetail.quote_calculation.standard_is_discount_load;
        quoteDetail.discount_aggravate_percentage = quoteDetail.quote_calculation.standard_discount_aggravate_percentage;
        quoteDetail.insurance_rate = quoteDetail.quote_calculation.standard_insurance_rate;
      };
      let transportGoodId;
      let displayModerate = DEFAULT_ENUM.FALSE;
      /* if transport good does not exist then need to create it */
      if (!quoteDetail.transport_good) {
        /* get transport good payload to create transport good */
        const transportGoodsPayload = {
          quote_id,
          /* total limit of the good */
          total_limit: good.total_amount ? good.total_amount : 0.0,
          currency: good.currency ? good.currency : CURRENCY_ID.REAL$,
        };
        /* create transport good */
        const transportGoods = await this.services.createTransportGoods(transportGoodsPayload);
        /* add transport good detail */
        await this.addSingleTransportGoodsDetail(
          good,
          transportGoods.id,
          quoteDetail,
          [],
          user.role_id,
        );
        transportGoodId = transportGoods.id;
      } else {
        /* if transport good for the quote already exists */
        /* store the previous transport good total limit */
        previousTotalLimit = quoteDetail.transport_good.total_limit;
        /* get the payload to update the transport good */
        const transportGoodsPayload = {
          currency: good.currency ? good.currency : CURRENCY_ID.REAL$,
        };
        /* update the transport good of the quote */
        await this.services.updateTransportGoods(transportGoodsPayload, { id: quoteDetail.transport_good.id });
        /* get the transport good detail of the quote */
        const transportGoodDetails = await this.services.getTransportGoodDetails({ transport_good_id: quoteDetail.transport_good.id });
        /* add or update the transport good detail of the quote */
        const resultOfTransportGoodsDetail = await this.addSingleTransportGoodsDetail(
          good,
          quoteDetail.transport_good.id,
          quoteDetail,
          transportGoodDetails,
          user.role_id
        );
        /* store new transport good total limit */
        newTotalLimit = resultOfTransportGoodsDetail.total_limit;
        /* check and update the quote as moderation */
        if (
          quoteDetail.quote_shipment &&
          quoteDetail.commission &&
          quoteDetail.display_moderation == DEFAULT_ENUM.FALSE &&
          user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN
        ) {
          const moderationResult = await this.checkQuoteModerationAsPerGoodsForSingleInsuranceType(
            newTotalLimit,
            quoteDetail.transport_good,
          );
          if (moderationResult) {
            /* get quote payload to make the quote moderate if admin and sub admin is not logged in */
            let quotePayload = {
              status: QUOTE_STATUS.MODERAÇÃO,
              is_moderate: IS_MODERATE.TRUE,
              display_moderation: DEFAULT_ENUM.TRUE,
              updatedAt: new Date()
            }
          };
        };
        transportGoodId = quoteDetail.transport_good.id;
      };
      let latestQuoteDetailForGrBook = await this.services.getQuoteDetailForGrBook({ id: quote_id });
      if (latestQuoteDetailForGrBook.quote_calculation) {
        latestQuoteDetailForGrBook.commission =
          latestQuoteDetailForGrBook.is_calculation_personalized == DEFAULT_ENUM.TRUE ?
            latestQuoteDetailForGrBook.quote_calculation.personalized_commission_percentage :
            latestQuoteDetailForGrBook.quote_calculation.standard_commission_percentage;
      };
      const quotePayload = {};
      /* update quote */
      await this.services.updateQuote({ id: quote_id }, quotePayload);
      /* get the latest quote detail */
      const result = await this.services.getAllQuoteDetail({ id: quote_id });
      let totalLimit = result.transport_good.total_limit;
      const moderationResult = await this.checkQuoteModerationAsPerGoodsForSingleInsuranceType(
        totalLimit,
        result.transport_good,
      );
      /* adding the display moderation flag in transport good if transport goods lies in moderation condition */
      if (moderationResult) {
        displayModerate = DEFAULT_ENUM.TRUE;
      };
      result.transport_good.dataValues.displayModerate = displayModerate;
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: QuoteMessages.TRANSPORT_GOODS_ADDED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.TRANSPORT_GOODS_ADDED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('create Single Transport Goods Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* add single transport goods detail */
  async addSingleTransportGoodsDetail(
    newGood,
    transportGoodsId,
    isQuoteExist,
    existingGoods,
    roleId,
  ) {
    try {
      let total_limit = 0;
      /* update transport goods total amount. */
      newGood.total_amount = await convertToNumber(
        newGood.total_amount
      );
      if (existingGoods.length > 0) {
        /* loop over the existing transport good details to get the new total limit for the transport good */
        for (let ele of existingGoods) {
          /* if the good coming in body consists of the id then */
          if (newGood.id == ele.dataValues.id) {
            total_limit = total_limit + newGood.total_amount;
          } else {
            /* if the good coming in body does not consists of the id means new good to be added */
            total_limit = ele.dataValues.total_amount ? total_limit + ele.dataValues.total_amount : total_limit;
          };
        };
      }
      if (!newGood.id) {
        total_limit = total_limit + newGood.total_amount
      };
      /* single insurance type calculation product wise */
      if (isQuoteExist.commission) {
        let calculationResult = {};
        let getQuoteDetailForPriceDistribution = await this.services.getQuoteDetailsForPriceDistribution({ id: isQuoteExist.id });
        getQuoteDetailForPriceDistribution.commission_percentage = isQuoteExist.commission;
        getQuoteDetailForPriceDistribution.total_limit = total_limit;
        getQuoteDetailForPriceDistribution.discount_aggravate_percentage = isQuoteExist.discount_aggravate_percentage;
        getQuoteDetailForPriceDistribution.is_discount_load = isQuoteExist.is_discount_load;
        getQuoteDetailForPriceDistribution.insurance_type_id = isQuoteExist.insurance_type_id;
        // getQuoteDetailForPriceDistribution.product_id = product_id;
        calculationResult = await this.importExportQuoteCalculation(getQuoteDetailForPriceDistribution);
        const payload = {};
        // if (calculationResult.quote_targeted_to_moderation) {
        //   if (roleId != ROLES.ADMIN && roleId != ROLES.SUB_ADMIN) {
        //     payload.is_moderate = DEFAULT_ENUM.TRUE;
        //     payload.status = QUOTE_STATUS.MODERAÇÃO;
        //     payload.display_moderation = DEFAULT_ENUM.TRUE;
        //     payload.updatedAt = new Date();
        //   } else {
        //     payload.updatedAt = new Date();
        //   };
        //   await this.services.updateQuote({ id: isQuoteExist.id }, payload);
        // } else {
        payload.standard_net_written_premium = calculationResult.net_written_premium ? calculationResult.net_written_premium : null;
        payload.standard_gross_written_premium = calculationResult.gross_written_premium ? calculationResult.gross_written_premium : null;
        payload.standard_total_insurance_cost = calculationResult.total_insurance_cost ? calculationResult.total_insurance_cost : null;
        payload.standard_discount_aggravate_amount = calculationResult.discount_aggravate_amount ? calculationResult.discount_aggravate_amount : null;
        payload.standard_total_premium = calculationResult.total_premium ? calculationResult.total_premium : null;
        await this.services.updateQuoteCalculation({ quote_id: isQuoteExist.id }, payload);
        // };
      };
      /* end */
      /* update the total limit of the transport good of that quote */
      await this.services.updateTransportGoods({ total_limit }, { quote_id: isQuoteExist.id });
      /* if good coming in body does not consist of id then create otherwise update */
      if (!newGood.id) {
        let transportGoodsDetail = await this.getTransportGoodsDetailPayload(newGood, transportGoodsId);
        await this.services.createTransportGoodDetail(transportGoodsDetail);
      } else {
        /* get payload to update transport good detail */
        const payload = await this.getTransportGoodsDetailPayload(newGood, transportGoodsId);
        await this.services.updateTransportGoodsDetail(payload, { id: newGood.id });
      };
      /* return */
      return {
        total_limit,
      };
    } catch (error) {
      logger.error('add Single Transport Goods Detail Error', error);
      throw error;
    }
  };
  /* end */

  /* create transport goods detail payload */
  async getTransportGoodsDetailPayload(good, transportGoodsId) {
    const goodDetail = await this.services.getGood({ id: good.good_id });
    return {
      transport_good_id: transportGoodsId,
      good_id: good.good_id,
      group_id: goodDetail.group ? goodDetail.group : null,
      good_group_percentage: good.good_group_percentage
        ? typeof good.good_group_percentage === 'string'
          ? parseFloat(good.good_group_percentage.split('%')[0])
          : good.good_group_percentage
        : null,
      type_of_good: good.type_of_good ? good.type_of_good : 1,
      additional_information: good.additional_information
        ? good.additional_information
        : null,
      chilled: good.chilled ? good.chilled : 0,
      frozen: good.frozen ? good.frozen : 0,
      in_bulk: good.in_bulk ? good.in_bulk : 0,
      boxes: good.boxes ? good.boxes : 0,
      container: good.container ? good.container : 0,
      valor_da_mercadoria: good.valor_da_mercadoria
        ? good.valor_da_mercadoria
        : null,
      freight: good.freight ? good.freight : null,
      expenses_percentage: good.expenses_percentage
        ? good.expenses_percentage
        : 0,
      expenses: good.expenses ? good.expenses : null,
      total_amount: good.total_amount ? good.total_amount : null,
      incoterm: good.incoterm ? good.incoterm : null,
    };
  }
  /* end */

  /*updated calculation function with type of goods risk */
  async importExportQuoteCalculation(getQuoteDetailForPriceDistribution) {
    const basicCoverages = getQuoteDetailForPriceDistribution.dataValues.coverage_id;
    const road_used = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.road_used;
    // const road_percentage = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.road_percentage;
    const maritime_used = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.maritime_used;
    //const maritime_percentage = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.maritime_percentage;
    const air_used = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.air_used;
    //const air_percentage = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.air_percentage;
    const total_limit = getQuoteDetailForPriceDistribution.total_limit;
    /* new code */
    const goodsId = getQuoteDetailForPriceDistribution?.dataValues?.transport_good?.dataValues?.transport_good_details || [];
    const processedDetails = await Promise.all(
      goodsId.map(async (ele) => {
        //const goodId = parseInt(ele.dataValues.good_id, 10);
        const goodsDetail = await this.services.getGoodsForModeration({ id: JSON.parse(ele.dataValues.good_id) });
        return goodsDetail.map(obj => obj.type_of_risk); // Extract names
      })
    );
    const flatGoodIds = processedDetails.flat() || [];
    const maxTypeOfGoodRiskId = flatGoodIds.length > 0 ? Math.max(...flatGoodIds) : null;
    /*end */
    const transpotationType = [];
    const result = {};
    let totalInsuranceRate;
    // Transportation type mapping
    if (road_used == 1) {
      transpotationType.push(TRANSPOTATION_TYPE.ROAD_USED)
    };
    if (maritime_used == 1) {
      transpotationType.push(TRANSPOTATION_TYPE.MARITIME_USED)
    }
    if (air_used == 1) {
      transpotationType.push(TRANSPOTATION_TYPE.AIR_USED)
    }
    let getImpExpAnnualData;
    if (getQuoteDetailForPriceDistribution && getQuoteDetailForPriceDistribution.insurance_rate) {
      totalInsuranceRate = getQuoteDetailForPriceDistribution.insurance_rate;
    } else {
      // Fetch ImpExpAnnual data and include transport type conditions
      getImpExpAnnualData = await this.services.getImpExpCalculation({
        coverage_id: basicCoverages,
        transpotation_type: { [Op.in]: transpotationType },
        type_of_risk: maxTypeOfGoodRiskId
      });
      if (basicCoverages == 3 || basicCoverages == 1 || basicCoverages == 2) {
        result.deductible = getImpExpAnnualData && getImpExpAnnualData[0].deductible;
      };
      if (getImpExpAnnualData && getImpExpAnnualData.length > 0) {
        if (getQuoteDetailForPriceDistribution && getQuoteDetailForPriceDistribution.insurance_type_id == INSURANCE_TYPE_ID.SINGLE) {
          const { coverage_id, insurance_rate_especifica } = getImpExpAnnualData[0];
          totalInsuranceRate = insurance_rate_especifica;
          // console.log('insurance_rate_ifff', totalInsuranceRate);
        } else {
          // const coverageGrossRates = [];
          const { coverage_id, insurance_rate_anual } = getImpExpAnnualData[0];
          // const coverage_id = getImpExpAnnualData[0].coverage_id;
          // const gross_rate = getImpExpAnnualData[0].insurance_rate_anual;
          // console.log('gross_rate12121', gross_rate);
          totalInsuranceRate = insurance_rate_anual;
        }
        // return
        /* for now we need to comment this code as discuss with ashwani sir */
        // Perform calculations
        // const roadCalculation = roadData? (get6Decimal((roadData.insurance_rate * road_percentage) / 100))
        //   : 0;
        // const maritimeCalculation = maritimeData? (get6Decimal((maritimeData.insurance_rate * maritime_percentage) / 100))
        //   : 0;
        // const airCalculation = airData? (get6Decimal((airData.insurance_rate * air_percentage) / 100))
        //   : 0;
        // // Sum all the calculated values
        // totalInsuranceRate =
        //   parseFloat(roadCalculation) +
        //   parseFloat(maritimeCalculation) +
        //   parseFloat(airCalculation);
        /* end */
      }
      // console.log('net_insurance_rate121212', totalInsuranceRate);
    }
    result.net_insurance_rate = totalInsuranceRate;
    /* calculate net insurance cost with commission/ gross written premium  */
    let grossWrittenPremium = get6Decimal(total_limit * (totalInsuranceRate / 100));
    result.gross_written_premium = grossWrittenPremium;
    /* Apply the minimum premium logic */
    const minimumPremiumValues = {
      [TRANSPOTATION_TYPE.ROAD_USED]: 100,
      [TRANSPOTATION_TYPE.MARITIME_USED]: 100,
      [TRANSPOTATION_TYPE.AIR_USED]: 50,
    };
    const applicableMinimumPremium = transpotationType.map(type => minimumPremiumValues[type] || 0);
    const maxMinimumPremium = Math.max(...applicableMinimumPremium);
    // const maxMinimumPremium = getImpExpAnnualData && getImpExpAnnualData.length > 0 ? getImpExpAnnualData[0].mindep : 0;
    if (grossWrittenPremium < maxMinimumPremium) {
      result.gross_written_premium = maxMinimumPremium;
      grossWrittenPremium = maxMinimumPremium;
    }
    result.minimum_premium = maxMinimumPremium;
    /* calculate net insurance cost / net written premium */
    const net_written_premium = (grossWrittenPremium - (grossWrittenPremium * get6Decimal(getQuoteDetailForPriceDistribution.commission_percentage / 100)));
    //console.log('net_written_premium111', net_written_premium);
    result.net_written_premium = get6Decimal(net_written_premium);
    /* calculate commission value */
    result.commission_value = get2Decimal(grossWrittenPremium - net_written_premium);
    // result.gross_written_premium = grossWrittenPremium;
    /* get the discount aggravate means if the condition of the quote is being better or worse if better then apply discount in positively else in negative way  */
    let discountAggravateAmount = getQuoteDetailForPriceDistribution.discount_aggravate_percentage ? (grossWrittenPremium * getQuoteDetailForPriceDistribution.discount_aggravate_percentage) / 100 : 0;
    discountAggravateAmount = get2Decimal(discountAggravateAmount);
    result.discount_aggravate_amount = discountAggravateAmount;
    /* calculate the total premium / total nicwc of the quote */
    result.total_premium = getQuoteDetailForPriceDistribution.is_discount_load == 1 ? get2Decimal(grossWrittenPremium + discountAggravateAmount) : get2Decimal(grossWrittenPremium - discountAggravateAmount);
    result.total_insurance_cost = result.total_premium;
    let taxCalculation;
    if (getQuoteDetailForPriceDistribution.insurance_type_id == 1) {
      if (getQuoteDetailForPriceDistribution && getQuoteDetailForPriceDistribution.is_gross_written_premium_change == 1) {
        taxCalculation = await this.calculateTaxes(getQuoteDetailForPriceDistribution.total_premium);
        result.total_premium = getQuoteDetailForPriceDistribution.total_premium;
      } else {
        taxCalculation = await this.calculateTaxes(result.total_premium);
        result.total_premium = result.total_premium;
      }
      result.total_insurance_cost = taxCalculation.total_amount;
      result.tax_scvs = taxCalculation.tax_scvs;
      result.tax_ssc = taxCalculation.tax_ssc;
      result.tax_emission = taxCalculation.tax_emmssion;
      result.tax_iva = taxCalculation.tax_iva;
      result.sub_total = taxCalculation.subtotal;
    }
    return result;
  }

  /*old calculation function  */
  async importExportQuoteCalculationV1(getQuoteDetailForPriceDistribution) {
    const basicCoverages = getQuoteDetailForPriceDistribution.dataValues.coverage_id;
    const road_used = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.road_used;
    const road_percentage = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.road_percentage;
    const maritime_used = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.maritime_used;
    const maritime_percentage = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.maritime_percentage;
    const air_used = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.air_used;
    const air_percentage = getQuoteDetailForPriceDistribution.dataValues.quote_shipment.dataValues.air_percentage;
    const total_limit = getQuoteDetailForPriceDistribution.total_limit;
    const transpotationType = [];
    const result = {};
    let totalInsuranceRate;
    // Transportation type mapping
    if (road_used == 1) {
      transpotationType.push(TRANSPOTATION_TYPE.ROAD_USED)
    };
    if (maritime_used == 1) {
      transpotationType.push(TRANSPOTATION_TYPE.MARITIME_USED)
    }
    if (air_used == 1) {
      transpotationType.push(TRANSPOTATION_TYPE.AIR_USED)
    }
    //let getImpExpAnnualData;
    if (getQuoteDetailForPriceDistribution && getQuoteDetailForPriceDistribution.insurance_rate) {
      totalInsuranceRate = getQuoteDetailForPriceDistribution.insurance_rate;
    } else {
      // Fetch ImpExpAnnual data and include transport type conditions
      const getImpExpAnnualData = await this.services.getImpExpCalculation({
        coverage_id: basicCoverages,
        transpotation_type: { [Op.in]: transpotationType },
      });
      // console.log('getImpExpAnnualData12121121', getImpExpAnnualData);
      if (basicCoverages == 3 || basicCoverages == 1 || basicCoverages == 2) {
        result.deductible = getImpExpAnnualData[0].deductible;
      };
      if (getImpExpAnnualData && getImpExpAnnualData.length > 0) {
        //Find the insurance rate for each transportation type
        const roadData = getImpExpAnnualData.find(item => item.transpotation_type === TRANSPOTATION_TYPE.ROAD_USED);
        const maritimeData = getImpExpAnnualData.find(item => item.transpotation_type === TRANSPOTATION_TYPE.MARITIME_USED);
        const airData = getImpExpAnnualData.find(item => item.transpotation_type === TRANSPOTATION_TYPE.AIR_USED);
        /* new code */
        let maxCalculation;
        if (getQuoteDetailForPriceDistribution && getQuoteDetailForPriceDistribution.insurance_type_id == INSURANCE_TYPE_ID.SINGLE) {
          const roadCalculation = roadData && roadData.insurance_rate_especifica ? roadData.insurance_rate_especifica : 0;
          const maritimeCalculation = maritimeData && maritimeData.insurance_rate_especifica ? maritimeData.insurance_rate_especifica : 0;
          const airCalculation = airData && airData.insurance_rate_especifica ? airData.insurance_rate_especifica : 0;
          maxCalculation = Math.max(roadCalculation, maritimeCalculation, airCalculation);
          totalInsuranceRate = maxCalculation;
          // console.log('insurance_rate_ifff', totalInsuranceRate);
        } else {
          const roadCalculation = roadData && roadData.insurance_rate_anual ? roadData.insurance_rate_anual : 0;
          const maritimeCalculation = maritimeData && maritimeData.insurance_rate_anual ? maritimeData.insurance_rate_anual : 0;
          const airCalculation = airData && airData.insurance_rate_anual ? airData.insurance_rate_anual : 0;
          maxCalculation = Math.max(roadCalculation, maritimeCalculation, airCalculation);
          totalInsuranceRate = maxCalculation
          //  console.log('insurance_rate7878787_elseee', totalInsuranceRate);
        }
        /* end */
        // return
        /* for now we need to comment this code as discuss with ashwani sir */
        // Perform calculations
        // const roadCalculation = roadData ? (get6Decimal((roadData.insurance_rate * road_percentage) / 100))
        //   : 0;
        // const maritimeCalculation = maritimeData ? (get6Decimal((maritimeData.insurance_rate * maritime_percentage) / 100))
        //   : 0;
        // const airCalculation = airData ? (get6Decimal((airData.insurance_rate * air_percentage) / 100))
        //   : 0;
        // // Sum all the calculated values
        // totalInsuranceRate =
        //   parseFloat(roadCalculation) +
        //   parseFloat(maritimeCalculation) +
        //   parseFloat(airCalculation);
        /* end */
      }
      // console.log('net_insurance_rate121212', totalInsuranceRate);
    }
    result.net_insurance_rate = totalInsuranceRate;
    /* calculate net insurance cost with commission/ gross written premium  */
    let grossWrittenPremium = get6Decimal(total_limit * (totalInsuranceRate / 100));
    result.gross_written_premium = grossWrittenPremium;
    /* Apply the minimum premium logic */
    const minimumPremiumValues = {
      [TRANSPOTATION_TYPE.ROAD_USED]: 100,
      [TRANSPOTATION_TYPE.MARITIME_USED]: 100,
      [TRANSPOTATION_TYPE.AIR_USED]: 50,
    };
    const applicableMinimumPremium = transpotationType.map(type => minimumPremiumValues[type] || 0);
    const maxMinimumPremium = Math.max(...applicableMinimumPremium);
    //const maxMinimumPremium = getImpExpAnnualData[0].mindep;
    if (grossWrittenPremium < maxMinimumPremium) {
      result.gross_written_premium = maxMinimumPremium;
      grossWrittenPremium = maxMinimumPremium;
    }
    result.minimum_premium = maxMinimumPremium;
    /* calculate net insurance cost / net written premium */
    const net_written_premium = (grossWrittenPremium - (grossWrittenPremium * get6Decimal(getQuoteDetailForPriceDistribution.commission_percentage / 100)));
    //console.log('net_written_premium111', net_written_premium);
    result.net_written_premium = get6Decimal(net_written_premium);
    /* calculate commission value */
    result.commission_value = get2Decimal(grossWrittenPremium - net_written_premium);
    // result.gross_written_premium = grossWrittenPremium;
    /* get the discount aggravate means if the condition of the quote is being better or worse if better then apply discount in positively else in negative way  */
    let discountAggravateAmount = getQuoteDetailForPriceDistribution.discount_aggravate_percentage ? (grossWrittenPremium * getQuoteDetailForPriceDistribution.discount_aggravate_percentage) / 100 : 0;
    discountAggravateAmount = get2Decimal(discountAggravateAmount);
    result.discount_aggravate_amount = discountAggravateAmount;
    /* calculate the total premium / total nicwc of the quote */
    result.total_premium = getQuoteDetailForPriceDistribution.is_discount_load == 1 ? get2Decimal(grossWrittenPremium + discountAggravateAmount) : get2Decimal(grossWrittenPremium - discountAggravateAmount);
    result.total_insurance_cost = result.total_premium;
    let taxCalculation;
    if (getQuoteDetailForPriceDistribution.insurance_type_id == 1) {
      if (getQuoteDetailForPriceDistribution && getQuoteDetailForPriceDistribution.is_gross_written_premium_change == 1) {
        taxCalculation = await this.calculateTaxes(getQuoteDetailForPriceDistribution.total_premium);
        result.total_premium = getQuoteDetailForPriceDistribution.total_premium;
      } else {
        taxCalculation = await this.calculateTaxes(result.total_premium);
        result.total_premium = result.total_premium;
      }
      result.total_insurance_cost = taxCalculation.total_amount;
      result.tax_scvs = taxCalculation.tax_scvs;
      result.tax_ssc = taxCalculation.tax_ssc;
      result.tax_emission = taxCalculation.tax_emmssion;
      result.tax_iva = taxCalculation.tax_iva;
      result.sub_total = taxCalculation.subtotal;
    }
    return result;
  }
  /* end */

  /* calculate insurance rate */
  // calculateInsuranceRate(
  //   calculationPayload
  // ) {
  //   try {
  //     /* get risk rate */
  //     const risk_rate = (calculationPayload.approximate_value / calculationPayload.total_limit) * 100;
  //     const insurance_rate = risk_rate > calculationPayload.goods_rate ? risk_rate : calculationPayload.goods_rate;
  //     let net_insurance_rate = insurance_rate + (insurance_rate * 6) / 100;
  //     net_insurance_rate += (net_insurance_rate * 15) / 100;
  //     net_insurance_rate += (net_insurance_rate * 15) / 100;
  //     if (net_insurance_rate < 0.06) {
  //       net_insurance_rate = 0.06;
  //     };
  //     if (calculationPayload.is_clause_no_exists) {
  //       net_insurance_rate += 0.008
  //     };
  //     return { insurance_rate: get6Decimal(net_insurance_rate) };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  /* end */

  /* update moderation status of the quote for single insurance type */
  async checkQuoteModerationAsPerGoodsForSingleInsuranceType(
    totalLimit,
    transportGood
  ) {
    try {
      /* store the new total limit of the transport good of the quote */
      let totalAmount = totalLimit;
      /* get latest transport good details */
      const transportGoodDetails = await this.services.getTransportGoodDetails({ transport_good_id: transportGood.id });
      const goodIds = [];
      if (transportGoodDetails.length > 0) {
        for (const ele of transportGoodDetails) {
          goodIds.push(ele.good_id)
        }
        const getModeratedGoods = await this.services.getGood({ id: goodIds, is_moderate: DEFAULT_ENUM.TRUE });
        if (getModeratedGoods) {
          return true;
        }
        /* if the good group is b and the total amount after conversion is greater than 1000000 usd */
        if (transportGoodDetails.some(obj => obj.expenses_percentage > 10) || (totalAmount && totalAmount > 1000000)) {
          return true;
        };
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }
  /* end */

  /* get higher risk good class */
  async getSingleHigherRiskGoodClass(transportGoodDetails) {
    try {
      const result = {};
      if (
        transportGoodDetails.find(
          (ele) => ele.group_id === 'B'
        )
      ) {
        result.display_moderation = 1;
        result.higher_risk_good_class = 'B';
      } else if (
        transportGoodDetails.find(
          (ele) => ele.group_id === 'A'
        )
      ) {
        result.higher_risk_good_class = 'A';
      } else {
        let list = [];
        transportGoodDetails.every((e) =>
          list.push(e.group_id)
        );
        result.higher_risk_good_class = Math.max
          .apply(null, list)
          .toString();
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  /* end */

  /* get all quote detail */
  async getQuoteDetail(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    try {
      const { user } = req;
      const selectedGoodIds = [];
      const { uuid } = req.params;
      /* get quote detail */
      const result = await this.services.getAllQuoteDetail({ uuid });
      // console.log('result21212', result?.dataValues?.quote_company?.dataValues?.company_address?.dataValues?.ecuador_state?.name ?? 'N/A');
      // return
      /* code for securing the quote detail page URL */
      // if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN && user.role_id == ROLES.BROKER && user.role_id == ROLES.SUB_BROKER) {
      //   if (user.id != result.user_id) {
      //     return res.send(errorResponse(CommonMessages.UNAUTHORIZED_USER, null, RESPONSE_CODES.BAD_REQUEST));
      //   }
      // }
      if (!result) {
        return res.send(errorResponse(
          QuoteMessages.QUOTE_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      }
      /* return good names corresponding to the quote transport good details  */
      if (result && result.transport_good && result.transport_good.transport_good_details) {
        const processedDetails = result.transport_good.transport_good_details.map(async (ele) => {
          const goodsDetail = await this.services.getGoodsForModeration({ id: JSON.parse(ele.good_id) });
          const goodNames = goodsDetail.map(obj => obj.name);
          ele.dataValues.good_name = goodNames;
          if (result.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL) {
            selectedGoodIds.push(...JSON.parse(ele.good_id));
          }
        });
        await Promise.all(processedDetails);
      }
      if (result.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL) {
        const notSelectedGoods = await this.getNotSelectedGoods(selectedGoodIds);
        result.dataValues.not_selected_goods = notSelectedGoods;
      };
      return res
        .send(
          successResponse(QuoteMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('get Quote Detail Error, ', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* get not selected goods of the quote */
  async getNotSelectedGoods(selectedGoodIds) {
    try {
      /* get not selected goods */
      const notSelectedGoods = await this.services.getGoods({ id: { [Op.notIn]: selectedGoodIds }, is_active: IS_ACTIVE.TRUE });
      let result = [];
      /* add the not selected goods of group 1 if available */
      let filterData = notSelectedGoods.filter((ele) => ele.group == 1);
      if (filterData.length > 0) {
        result.push({
          id: filterData[0].group,
          name: filterData.map((ele) => ele.name).join(','),
          group: filterData[0].group,
        });
      };
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  /* end */

  /* add single shipment detail */
  async addSingleShipmentDetail(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      /* destructure the body */
      const {
        quote_id,
        road_used,
        road_percentage,
        maritime_used,
        maritime_percentage,
        air_used,
        air_percentage,
        complementary_land_route,
        shipping_company,
        landing_city,
        landing_place,
        destination_city,
        destination_place,
        boarding_document_number,
        boarding_document_type,
        route,
        documents,
      } = req.body;
      /* get quote detail */
      const quoteDetail = await this.services.getQuoteDetailForAddShipmentDetail({ id: quote_id });
      /* return if the quote does not found */
      if (!quoteDetail) {
        return res.send(errorResponse(
          QuoteMessages.QUOTE_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      if (quoteDetail.quote_calculation) {
        /* standard calculation */
        quoteDetail.commission = quoteDetail.quote_calculation.standard_commission_percentage;
        quoteDetail.discount = quoteDetail.quote_calculation.standard_deductible && quoteDetail.quote_calculation.standard_deductible.discount != null ? quoteDetail.quote_calculation.standard_deductible.discount : null;
        quoteDetail.is_discount_load = quoteDetail.quote_calculation.standard_is_discount_load;
        quoteDetail.discount_aggravate_percentage = quoteDetail.quote_calculation.standard_discount_aggravate_percentage;
        quoteDetail.insurance_rate = quoteDetail.quote_calculation.standard_insurance_rate;
      };
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.ADD_SINGLE_SHIPMENT_DETAIL,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      let quoteShipmentId;
      const isQuoteShipmentExists = await this.services.getQuoteShipmentExistence({ quote_id });
      /* create shipment */
      const quoteShipmentPayload = {
        road_used,
        road_percentage: road_percentage,
        maritime_used,
        maritime_percentage: maritime_percentage,
        air_used,
        air_percentage: air_percentage
      };
      /* if quote shipment does not exist */
      if (!isQuoteShipmentExists) {
        quoteShipmentPayload.quote_id = quote_id;
        const createQuoteShipment = await this.services.createQuoteShipment(quoteShipmentPayload);
        quoteShipmentId = createQuoteShipment.id;
      } else {
        /* update quote shipment */
        await this.services.updateQuoteShipment(quoteShipmentPayload, { quote_id });
        quoteShipmentId = isQuoteShipmentExists.id;
      };
      /* create or update the single shipment detail */
      const singleShipmentDetailPayload = {
        boarding_document_number,
        boarding_document_type,
        landing_city,
        landing_place,
        destination_city,
        destination_place,
        shipping_company,
        complementary_land_route,
      };
      await this.createUpdateSingleShipmentDetail(singleShipmentDetailPayload, quoteShipmentId);
      /* create or update the single shipment route detail */
      await this.createUpdateSingleShipmentRouteDetail(route, quoteShipmentId);
      /* if new shipment documents are to be added */
      if (documents && documents.length > 0) {
        const documentsArr = [];
        for (const ele of documents) {
          ele.quote_shipment_id = quoteShipmentId;
          documentsArr.push(ele);
        };
        await this.services.bulkCreateShipmentDocuments(documentsArr);
      };
      /* get quote data for checking whether quote will go to moderation or not on the basis of the routes selected */
      const quoteDataForCheckingRouteModeration = await this.services.getQuoteDataForCheckingRouteModeration({ id: quote_id });
      /* get the quote commission as per the calculation type standard or personalized */
      const quoteCommission = quoteDataForCheckingRouteModeration.quote_calculation ? quoteDataForCheckingRouteModeration.is_calculation_personalized == 1 ? quoteDataForCheckingRouteModeration.quote_calculation.personalized_commission_percentage : quoteDataForCheckingRouteModeration.quote_calculation.standard_commission_percentage : 0;
      if (quoteDataForCheckingRouteModeration && quoteCommission && (quoteDataForCheckingRouteModeration.product_id == PRODUCT_ID.IMP || quoteDataForCheckingRouteModeration.product_id == PRODUCT_ID.EXP)) {
        // const country = quoteDataForCheckingRouteModeration.product_id == PRODUCT_ID.IMP ? quoteDataForCheckingRouteModeration.quote_shipment.shipment_route_details[0].source_detail : quoteDataForCheckingRouteModeration.quote_shipment.shipment_route_details[0].destiny_detail;
        /* if the country selected is moderated then quote needs to be moderated */
        // if (country.is_moderate) {
        //   const payload = user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN ? {
        //     status: QUOTE_STATUS.MODERAÇÃO,
        //     is_moderate: IS_MODERATE.TRUE,
        //     display_moderation: DEFAULT_ENUM.TRUE,
        //   } :
        //     { updatedAt: new Date() };
        //   /* update quote */
        //   await this.services.updateQuote({ id: quote_id }, payload);
        // };
      };
      /* new code */
      if (quoteDetail.commission) {
        let calculationResult = {};
        let getQuoteDetailForPriceDistribution = await this.services.getQuoteDetailsForPriceDistribution({ id: quoteDetail.id });
        getQuoteDetailForPriceDistribution.commission_percentage = quoteDetail.commission;
        getQuoteDetailForPriceDistribution.total_limit = quoteDetail.transport_good.total_limit;
        getQuoteDetailForPriceDistribution.discount_aggravate_percentage = quoteDetail.discount_aggravate_percentage;
        getQuoteDetailForPriceDistribution.is_discount_load = quoteDetail.is_discount_load;
        getQuoteDetailForPriceDistribution.insurance_rate = quoteDetail.insurance_rate;
        getQuoteDetailForPriceDistribution.insurance_type_id = quoteDetail.insurance_type_id;

        // getQuoteDetailForPriceDistribution.product_id = product_id;
        calculationResult = await this.importExportQuoteCalculation(getQuoteDetailForPriceDistribution);
        const payload = {};
        /* if quote is targeted to moderation as per the calculation and the admin or sub admin is not logged in */
        // if (calculationResult.quote_targeted_to_moderation) {
        //   if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN) {
        //     payload.is_moderate = DEFAULT_ENUM.TRUE;
        //     payload.status = QUOTE_STATUS.MODERAÇÃO;
        //     payload.display_moderation = DEFAULT_ENUM.TRUE;
        //     payload.updatedAt = new Date();
        //   } else {
        //     payload.updatedAt = new Date();
        //   };
        //   await this.services.updateQuote({ id: quoteDetail.id }, payload);
        // } else {
        payload.standard_net_written_premium = calculationResult.net_written_premium ? calculationResult.net_written_premium : null;
        payload.standard_gross_written_premium = calculationResult.gross_written_premium ? calculationResult.gross_written_premium : null;
        payload.standard_total_insurance_cost = calculationResult.total_insurance_cost ? calculationResult.total_insurance_cost : null;
        payload.standard_discount_aggravate_amount = calculationResult.discount_aggravate_amount ? calculationResult.discount_aggravate_amount : null;
        payload.standard_total_premium = calculationResult.total_premium ? calculationResult.total_premium : null;
        payload.standard_insurance_rate = calculationResult.net_insurance_rate ? calculationResult.net_insurance_rate : null;
        // };
        await this.services.updateQuoteCalculation({ quote_id: quoteDetail.id }, payload);
      }
      /* end */
      /* get the updated quote detail */
      const result = await this.services.getAllQuoteDetail({ id: quote_id });
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: QuoteMessages.SHIPMENT_DETAIL_ADDED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.SHIPMENT_DETAIL_ADDED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('add Single Shipment Detail Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* create or update single shipment route detail */
  async createUpdateSingleShipmentDetail(
    singleShipmentDetailPayload,
    quoteShipmentId
  ) {
    try {
      const isSingleShipmentDetailExists = await this.services.getSingleShipmentDetail({ quote_shipment_id: quoteShipmentId });
      if (!isSingleShipmentDetailExists) {
        singleShipmentDetailPayload.quote_shipment_id = quoteShipmentId;
        await this.services.createSingleShipmentDetail(singleShipmentDetailPayload);
      } else {
        await this.services.updateSingleShipmentDetail(singleShipmentDetailPayload, { quote_shipment_id: quoteShipmentId });
      }
      return;
    } catch (error) {
      throw error;
    }
  }
  /* end */

  /* create or update single shipment route detail */
  async createUpdateSingleShipmentRouteDetail(
    route,
    quoteShipmentId
  ) {
    try {
      /* if shipment route detail does not exist else update it */
      if (!route.id) {
        route.quote_shipment_id = quoteShipmentId;
        await this.services.createShipmentRouteDetail(route)
      } else {
        await this.services.updateShipmentRouteDetail(route, { id: route.id })
      };
      return;
    } catch (error) {
      throw error;
    }
  }
  /* end */

  /* delete quote document */
  async deleteQuoteDocument(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      const { document_id, document_type } = req.body;
      let model;
      /* get model */
      if (document_type == DOCUMENT_TYPE.SHIPMENT) {
        model = this.Models.ShipmentDocuments;
      } else if (document_type == DOCUMENT_TYPE.QUOTE) {
        model = this.Models.QuoteDocuments;
      } else if (document_type == DOCUMENT_TYPE.RISK) {
        model = this.Models.QuoteRiskDocuments;
      } else if (document_type == DOCUMENT_TYPE.QUOTE_CLAIM) {
        model = this.Models.QuoteClaimDocuments;
      } else if (document_type == DOCUMENT_TYPE.APPLICATION) {
        model = this.Models.Application_documents;
      }
      /* return if model not found */
      if (!model) {
        return res.send(errorResponse(
          QuoteMessages.DOCUMENT_TYPE_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      /* check document with the given id exists or not  */
      const isDocumentExists = await this.services.getDocumentExistence(model, { id: document_id });
      /* return if document does not exist */
      if (!isDocumentExists) {
        return res.send(errorResponse(
          QuoteMessages.DOCUMENT_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: isDocumentExists.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.DELETE_QUOTE_DOCUMENT,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* delete document from server */
      try {
        /* check if file exists on azure server */
        await getFileFromServer(isDocumentExists.path);
        /* delete file from the azure server */
        await deleteFileFromServer(isDocumentExists.path);
      } catch (error) {
        console.log('error :>> ', error);
      };
      /* delete document from database */
      await this.services.deleteDocument(model, { id: document_id });
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: null,
          message: QuoteMessages.DOCUMENT_DELETED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(
        successResponse(QuoteMessages.DOCUMENT_DELETED_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('delete Quote Document Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* create coverages for single flow */
  async createSingleCoverages(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, body, ip_address } = req;
      /* destructuring */
      const {
        quote_id,
        basic_coverages,
        additional_coverages,
      } = body;
      /* check if the quote exists or not and get the required data of quote for creating coverages */
      const quoteDetail = await this.services.getQuoteDetailToCreateSingleCoverages({ id: quote_id });
      /* return if quote does not exist */
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
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.CREATE_SINGLE_COVERAGES,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      if (quoteDetail.quote_calculation) {
        /* standard calculation */
        quoteDetail.commission = quoteDetail.quote_calculation.standard_commission_percentage;
        quoteDetail.discount = quoteDetail.quote_calculation.standard_deductible && quoteDetail.quote_calculation.standard_deductible.discount != null ? quoteDetail.quote_calculation.standard_deductible.discount : null;
        quoteDetail.is_discount_load = quoteDetail.quote_calculation.standard_is_discount_load;
        quoteDetail.discount_aggravate_percentage = quoteDetail.quote_calculation.standard_discount_aggravate_percentage;
        quoteDetail.insurance_rate = quoteDetail.quote_calculation.standard_insurance_rate;
      };
      /* to add the quote coverages, need to compare the quote coverages given in body and stored in database */
      /* add quote basic coverages if available */
      if (basic_coverages.length > 0) {
        const newQuoteBasicCoveragesToBeAdded = [];
        /* get existing quote basic coverages */
        const isQuoteBasicCoveragesExists = await this.services.getQuoteBasicCoverages({ quote_id });
        /* if quote basic coverages exists */
        if (isQuoteBasicCoveragesExists.length > 0) {
          /* get the coverage ids of the existing quote basic coverages */
          const existingQuoteBasicCoverageIds = isQuoteBasicCoveragesExists.map(ele => ele.coverage_id);
          /* compare and get the new coverage ids that need to be added */
          const newBasicCoverageIds = basic_coverages.filter(id => !existingQuoteBasicCoverageIds.includes(id));
          /* if new quote basic coverage ids exists */
          if (newBasicCoverageIds.length > 0) {
            /* create the payload to add the new quote basic coverages */
            newBasicCoverageIds.map(ele => newQuoteBasicCoveragesToBeAdded.push({ quote_id, coverage_id: ele }));
          };
          /* compare and get the old coverage ids that are now to be removed but exists in database */
          const oldRemovedBasicCoverageIds = existingQuoteBasicCoverageIds.filter(id => !basic_coverages.includes(id));
          /* if basic coverages to be removed exists */
          if (oldRemovedBasicCoverageIds.length > 0) {
            /* delete basic coverages that are not included in body but exists in database */
            await this.services.deleteQuoteBasicCoverages({ quote_id, coverage_id: oldRemovedBasicCoverageIds });
          };
        } else {
          /* if basic coverages does not exists in the database means all the basic coverages in body need to be added so creating payload */
          basic_coverages.map(ele => newQuoteBasicCoveragesToBeAdded.push({ quote_id, coverage_id: ele }));
        };
        /* bulk create new quote basic coverages */
        if (newQuoteBasicCoveragesToBeAdded.length > 0) {
          await this.services.bulkCreateQuoteBasicCoverages(newQuoteBasicCoveragesToBeAdded);
        };
      } else {
        /* if no basic coverages are given means need to remove the existing */
        await this.services.deleteQuoteBasicCoverages({ quote_id });
      };
      /* add quote additional coverages if available */
      if (additional_coverages.length > 0) {
        const newQuoteAdditionalCoveragesToBeAdded = [];
        /* check if the quote additional coverages already exists */
        const isQuoteAdditionalCoveragesExists = await this.services.getQuoteAdditionalCoverages({ quote_id });
        /* if quote additional coverages already exists in database */
        if (isQuoteAdditionalCoveragesExists.length > 0) {
          /* get the existing quote additional coverage ids */
          const existingQuoteAdditionalCoverageIds = isQuoteAdditionalCoveragesExists.map(ele => ele.coverage_id);
          /* compare and get which new additional coverages are given to be added */
          const newAdditionalCoverageIds = additional_coverages.filter(id => !existingQuoteAdditionalCoverageIds.includes(id));
          /* if getting quote additional coverages to be added */
          if (newAdditionalCoverageIds.length > 0) {
            /* get payload of the new quote additional coverages that are to be added */
            newAdditionalCoverageIds.map(ele => newQuoteAdditionalCoveragesToBeAdded.push({ quote_id, coverage_id: ele }));
          };
          /* compare and get which quote additional coverages are to be removed */
          const oldRemovedAdditionalCoverageIds = existingQuoteAdditionalCoverageIds.filter(id => !additional_coverages.includes(id));
          /* if quote additional coverages to be removed exists */
          if (oldRemovedAdditionalCoverageIds.length > 0) {
            /* remove quote additional coverages */
            await this.services.deleteQuoteAdditionalCoverages({ quote_id, coverage_id: oldRemovedAdditionalCoverageIds });
          };
        } else {
          /* if quote additional coverages does not exist exists in database  */
          additional_coverages.map(ele => newQuoteAdditionalCoveragesToBeAdded.push({ quote_id, coverage_id: ele }));
        };
        /* bulk create quote additional coverages */
        if (newQuoteAdditionalCoveragesToBeAdded.length > 0) {
          await this.services.bulkCreateQuoteAdditionalCoverages(newQuoteAdditionalCoveragesToBeAdded);
        };
      } else {
        /* if additional coverages are not given means need to remove the existing */
        await this.services.deleteQuoteAdditionalCoverages({ quote_id });
      };
      /* single insurance type calculation product wise */
      if (quoteDetail.commission) {
        let calculationResult = {};
        let getQuoteDetailForPriceDistribution = await this.services.getQuoteDetailsForPriceDistribution({ id: quoteDetail.id });
        getQuoteDetailForPriceDistribution.commission_percentage = quoteDetail.commission;
        getQuoteDetailForPriceDistribution.total_limit = quoteDetail.transport_good.total_limit;
        getQuoteDetailForPriceDistribution.discount_aggravate_percentage = quoteDetail.discount_aggravate_percentage;
        getQuoteDetailForPriceDistribution.is_discount_load = quoteDetail.is_discount_load;
        getQuoteDetailForPriceDistribution.insurance_rate = quoteDetail.insurance_rate;
        getQuoteDetailForPriceDistribution.insurance_type_id = quoteDetail.insurance_type_id;
        // getQuoteDetailForPriceDistribution.product_id = product_id;
        calculationResult = await this.importExportQuoteCalculation(getQuoteDetailForPriceDistribution);
        const payload = {};
        payload.standard_net_written_premium = calculationResult.net_written_premium ? calculationResult.net_written_premium : null;
        payload.standard_gross_written_premium = calculationResult.gross_written_premium ? calculationResult.gross_written_premium : null;
        payload.standard_total_insurance_cost = calculationResult.total_insurance_cost ? calculationResult.total_insurance_cost : null;
        payload.standard_discount_aggravate_amount = calculationResult.discount_aggravate_amount ? calculationResult.discount_aggravate_amount : null;
        payload.standard_total_premium = calculationResult.total_premium ? calculationResult.total_premium : null;
        payload.standard_insurance_rate = calculationResult.net_insurance_rate ? calculationResult.net_insurance_rate : null;
        await this.services.updateQuoteCalculation({ quote_id: quoteDetail.id }, payload);
      }
      /* end */
      /* ========================================all moderation checks for the quote ========================================================= */
      // await this.checkAllModerationConditionsForTheQuoteNew(quoteDetail.id, user, /*basic_coverages, additional_coverages,*/ QuoteMessages);
      /* get quote moderation detail for the response */
      const result = await this.services.getQuoteDetailAfterAddingSingleCoverages({ id: quote_id });
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: QuoteMessages.COVERAGES_ADDED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.COVERAGES_ADDED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('create Single Coverages Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* delete good for flow one */
  async deleteTransportGoodDetail(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, body, ip_address } = req;
      const { transport_good_detail_id, quote_id } = body;
      const quoteDetail = await this.services.getQuoteExistenceToDeleteGood({ id: quote_id });
      /* return if quote does not exist */
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
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.DELETE_TRANSPORT_GOOD_DETAIL,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      /* check if transport good detail exists or not */
      const transportGoodDetail = await this.services.getTransportGoodDetailToDeleteGood({ id: transport_good_detail_id });
      /* return if quote does not exist */
      if (!transportGoodDetail) {
        return res.send(errorResponse(
          QuoteMessages.TRANSPORT_GOOD_DETAIL_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      const transportGood = await this.services.getTransportGoodToDeleteGood({ id: transportGoodDetail.transport_good_id });
      const totalLimit = Math.abs(
        transportGood.total_limit - transportGoodDetail.total_amount
      );
      await this.services.updateTransportGoods({ total_limit: totalLimit }, { id: transportGoodDetail.transport_good_id });
      if (quoteDetail.quote_calculation) {
        /* standard calculation */
        quoteDetail.commission = quoteDetail.quote_calculation.standard_commission_percentage;
        quoteDetail.discount = quoteDetail.quote_calculation.standard_deductible && quoteDetail.quote_calculation.standard_deductible.discount != null ? quoteDetail.quote_calculation.standard_deductible.discount : null;
        quoteDetail.is_discount_load = quoteDetail.quote_calculation.standard_is_discount_load;
        quoteDetail.discount_aggravate_percentage = quoteDetail.quote_calculation.standard_discount_aggravate_percentage;
      };
      /* single insurance type calculation product wise */
      if (quoteDetail.commission) {
        let calculationResult = {};
        let getQuoteDetailForPriceDistribution = await this.services.getQuoteDetailsForPriceDistribution({ id: quoteDetail.id });
        /* payload for quote calculations */
        getQuoteDetailForPriceDistribution.commission_percentage = quoteDetail.commission;
        getQuoteDetailForPriceDistribution.total_limit = transportGood.total_limit;
        getQuoteDetailForPriceDistribution.discount_aggravate_percentage = quoteDetail.discount_aggravate_percentage;
        getQuoteDetailForPriceDistribution.is_discount_load = quoteDetail.is_discount_load;
        getQuoteDetailForPriceDistribution.insurance_type_id = quoteDetail.insurance_type_id;
        // getQuoteDetailForPriceDistribution.product_id = product_id;
        calculationResult = await this.importExportQuoteCalculation(getQuoteDetailForPriceDistribution);
        const payload = {};
        /* payload for update quote calculations */
        payload.standard_net_written_premium = calculationResult.net_written_premium ? calculationResult.net_written_premium : null;
        payload.standard_gross_written_premium = calculationResult.gross_written_premium ? calculationResult.gross_written_premium : null;
        payload.standard_total_insurance_cost = calculationResult.total_insurance_cost ? calculationResult.total_insurance_cost : null;
        payload.standard_discount_aggravate_amount = calculationResult.discount_aggravate_amount ? calculationResult.discount_aggravate_amount : null;
        payload.standard_total_premium = calculationResult.total_premium ? calculationResult.total_premium : null;
        await this.services.updateQuoteCalculation({ quote_id: quoteDetail.id }, payload);
      };
      /* end */
      /* delete transport good detail */
      await this.services.deleteTransportGoodDetail({ id: transport_good_detail_id });
      const transportGoodDetails = await this.services.getTransportGoodDetails({ transport_good_id: transportGoodDetail.transport_good_id });
      if (transportGoodDetails.length == 0) {
        await this.services.updateQuote({ id: quote_id }, { status: QUOTE_STATUS.RASCUNHO });
      };
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: null,
          message: QuoteMessages.TRANSPORT_GOOD_DETAIL_DELETED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.TRANSPORT_GOOD_DETAIL_DELETED_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('delete Transport Good Detail Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* get quote calculation for single insurance type */
  async getSingleQuoteCalculation(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    try {
      const { user } = req;
      const {
        insurance_type_id,
        product_id,
        currency,
        total_limit,
        commission_percentage,
        discount,
        is_discount_load,
        discount_aggravate_percentage,
        quote_id,
        net_written_premium,
        total_premium,
        is_gross_written_premium_change
      } = req.body;
      let result;
      let getQuoteDetailForPriceDistribution = await this.services.getQuoteDetailsForPriceDistribution({ id: quote_id });
      /* payload for quote calculations */
      getQuoteDetailForPriceDistribution.commission_percentage = commission_percentage;
      getQuoteDetailForPriceDistribution.total_limit = total_limit;
      getQuoteDetailForPriceDistribution.discount_aggravate_percentage = discount_aggravate_percentage;
      getQuoteDetailForPriceDistribution.is_discount_load = is_discount_load;
      getQuoteDetailForPriceDistribution.total_premium = total_premium;
      getQuoteDetailForPriceDistribution.is_gross_written_premium_change = is_gross_written_premium_change;
      getQuoteDetailForPriceDistribution.insurance_type_id = insurance_type_id;
      //getQuoteDetailForPriceDistribution.product_id = product_id;
      /* calculation for import or export product of first flow */
      result = await this.importExportQuoteCalculation(getQuoteDetailForPriceDistribution);
      return res
        .send(
          successResponse(QuoteMessages.CALCULATION_LOADED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('get Single Quote Calculation Error', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* add and update quote calculation */
  async addUpdateQuoteCalculation(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      const {
        quote_id,
        deductible_id,
        minimum_prize,
        premium_calculation_type,
        discount_aggravate_amount,
        commission_percentage,
        commission_value,
        discount_aggravate_percentage,
        is_discount_load,
        gross_written_premium,
        total_insurance_cost,
        net_written_premium,
        total_premium,
        deductible_amount,
        deductible_text,
        insurance_rate,
        tax_scvs,
        tax_ssc,
        tax_iva,
        tax_emission,
        sub_total
      } = req.body;
      const quoteDetail = await this.services.getQuoteForAddUpdateQuoteCalculation({ id: quote_id });
      /* return if quote does not exist */
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
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.ADD_UPDATE_QUOTE_CALCULATION,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      /* quote calculation payload */
      const quoteCalculationPayload = {
        quote_id,
        standard_net_written_premium: net_written_premium,
        standard_gross_written_premium: gross_written_premium,
        standard_total_premium: total_premium,
        standard_commission_percentage: commission_percentage,
        standard_commission_value: commission_value,
        standard_deductible_id: deductible_id,
        standard_is_discount_load: is_discount_load,
        standard_discount_aggravate_percentage: discount_aggravate_percentage,
        standard_tax_value: null,
        standard_total_insurance_cost: total_insurance_cost,
        standard_discount_aggravate_amount: discount_aggravate_amount,
        standard_insurance_rate: insurance_rate,
        standard_tax_scvs: tax_scvs,
        standard_tax_ssc: tax_ssc,
        standard_tax_emission: tax_emission,
        standard_tax_iva: tax_iva,
        standard_sub_total: sub_total,
      };
      if (!quoteDetail.quote_calculation) {
        quoteCalculationPayload.personalized_net_written_premium = net_written_premium;
        quoteCalculationPayload.personalized_gross_written_premium = gross_written_premium;
        quoteCalculationPayload.personalized_total_premium = total_premium;
        quoteCalculationPayload.personalized_commission_percentage = commission_percentage;
        quoteCalculationPayload.personalized_commission_value = commission_value;
        quoteCalculationPayload.personalized_deductible_id = deductible_id;
        quoteCalculationPayload.personalized_is_discount_load = is_discount_load;
        quoteCalculationPayload.personalized_discount_aggravate_percentage = discount_aggravate_percentage;
        quoteCalculationPayload.personalized_tax_value = null;
        quoteCalculationPayload.personalized_total_insurance_cost = total_insurance_cost;
        quoteCalculationPayload.personalized_discount_aggravate_amount = discount_aggravate_amount;
        quoteCalculationPayload.personalized_insurance_rate = insurance_rate;
        quoteCalculationPayload.personalized_tax_scvs = tax_scvs;
        quoteCalculationPayload.personalized_tax_ssc = tax_ssc;
        quoteCalculationPayload.personalized_tax_emission = tax_emission;
        quoteCalculationPayload.personalized_tax_iva = tax_iva;
        quoteCalculationPayload.personalized_sub_total = sub_total;
        /* create quote calculations */
        await this.services.createQuoteCalculation(quoteCalculationPayload);
      } else {
        /* update quote calculations */
        await this.services.updateQuoteCalculation({ quote_id }, quoteCalculationPayload);
      };
      const quotePayload = {
        minimum_prize,
        premium_calculation_type,
        status: quoteDetail.status == QUOTE_STATUS.MODERAÇÃO ? quoteDetail.status : QUOTE_STATUS.ACTIVE,
        deductible_amount,
        deductible_text,
        activated_at: new Date()
      };
      //const moderation_reasons = {};
      // const authority_commission = quoteDetail && quoteDetail.user && quoteDetail.user.company && quoteDetail.user.company.authority_levels && quoteDetail.user.company.authority_levels.commission ? quoteDetail.user.company.authority_levels.commission : 0;
      // if (quoteDetail.status == QUOTE_STATUS.ACTIVE) {
      //   quotePayload. = new Date();
      // };
      await this.services.updateQuote({ id: quote_id }, quotePayload);
      // quoteDetail.commission_percentage = commission_percentage;
      // quoteDetail.discount_aggravate_percentage = discount_aggravate_percentage;
      await this.checkAllModerationConditionsForTheQuoteNew(quoteDetail.id, user, QuoteMessages);
      //emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
      const result = await this.services.getAllQuoteDetail({ id: quote_id });
      /* return good names corresponding to the quote transport good details  */
      const selectedGoodIds = [];
      if (result.transport_good && result.transport_good.transport_good_details) {
        for (let ele of result.transport_good.transport_good_details) {
          const goodNames = [];
          const goodDetail = await this.services.getGoodsForModeration({ id: JSON.parse(ele.good_id) });
          goodDetail.map(obj => {
            goodNames.push(obj.name);
          });
          ele.dataValues.good_name = goodNames;
          /* for annual insurance type need to get the not selected goods */
          if (result.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL) {
            selectedGoodIds.push(...JSON.parse(ele.good_id))
          }
        }
      };
      if (result.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL) {
        const notSelectedGoods = await this.getNotSelectedGoods(selectedGoodIds);
        result.dataValues.not_selected_goods = notSelectedGoods;
      };
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: QuoteMessages.CALCULATION_ADDED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      /* socket emission */
      emitSocketEvent(SOCKET_EVENTS.ADD_UPDATE_QUOTE_CALCULATION, { quote_id: quoteDetail.id });
      //emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
      /* end */
      return res.send(successResponse(QuoteMessages.CALCULATION_ADDED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('add Update Quote Calculation Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* get quote calculation on the basis of standard or personalize preference */
  getActiveQuoteCalculation(quoteDetail) {
    try {
      /* get the quote calculation as per the calculation type that is standard or personalized */
      if (quoteDetail.is_calculation_personalized == DEFAULT_ENUM.TRUE) {
        /* personalized calculation */
        quoteDetail.commission = quoteDetail.quote_calculation.personalized_commission_percentage;
        quoteDetail.discount = quoteDetail.quote_calculation.personalized_deductible && quoteDetail.quote_calculation.personalized_deductible.discount != null ? quoteDetail.quote_calculation.personalized_deductible.discount : null;
        quoteDetail.deductible_name = quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_deductible && quoteDetail.quote_calculation.personalized_deductible.name ? quoteDetail.quote_calculation.personalized_deductible.name : null;
        quoteDetail.discount_aggravate_percentage = quoteDetail.quote_calculation.personalized_discount_aggravate_percentage;
        quoteDetail.gross_written_premium = quoteDetail.quote_calculation.personalized_gross_written_premium ? quoteDetail.quote_calculation.personalized_gross_written_premium : null;
        quoteDetail.insurance_rate = quoteDetail.quote_calculation.personalized_insurance_rate ? quoteDetail.quote_calculation.personalized_insurance_rate : null;
      } else {
        /* standard calculation */
        quoteDetail.commission = quoteDetail.quote_calculation.standard_commission_percentage;
        quoteDetail.discount = quoteDetail.quote_calculation.standard_deductible && quoteDetail.quote_calculation.standard_deductible.discount != null ? quoteDetail.quote_calculation.standard_deductible.discount : null;
        quoteDetail.deductible_name = quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_deductible && quoteDetail.quote_calculation.standard_deductible.name ? quoteDetail.quote_calculation.standard_deductible.name : null;
        quoteDetail.discount_aggravate_percentage = quoteDetail.quote_calculation.standard_discount_aggravate_percentage;
        quoteDetail.gross_written_premium = quoteDetail.quote_calculation.standard_gross_written_premium ? quoteDetail.quote_calculation.standard_gross_written_premium : null;
        quoteDetail.insurance_rate = quoteDetail.quote_calculation.standard_insurance_rate ? quoteDetail.quote_calculation.standard_insurance_rate : null;
      };
      return quoteDetail;
    } catch (error) {
      console.log(error);
    }
  }
  /* end */

  /* create annual transport goods */
  async createAnnualTransportGoods(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      const {
        quote_id,
        type_of_good_new,
        type_of_good_used,
        currency,
        estimated_for_next_12_months,
        in_bulk,
        chilled,
        frozen,
        goods_change,
        total_limit,
        goods,
      } = req.body;
      let newTotalLimit = total_limit;
      let previousTotalLimit = 0;
      /* check quote exists */
      const quoteDetail = await this.services.getQuoteForCreateTransportGoods({ id: quote_id });
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
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.CREATE_ANNUAL_TRANSPORT_GOODS,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      if (quoteDetail.quote_calculation) {
        /* standard calculation */
        quoteDetail.commission = quoteDetail.quote_calculation.standard_commission_percentage;
        quoteDetail.discount = quoteDetail.quote_calculation.standard_deductible && quoteDetail.quote_calculation.standard_deductible.discount != null ? quoteDetail.quote_calculation.standard_deductible.discount : null;
        quoteDetail.is_discount_load = quoteDetail.quote_calculation.standard_is_discount_load;
        quoteDetail.discount_aggravate_percentage = quoteDetail.quote_calculation.standard_discount_aggravate_percentage;
      };
      let transportGoodId;
      let displayModerate = DEFAULT_ENUM.FALSE;
      /* get transport good payload to create transport good */
      const transportGoodsPayload = {
        quote_id,
        type_of_good_new,
        type_of_good_used,
        estimated_for_next_12_months,
        in_bulk,
        chilled,
        frozen,
        currency,
        total_limit,
      };
      let existingGoods = []
      /* if transport good does not exist then need to create it */
      if (!quoteDetail.transport_good) {
        /* create transport good */
        const transportGoods = await this.services.createTransportGoods(transportGoodsPayload);
        transportGoodId = transportGoods.id;
        /* if transport good for the quote already exists */
      } else {
        /* update the transport good of the quote */
        await this.services.updateTransportGoods(transportGoodsPayload, { id: quoteDetail.transport_good.id });
        /* get the transport good detail of the quote */
        existingGoods = await this.services.getTransportGoodDetails({ transport_good_id: quoteDetail.transport_good.id });
        /* check and update the quote as moderation */
        if (
          quoteDetail.commission &&
          quoteDetail.display_moderation == DEFAULT_ENUM.FALSE &&
          user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN
        ) {
          const moderationResult = await this.checkQuoteModerationAsPerGoodsForAnnualInsuranceType(
            quoteDetail,
          );
          if (moderationResult) {
            /* get quote payload to make the quote moderate if admin and sub admin is not logged in */
            let quotePayload = {
              status: QUOTE_STATUS.MODERAÇÃO,
              is_moderate: IS_MODERATE.TRUE,
              display_moderation: DEFAULT_ENUM.TRUE,
              updatedAt: new Date()
            }
            await this.services.updateQuote({ id: quote_id }, quotePayload);
          };
        };
        transportGoodId = quoteDetail.transport_good.id;
        previousTotalLimit = quoteDetail.transport_good.total_limit;
      };
      // newTotalLimit = quoteDetail.total_limit;
      /* add or update the transport good detail of the quote */
      await this.addUpdateAnnualTransportGoodDetails(
        goods,
        transportGoodId,
        existingGoods,
      );
      let latestQuoteDetailForGrBook = await this.services.getQuoteDetailForGrBook({ id: quote_id });
      if (latestQuoteDetailForGrBook.quote_calculation) {
        latestQuoteDetailForGrBook.commission =
          latestQuoteDetailForGrBook.is_calculation_personalized == DEFAULT_ENUM.TRUE ?
            latestQuoteDetailForGrBook.quote_calculation.personalized_commission_percentage :
            latestQuoteDetailForGrBook.quote_calculation.standard_commission_percentage;
      };
      /* get not selected goods */
      const selectedGoodIds = [];
      let not_selected_goods;
      if (latestQuoteDetailForGrBook.transport_good && latestQuoteDetailForGrBook.transport_good.transport_good_details) {
        for (let ele of latestQuoteDetailForGrBook.transport_good.transport_good_details) {
          /* for annual insurance type need to get the not selected goods */
          selectedGoodIds.push(...JSON.parse(ele.good_id))
        }
        not_selected_goods = await this.getNotSelectedGoods(selectedGoodIds);
        latestQuoteDetailForGrBook.dataValues.not_selected_goods = not_selected_goods;
      };
      const quotePayload = {};
      /* get the latest quote detail */
      const result = await this.services.getAllQuoteDetail({ id: quote_id });
      if (quoteDetail.commission) {
        let calculationResult = {};
        let getQuoteDetailForPriceDistribution = await this.services.getQuoteDetailsForPriceDistribution({ id: quoteDetail.id });
        getQuoteDetailForPriceDistribution.commission_percentage = quoteDetail.commission;
        getQuoteDetailForPriceDistribution.total_limit = quoteDetail.newTotalLimit;
        getQuoteDetailForPriceDistribution.discount_aggravate_percentage = quoteDetail.discount_aggravate_percentage;
        getQuoteDetailForPriceDistribution.is_discount_load = quoteDetail.is_discount_load;
        getQuoteDetailForPriceDistribution.total_limit = newTotalLimit;
        getQuoteDetailForPriceDistribution.insurance_type_id = quoteDetail.insurance_type_id;
        // getQuoteDetailForPriceDistribution.product_id = product_id;
        calculationResult = await this.importExportQuoteCalculation(getQuoteDetailForPriceDistribution);
        const payload = {};
        payload.standard_net_written_premium = calculationResult.net_written_premium ? calculationResult.net_written_premium : null;
        payload.standard_gross_written_premium = calculationResult.gross_written_premium ? calculationResult.gross_written_premium : null;
        payload.standard_total_insurance_cost = calculationResult.total_insurance_cost ? calculationResult.total_insurance_cost : null;
        payload.standard_discount_aggravate_amount = calculationResult.discount_aggravate_amount ? calculationResult.discount_aggravate_amount : null;
        payload.standard_total_premium = calculationResult.total_premium ? calculationResult.total_premium : null;
        await this.services.updateQuoteCalculation({ quote_id: quoteDetail.id }, payload);
      };
      const moderationResult = await this.checkQuoteModerationAsPerGoodsForAnnualInsuranceType(
        result,
      );
      /* adding the display moderation flag in transport good if transport goods lies in moderation condition */
      if (moderationResult) {
        displayModerate = DEFAULT_ENUM.TRUE;
      };
      result.transport_good.dataValues.displayModerate = displayModerate;
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: QuoteMessages.TRANSPORT_GOODS_ADDED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.TRANSPORT_GOODS_ADDED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('create Annual Transport Goods Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* add annual transport goods detail */
  async addUpdateAnnualTransportGoodDetails(
    newGoods,
    transportGoodId,
    existingGoods,
  ) {
    try {
      const newTransportGoodDetails = [];
      for (const ele of newGoods) {
        const transportGoodDetailPayload = {
          transport_good_id: transportGoodId,
          good_id: JSON.stringify(ele.good_id),
          group_id: ele.group_id,
          good_group_percentage: ele.good_group_percentage,
          group_percentage: ele.group_percentage,
          good_text: ele.good_text ? ele.good_text : null
        };
        /* update if id exists in the good object else create */
        if (!ele.id) {
          newTransportGoodDetails.push(transportGoodDetailPayload);
        } else {
          await this.services.updateTransportGoodsDetail(transportGoodDetailPayload, { id: ele.id });
        };
      };
      const missingTransportGoodDetailIds = [];
      for (let ele of existingGoods) {
        if (!newGoods.find((item) => item.id === ele.id))
          missingTransportGoodDetailIds.push(ele.id);
      };
      if (missingTransportGoodDetailIds.length > 0) {
        await this.services.deleteTransportGoodsDetail({ id: missingTransportGoodDetailIds });
      };
      /* bulk create new transport good details */
      await this.services.bulkCreateTransportGoodsDetail(newTransportGoodDetails);
    } catch (error) {
      logger.error('add Update Annual Transport Good Details Error', error);
      throw error;
    }
  };
  /* end */

  /* calculate goods rate of transport good details or goods selected for the quote */
  // calculateGoodsRate(
  //   transportGoodDetails,
  // ) {
  //   try {
  //     let totalGoodsRate = 0;
  //     /* getting the goods rate by getting the percentage(that we selected of a particular good) of the main group percentage and then adding them */
  //     for (const ele of transportGoodDetails) {
  //       totalGoodsRate += (ele.group_percentage * ele.good_group_percentage) / 100;
  //     };
  //     return { goods_rate: totalGoodsRate }
  //   } catch (error) {
  //     console.log('calculate Good Rate Error :>> ', error);
  //     throw error;
  //   }
  // }
  /* end */

  /* check moderation of the quote for annual insurance type */
  async checkQuoteModerationAsPerGoodsForAnnualInsuranceType(
    quoteDetail,
  ) {
    try {
      /* get latest transport good details */
      const transportGoodDetails = await this.services.getTransportGoodDetails({ transport_good_id: quoteDetail.transport_good.id });
      /* check if group b goods exists then quote needs to be moderated */
      if (
        quoteDetail.quote_claim
      ) {
        const goodIds = [];
        for (const ele of transportGoodDetails) {
          goodIds.push(...JSON.parse(ele.good_id))
        }
        const getModeratedGoods = await this.services.getGood({ id: goodIds, is_moderate: DEFAULT_ENUM.TRUE });
        if (getModeratedGoods) {
          return true;
        }
      };
      return false;
    } catch (error) {
      console.log(error);
    }
  }
  /* end */

  /* add update annual shipment detail */
  async addUpdateAnnualShipmentDetail(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      /* destructure the body */
      const {
        quote_id,
        road_used,
        road_percentage,
        maritime_used,
        maritime_percentage,
        air_used,
        air_percentage,
        additional_information,
        routes,
      } = req.body;
      /* get quote detail */
      const quoteDetail = await this.services.getQuoteDetailForAddShipmentDetail({ id: quote_id });
      /* return if the quote does not found */
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
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.ADD_UPDATE_ANNUAL_SHIPMENT_DETAIL,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      if (quoteDetail.quote_calculation) {
        /* standard calculation */
        quoteDetail.commission = quoteDetail.quote_calculation.standard_commission_percentage;
        quoteDetail.discount = quoteDetail.quote_calculation.standard_deductible && quoteDetail.quote_calculation.standard_deductible.discount != null ? quoteDetail.quote_calculation.standard_deductible.discount : null;
        quoteDetail.is_discount_load = quoteDetail.quote_calculation.standard_is_discount_load;
        quoteDetail.discount_aggravate_percentage = quoteDetail.quote_calculation.standard_discount_aggravate_percentage;
        quoteDetail.insurance_rate = quoteDetail.quote_calculation.standard_insurance_rate;
      };
      let quoteShipmentId;
      /* get quote shipment */
      const isQuoteShipmentExists = await this.services.getQuoteShipmentExistence({ quote_id });
      /* create quote shipment payload */
      const quoteShipmentPayload = {
        road_used,
        road_percentage,
        maritime_used,
        maritime_percentage,
        air_used,
        air_percentage,
        additional_information,
      };
      /* if quote shipment does not exist */
      if (!isQuoteShipmentExists) {
        quoteShipmentPayload.quote_id = quote_id;
        const createQuoteShipment = await this.services.createQuoteShipment(quoteShipmentPayload);
        quoteShipmentId = createQuoteShipment.id;
      } else {
        /* update quote shipment */
        await this.services.updateQuoteShipment(quoteShipmentPayload, { quote_id });
        quoteShipmentId = isQuoteShipmentExists.id;
      };
      /* create or update the shipment route detail */
      await this.createUpdateAnnualShipmentRouteDetail(routes, quoteShipmentId);
      /* new code */
      if (quoteDetail.commission) {
        let calculationResult = {};
        let getQuoteDetailForPriceDistribution = await this.services.getQuoteDetailsForPriceDistribution({ id: quoteDetail.id });
        getQuoteDetailForPriceDistribution.commission_percentage = quoteDetail.commission;
        getQuoteDetailForPriceDistribution.total_limit = quoteDetail.transport_good.total_limit;
        getQuoteDetailForPriceDistribution.discount_aggravate_percentage = quoteDetail.discount_aggravate_percentage;
        getQuoteDetailForPriceDistribution.is_discount_load = quoteDetail.is_discount_load;
        getQuoteDetailForPriceDistribution.insurance_rate = quoteDetail.insurance_rate;
        getQuoteDetailForPriceDistribution.insurance_type_id = quoteDetail.insurance_type_id;
        // getQuoteDetailForPriceDistribution.product_id = product_id;
        calculationResult = await this.importExportQuoteCalculation(getQuoteDetailForPriceDistribution);
        //console.log('calculationResult11111111', calculationResult);
        const payload = {};
        payload.standard_net_written_premium = calculationResult.net_written_premium ? calculationResult.net_written_premium : null;
        payload.standard_gross_written_premium = calculationResult.gross_written_premium ? calculationResult.gross_written_premium : null;
        payload.standard_total_insurance_cost = calculationResult.total_insurance_cost ? calculationResult.total_insurance_cost : null;
        payload.standard_discount_aggravate_amount = calculationResult.discount_aggravate_amount ? calculationResult.discount_aggravate_amount : null;
        payload.standard_total_premium = calculationResult.total_premium ? calculationResult.total_premium : null;
        payload.standard_insurance_rate = calculationResult.net_insurance_rate ? calculationResult.net_insurance_rate : null;
        await this.services.updateQuoteCalculation({ quote_id: quoteDetail.id }, payload);
      }
      /* end */
      /* get the updated quote detail */
      const result = await this.services.getAllQuoteDetail({ id: quote_id });
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: QuoteMessages.SHIPMENT_DETAIL_ADDED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.SHIPMENT_DETAIL_ADDED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('add Update Annual Shipment Detail Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* create update annual quote risks  */
  async addUpdateAnnualQuoteRisks(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      /* destructure the body */
      const {
        quote_id,
        have_manager,
        technology_tracker,
        technology_tracker_text,
        technology_tracker_risk,
        technology_tracker_secondary,
        technology_tracker_secondary_text,
        technology_tracker_secondary_risk,
        technology_bait,
        technology_bait_text,
        technology_bait_risk,
        technology_intelligent_immobilizer,
        technology_intelligent_immobilizer_text,
        technology_intelligent_immobilizer_risk,
        technology_other,
        technology_other_text,
        company_name,
        quote_risk_documents
      } = req.body;
      /* get quote detail */
      const quoteDetail = await this.services.getQuoteDetailToAddQuoteRisks({ id: quote_id });
      /* return if the quote does not found */
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
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.ADD_UPDATE_ANNUAL_QUOTE_RISK,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      if (quoteDetail.quote_calculation) {
        /* standard calculation */
        quoteDetail.commission = quoteDetail.quote_calculation.standard_commission_percentage;
      };
      let quoteRiskId;
      /* get quote risk */
      const isQuoteRiskExists = await this.services.getQuoteRiskExistence({ quote_id });
      /* create quote risk payload */
      const quoteRiskPayload = {
        have_manager,
        company_name: JSON.stringify(company_name),
        technology_tracker,
        technology_tracker_risk: JSON.stringify(technology_tracker_risk),
        technology_tracker_text,
        technology_tracker_secondary,
        technology_tracker_secondary_risk: JSON.stringify(technology_tracker_secondary_risk),
        technology_tracker_secondary_text,
        technology_bait,
        technology_bait_risk: JSON.stringify(technology_bait_risk),
        technology_bait_text,
        technology_intelligent_immobilizer,
        technology_intelligent_immobilizer_risk: JSON.stringify(technology_intelligent_immobilizer_risk),
        technology_intelligent_immobilizer_text,
        technology_other,
        technology_other_text,
      };
      /* if quote risk does not exist */
      if (!isQuoteRiskExists) {
        quoteRiskPayload.quote_id = quote_id;
        const createQuoteRisk = await this.services.createQuoteRisk(quoteRiskPayload);
        quoteRiskId = createQuoteRisk.id;
      } else {
        /* update quote risk */
        await this.services.updateQuoteRisk(quoteRiskPayload, { quote_id });
        quoteRiskId = isQuoteRiskExists.id;
      };
      if (quote_risk_documents && quote_risk_documents.length > 0) {
        quote_risk_documents.map(ele => {
          return ele.quote_risk_id = quoteRiskId;
        });
        await this.services.bulkCreateQuoteRiskDocuments(quote_risk_documents);
      };
      if (
        quoteDetail.commission && quoteDetail.quote_risk &&
        quoteDetail.quote_risk.quote_risk_documents.length > 0 &&
        user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN
      ) {
        /* get quote payload to make the quote moderate if admin and sub admin is not logged in */
        let quotePayload = {
          status: QUOTE_STATUS.MODERAÇÃO,
          is_moderate: IS_MODERATE.TRUE,
          display_moderation: DEFAULT_ENUM.TRUE,
          updatedAt: new Date(),
        }
        await this.services.updateQuote({ id: quote_id }, quotePayload);
      };
      /* get the updated quote detail */
      const result = await this.services.getAllQuoteDetail({ id: quote_id });
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: QuoteMessages.QUOTE_RISKS_ADDED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.QUOTE_RISKS_ADDED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('add Update Annual Quote Risks Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* create or update single shipment route detail */
  async createUpdateAnnualShipmentRouteDetail(
    routes,
    quoteShipmentId
  ) {
    try {
      const shipmentRouteDetails = [];
      for (const ele of routes) {
        const shipmentRouteDetailPayload = {
          source: ele.source,
          destiny: ele.destiny,
          percentage: ele.percentage
        }
        /* if shipment route detail does not exist else update it */
        if (!ele.id) {
          shipmentRouteDetailPayload.quote_shipment_id = quoteShipmentId;
          shipmentRouteDetails.push(shipmentRouteDetailPayload);
        } else {
          await this.services.updateShipmentRouteDetail(shipmentRouteDetailPayload, { id: ele.id })
        };
      };
      const existingShipmentRouteDetails = await this.services.getShipmentRouteDetails({ quote_shipment_id: quoteShipmentId })
      const missingShipmentRouteDetailsIds = [];
      for (let ele of existingShipmentRouteDetails) {
        if (!routes.find((item) => item.id == ele.id))
          missingShipmentRouteDetailsIds.push(ele.id);
      };
      /* delete missing shipment route details if available */
      if (missingShipmentRouteDetailsIds.length > 0) {
        await this.services.deleteShipmentRouteDetails({ id: missingShipmentRouteDetailsIds });
      };
      /* bulk create new shipment route details */
      await this.services.bulkCreateShipmentRouteDetails(shipmentRouteDetails);
      return;
    } catch (error) {
      throw error;
    }
  }
  /* end */

  /* create update annual quote claims */
  async addUpdateAnnualQuoteClaims(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      /* destructure the body */
      const {
        quote_id,
        is_past_claims,
        currency,
        approximate_value,
        quote_claim_details,
        quote_claim_documents,
        from_sheet
      } = req.body;
      /* get quote detail */
      const quoteDetail = await this.services.getQuoteDetailToAddQuoteClaims({ id: quote_id });
      if (!from_sheet) {
        /* return if the quote does not found */
        if (!quoteDetail) {
          return res.send(errorResponse(
            QuoteMessages.QUOTE_NOT_FOUND,
            null,
            RESPONSE_CODES.BAD_REQUEST,
            req.headers.tokenization
          ));
        };
      };
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: from_sheet == DEFAULT_ENUM.TRUE ? CHILD_LOG_TYPE.SAVE_ANNUAL_QUOTE_CLAIM_SHEET_FROM_SHEET : CHILD_LOG_TYPE.ADD_UPDATE_ANNUAL_QUOTE_CLAIMS_FROM_SHEET,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      let quoteClaimId;
      /* get quote claim */
      const isQuoteClaimExists = await this.services.getQuoteClaimExistence({ quote_id });
      /* create quote claim payload */
      const quoteClaimPayload = {
        is_past_claims,
        currency,
        approximate_value,
        user_id: quoteDetail.user_id,
        created_by_id: user.id,
      };
      /* if quote claim does not exist */
      if (!isQuoteClaimExists) {
        quoteClaimPayload.quote_id = quote_id;
        const createQuoteClaim = await this.services.createQuoteClaim(quoteClaimPayload);
        quoteClaimId = createQuoteClaim.id;
      } else {
        /* update quote claim */
        await this.services.updateQuoteClaim(quoteClaimPayload, { quote_id });
        quoteClaimId = isQuoteClaimExists.id;
      };
      await this.addUpdateAnnualQuoteClaimDetails(quote_claim_details, quoteClaimId, currency, from_sheet);
      if (quote_claim_documents && quote_claim_documents.length > 0) {
        quote_claim_documents.map(ele => {
          return ele.quote_claim_id = quoteClaimId;
        });
        await this.services.bulkCreateQuoteClaimDocuments(quote_claim_documents);
      };
      /* get the updated quote detail */
      const result = await this.services.getAllQuoteDetail({ id: quote_id });
      if (from_sheet) {
        fs.unlinkSync(req.file.path);
      }
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: QuoteMessages.QUOTE_CLAIMS_ADDED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.QUOTE_CLAIMS_ADDED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('add Update Annual Quote Claims Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* save annual quote claim sheet */
  async saveAnnualQuoteClaimSheet(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    try {
      const { user, params } = req;
      /* get quote detail */
      const quoteDetail = await this.services.getQuoteDetailToAddQuoteClaimsBySheet({ id: params.quote_id });
      /* return if the quote does not found */
      if (!quoteDetail) {
        return res.send(errorResponse(
          QuoteMessages.QUOTE_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      const quote_claim_details = [];
      let approximate_value = 0;
      const schema = {
        data_de_ocorrencia: {
          prop: 'data_de_ocorrencia',
          type: Date,
          required: true,
        },
        causa: {
          prop: 'causa',
          type: Number,
          required: true,
        },
        status: {
          prop: 'status',
          type: Number,
          required: true,
        },
        moeda: {
          prop: 'moeda',
          type: Number,
          required: true,
        },
        franquia: {
          prop: 'franquia',
          type: Number,
          required: true,
        },
        valor_sinistro: {
          prop: 'valor_sinistro',
          type: Number,
          required: true,
        },
      };
      let result = null;
      try {
        result = await readXlsxFile(req.file.path, { schema });
      } catch (err) {
        return res.send(errorResponse(err.message, null, RESPONSE_CODES.POST, req.headers.tokenization));
      };
      if (result.errors.length > 0) {
        return res.send(errorResponse(QuoteMessages.INVALID_DATA_FORMAT, result.errors, RESPONSE_CODES.POST, req.headers.tokenization));
      };
      if (result.rows && result.rows.length > 0) {
        for (let ele of result.rows) {
          const payload = {
            date: ele.data_de_ocorrencia ? ele.data_de_ocorrencia : null,
            franchise: ele.franquia ? ele.franquia : null,
            claim_value: ele.valor_sinistro ? ele.valor_sinistro : null,
            claim_cause_id: ele.causa ? ele.causa : null, /* TODO: need to discuss */
            claim_status_id: ele.status ? ele.status : null,
            currency: ele.moeda ? ele.moeda : null,
          };
          if (
            payload.claim_cause_id &&
            payload.currency &&
            payload.claim_status_id &&
            payload.date
          ) {
            quote_claim_details.push(payload);
          };
        };
      };
      for (const ele of quote_claim_details) {
        if (quoteDetail.transport_good && quoteDetail.transport_good.currency && quoteDetail.transport_good.currency != ele.currency) {
          return res.send(errorResponse(QuoteMessages.SELECT_VALID_CURRENCY, null, RESPONSE_CODES.POST, req.headers.tokenization));
        }
        approximate_value += ele.claim_value;
      };
      /* here add update annual quote claim function is called by passing the sheet data in the body */
      const bodyData = {
        quote_id: params.quote_id,
        is_past_claims: DEFAULT_ENUM.TRUE,
        currency: quoteDetail.transport_good.currency,
        approximate_value,
        quote_claim_documents: [],
        quote_claim_details,
        from_sheet: DEFAULT_ENUM.TRUE,
      };
      /* adding body data in the req body */
      req.body = { ...req.body, ...bodyData };
      /* from_sheet flag */
      this.addUpdateAnnualQuoteClaims(req, res)
    } catch (error) {
      logger.error('save Annual Quote Claim Sheet Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* create or update single shipment route detail */
  async addUpdateAnnualQuoteClaimDetails(
    quote_claim_details,
    quoteClaimId,
    currency,
    from_sheet,
  ) {
    try {
      const quoteClaimDetails = [];
      for (const ele of quote_claim_details) {
        const quoteClaimDetailPayload = {
          date: ele.date,
          franchise: ele.franchise,
          claim_value: ele.claim_value,
          claim_cause_id: ele.claim_cause_id,
          claim_status_id: ele.claim_status_id,
          currency,
        };
        /* if quote claim detail does not exist then create else update it */
        if (!ele.id) {
          quoteClaimDetailPayload.quote_claim_id = quoteClaimId;
          quoteClaimDetails.push(quoteClaimDetailPayload);
        } else {
          await this.services.updateQuoteClaimDetail(quoteClaimDetailPayload, { id: ele.id })
        };
      };
      if (!from_sheet) {
        const existingQuoteClaimDetails = await this.services.getQuoteClaimDetails({ quote_claim_id: quoteClaimId })
        const missingQuoteClaimDetailsIds = [];
        for (let ele of existingQuoteClaimDetails) {
          if (!quote_claim_details.find((item) => item.id == ele.id))
            missingQuoteClaimDetailsIds.push(ele.id);
        };
        /* delete missing quote claim details if available */
        if (missingQuoteClaimDetailsIds.length > 0) {
          await this.services.deleteQuoteClaimDetails({ id: missingQuoteClaimDetailsIds });
        };
      };
      /* bulk create quote claim details */
      await this.services.bulkCreateQuoteClaimDetails(quoteClaimDetails);
      return;
    } catch (error) {
      throw error;
    }
  }
  /* end */

  /* add quote message sent from the quote moderation popup in the last tab */
  async addMessage(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      /* destructure the body */
      const {
        quote_id,
        message
      } = req.body;
      const quoteDetail = await this.services.quoteDetailForAddMessage({ id: quote_id });
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.ADD_MESSAGE,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      /* get message payload */
      const messagePayload = {
        quote_id,
        message,
        sender_id: user.id,
      };
      /* add quote message */
      const result = await this.services.createMessage(messagePayload);
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: QuoteMessages.QUOTE_MESSAGE_ADDED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.QUOTE_MESSAGE_ADDED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('add Message Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* get quote message list sent from the quote moderation popup in the last tab */
  async getMessages(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    try {
      /* destructuring the request */
      const { quote_id } = req.params;
      /* get quote message list */
      const result = await this.services.getMessages({ quote_id });
      return res.send(
        successResponse(QuoteMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get Messages Error, ', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* get quote calculation for annual insurance type */
  async getAnnualQuoteCalculation(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    try {
      const { user } = req;
      const {
        product_id,
        insurance_rate,
        total_limit,
        commission_percentage,
        discount,
        is_discount_load,
        discount_aggravate_percentage,
        quote_id,
        insurance_type_id
      } = req.body;
      let result;
      let getQuoteDetailForPriceDistribution = await this.services.getQuoteDetailsForPriceDistribution({ id: quote_id });
      /* payload for quote calculations */
      getQuoteDetailForPriceDistribution.commission_percentage = commission_percentage;
      getQuoteDetailForPriceDistribution.total_limit = total_limit;
      getQuoteDetailForPriceDistribution.discount_aggravate_percentage = discount_aggravate_percentage;
      getQuoteDetailForPriceDistribution.is_discount_load = is_discount_load;
      getQuoteDetailForPriceDistribution.product_id = product_id;
      getQuoteDetailForPriceDistribution.insurance_rate = insurance_rate;
      getQuoteDetailForPriceDistribution.insurance_type_id = insurance_type_id;
      result = await this.importExportQuoteCalculation(getQuoteDetailForPriceDistribution);
      return res
        .send(
          successResponse(QuoteMessages.CALCULATION_LOADED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('get Annual Quote Calculation Error', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* add annual coverages for flow 2 */
  async createAnnualCoverages(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, body, ip_address } = req;
      const {
        quote_id,
        basic_coverages,
        additional_coverages,
      } = body;
      /* check if the quote exists or not and get the required data of quote for creating coverages */
      const quoteDetail = await this.services.getQuoteDetailToAddCoverages({ id: quote_id });
      /* return if quote does not exist */
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
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.CREATE_ANNUAL_COVERAGES,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      /* to add the quote coverages, need to compare the quote coverages given in body and stored in database */
      /* add quote basic coverages if available */
      if (basic_coverages.length > 0) {
        const newQuoteBasicCoveragesToBeAdded = [];
        /* get existing quote basic coverages */
        const isQuoteBasicCoveragesExists = await this.services.getQuoteBasicCoverages({ quote_id: quote_id });
        /* if quote basic coverages exists */
        if (isQuoteBasicCoveragesExists.length > 0) {
          /* get the coverage ids of the existing quote basic coverages */
          const existingQuoteBasicCoverageIds = isQuoteBasicCoveragesExists.map(ele => ele.coverage_id);
          /* compare and get the new coverage ids that need to be added */
          const newBasicCoverageIds = basic_coverages.filter(id => !existingQuoteBasicCoverageIds.includes(id));
          /* if new quote basic coverage ids exists */
          if (newBasicCoverageIds.length > 0) {
            /* create the payload to add the new quote basic coverages */
            newBasicCoverageIds.map(ele => newQuoteBasicCoveragesToBeAdded.push({ quote_id: quote_id, coverage_id: ele }));
          };
          /* compare and get the old coverage ids that are now to be removed but exists in database */
          const oldRemovedBasicCoverageIds = existingQuoteBasicCoverageIds.filter(id => !basic_coverages.includes(id));
          /* if basic coverages to be removed exists */
          if (oldRemovedBasicCoverageIds.length > 0) {
            /* delete basic coverages that are not included in body but exists in database */
            await this.services.deleteQuoteBasicCoverages({ quote_id: quote_id, coverage_id: oldRemovedBasicCoverageIds });
          };
        } else {
          /* if basic coverages does not exists in the database means all the basic coverages in body need to be added so creating payload */
          basic_coverages.map(ele => newQuoteBasicCoveragesToBeAdded.push({ quote_id: quote_id, coverage_id: ele }));
        };
        /* bulk create new quote basic coverages */
        if (newQuoteBasicCoveragesToBeAdded.length > 0) {
          await this.services.bulkCreateQuoteBasicCoverages(newQuoteBasicCoveragesToBeAdded);
        };
      } else {
        /* if no basic coverages are given means need to remove the existing */
        await this.services.deleteQuoteBasicCoverages({ quote_id: quote_id });
      };
      /* add quote additional coverages if available */
      if (additional_coverages.length > 0) {
        const newQuoteAdditionalCoveragesToBeAdded = [];
        /* check if the quote additional coverages already exists */
        const isQuoteAdditionalCoveragesExists = await this.services.getQuoteAdditionalCoverages({ quote_id: quote_id });
        /* if quote additional coverages already exists in database */
        if (isQuoteAdditionalCoveragesExists.length > 0) {
          /* get the existing quote additional coverage ids */
          const existingQuoteAdditionalCoverageIds = isQuoteAdditionalCoveragesExists.map(ele => ele.coverage_id);
          /* compare and get which new additional coverages are given to be added */
          const newAdditionalCoverageIds = additional_coverages.filter(id => !existingQuoteAdditionalCoverageIds.includes(id));
          /* if getting quote additional coverages to be added */
          if (newAdditionalCoverageIds.length > 0) {
            /* get payload of the new quote additional coverages that are to be added */
            newAdditionalCoverageIds.map(ele => newQuoteAdditionalCoveragesToBeAdded.push({ quote_id: quote_id, coverage_id: ele }));
          };
          /* compare and get which quote additional coverages are to be removed */
          const oldRemovedAdditionalCoverageIds = existingQuoteAdditionalCoverageIds.filter(id => !additional_coverages.includes(id));
          /* if quote additional coverages to be removed exists */
          if (oldRemovedAdditionalCoverageIds.length > 0) {
            /* remove quote additional coverages */
            await this.services.deleteQuoteAdditionalCoverages({ quote_id: quote_id, coverage_id: oldRemovedAdditionalCoverageIds });
          };
        } else {
          /* if quote additional coverages does not exist exists in database  */
          additional_coverages.map(ele => newQuoteAdditionalCoveragesToBeAdded.push({ quote_id: quote_id, coverage_id: ele }));
        };
        /* bulk create quote additional coverages */
        if (newQuoteAdditionalCoveragesToBeAdded.length > 0) {
          await this.services.bulkCreateQuoteAdditionalCoverages(newQuoteAdditionalCoveragesToBeAdded);
        };
      } else {
        /* if additional coverages are not given means need to remove the existing */
        await this.services.deleteQuoteAdditionalCoverages({ quote_id: quote_id });
      };
      //await this.checkAllModerationConditionsForTheQuoteNew(quoteDetail.id, user, /*basic_coverages, additional_coverages,*/ QuoteMessages);
      /* get quote moderation detail for the response */
      const result = await this.services.getQuoteDetailAfterAddingCoverages({ id: quote_id });
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: QuoteMessages.COVERAGES_ADDED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.COVERAGES_ADDED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('create Annual Coverages Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* approve reject quote from the moderation popup */
  async approveReject(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    const EmailMessages = req.CommonMessages.email;
    let addApiLogResponse;
    try {
      const { user, body, ip_address } = req;
      const {
        is_calculation_personalized,
        total_premium,
        discount_aggravate_amount,
        quote_id,
        net_written_premium,
        gross_written_premium,
        commission_value,
        total_insurance_cost,
        tax_value,
        commission_percentage,
        deductible_id,
        deductible_amount,
        minimum_prize,
        premium_calculation_type,
        of_adjustment,
        of_claims,
        stipulation_policy_checkbox,
        is_discount_load,
        discount_aggravate_percentage,
        insurance_rate,
        tax_scvs,
        tax_ssc,
        tax_iva,
        tax_emission,
        sub_total
      } = body;
      /* get quote detail  */
      const quoteDetail = await this.services.getQuoteDetailForApproveReject({ id: quote_id });
      /* if quote detail not found */
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
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.APPROVE_REJECT,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      let quotePayload = {};
      /* if gross written premium is given */
      if (total_premium) {
        if (quoteDetail.quote_calculation) {
          const payload = {};
          if (is_calculation_personalized == DEFAULT_ENUM.TRUE) {
            /* payload for personalized quote caluclations */
            payload.personalized_net_written_premium = net_written_premium ? net_written_premium : null;
            payload.personalized_gross_written_premium = gross_written_premium ? gross_written_premium : null;
            payload.personalized_total_insurance_cost = total_insurance_cost ? total_insurance_cost : null;
            payload.personalized_discount_aggravate_amount = discount_aggravate_amount ? discount_aggravate_amount : null;
            payload.personalized_commission_value = commission_value ? commission_value : null
            payload.personalized_total_premium = total_premium ? total_premium : null;
            payload.personalized_tax_value = tax_value ? tax_value : null;
            payload.personalized_commission_percentage = commission_percentage ? commission_percentage : null;
            payload.personalized_deductible_id = deductible_id ? deductible_id : null;
            payload.personalized_is_discount_load = is_discount_load ? is_discount_load : null;
            payload.personalized_discount_aggravate_percentage = discount_aggravate_percentage ? discount_aggravate_percentage : null;
            payload.personalized_insurance_rate = insurance_rate ? insurance_rate : null;
            payload.personalized_tax_scvs = tax_scvs ? tax_scvs : null;
            payload.personalized_tax_ssc = tax_ssc ? tax_ssc : null;
            payload.personalized_tax_emission = tax_emission ? tax_emission : null;
            payload.personalized_tax_iva = tax_iva ? tax_iva : null;
            payload.personalized_sub_total = sub_total ? sub_total : null;
          } else {
            /* payload for standard quote calculations */
            payload.standard_net_written_premium = net_written_premium ? net_written_premium : null;
            payload.standard_gross_written_premium = gross_written_premium ? gross_written_premium : null;
            payload.standard_total_insurance_cost = total_insurance_cost ? total_insurance_cost : null;
            payload.standard_discount_aggravate_amount = discount_aggravate_amount ? discount_aggravate_amount : null;
            payload.standard_total_premium = total_premium ? total_premium : null;
            payload.standard_commission_value = commission_value ? commission_value : null;
            payload.standard_tax_value = tax_value ? tax_value : null;
            payload.standard_commission_percentage = commission_percentage ? commission_percentage : null;
            payload.standard_deductible_id = deductible_id ? deductible_id : null;
            payload.standard_is_discount_load = is_discount_load ? is_discount_load : null;
            payload.standard_discount_aggravate_percentage = discount_aggravate_percentage ? discount_aggravate_percentage : null;
            payload.standard_insurance_rate = insurance_rate ? insurance_rate : null;
            payload.standard_tax_scvs = tax_scvs ? tax_scvs : null;
            payload.standard_tax_ssc = tax_ssc ? tax_ssc : null;
            payload.standard_tax_emission = tax_emission ? tax_emission : null;
            payload.standard_tax_iva = tax_iva ? tax_iva : null;
            payload.standard_sub_total = sub_total ? sub_total : null;
          };
          /* update quote calculation */
          await this.services.updateQuoteCalculation({ quote_id: quoteDetail.id }, payload);
        } else {
          const calculationPayload = {
            quote_id: quoteDetail.id,
            personalized_net_written_premium: net_written_premium ? net_written_premium : null,
            personalized_gross_written_premium: gross_written_premium ? gross_written_premium : null,
            personalized_total_insurance_cost: total_insurance_cost ? total_insurance_cost : null,
            personalized_discount_aggravate_amount: discount_aggravate_amount ? discount_aggravate_amount : null,
            personalized_commission_value: commission_value ? commission_value : null,
            personalized_total_premium: total_premium ? total_premium : null,
            personalized_tax_value: tax_value ? tax_value : null,
            personalized_commission_percentage: commission_percentage ? commission_percentage : null,
            personalized_deductible_id: deductible_id ? deductible_id : null,
            personalized_is_discount_load: is_discount_load ? is_discount_load : null,
            personalized_discount_aggravate_percentage: discount_aggravate_percentage ? discount_aggravate_percentage : null,
            personalized_insurance_rate: insurance_rate ? insurance_rate : null,
            personalized_tax_scvs: tax_scvs ? tax_scvs : null,
            personalized_tax_ssc: tax_ssc ? tax_ssc : null,
            personalized_tax_emission: tax_emission ? tax_emission : null,
            personalized_tax_iva: tax_iva ? tax_iva : null,
            personalized_sub_total: sub_total ? sub_total : null,
            standard_tax_scvs: tax_scvs ? tax_scvs : null,
            standard_tax_ssc: tax_ssc ? tax_ssc : null,
            standard_tax_emission: tax_emission ? tax_emission : null,
            standard_tax_iva: tax_iva ? tax_iva : null,
            standard_sub_total: sub_total ? sub_total : null,
            standard_net_written_premium: net_written_premium ? net_written_premium : null,
            standard_gross_written_premium: gross_written_premium ? gross_written_premium : null,
            standard_total_insurance_cost: total_insurance_cost ? total_insurance_cost : null,
            standard_discount_aggravate_amount: discount_aggravate_amount ? discount_aggravate_amount : null,
            standard_total_premium: total_premium ? total_premium : null,
            standard_commission_value: commission_value ? commission_value : null,
            standard_tax_value: tax_value ? tax_value : null,
            standard_commission_percentage: commission_percentage ? commission_percentage : null,
            standard_deductible_id: deductible_id ? deductible_id : null,
            standard_is_discount_load: is_discount_load ? is_discount_load : null,
            standard_discount_aggravate_percentage: discount_aggravate_percentage ? discount_aggravate_percentage : null,
            standard_insurance_rate: insurance_rate ? insurance_rate : null,
          }
          /* create quote calculation */
          await this.services.createQuoteCalculation(calculationPayload);
        };
        quotePayload.status = QUOTE_STATUS.ACTIVE;
        quotePayload.activated_at = new Date();
      } else {
        quotePayload.status = QUOTE_STATUS.DECLINADA;
        /* send email to the moderation notification emails if quote is rejected */
        if (quoteDetail &&
          quoteDetail.user &&
          quoteDetail.user.company &&
          quoteDetail.user.company.dataValues &&
          quoteDetail.user.company.dataValues.company_setting &&
          quoteDetail.user.company.dataValues.company_setting.moderation_notification_emails) {
          const msg = {
            to: JSON.parse(quoteDetail.user.dataValues.company.dataValues.company_setting.moderation_notification_emails),
            from: process.env.SENDGRID_USERNAME,
            subject: EmailMessages.QUOTE_REJECTION,
            html: `Su cotización ha sido rechazada.`
          };
          sendMail(msg);
        }
      }
      /* if sub admin limit exceeds the quote total limit means quote needs to be moderated and reviewed by higher administration  */
      let isUserLimitExceeds = DEFAULT_ENUM.FALSE;
      // if (user.role_id == ROLES.SUB_ADMIN && net_written_premium) {
      //   /* check if sub admin limit exceeds then quote needs to be moderated */
      //   const subAdminCategory = await this.services.getBrokerCategory({ id: user.authority_level_id });
      //   //isUserLimitExceeds = await checkUserQuoteLimit(quoteDetail, subAdminCategory, currencyExchangeRate.rate);
      //   isUserLimitExceeds = await checkUserQuoteLimit(quoteDetail, subAdminCategory);
      //   if (isUserLimitExceeds) {
      //     quotePayload.status = quoteDetail.status != QUOTE_STATUS.REVISÃO ? QUOTE_STATUS.MODERAÇÃO : QUOTE_STATUS.REVISÃO;
      //   }
      // };
      quotePayload.is_calculation_personalized = is_calculation_personalized;
      quotePayload.deductible_amount = deductible_amount ? deductible_amount : null;
      quotePayload.minimum_prize = minimum_prize ? minimum_prize : null;
      quotePayload.premium_calculation_type = premium_calculation_type ? premium_calculation_type : null;
      quotePayload.of_adjustment = of_adjustment ? of_adjustment : null;
      quotePayload.of_claims = of_claims ? of_claims : null;
      quotePayload.stipulation_policy_checkbox = stipulation_policy_checkbox;
      quotePayload.is_moderate = DEFAULT_ENUM.FALSE;
      quotePayload.tax_scvs = tax_scvs;
      quotePayload.tax_ssc = tax_ssc;
      quotePayload.tax_emission = tax_emission;
      quotePayload.tax_iva = tax_iva;
      quotePayload.sub_total = sub_total;
      /* update quote status according to the quotePayload status */
      await this.services.updateQuote({ id: quote_id }, quotePayload);
      /* check if company's moderation setting is on or off */
      if (!isUserLimitExceeds &&
        quoteDetail.user &&
        quoteDetail.user.dataValues &&
        quoteDetail.user.dataValues.company &&
        quoteDetail.user.dataValues.company.dataValues &&
        quoteDetail.user.dataValues.company.dataValues.company_setting &&
        quoteDetail.user.dataValues.company.dataValues.company_setting.moderation_notification &&
        quoteDetail.user.dataValues.company.dataValues.company_setting.moderation_notification == DEFAULT_ENUM.TRUE &&
        net_written_premium) {
        /* check if broker email exist or not */
        if (quoteDetail &&
          quoteDetail.user &&
          quoteDetail.user.company &&
          quoteDetail.user.company.dataValues &&
          quoteDetail.user.company.dataValues.company_setting &&
          quoteDetail.user.company.dataValues.company_setting.moderation_notification_emails) {
          /* send email to the user if his moderation notification is on*/
          const userMsg = {
            to: JSON.parse(quoteDetail.user.dataValues.company.dataValues.company_setting.moderation_notification_emails),
            from: process.env.SENDGRID_USERNAME,
            subject: EmailMessages.QUOTE_APPROVAL,
            html: `Tu cotización ha sido aprobada.`
          };
          sendMail(userMsg);
        }
        /* check if user's responsible person mail exist or not */
        if (quoteDetail &&
          quoteDetail.user &&
          quoteDetail.user.company &&
          quoteDetail.user.company.dataValues &&
          quoteDetail.user.company.dataValues.responsible_detail &&
          quoteDetail.user.company.dataValues.responsible_detail.email) {
          /* send email to the user's responsible */
          const responsibleMsg = {
            to: quoteDetail.user.company.dataValues.responsible_detail.email,
            from: process.env.SENDGRID_USERNAME,
            subject: EmailMessages.QUOTE_APPROVAL,
            html: `La cotización asociada con su corredor ha sido aprobada.`
          };
          sendMail(responsibleMsg);
        }
      }
      /* response message according to the total premium (previously we apply this check based on net written premium) */
      const finalResponseMessage = !total_premium
        ? QuoteMessages.QUOTE_HAS_BEEN_REJECTED
        : isUserLimitExceeds
          ? QuoteMessages.QUOTE_DETAILS_SENT_SUCCESSFULLY
          : QuoteMessages.QUOTE_APPROVED_SUCCESSFULLY;
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
      emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
      /* end */
      return res.send(successResponse(finalResponseMessage, null, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('approve Reject Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */

  /* update quote status */
  async updateQuoteStatus(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    const EmailMessages = req.CommonMessages.email;
    let addApiLogResponse;
    try {
      const { body, user, ip_address } = req;
      const { quote_id, status, status_reason } = body;
      const quoteDetail = await this.services.getQuoteDetailForUpdateQuoteStatus({ id: quote_id });
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
        request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.UPDATE_QUOTE_STATUS,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      const quotePayload = {};
      if (status == QUOTE_STATUS.ACTIVE) {
        /* check if admin and sub admin not logged in */
        quotePayload.activated_at = new Date(),
          quotePayload.status_reason = status_reason ? status_reason : null
      } else {
        /* check if the proposal of the quote is existed or not */
        if (quoteDetail.proposal_detail) {
          return res
            .send(
              successResponse(QuoteMessages.PROPOSAL_IS_IN_PROGRESS, null, RESPONSE_CODES.POST, req.headers.tokenization)
            );
        }
      }
      /* if quote is going to be rejected */
      if (status == QUOTE_STATUS.DECLINADA) {
        /* send email to the user if quote is rejected */
        const msg = {
          to: quoteDetail.user.email,
          from: process.env.SENDGRID_USERNAME,
          subject: EmailMessages.QUOTE_REJECTION,
          html: `Su cotización ha sido rechazada.`
        };
        sendMail(msg);
      }
      quotePayload.status = status;
      /* update quote */
      await this.services.updateQuote({ id: quote_id }, quotePayload);
      /* response based on the quote status */
      const finalResponseMessage = status == QUOTE_STATUS.INACTIVE
        ? QuoteMessages.QUOTE_DISABLED_SUCCESSFULLY
        : status == QUOTE_STATUS.ACTIVE
          ? QuoteMessages.QUOTE_ACTIVATED_SUCCESSFULLY
          : QuoteMessages.QUOTE_STATUS_UPDATED_SUCCESSFULLY;
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
      emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { proposal_id: quoteDetail.proposal_no });
      /* end */
      return res.send(successResponse(finalResponseMessage, null, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('update Quote Status Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization))
    }
  }
  /* end */

  /* create duplicate quote */
  async duplicateQuote(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      const { quote_id, user_id, change_quote_insured } = req.body;
      const quoteDetail = await this.services.getQuoteToDuplicateQuote({ id: quote_id });
      /* if quote detail is not found */
      if (!quoteDetail) {
        return res.send(errorResponse(
          QuoteMessages.QUOTE_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ))
      }
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        // request_id: quoteDetail.id,
        type: PARENT_LOG_TYPE.QUOTE,
        log_type: CHILD_LOG_TYPE.DUPLICATE_QUOTE,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* end */
      /* check for quote status */
      if (quoteDetail.status != QUOTE_STATUS.ACTIVE && quoteDetail.status != QUOTE_STATUS.EMITIDO && quoteDetail.status != QUOTE_STATUS.EM_EMISSÃO) {
        return res.send(errorResponse(QuoteMessages.QUOTE_CANNOT_BE_DUPLICATE, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
      }
      quoteDetail.status = QUOTE_STATUS.ACTIVE;
      /* check if change quote insured flag value is true or false */
      if (change_quote_insured == DEFAULT_ENUM.TRUE) {
        delete quoteDetail.dataValues.company_id;
        quoteDetail.dataValues.change_quote_insured = change_quote_insured;
        quoteDetail.status = QUOTE_STATUS.RASCUNHO
      }
      quoteDetail.duplicate_quote_id = quote_id;
      const uuid = await getUUID();
      quoteDetail.activated_at = new Date();
      quoteDetail.user_id = user_id;
      quoteDetail.uuid = uuid;
      let duplicateQuoteId;
      quoteDetail.moderation_reasons = JSON.stringify(quoteDetail.dataValues.moderation_reasons);
      /* create the duplicate quote of existing quote */
      const duplicateQuote = await this.services.createQuote(quoteDetail.dataValues);
      duplicateQuoteId = duplicateQuote.dataValues.id;
      /* get unique proposal number */
      //const proposalNo = await this.getUniqueProposalNo(duplicateQuoteId, quoteDetail.dataValues.product.product_number);
      /* update proposal number for duplicate quote */
      // await this.services.updateQuote({ id: duplicateQuoteId }, { proposal_no: proposalNo });
      /* check for existing quote additional coverages to create duplicate quote additional coverages*/
      const oldQuoteAdditionalCoverages = quoteDetail.quote_additional_coverages;
      const quoteAdditionalCoverages = [];
      if (oldQuoteAdditionalCoverages) {
        oldQuoteAdditionalCoverages.map(additionalCoverage => {
          additionalCoverage.dataValues.quote_id = duplicateQuoteId;
          quoteAdditionalCoverages.push(additionalCoverage.dataValues);
        });
        /* create duplicate quote additional coverages of existing quote additional coverages*/
        await this.services.bulkCreateQuoteAdditionalCoverages(quoteAdditionalCoverages);
      }
      /* check for existing quote basic coverages to create duplicate quote basic coverages*/
      const oldQuoteBasicCoverages = quoteDetail.quote_basic_coverages;
      const quoteBasicCoverages = [];
      if (oldQuoteBasicCoverages) {
        oldQuoteBasicCoverages.map(basicCoverages => {
          basicCoverages.dataValues.quote_id = duplicateQuoteId;
          quoteBasicCoverages.push(basicCoverages.dataValues);
        });
        /* create duplicate quote basic coverages of existing quote */
        await this.services.bulkCreateQuoteBasicCoverages(quoteBasicCoverages);
      }
      /* check for existing quote additional customer to create duplicate quote additional customer*/
      const oldQuoteAdditionalCustomer = quoteDetail.quote_additional_customers;
      if (oldQuoteAdditionalCustomer) {
        const quoteAdditionalCustomers = [];
        oldQuoteAdditionalCustomer.map(additionalCustomers => {
          additionalCustomers.dataValues.quote_id = duplicateQuoteId;
          quoteAdditionalCustomers.push(additionalCustomers.dataValues);
        });
        /* create duplicate quote additional customers of existing quote */
        await this.services.bulkCreateQuoteAdditionalCustomers(quoteAdditionalCustomers);
      }
      /* check for existing quote calculation to create duplicate quote calculation */
      const oldQuoteCalculation = quoteDetail.quote_calculation;
      if (oldQuoteCalculation) {
        oldQuoteCalculation.dataValues.quote_id = duplicateQuoteId;
        /* create duplicate quote calculations of existing quote */
        await this.services.createQuoteCalculation(oldQuoteCalculation.dataValues);
      }
      /* check duplicate quote transport good of existing quote to create duplicate transport good*/
      const oldTransportGood = quoteDetail.transport_good;
      if (oldTransportGood) {
        oldTransportGood.dataValues.quote_id = duplicateQuoteId;
        /* create duplicate quote transport good of existing quote */
        const duplicateTransportGood = await this.services.createTransportGoods(oldTransportGood.dataValues);
        /* check for existing transport good details to create duplicate transport good details */
        const oldTransportGoodDetails = quoteDetail && quoteDetail.transport_good.transport_good_details;
        if (oldTransportGoodDetails) {
          oldTransportGoodDetails.map(async obj => {
            obj.dataValues.transport_good_id = duplicateTransportGood.id;
            /* create duplicate transport good detail of existing quote */
            await this.services.createTransportGoodDetail(obj.dataValues);
          });
        };
      }
      /* check for existing quote shipment to create duplicate quote shipment */
      const oldQuoteShipment = quoteDetail.quote_shipment;
      if (oldQuoteShipment) {
        oldQuoteShipment.dataValues.quote_id = duplicateQuoteId;
        /* create duplicate quote shipment of existing quote */
        const duplicateQuoteShipment = await this.services.createQuoteShipment(oldQuoteShipment.dataValues);
        /* check for existing quote shipment route details to create duplicate quote shipment route details */
        const oldQuoteShipmentRouteDetails = quoteDetail.quote_shipment.shipment_route_details;
        if (oldQuoteShipmentRouteDetails) {
          oldQuoteShipmentRouteDetails.map(async shipmentRoute => {
            shipmentRoute.dataValues.quote_shipment_id = duplicateQuoteShipment.id;
            /* create duplicate quote shipment route details of existing quote */
            await this.services.createShipmentRouteDetail(shipmentRoute.dataValues);
          });
        }
        /* check for existing quote single shipment detail to create duplicate quote single shipment detail */
        const oldQuoteSingleShipmentDetail = quoteDetail.quote_shipment.single_shipment_detail;
        if (oldQuoteSingleShipmentDetail) {
          oldQuoteSingleShipmentDetail.dataValues.quote_shipment_id = duplicateQuoteShipment.id;
          /* create duplicate quote single shipment details of existing quote */
          await this.services.createSingleShipmentDetail(oldQuoteSingleShipmentDetail.dataValues);
        }
        /* check for existing quote shipment documents to create duplicate quote shipment documents */
        const oldQuoteShipmentDocuments = quoteDetail.quote_shipment.shipment_documents;
        if (oldQuoteShipmentDocuments) {
          const uploadQuoteShipmentDoc = [];
          oldQuoteShipmentDocuments.map(shipmentDocuments => {
            shipmentDocuments.dataValues.quote_shipment_id = duplicateQuoteShipment.id;
            uploadQuoteShipmentDoc.push(shipmentDocuments.dataValues);
          });
          /* create duplicate quote shipment documents of existing quote */
          await this.services.bulkCreateShipmentDocuments(uploadQuoteShipmentDoc);
        }
      }
      /* check for existing quote claim to create duplicate quote claim */
      const oldQuoteClaim = quoteDetail.quote_claim;
      if (oldQuoteClaim) {
        oldQuoteClaim.dataValues.quote_id = duplicateQuoteId;
        /* create duplicate quote claim of existing quote */
        const duplicateQuoteClaim = await this.services.createQuoteClaim(oldQuoteClaim.dataValues);
        /* check for existing quote claim details to create duplicate quote claim details */
        const oldQuoteClaimDetails = quoteDetail.quote_claim.quote_claim_details
        if (oldQuoteClaimDetails) {
          const quoteClaimDetail = [];
          oldQuoteClaimDetails.map(quoteClaim => {
            quoteClaim.dataValues.quote_claim_id = duplicateQuoteClaim.id;
            quoteClaimDetail.push(quoteClaim.dataValues)
          });
          /* create duplicate quote claim details of existing quote */
          await this.services.bulkCreateQuoteClaimDetails(quoteClaimDetail);
        }
        /* check for existing quote claim documents to create duplicate quote claim documents */
        const oldQuoteClaimDocuments = quoteDetail.quote_claim.quote_claim_documents;
        if (oldQuoteClaimDocuments) {
          const uploadedQuoteClaimDoc = [];
          oldQuoteClaimDocuments.map(quoteClaimDocuments => {
            quoteClaimDocuments.dataValues.quote_claim_id = duplicateQuoteClaim.id;
            uploadedQuoteClaimDoc.push(quoteClaimDocuments.dataValues);
          });
          /* create duplicate quote claim documents of existing quote */
          await this.services.bulkCreateQuoteClaimDocuments(uploadedQuoteClaimDoc);
        }
      }
      /* check for existing quote risk to create duplicate quote risk */
      const oldQuoteRisk = quoteDetail.quote_risk;
      if (oldQuoteRisk) {
        oldQuoteRisk.dataValues.quote_id = duplicateQuoteId;
        /* create duplicate quote risk of existing quote */
        const duplicateQuoteRisk = await this.services.createQuoteRisk(oldQuoteRisk.dataValues);
        /* check for existing quote risk documents to create duplicate quote risk documents */
        const oldQuoteRiskDocuments = quoteDetail.quote_risk.quote_risk_documents;
        if (oldQuoteRiskDocuments) {
          const uploadedQuoteRiskDoc = [];
          oldQuoteRiskDocuments.map(quoteRiskDocuments => {
            quoteRiskDocuments.dataValues.quote_risk_id = duplicateQuoteRisk.id;
            uploadedQuoteRiskDoc.push(quoteRiskDocuments.dataValues);
          });
          /* create duplicate quote risk documents of existing quote */
          await this.services.bulkCreateQuoteRiskDocuments(uploadedQuoteRiskDoc);
        }
      }
      /* check for existing quote documents to create duplicate quote documents */
      const oldQuoteDocuments = quoteDetail.quote_documents;
      if (oldQuoteDocuments) {
        const uploadedQuoteDocuments = [];
        oldQuoteDocuments.map(quoteDocuments => {
          quoteDocuments.dataValues.quote_id = duplicateQuoteId;
          uploadedQuoteDocuments.push(quoteDocuments.dataValues);
        });
        /* create duplicate quote documents of existing quote */
        await this.services.bulkCreateQuoteDocuments(uploadedQuoteDocuments);
      }
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          request_id: duplicateQuoteId,
          response: quoteDetail.uuid,
          message: CommonMessages.DATA_LOADED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, quoteDetail.uuid, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('duplicate Quote Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */

  /* get quote detail for moderation */
  async getQuoteDetailForModeration(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    try {
      const { uuid } = req.body;
      const selectedGoodIds = [];
      const quoteDetail = await this.services.quoteDetailForModeration({ uuid: uuid });
      /* return good names corresponding to the quote transport good details  */
      if (quoteDetail.transport_good && quoteDetail.transport_good.transport_good_details) {
        for (let ele of quoteDetail.transport_good.transport_good_details) {
          const goodNames = [];
          const goodsDetail = await this.services.getGoodsForModeration({ id: JSON.parse(ele.good_id) });
          goodsDetail.map(obj => {
            goodNames.push(obj.name);
          });
          ele.dataValues.good_name = goodNames;
          /* for annual insurance type need to get the not selected goods */
          if (quoteDetail.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL) {
            selectedGoodIds.push(...JSON.parse(ele.good_id))
          }
        }
      };
      if (quoteDetail.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL) {
        const notSelectedGoods = await this.getNotSelectedGoods(selectedGoodIds);
        quoteDetail.dataValues.not_selected_goods = notSelectedGoods;
      };
      /* socket emission */
      emitSocketEvent(SOCKET_EVENTS.ADD_UPDATE_QUOTE_CALCULATION, { quote_id: quoteDetail.id });
      //emitSocketEvent(SOCKET_EVENTS.QUOTE_STATUS_UPDATE_SUCCESS, { quote_id: quoteDetail.id });
      /* end */
      return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, quoteDetail, RESPONSE_CODES.POST, req.headers.tokenization))
    } catch (error) {
      console.log(error);
      logger.error('get Quote Detail For Moderation Error', error);
      return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */

  async calculateTaxes(gross_written_premium) {
    // Calculate tax_scvs (3.5% of gross_written_premium)
    const tax_scvs = get2Decimal(gross_written_premium * 0.035);
    // Calculate tax_ssc (0.5% of gross_written_premium)
    const tax_ssc = get2Decimal(gross_written_premium * 0.005);
    // Calculate tax_emmssion based on conditions
    let tax_emmssion;
    if (gross_written_premium <= 250) {
      tax_emmssion = 0.50;
    } else if (gross_written_premium <= 500) {
      tax_emmssion = 1;
    } else if (gross_written_premium <= 1000) {
      tax_emmssion = 3;
    } else if (gross_written_premium < 2000) {
      tax_emmssion = 5;
    } else if (gross_written_premium > 2000) {
      tax_emmssion = 5;   //as per discussion
    } else {
      tax_emmssion = 0;
    }
    // Calculate subtotal (gross_written_premium + tax_scvs + tax_ssc + tax_emmssion)
    const subtotal = gross_written_premium + tax_scvs + tax_ssc + tax_emmssion;
    // Calculate tax_iva (15% of subtotal)
    const tax_iva = get2Decimal(subtotal * 0.15);
    // Calculate total_amount (subtotal + tax_iva)
    const total_amount = get6Decimal(subtotal + tax_iva);
    // Return an object with all calculated values
    return {
      grossValue: gross_written_premium,
      tax_scvs: tax_scvs,
      tax_ssc: tax_ssc,
      tax_emmssion: tax_emmssion,
      subtotal: subtotal,
      tax_iva: tax_iva,
      total_amount: total_amount
    };
  }

  /* get quote pdf */
  async getQuotePdf(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    try {
      const { params, user } = req;
      let quoteDetail = await this.services.getAllQuoteDetail({ id: params.quote_id });
      let currency = quoteDetail.transport_good.currency == DEFAULT_ENUM.TRUE ? 'BRL' : 'USD';
      /* return if quote does not exist */
      if (!quoteDetail) {
        return res.send(errorResponse(
          QuoteMessages.QUOTE_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      /* if quote is not active then return */
      if (quoteDetail.status != QUOTE_STATUS.ACTIVE && quoteDetail.status != QUOTE_STATUS.EM_EMISSÃO && quoteDetail.status != QUOTE_STATUS.EMITIDO) {
        return res.send(errorResponse(
          QuoteMessages.QUOTE_NOT_ACTIVE,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      /* if quote is already emitido and quote pdf exists */
      if (quoteDetail.status == QUOTE_STATUS.EMITIDO && quoteDetail.quote_pdf) {
        /* check pdf data exists on server or not */
        try {
          const result = await getFileFromServer(quoteDetail.quote_pdf);
          if (result) {
            return res
              .send(
                successResponse(QuoteMessages.DATA_LOADED_SUCCESS, quoteDetail.quote_pdf, RESPONSE_CODES.GET, req.headers.tokenization)
              );
          };
        } catch (error) {
          console.log('error while getting quote pdf from server', error)
        }
      };
      /* return good names corresponding to the quote transport good details  */
      if (quoteDetail.transport_good && quoteDetail.transport_good.transport_good_details) {
        for (let ele of quoteDetail.transport_good.transport_good_details) {
          const goodNames = [];
          const goodsDetail = await this.services.getGoodsForModeration({ id: JSON.parse(ele.good_id) });
          goodsDetail.map(obj => {
            goodNames.push(obj.name);
          });
          ele.dataValues.good_name = goodNames;
        };
      };

      let grossWrittenPremium;
      let totalPremium;
      let insurance_rate;
      let tax_emission;
      let tax_iva;
      let tax_scvs;
      let tax_ssc;
      let sub_total;
      let totalInsuranceCost;
      if (quoteDetail.quote_calculation) {
        if (quoteDetail.is_calculation_personalized == 0) {
          /* standard calculation */
          totalPremium = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_total_premium ? quoteDetail.quote_calculation.standard_total_premium : 0;
          grossWrittenPremium = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_gross_written_premium ? quoteDetail.quote_calculation.standard_gross_written_premium : 0;
          quoteDetail.deductible_name = quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_deductible && quoteDetail.quote_calculation.standard_deductible.name ? quoteDetail.quote_calculation.standard_deductible.name : null;
          insurance_rate = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_insurance_rate ? quoteDetail.quote_calculation.standard_insurance_rate : 0;
          tax_scvs = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_tax_scvs ? quoteDetail.quote_calculation.standard_tax_scvs : 0;
          tax_ssc = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_tax_ssc ? quoteDetail.quote_calculation.standard_tax_ssc : 0;
          tax_iva = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_tax_iva ? quoteDetail.quote_calculation.standard_tax_iva : 0;
          tax_emission = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_tax_emission ? quoteDetail.quote_calculation.standard_tax_emission : 0;
          sub_total = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_sub_total ? quoteDetail.quote_calculation.standard_sub_total : 0;
          totalInsuranceCost = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_total_insurance_cost ? quoteDetail.quote_calculation.standard_total_insurance_cost : 0;
        } else {
          /* personalized calculation */
          totalPremium = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_total_premium ? quoteDetail.quote_calculation.personalized_total_premium : 0;
          grossWrittenPremium = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_gross_written_premium ? quoteDetail.quote_calculation.personalized_gross_written_premium : 0;
          quoteDetail.deductible_name = quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_deductible && quoteDetail.quote_calculation.personalized_deductible.name ? quoteDetail.quote_calculation.personalized_deductible.name : null;
          insurance_rate = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_insurance_rate ? quoteDetail.quote_calculation.personalized_insurance_rate : 0;
          tax_scvs = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_tax_scvs ? quoteDetail.quote_calculation.personalized_tax_scvs : 0;
          tax_ssc = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_tax_ssc ? quoteDetail.quote_calculation.personalized_tax_ssc : 0;
          tax_iva = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_tax_iva ? quoteDetail.quote_calculation.personalized_tax_iva : 0;
          tax_emission = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_tax_emission ? quoteDetail.quote_calculation.personalized_tax_emission : 0;
          sub_total = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_sub_total ? quoteDetail.quote_calculation.personalized_sub_total : 0;
          totalInsuranceCost = quoteDetail && quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_total_insurance_cost ? quoteDetail.quote_calculation.personalized_total_insurance_cost : 0;
        }
      };
      let source;
      let destination;
      if (quoteDetail.insurance_type_id == INSURANCE_TYPE_ID.SINGLE) {
        source = quoteDetail.quote_shipment && quoteDetail.quote_shipment.shipment_route_details && quoteDetail.quote_shipment.shipment_route_details.length > 0
          ? `${quoteDetail.quote_shipment.shipment_route_details[0].source_detail.name}` : null;

        destination = quoteDetail.quote_shipment && quoteDetail.quote_shipment.shipment_route_details && quoteDetail.quote_shipment.shipment_route_details.length > 0
          ? `${quoteDetail.quote_shipment.shipment_route_details[0].destiny_detail.name}` : null;
      }
      let goodsValueAndFees = 0;
      if (quoteDetail.insurance_type_id == INSURANCE_TYPE_ID.SINGLE) {
        for (let ele of quoteDetail.transport_good.transport_good_details) {
          goodsValueAndFees += (ele.valor_da_mercadoria + ele.freight);
        }
      };
      // const total_limit = quoteDetail.transport_good && quoteDetail.transport_good.total_limit ? quoteDetail.transport_good.total_limit : 0;
      // console.log('totalPremium', totalPremium);
      // const result = await this.calculateTaxes(totalPremium);
      //console.log('result121212121', result);
      // return
      const payload = {
        quote_created_at: moment(quoteDetail.createdAt).format('DD/MM/YYYY'),
        quote_company_name: quoteDetail.quote_company && quoteDetail.quote_company.company_name ? quoteDetail.quote_company.company_name : null,
        user_company_name: quoteDetail.user && quoteDetail.user.company && quoteDetail.user.company.company_name ? quoteDetail.user.company.company_name : null,
        company_ruc: quoteDetail.quote_company && quoteDetail.quote_company.ruc ? quoteDetail.quote_company.ruc : null,
        product_name: quoteDetail.product && quoteDetail.product.name ? quoteDetail.product.name : null,
        product_id: quoteDetail.product_id ? quoteDetail.product_id : null,
        insurance_type_name: quoteDetail.insurance_type && quoteDetail.insurance_type.name ? quoteDetail.insurance_type.name : null,
        total_limit: quoteDetail.transport_good && quoteDetail.transport_good.total_limit ? convertToBrazilCurrency(quoteDetail.transport_good.total_limit, currency) : null,
        deductible_name: quoteDetail.deductible_name
          ? quoteDetail.deductible_name == 'OPÇÃO 1'
            ? ''
            : quoteDetail.deductible_name
          : 'Não aplicável',
        goods: quoteDetail.transport_good && quoteDetail.transport_good.transport_good_details ? quoteDetail.transport_good.transport_good_details : null,
        responsible_name: quoteDetail.user && quoteDetail.user.company && quoteDetail.user.company.responsible_detail && quoteDetail.user.company.responsible_detail.name ? quoteDetail.user.company.responsible_detail.name : null,
        insurance_type_id: quoteDetail.insurance_type_id ? quoteDetail.insurance_type_id : null,
        quote_company_address: quoteDetail.quote_company && quoteDetail.quote_company.company_address && quoteDetail.quote_company.company_address.dataValues ? quoteDetail.quote_company.company_address.dataValues : null,
        goods_value_and_fees: convertToBrazilCurrency(get6Decimal(goodsValueAndFees), currency),
        expenses_percentage: quoteDetail && quoteDetail.transport_good && quoteDetail.transport_good.transport_good_details[0] && quoteDetail.transport_good.transport_good_details[0].expenses_percentage ? quoteDetail.transport_good.transport_good_details[0].expenses_percentage : null,
        source: source,
        destination: destination,
        quote_additional_coverages: quoteDetail && quoteDetail.quote_additional_coverages ? quoteDetail.quote_additional_coverages.map(coverage => coverage.dataValues.name)
          : [],
        quote_basic_coverages: quoteDetail && quoteDetail.quote_basic_coverages
          ? quoteDetail.quote_basic_coverages.map(coverage => coverage.dataValues.name)
          : [],
        // grossValue: convertToBrazilCurrency(result.grossValue, currency),
        // tax_scvs: convertToBrazilCurrency(get2Decimal(result.tax_scvs), currency),
        // tax_ssc: convertToBrazilCurrency(get2Decimal(result.tax_ssc), currency),
        // tax_emmssion: convertToBrazilCurrency(result.tax_emmssion, currency),
        // subtotal: convertToBrazilCurrency(result.subtotal, currency),
        // tax_iva: convertToBrazilCurrency(get2Decimal(result.tax_iva), currency),
        // total_amount: convertToBrazilCurrency(result.total_amount, currency),
        grossValue: convertToBrazilCurrency(totalPremium, currency),
        tax_scvs: convertToBrazilCurrency(get2Decimal(tax_scvs), currency),
        tax_ssc: convertToBrazilCurrency(get2Decimal(tax_ssc), currency),
        tax_emission: convertToBrazilCurrency(get2Decimal(tax_emission), currency),
        sub_total: convertToBrazilCurrency(sub_total, currency),
        tax_iva: convertToBrazilCurrency(get2Decimal(tax_iva), currency),
        total_amount: convertToBrazilCurrency(totalInsuranceCost, currency),
        insurance_rate: insurance_rate ? insurance_rate : 0,
        //total_insurance_cost: convertToBrazilCurrency(total_insurance_cost, currency)
      };
      let template = jsRender.templates('./public/pdfs/quote-pdf.html')
      let html = template.render(payload);
      const opts = {
        headless: true,
        args: ['--no-sandbox', '--disabled-setupid-sandbox'],
      };
      const browser = await puppeteer.launch(opts);
      const page = await browser.newPage();
      await page.setContent(html);
      const quotePdf = await page.pdf({
        // path: 'quote.pdf',
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
      let buf = quotePdf;
      let filePayload = {
        Key: quoteDetail && quoteDetail.quote_company && quoteDetail.quote_company.company_name ? `${quoteDetail.quote_company.company_name}_${quoteDetail.product.name}_${quoteDetail.id}_${Date.now()}.pdf` : `${quoteDetail.product.name}_${quoteDetail.id}_${Date.now()}.pdf`,
        Body: buf,
        folderName: `quotes/${quoteDetail.id}`
      };
      if (quoteDetail.quote_pdf) {
        try {
          await getFileFromServer(quoteDetail.quote_pdf);
          await deleteFileFromServer(quoteDetail.quote_pdf);
        } catch (error) {
          console.log('error :>> ', error);
        }
      };
      let fileUploadResult = await uploadFileToServer(filePayload);
      const quotePayload = {
        quote_pdf: fileUploadResult && fileUploadResult.Location ? fileUploadResult.Location : null,
      }
      await this.services.updateQuote({ id: quoteDetail.id }, quotePayload);
      // const query = {
      //   quote_id: quoteDetail.id
      // }
      // await this.services.updateQuoteCalculation({ standard_total_premium: payload.total_amount }, query)
      if (params.from_duplicate_quote) {
        console.log("returned for the duplicate function================");
        return;
      };
      return res
        .send(
          successResponse(QuoteMessages.CALCULATION_ADDED_SUCCESS, quotePayload.quote_pdf, RESPONSE_CODES.GET, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('get Quote Pdf Error', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    };
  }
  /* end */

  /* update moderation status of the quote for single insurance type */
  async checkAllModerationConditionsForTheQuoteNew(
    quoteId,
    user,
    QuoteMessages
  ) {
    try {
      const quoteDetail = await this.services.quoteModerationDetails({ id: quoteId });
      const moderation_reasons = {};
      let isQuoteNeedToBeModerated = DEFAULT_ENUM.FALSE;
      /* check if the quote with the same insurance type, product id and ruc is rejected in the past */
      const isSameQuoteRejected = await this.services.getQuoteExistence(
        {
          insurance_type_id: quoteDetail.insurance_type_id,
          product_id: quoteDetail.product_id,
          company_id: quoteDetail.company_id,
          status: QUOTE_STATUS.DECLINADA,
        }
      );
      /* if same declined quote exists in past then quote needs to be moderated */
      if (isSameQuoteRejected) {
        moderation_reasons.declined_quote = QuoteMessages.QUOTE_ALREADY_DECLINED;
      };
      /*  if the quote is in unfinished state */
      if (quoteDetail.status == QUOTE_STATUS.RASCUNHO) {
        /* check if the emitido quote(if proposal for the quote is created) with the same product id and ruc exists */
        const isSameEmitidoQuote = await this.services.getQuoteExistence(
          {
            product_id: quoteDetail.product_id,
            company_id: quoteDetail.company_id,
            status: QUOTE_STATUS.EMITIDO,
          }
        );
        if (isSameEmitidoQuote) {
          moderation_reasons.existing_quote = QuoteMessages.QUOTE_ALREADY_EMITIDO;
        }
      };
      /* check if broker limit exceeds then quote needs to be moderated */
      // const brokerCategory = await this.services.getBrokerCategory({ id: quoteDetail.user.company.authority_level_id });
      const brokerCategory = await this.services.getBrokerCategory({ id: quoteDetail.user.authority_level_id });
      //const checkUserLimitResult = await checkUserQuoteLimit(quoteDetail, brokerCategory, currencyExchangeRate.rate);
      const checkUserLimitResult = await checkUserQuoteLimit(quoteDetail, brokerCategory);
      /* if sub admin limit exceeds the quote total limit means quote needs to be moderated and reviewed by higher administration  */
      if (checkUserLimitResult) {
        moderation_reasons.limit = quoteDetail.transport_good.total_limit;
      };
      /* check if sub admin limit exceeds then quote needs to be moderated */
      let isUserLimitExceeds = DEFAULT_ENUM.FALSE;
      if (user.role_id == ROLES.SUB_ADMIN) {
        // const subAdminCategory = await this.services.getBrokerCategory({ id: user.dataValues.company.dataValues.authority_level_id });
        const subAdminCategory = await this.services.getBrokerCategory({ id: user.authority_level_id });
        //const checkUserLimitResult = await checkUserQuoteLimit(quoteDetail, subAdminCategory, currencyExchangeRate.rate);
        const checkUserLimitResult = await checkUserQuoteLimit(quoteDetail, subAdminCategory);
        /* if sub admin limit exceeds the quote total limit means quote needs to be moderated and reviewed by higher administration  */
        if (checkUserLimitResult) {
          isUserLimitExceeds = DEFAULT_ENUM.TRUE;
        };
      }
      if (quoteDetail.quote_calculation) {
        /* get the quote calculation as per the calculation type that is standard or personalized */
        if (quoteDetail.is_calculation_personalized == DEFAULT_ENUM.TRUE) {
          /* personalized calculation */
          quoteDetail.commission = quoteDetail.quote_calculation.personalized_commission_percentage;
          quoteDetail.discount = quoteDetail.quote_calculation.personalized_deductible && quoteDetail.quote_calculation.personalized_deductible.discount != null ? quoteDetail.quote_calculation.personalized_deductible.discount : null;
          quoteDetail.deductible_name = quoteDetail.quote_calculation && quoteDetail.quote_calculation.personalized_deductible && quoteDetail.quote_calculation.personalized_deductible.name ? quoteDetail.quote_calculation.personalized_deductible.name : null;
          quoteDetail.discount_aggravate_percentage = quoteDetail.quote_calculation.personalized_discount_aggravate_percentage;
        } else {
          /* standard calculation */
          quoteDetail.commission = quoteDetail.quote_calculation.standard_commission_percentage;
          quoteDetail.discount = quoteDetail.quote_calculation.standard_deductible && quoteDetail.quote_calculation.standard_deductible.discount != null ? quoteDetail.quote_calculation.standard_deductible.discount : null;
          quoteDetail.deductible_name = quoteDetail.quote_calculation && quoteDetail.quote_calculation.standard_deductible && quoteDetail.quote_calculation.standard_deductible.name ? quoteDetail.quote_calculation.standard_deductible.name : null;
          quoteDetail.discount_aggravate_percentage = quoteDetail.quote_calculation.standard_discount_aggravate_percentage;
        }
        /* if user edit his quote  */
        quoteDetail.commission = quoteDetail.quote_calculation.standard_commission_percentage;
        if (quoteDetail.discount == DEFAULT_ENUM.FALSE) {
          moderation_reasons.deductibles = quoteDetail.deductible_name;
        };
        /* check broker limit exceeds the quote limit */
        // const userCategory = await this.services.getBrokerCategory({ id: quoteDetail.user.company.authority_level_id });
        // if (quoteDetail.discount_aggravate_percentage > userCategory.discount_load) {
        //   moderation_reasons.discount_load = quoteDetail.discount_aggravate_percentage;
        // };
      };
      /* check if quote commission is greater than quote's user authority level commission */
      // if (quoteDetail.commission > quoteDetail.user.authority_levels.commission) {
      //   moderation_reasons.commission = quoteDetail.commission;
      // };
      /* check the transport goods details and their names and moderation status */
      if (quoteDetail.transport_good && quoteDetail.transport_good.transport_good_details) {
        const goodIds = [];
        quoteDetail.transport_good.transport_good_details.map(ele => {
          goodIds.push(JSON.parse(ele.good_id));
        });
        /* Flatten the array to get the list of IDs */
        const flatGoodIds = goodIds.flat();
        if (goodIds.length > 0) {
          const goodNames = {
            "Mercadería no permitida": [],
            "Mercadería Riesgo Alto": [],
          };
          const goodsDetail = await this.services.getGoodsForModeration({ id: flatGoodIds, is_moderate: DEFAULT_ENUM.TRUE });
          goodsDetail.map(obj => {
            if (obj.obs == 'Mercadería no permitida') {
              goodNames['Mercadería no permitida'].push(obj.name);
            }
            if (obj.obs == 'Mercadería Riesgo Alto') {
              goodNames['Mercadería Riesgo Alto'].push(obj.name);
            }
          });
          if (goodNames['Mercadería no permitida'].length > 0 || goodNames['Mercadería Riesgo Alto'].length) {
            /* Remove empty properties */
            Object.keys(goodNames).forEach(key => {
              if (goodNames[key].length === 0) {
                delete goodNames[key];
              }
            });
          }
          if (goodsDetail &&
            goodsDetail.length > 0 &&
            quoteDetail.insurance_type_id == INSURANCE_TYPE_ID.ANNUAL &&
            quoteDetail.quote_claim) {
            moderation_reasons.goods_type = goodNames;
          } else if (goodsDetail &&
            goodsDetail.length > 0 &&
            quoteDetail.insurance_type_id == INSURANCE_TYPE_ID.SINGLE) {
            moderation_reasons.goods_type = goodNames;
          }
        };
        /* check if expenses percentage is greater then 10 for flow 1 */
        if (quoteDetail.transport_good.transport_good_details.find(obj => obj.expenses_percentage > 10)) {
          if (quoteDetail.transport_good.transport_good_details[0].expenses_percentage > 10) {
            moderation_reasons.expenses_percentage = quoteDetail.transport_good.transport_good_details[0].expenses_percentage;
          };
        }
      }
      /* for flow 1 we need to check the standard total limit  */
      if (quoteDetail.insurance_type_id == INSURANCE_TYPE_ID.SINGLE) {
        const standardTotalLimit = 1000000;
        if (quoteDetail.transport_good) {
          if (quoteDetail.transport_good.total_limit > standardTotalLimit) {
            moderation_reasons.limit = quoteDetail.transport_good.total_limit;
          }
        };
      };
      /* after all the above checks if the quote needs to be moderated then update the quote as moderated */
      if (Object.keys(moderation_reasons).length > 0 || isQuoteNeedToBeModerated == DEFAULT_ENUM.TRUE) {
        let payload = {};
        payload = {
          status: QUOTE_STATUS.MODERAÇÃO,
          is_moderate: IS_MODERATE.TRUE,
          display_moderation: DEFAULT_ENUM.TRUE,
          moderation_reasons: JSON.stringify(moderation_reasons)
        }
        /* if sub admin is logged in then we need to check if sub admin has the authority for the quote limit */
        if (user.role_id == ROLES.SUB_ADMIN && isUserLimitExceeds) {
          payload.moderated_by_sub_admin_limit = DEFAULT_ENUM.TRUE;
          moderation_reasons.authority = QuoteMessages.ABOVE_UNDERWRITER_AUTONOMY
          /* if sub admin limit exceeds means quote need to be moderated */
          await this.services.updateQuote({ id: quoteDetail.id }, payload);
        };
        /* if admin or subadmin is not logged in then no need to make the quote moderated just update the updateat of the quote */
        if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN) {
          /* update quote */
          payload.activated_at = null;
          await this.services.updateQuote({ id: quoteDetail.id }, payload);
        }
      };
      return;
    } catch (error) {
      console.log(error);
    }
  }
  /* end */
}