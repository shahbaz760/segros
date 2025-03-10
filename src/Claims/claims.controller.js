import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from 'sequelize';
import { CHILD_LOG_TYPE, DEFAULT_ENUM, PARENT_LOG_TYPE, RESPONSE_CODES, ROLES, SOCKET_EVENTS } from "../../config/constants";
import { errorResponse, successResponse, successResponseWithPagination } from "../../config/responseHandlers";
import authServices from "../Auth/auth.services";
import { claimPartnersAuthorization, getAssociatedUsers, getUUID, saveApilogs, updateApilogs } from "../helpers/commonFunction";
import logger from '../helpers/logger';
import { emitSocketEvent } from "../services/socket.io";
import Services from "./claims.services";
export default class Claims {
  async init(db) {
    /* initializing classes to be used */
    this.services = new Services();
    this.authServices = new authServices();
    this.Models = db.models;
    this.db = db;
    await this.services.init(db);
    await this.authServices.init(db);
  }

  /* add update claim partners */
  async addUpdateClaimPartner(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    const claimsMessages = req.CommonMessages.claims;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      const { email, name, password } = req.body;
      /* check email already exists */
      const isEmailExist = await this.services.getClaimPartnerByEmail({ email: email });
      if (isEmailExist) {
        let query = {
          id: isEmailExist.id
        };
        let payload = {
          name,
          email,
          password
        };
        /* update claim partner if his email found successfully */
        await this.services.updateClaimPartner(payload, query);
      } else {
        const claimPartnerPayload = {
          name,
          email,
          password
        };
        /* create claim partner */
        await this.services.createClaimPartner(claimPartnerPayload);
      };
      const claimPartner = await this.services.getClaimPartnerByEmail({ email: email });
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: claimPartner.id,
        type: PARENT_LOG_TYPE.CLAIM_PARTNER,
        log_type: CHILD_LOG_TYPE.ADD_UPDATE_CLAIM_PARTNER,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
        response: null,
        message: claimsMessages.CLAIMS_PARTNER_ADDED
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      return res.send(successResponse(claimsMessages.CLAIMS_PARTNER_ADDED, null, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('add Update Claim Partner Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */

  /* get claim partners access token */
  async getClaimPartnerAccessToken(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    const claimsMessages = req.CommonMessages.claims;
    try {
      const { email, password } = req.body;
      const CLAIM_PARTNERS_SECRET_KEY = process.env.CLAIM_PARTNERS_SECRET_KEY;
      if (!req.headers['secret-key'] || req.headers['secret-key'] != CLAIM_PARTNERS_SECRET_KEY) {
        return res.send(errorResponse(
          !req.headers['secret-key'] ? claimsMessages.PROVIDE_SECRET_KEY : claimsMessages.SECRET_KEY_UNMATCHED,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      }
      /* get claim partner by email */
      const isemailExists = await this.services.getClaimPartnerByEmail({ email: email });
      /* if email is already exist */
      if (!isemailExists) {
        return res.send(errorResponse(
          authMessages.USER_NOT_FOUND,
          null,
          RESPONSE_CODES.UNAUTHORIZED,
          req.headers.tokenization
        ));
      };
      /* compare the encrypted password*/
      const passwordMatch = bcrypt.compareSync(password, isemailExists.password);
      if (!passwordMatch) {
        return res.send(errorResponse(
          authMessages.WRONG_PASSWORD,
          null,
          RESPONSE_CODES.UNAUTHORIZED,
          req.headers.tokenization
        ));
      };
      /* create the token payload */
      const tokenPayload = {
        id: isemailExists.id,
        email: isemailExists.email,
      };
      let token = jwt.sign(tokenPayload, CLAIM_PARTNERS_SECRET_KEY, {
        expiresIn: '1hr',
      });
      return res
        .send(
          successResponse(authMessages.USER_LOGIN_SUCCESS, token, RESPONSE_CODES.POST, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('get Claim Partner Access Token Error ', error);
      console.log("error", error)
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get Policy Details */
  async getPolicyDetails(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const claimsMessages = req.CommonMessages.claims;
    try {
      const { body } = req;
      /* check user account authorization */
      try {
        const tokenDecode = await claimPartnersAuthorization(req, this.db);
        const isUsernameExists = await this.services.getClaimPartnerByEmail({ id: tokenDecode.id });
        if (!isUsernameExists) {
          return res.send(errorResponse(
            claimsMessages.USER_NOT_FOUND,
            null,
            RESPONSE_CODES.UNAUTHORIZED,
            req.headers.tokenization
          ));
        };
        if (isUsernameExists.email != tokenDecode.email) {
          return res.send(errorResponse(
            claimsMessages.USERNAME_NOT_EXIST,
            null,
            RESPONSE_CODES.UNAUTHORIZED,
            req.headers.tokenization
          ));
        };
        const query = {
          deleted_at: null,
          policy_id: body.policy_id
        };
        const result = await this.services.getPolicy(query);
        return res
          .send(
            successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
          );
      } catch (error) {
        return res.send(errorResponse(
          error.message,
          null,
          RESPONSE_CODES.UNAUTHORIZED,
          req.headers.tokenization
        ));
      };
    } catch (error) {
      console.log(error);
      logger.error('get Policy Details Error', error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* create Claims */
  async createClaims(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    const claimsMessages = req.CommonMessages.claims;
    let addApiLogResponse;
    try {
      const { body, ip_address, user } = req;
      /* check user account authorization */
      let claimData;
      try {
        const tokenDecode = await claimPartnersAuthorization(req, this.db);
        const isUsernameExists = await this.services.getClaimPartnerByEmail({ id: tokenDecode.id });
        if (!isUsernameExists) {
          return res.send(errorResponse(
            authMessages.USER_NOT_FOUND,
            null,
            RESPONSE_CODES.UNAUTHORIZED,
            req.headers.tokenization
          ));
        };
        if (isUsernameExists.email != tokenDecode.email) {
          return res.send(errorResponse(
            claimsMessages.USERNAME_NOT_EXIST,
            null,
            RESPONSE_CODES.UNAUTHORIZED,
            req.headers.tokenization
          ));
        };
        /* get proposal */
        const proposalData = await this.services.getProposals({ policy_id: body.policy_id, deleted_at: null });
        if (!proposalData) {
          return res.send(errorResponse(
            claimsMessages.PROPOSALS_NOT_FOUND,
            null,
            RESPONSE_CODES.BAD_REQUEST,
            req.headers.tokenization
          ));
        };
        /* get claims */
        claimData = await this.services.getClaims({ aviso_numero: body.aviso_numero, claim_partner_id: tokenDecode.id });
        if (claimData) {
          return res.send(errorResponse(
            claimsMessages.CLAIM_ALREADY_EXIST,
            null,
            RESPONSE_CODES.BAD_REQUEST,
            req.headers.tokenization
          ));
        }
        /* generate uuid for api logs */
        const apilog_uuid = await getUUID();
        /* create api log payload  */
        const addApilogPayload = {
          request_id: proposalData.proposal_no,
          type: PARENT_LOG_TYPE.CLAIM,
          ip_address: ip_address,
          login_user_id: tokenDecode.id,
          uuid: apilog_uuid,
          request_payload: JSON.stringify(body),
        };
        addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
        /* end */
        if (!claimData) {
          /* generate uuid for user */
          const claim_uuid = await getUUID();
          //isFirstClaim = true;
          body.uuid = claim_uuid;
          body.proposal_id = proposalData.id;
          body.user_id = proposalData.user_id;
          body.quote_id = proposalData.quote_id;
          body.claim_partner_id = tokenDecode.id;
          body.company_id = proposalData.company_id;
          body.created_by_id = proposalData.created_by_id;
          claimData = await this.services.createClaims(body);
        };
        /* socket emission */
        emitSocketEvent(SOCKET_EVENTS.CLAIM_ADDED_SUCCESS, { claim_id: claimData.id });
        /* end */
      } catch (error) {
        console.log(error);
        return res.send(errorResponse(
          error.message,
          null,
          RESPONSE_CODES.UNAUTHORIZED,
          req.headers.tokenization
        ));
      };
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          log_type: `${CHILD_LOG_TYPE.CREATE_CLAIMS}-${claimData.id}`,
          response: null,
          message: claimsMessages.CLAIMS_ADDED
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(claimsMessages.CLAIMS_ADDED, null, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('create Claims Error ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */

  /* get claims list */
  async getClaimsList(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { body, user, params } = req;
      if (user.role_id == ROLES.SUB_AGENCY || user.role_id == ROLES.SUB_BROKER) {
        if (user.user_access.claims == DEFAULT_ENUM.FALSE) {
          return res.send(errorResponse(
            CommonMessages.UNAUTHORIZED_USER,
            null,
            RESPONSE_CODES.BAD_REQUEST,
            req.headers.tokenization));
        }
      };
      let query = {
        deleted_at: null
      };
      const proposalId = params.proposal_id;
      if (proposalId) {
        query.proposal_id = proposalId
      };
      /* if claim partner is given */
      if (body.claim_partner_id) {
        query.claim_partner_id = body.claim_partner_id;
      };
      /* if company id is given */
      if (body.company_id) {
        /* get the client quote list which is associated with his company */
        const getClientQuoteList = await this.services.getClientQuoteList({ company_id: body.company_id })
        await getClientQuoteList.map(quote => { query.quote_id = quote.id })
      };
      let userIds = [];
      /* get the sub users of all roles except admin and sub admin */
      if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN) {
        userIds = await getAssociatedUsers(this.Models, user);
        query.user_id = userIds
      };
      /* get the search value from body */
      if (body && body.search && body.search.value != "") {
        query[Op.or] = [
          { id: { [Op.like]: "%" + body.search.value + "%" } },
          { nr_sinistro: { [Op.like]: "%" + body.search.value + "%" } },
          { aviso_numero: { [Op.like]: '%' + body.search.value + '%' } },
          { total_indemnity: { [Op.like]: '%' + body.search.value + '%' } },
          { policy_id: { [Op.like]: '%' + body.search.value + '%' } },
          { quote_company_name: { [Op.like]: '%' + body.search.value + '%' } },
          { estimativa_prejuizo: { [Op.like]: '%' + body.search.value + '%' } },
          { product_name: { [Op.like]: '%' + body.search.value + '%' } },
        ]
      };
      /* get claims list */
      const result = await this.services.getClaimList(query, body);
      body.start = DEFAULT_ENUM.FALSE;
      body.length = DEFAULT_ENUM.FALSE;
      /* get claims list for pagination */
      const resultWithoutPagination = await this.services.getClaimList(query, body);
      const recordsTotal = resultWithoutPagination.length;
      const recordsFiltered = resultWithoutPagination.length;
      return res.send(
        successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get Claims List Error', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get claim partners */
  async getClaimPartner(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      /* get claim partners list */
      const getClaimPartners = await this.services.getClaimPartner({ is_active: DEFAULT_ENUM.TRUE });
      return res.send(
        successResponse(CommonMessages.DATA_LOADED_SUCCESS, getClaimPartners, RESPONSE_CODES.POST, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get Claim Partner Error', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */
}