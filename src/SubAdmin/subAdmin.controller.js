import { Op } from "sequelize";
import { CHILD_LOG_TYPE, CURRENCY_ID, DEFAULT_ENUM, PARENT_LOG_TYPE, QUOTE_STATUS, RESPONSE_CODES, ROLES, USER_STATUS } from "../../config/constants";
import { errorResponse, successResponse, successResponseWithPagination } from "../../config/responseHandlers";
import { addUpdateCompanyDetail, getUUID, saveApilogs, updateApilogs } from "../helpers/commonFunction";
import { refreshToken } from '../helpers/jwt';
import logger from '../helpers/logger';
import { sendMail } from "../services/sendGrid";
import Services from "./subAdmin.services";
export default class SubAdmin {
  async init(db) {
    this.services = new Services();
    this.Models = db.models;
    await this.services.init(db);
  }
  /* add sub admin */
  async addSubAdmin(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      req.body.created_by_id = req.user.id;
      const {
        password,
        name,
        phone,
        authority_level_id,
        created_by_id,
      } = req.body;
      /* check email already exists */
      let email = req.body.email.toLowerCase();
      const isEmailExists = await this.services.getUserByEmail(email);
      if (isEmailExists) {
        return res.send(errorResponse(
          authMessages.EMAIL_ALREADY_EXIST,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      req.body.role_id = ROLES.ADMIN;
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        // request_id: proposalNo,
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.ADD_SUB_ADMIN,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* add update user company and its address */
      const addUpdateCompanyResult = await addUpdateCompanyDetail(req.body, this.Models);
      /* generate uuid */
      const uuid = await getUUID();
      /* add user */
      const userPayload = {
        company_id: addUpdateCompanyResult && addUpdateCompanyResult.company_id ? addUpdateCompanyResult.company_id : null,
        role_id: ROLES.SUB_ADMIN,
        name,
        email,
        password,
        phone,
        uuid,
        created_by_id,
        status: USER_STATUS.ACTIVE
      };
      const addUser = await this.services.createUser(userPayload);
      /* add user detail */
      // const userDetailPayload = {
      //   user_id: addUser.id,
      //   authority_level_id,
      // };
      //await this.services.createUserDetail(userDetailPayload);
      /* send email for the password reset */
      let token = refreshToken({
        email: addUser.email,
        user_id: addUser.id,
      });
      const result = await this.services.getUserById(addUser.id);
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          request_id: result.id,
          response: JSON.stringify(result),
          message: authMessages.USER_ADDED
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(authMessages.USER_ADDED, result, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('add Sub Admin Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* update sub admin */
  async updateSubAdmin(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { params, body, ip_address, user } = req;
      /* check if the sub admin is updating his own profile */
      if (req.user && req.user.role_id == ROLES.SUB_ADMIN && req.user.uuid != params.uuid) {
        return res.send(errorResponse(
          CommonMessages.UNAUTHORIZED_USER,
          null,
          RESPONSE_CODES.UNAUTHORIZED,
          req.headers.tokenization
        ));
      };
      /* check user exists or not */
      const isUserExists = await this.services.getUser({ uuid: params.uuid, deleted_at: null });
      if (!isUserExists) {
        return res.send(errorResponse(
          authMessages.USER_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: isUserExists.id,
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.UPDATE_SUB_ADMIN,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      let id = isUserExists.dataValues.id;
      if (body.email) {
        /* check if the email to be updated already exists */
        const isEmailAlreadyExists = await this.services.getUser({ email: body.email });
        if (isEmailAlreadyExists && isEmailAlreadyExists.dataValues.id != id) {
          return res.send(errorResponse(
            authMessages.EMAIL_ALREADY_REGISTERED,
            null,
            RESPONSE_CODES.BAD_REQUEST,
            req.headers.tokenization
          ));
        };
      };
      /* user payload */
      const userPayload = {
        name: body.name,
        email: body.email,
        phone: body.phone
      };
      /* updating the user */
      await this.services.updateUser(userPayload, { id: isUserExists.dataValues.id });
      /* company payload */
      const companyPayload = {
        company_name: body.company_name,
        ruc: body.ruc,
        authority_level_id: body.authority_level_id
      }
      /* update user detail */
      await this.services.updateUserDetail(companyPayload, { id: isUserExists.dataValues.company_id });
      const result = await this.services.getUser({ id: id });
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: authMessages.USER_UPDATED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res
        .send(
          successResponse(authMessages.USER_UPDATED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('update Sub Admin Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get sub admin by id */
  async getSubAdminById(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { uuid } = req.params;
      /* check if the sub admin is getting his own profile */
      if (req.user && req.user.role_id == ROLES.SUB_ADMIN && req.user.uuid != uuid) {
        return res.send(errorResponse(
          CommonMessages.UNAUTHORIZED_USER,
          null,
          RESPONSE_CODES.UNAUTHORIZED,
          req.headers.tokenization
        ));
      };
      const result = await this.services.getUser({
        uuid,
        deleted_at: null,
        role_id: ROLES.SUB_ADMIN
      });
      return res
        .send(
          successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('get Sub Admin By Id Error, ', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get all sub admin */
  async getAllSubAdmin(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { body } = req;
      let query = {
        deleted_at: null,
        role_id: ROLES.SUB_ADMIN,
      };
      if (body.status) {
        query.status = body.status;
      };
      const result = await this.services.getAllSubAdminList(query, body);
      body.start = 0;
      body.length = 0;
      const resultWithoutPagination = await this.services.getAllSubAdminList(query, body);
      const recordsTotal = resultWithoutPagination.length;
      const recordsFiltered = resultWithoutPagination.length;
      return res.send(
        successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get All Sub Admin Error, ', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* quote assign to sub admin */
  async quoteAssignToSubAdmin(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    const authMessages = req.CommonMessages.auth;
    const EmailMessages = req.CommonMessages.email;
    let addApiLogResponse;
    try {
      const { body, ip_address, user } = req;
      const quoteDetail = await this.services.getQuoteDetailsForSubadmin({ id: body.quote_id });
      if (!quoteDetail) {
        return res.send(errorResponse(
          QuoteMessages.QUOTE_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      const isSubAdminExist = await this.services.getSubAdminById({ id: body.sub_admin_id, deleted_at: null });
      if (!isSubAdminExist) {
        return res.send(errorResponse(
          authMessages.USER_NOT_FOUND,
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
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.QUOTE_ASSIGN_TO_SUB_ADMIN,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      await this.services.updateQuote({ status: QUOTE_STATUS.REVISÃO, review_user_id: body.sub_admin_id }, { id: body.quote_id });
      /* TODO: Need the template id  */
      // const mailPayload = {
      //   //"user_name": isSubAdminExist.name,
      //   "sub_admin_name": isSubAdminExist.name,
      //   "customer_name": quoteDetail.quote_company.company_name,
      //   "product_name": quoteDetail.product_details.name,
      //   "insurance_type_name": quoteDetail.insurance_type.name,
      //   //  "desire_limit": quoteDetail.transport_good.total_limit,
      //   "moderation_reason": quoteDetail.status_reason,
      //   //   "sub_admin_content": messages.length && messages[0].message ? messages[0].message : 'N/A',
      //   //"quote_link": `${links.urls}quotes/list/${btoa(body.quote_id)}`
      // }
      const msg = {
        to: isSubAdminExist.email,
        from: process.env.SENDGRID_USERNAME,
        subject: EmailMessages.QUOTE_APPROVAL_REQUEST,
        html: `Você recebeu uma cotação com ID de cotação ${quoteDetail.id}.`
      };
      sendMail(msg);
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: null,
          message: QuoteMessages.QUOTE_SENT_FOR_REVIEW_SUCCESSFULLY
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(QuoteMessages.QUOTE_SENT_FOR_REVIEW_SUCCESSFULLY, null, RESPONSE_CODES.POST, req.headers.tokenization))
    } catch (error) {
      console.log(error);
      logger.error('quote Assign To Sub Admin Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization))
    }
  }
  /* end */

  /* get list of sub admins who have high authorities than total limit of the quote */
  async getHigherAuthoritySubAdmins(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    try {
      const { params } = req;
      /* get quote detail */
      const quoteDetail = await this.services.getQuoteDetail({ id: params.quote_id });
      /* if quote detail not found */
      if (!quoteDetail) {
        return res.send(errorResponse(
          QuoteMessages.QUOTE_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ))
      };
      let getConvertedAmount;
      getConvertedAmount = quoteDetail && quoteDetail.transport_good && quoteDetail.transport_good.total_limit ? quoteDetail.transport_good.total_limit : 0;
      /* convert the total limit in real currency if it is in usd */
      // if (quoteDetail && quoteDetail.transport_good && quoteDetail.transport_good.currency == CURRENCY_ID.USD$) {
      //   getConvertedAmount = await getReal$Amount(this.Models, quoteDetail.transport_good.total_limit)
      // }
      /* get the higher authority level ids from total limit */
      const getAuthorityLevelIds = await this.services.getAuthorityLevelIds({
        imp_exp_limit: {
          [Op.gt]: getConvertedAmount
        }, is_active: DEFAULT_ENUM.TRUE
      })
      /* get sub admins list who have the higher imp_exp_limit */
      const getAllSubAdmins = await this.services.getSubAdmins({ authority_level_id: getAuthorityLevelIds, deleted_at: null, role_id: ROLES.SUB_ADMIN });
      return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, getAllSubAdmins, RESPONSE_CODES.POST, req.headers.tokenization))
    } catch (error) {
      console.log(error);
      logger.error('get Higher Authority Sub Admins Error', error);
      return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization))
    }
  }
  /* end */

  /* renew policy */
  async renewPolicy(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const ProposalMessages = req.CommonMessages.proposal;
    let addApiLogResponse;
    try {
      const { body, ip_address, user } = req;
      /* get the proposal detail from proposals tables */
      const oldProposal = await this.services.getProposal({ id: body.proposal_id });
      /* if old proposal not exist in proposal table */
      if (!oldProposal) {
        return res.send(errorResponse(ProposalMessages.OLD_PROPOSAL_NOT_FOUND, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
      }
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: oldProposal.proposal_no,
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.RENEW_POLICY,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* check the new proposal id is exist in proposal or not */
      const newProposal = await this.services.getProposal({ id: body.new_proposal_id });
      /* if new proposal id is not exist in proposal table */
      if (!newProposal) {
        return res.send(errorResponse(ProposalMessages.NEW_PROPOSAL_NOT_FOUND, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
      }
      /* check if proposal is already renewed in renew proposal table */
      const isRenewedProposal = await this.services.getRenewedProposal({ id: body.new_proposal_id });
      /* if new proposal id is already renewed */
      if (isRenewedProposal) {
        return res.send(errorResponse(ProposalMessages.POLICY_HAS_ALREADY_BEEN_RENEWED, isRenewedProposal, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
      }
      /* create the new proposal in the renew proposal table */
      await this.services.createNewProposal(body);
      /* if the new proposal id is new then update proposal table */
      await this.services.updateProposal({ is_renewed: DEFAULT_ENUM.TRUE }, { id: body.proposal_id })
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: null,
          message: ProposalMessages.PROPOSAL_CREATED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(ProposalMessages.PROPOSAL_CREATED_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization))
    } catch (error) {
      console.log(error);
      logger.error('renew Policy Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization))
    }
  }
  /* end */

  /* get policy ids */
  async getPolicyIds(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { query } = req;
      const length = parseInt(query.length);
      const start = parseInt(length * (query.page - 1));
      /* get renewed policies */
      const getRenewedPolicies = await this.services.getRenewedPolicies();
      /* get only ids from get renewed policies */
      const getRenewedPolicyIds = getRenewedPolicies.map((ids) => ids.new_proposal_id);
      /* push the proposal id into get renewed policies */
      getRenewedPolicyIds.push(parseInt(query.proposal_id));
      let search_query = []
      if (query.proposal_no_like) {
        search_query.push({ proposal_no: { [Op.like]: `%${query.proposal_no_like}%` } })
      }
      if (query.policy_id_like) {
        search_query.push({ policy_id: { [Op.like]: `%${query.policy_id_like}%` } })
      }
      /* Initialize quote query object with default values */
      let quoteQuery = {
        id: { [Op.notIn]: getRenewedPolicyIds },
        deleted_at: null,
      };
      /* If search_query has conditions, add them to quote query */
      if (search_query.length > 0) {
        quoteQuery[Op.and] = search_query;
      }
      /* get policies ids which are not renewed */
      const getPolicyIds = await this.services.getPolicyIds(quoteQuery, { start, length });
      const resultWithoutPagination = await this.services.getPolicyIds(quoteQuery, { start: 0, length: 0 });
      const recordsTotal = resultWithoutPagination.length;
      const recordsFiltered = resultWithoutPagination.length;
      return res.send(successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, getPolicyIds, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization))
    } catch (error) {
      console.log('error', error);
      logger.error('get Policy Ids Error', error);
      return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */
}
