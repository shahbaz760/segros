import { CHILD_LOG_TYPE, DEFAULT_ENUM, PARENT_LOG_TYPE, RESPONSE_CODES, ROLES, USER_STATUS } from "../../config/constants";
import { errorResponse, successResponse, successResponseWithPagination } from "../../config/responseHandlers";
import authController from "../Auth/auth.controller";
import authServices from "../Auth/auth.services";
import { getUUID, saveApilogs, updateApilogs } from "../helpers/commonFunction";
import logger from '../helpers/logger';
import Services from "./broker.services";
export default class Broker {
  async init(db) {
    this.services = new Services();
    this.authServices = new authServices();
    this.authController = new authController();
    this.Models = db.models;
    await this.services.init(db);
    await this.authServices.init(db);
    await this.authController.init(db);
  }

  /* add broker */
  async addBroker(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    // let addSamlLogResponse;
    try {
      const { user, body } = req;
      body.created_by_id = user.id;
      /* signup api */
      await this.authController.signup(req, res);
    } catch (error) {
      // logger.error('add Broker Error, ', error, addSamlLogResponse?.id || null, this.Models.ApiLogs);
      logger.error('add Broker Error, ', error);
      console.log(error)
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* update broker */
  async updateBroker(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { params, body, ip_address, user } = req;
      /* check if the broker is updating his own profile */
      if (req.user && req.user.role_id == ROLES.BROKER && req.user.uuid != params.uuid) {
        return res.send(errorResponse(
          CommonMessages.UNAUTHORIZED_USER,
          null,
          RESPONSE_CODES.UNAUTHORIZED,
          req.headers.tokenization
        ));
      };
      /* check broker exists or not */
      const isUserExists = await this.authServices.getUser({ uuid: params.uuid });
      if (!isUserExists) {
        return res.send(errorResponse(
          authMessages.USER_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      /* check if the email to be updated already exists */
      const isEmailAlreadyExists = await this.authServices.getUser({ email: body.email });
      if (isEmailAlreadyExists && isEmailAlreadyExists.uuid != params.uuid) {
        return res.send(errorResponse(
          authMessages.EMAIL_ALREADY_REGISTERED,
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
        log_type: CHILD_LOG_TYPE.UPDATE_BROKER,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      req.body.role_id = isUserExists.role_id;
      /* updating the user */
      await this.services.updateUser(body, { uuid: params.uuid });
      /* update user detail */
      await this.services.updateUserDetail(body, { user_id: isUserExists.id });
      const result = await this.authServices.getUser({ uuid: params.uuid });
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(result),
          message: authMessages.USER_UPDATED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(
        successResponse(authMessages.USER_UPDATED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('update Broker Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get broker by uuid */
  async getBrokerByUUID(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    try {
      const { uuid } = req.params;
      const result = await this.services.getBroker({
        uuid,
        deleted_at: null,
        role_id: ROLES.BROKER
      });
      if (!result) {
        return res.send(errorResponse(
          authMessages.USER_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      }
      return res.send(
        successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get Broker By UUID Error, ', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get broker list */
  async getBrokerList(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { body, user } = req;
      const query = {
        role_id: ROLES.BROKER,
        deleted_at: null,
      };
      if (body.status) {
        if (body.status == USER_STATUS.ACTIVE) {
          query.status = [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE];
        } else {
          query.status = body.status;
        }
      };
      /* if the agency or sub agency is accessing the broker list */
      if (user.role_id == ROLES.AGENCY || user.role_id == ROLES.SUB_AGENCY) {
        query.agency_id = user.role_id == ROLES.AGENCY ? user.id : user.created_by_detail.id;
      };
      /* if the admin is accessing the agency broker list */
      if ((user.role_id == ROLES.ADMIN || user.role_id == ROLES.SUB_ADMIN) && body.agency_id) {
        query.agency_id = body.agency_id;
      };
      const result = await this.services.getBrokerList(query, body);
      body.start = DEFAULT_ENUM.FALSE;
      body.length = DEFAULT_ENUM.FALSE;
      const resultWithoutPagination = await this.services.getBrokerList(query, body);
      const recordsTotal = resultWithoutPagination.length;
      const recordsFiltered = resultWithoutPagination.length;;
      return res.send(
        successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get Broker List Error, ', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* approve broker */
  async brokerApproveReject(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { params, body, ip_address, user } = req;
      /* check user exists or not  */
      const isUserExists = await this.authServices.getUser({ uuid: params.uuid });
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
        log_type: CHILD_LOG_TYPE.BROKER_APPROVE_REJECT,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      let id = isUserExists.id;
      /* updating the user */
      await this.authServices.updateUser({ id: id }, body);
      /* updating user details */
      await this.services.updateUserDetail(body, { user_id: id });
      const responseMessage = body.status == USER_STATUS.ACTIVE ? authMessages.USER_APPROVED : authMessages.USER_REJECTED;
      const updateApiLogPayload = {
        payload: {
          response: null,
          message: responseMessage
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(
        successResponse(responseMessage, null, RESPONSE_CODES.POST, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('broker Approve Reject Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* check broker existence */
  async checkBrokerExistence(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { body, user, ip_address } = req;
      const query = {
        ruc: body.user_ruc
      };
      let is_user_exist;
      is_user_exist = DEFAULT_ENUM.FALSE;
      /* check user ruc already exists */
      const isRucExists = await this.services.getUserByRuc(query);
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: body.user_ruc,
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.CHECK_BROKER_EXISTENCE,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      if (isRucExists) {
        is_user_exist = DEFAULT_ENUM.TRUE;
      }
      const data = { is_user_exist };
      const responseMessage = is_user_exist == DEFAULT_ENUM.TRUE ? authMessages.RUC_FOUND_SUCCESSFULLY : authMessages.RUC_NOT_FOUND;
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(data),
          message: responseMessage
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(
        responseMessage,
        data,
        RESPONSE_CODES.POST,
        req.headers.tokenization
      ));
    } catch (error) {
      console.log(error);
      logger, error('check Broker Existence Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */
}
