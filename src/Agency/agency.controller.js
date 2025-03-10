import { CHILD_LOG_TYPE, DEFAULT_ENUM, PARENT_LOG_TYPE, RESPONSE_CODES, ROLES, USER_STATUS } from "../../config/constants";
import { errorResponse, successResponse, successResponseWithPagination } from "../../config/responseHandlers";
import { addUpdateCompanyDetail, getUUID, saveApilogs, updateApilogs } from "../helpers/commonFunction";
import logger from '../helpers/logger';
import { sendMail } from "../services/sendGrid";
import Services from "./agency.services";

export default class Agency {
  async init(db) {
    this.services = new Services();
    this.Models = db.models;
    await this.services.init(db);
  }
  /* add agency */
  async addAgency(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    const emailMessages = req.CommonMessages.email;
    let addApiLogResponse;
    try {
      const { user, ip_address } = req;
      req.body.created_by_id = req.user.id;
      const {
        name,
        email,
        created_by_id,
      } = req.body;
      /* check email already exists */
      const isEmailExists = await this.services.getUserByEmail(email);
      if (isEmailExists) {
        return res.send(errorResponse(
          authMessages.EMAIL_ALREADY_EXIST,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.ADD_AGENCY,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      req.body.role_id = ROLES.AGENCY;
      /* add update user company and its address */
      const addUpdateCompanyResult = await addUpdateCompanyDetail(req.body, this.Models);
      /* generate uuid */
      const uuid = await getUUID();
      let randomString = Math.random().toString(36).substring(5);
      /* add user */
      const userPayload = {
        company_id: addUpdateCompanyResult && addUpdateCompanyResult.company_id ? addUpdateCompanyResult.company_id : null,
        role_id: ROLES.AGENCY,
        name,
        email: email.toLowerCase(),
        uuid,
        created_by_id,
        status: USER_STATUS.ACTIVE,
        password: randomString
      };
      const userDetails = await this.services.createUser(userPayload);
      /* add user detail*/
      const userDetailPayload = {
        user_id: userDetails.id,
      };
      await this.services.createUserDetail(userDetailPayload);
      /* send email for the password reset */
      const msg = {
        to: email,
        from: process.env.SENDGRID_USERNAME,
        subject: emailMessages.LOGIN_DETAILS,
        html: `<p>This is your email: ${user.email}</p><p>This is your password: ${randomString}</p>`
      };
      await sendMail(msg);
      const result = await this.services.getUserById(userDetails.id);
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
      return res.send(
        successResponse(authMessages.USER_ADDED, result, RESPONSE_CODES.POST, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('add Agency Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error)
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* update agency */
  async updateAgency(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { params, body, ip_address, user } = req;
      /* check if agency is updating his own profile */
      if (req.user && req.user.role_id == ROLES.AGENCY && req.user.uuid != params.uuid) {
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
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.UPDATE_AGENCY,
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
      }
      req.body.role_id = ROLES.AGENCY;
      /* add update user company and its address */
      const addUpdateCompanyResult = await addUpdateCompanyDetail(req.body, this.Models);
      body.company_id = addUpdateCompanyResult && addUpdateCompanyResult.company_id ? addUpdateCompanyResult.company_id : null;
      /* updating the user */
      await this.services.updateUser({ uuid: params.uuid }, body);
      const result = await this.services.getUser({ uuid: params.uuid });
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          request_id: result.id,
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
      logger.error('update Agency Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get agency by uuid */
  async getAgencyById(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { uuid } = req.params;
      /* check if agency is updating his own profile */
      if (req.user && req.user.role_id == ROLES.AGENCY && req.user.uuid != uuid) {
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
        role_id: ROLES.AGENCY
      });
      return res.send(
        successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get Agency By Id Error, ', error)
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get agency list */
  async getAgencyList(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { body, user } = req;
      const query = {
        deleted_at: null,
        role_id: [ROLES.AGENCY],
      };
      if (body.status) {
        query.status = body.status;
      };
      const result = await this.services.getAgencyList(query, body);
      body.start = DEFAULT_ENUM.FALSE;
      body.length = DEFAULT_ENUM.FALSE;
      const resultWithoutPagination = await this.services.getAgencyList(query, body);
      const recordsTotal = resultWithoutPagination.length;
      const recordsFiltered = resultWithoutPagination.length;
      return res.send(
        successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get Agency List Error, ', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */
}
