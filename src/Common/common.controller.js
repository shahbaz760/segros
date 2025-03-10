import fs from 'fs';
import { Op } from 'sequelize';
import { CHILD_LOG_TYPE, DEFAULT_ENUM, IS_ACTIVE, PARENT_LOG_TYPE, RESPONSE_CODES, ROLES, USER_STATUS } from "../../config/constants";
import { errorResponse, successResponse, successResponseWithPagination } from "../../config/responseHandlers";
import authServices from "../Auth/auth.services";
import { addUpdateCompanyDetail, decryptData, getAddressInfo, getUUID, saveApilogs, updateApilogs, uploadFileToServer } from "../helpers/commonFunction";
import { refreshToken } from '../helpers/jwt';
import logger from '../helpers/logger';
import { sendMail } from "../services/sendGrid";
import Services from "./common.services";
import readXlsxFile from "read-excel-file/node";


export default class Common {
  async init(db) {
    this.services = new Services();
    this.authServices = new authServices();
    this.Models = db.models;
    await this.services.init(db);
    await this.authServices.init(db);
  }

  /* get all banks */
  async getAllBanks(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const result = await this.services.getAllBanks();
      return res.send(
        successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get All Banks Error, ', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get address */
  async getAddressOfBroker(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const brokerMessages = req.CommonMessages.broker;
    try {
      const isAddressExists = await getAddressInfo(
        'https://viacep.com.br/ws/' + req.params.zip_code + '/json/'
      );
      if (!isAddressExists) {
        return res
          .send(errorResponse(brokerMessages.INVALID_BROKER_ID, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
      };
      if (isAddressExists) {
        if (isAddressExists.erro) {
          return res.send(
            errorResponse(CommonMessages.INVALID_ZIPCODE, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
        } else {
          return res.send(
            successResponse(CommonMessages.DATA_LOADED_SUCCESS, isAddressExists, RESPONSE_CODES.GET, req.headers.tokenization)
          );
        }
      } else {
        return res.send(
          errorResponse(brokerMessages.POLICY_NOT_POSSIBLE, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
      };
    } catch (error) {
      logger.error('get Address Of Broker Error, ', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get broker category list  */
  async getBrokerCategoryList(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const query = {
        is_active: IS_ACTIVE.TRUE,
      };
      const result = await this.services.getBrokerCategoryList(query);
      return res.send(
        successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get Broker Category List Error, ', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get responsible list */
  async getResponsibleList(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const query = {
        deleted_at: null,
        role_id: [ROLES.ADMIN, ROLES.SUB_ADMIN],
      };
      const result = await this.services.getResponsibleList(query);
      return res.send(
        successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.GET, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get Responsible List Error, ', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* active-inactive broker, sub admin, agency */
  async userActiveInactive(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { params, body, user, ip_address } = req;
      /* check user exists or not */
      const isUserExists = await this.services.getUser({
        uuid: params.uuid,
        deleted_at: null
      });
      /* check if the user is updating his own profile */
      if (req.user.uuid == params.uuid) {
        return res.send(errorResponse(
          CommonMessages.UNAUTHORIZED_USER,
          null,
          RESPONSE_CODES.UNAUTHORIZED,
          req.headers.tokenization
        ));
      };
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
        log_type: CHILD_LOG_TYPE.USER_ACTIVE_INACTIVE,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* updating the user */
      await this.services.updateUser({ id: isUserExists.id }, body);
      /* if agency or broker is to be active or inactive then need to make the associated sub users activated or deactivated as well */
      if (isUserExists.role_id == ROLES.AGENCY || isUserExists.role_id == ROLES.BROKER) {
        await this.services.updateUser({ created_by_id: isUserExists.id }, body);
      };
      const responseMessage = body.status == USER_STATUS.ACTIVE ?
        authMessages.USER_ACTIVATED :
        authMessages.USER_DEACTIVATED;
      /* Update the API logs with the result and success message */
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
      logger.error('user Active Inactive Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* delete user sub admin agency */
  async userDelete(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { params, body, ip_address, user } = req;
      /* check user exists or not */
      const isUserExists = await this.services.getUser({
        uuid: params.uuid,
        deleted_at: null
      });
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
        log_type: CHILD_LOG_TYPE.USER_DELETE,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* updating the user */
      await this.services.updateUser({ id: isUserExists.id }, { deleted_at: new Date() });
      /* if agency or broker is to be deleted then need to make the associated sub users deleted as well */
      if (isUserExists.role_id == ROLES.AGENCY || isUserExists.role_id == ROLES.BROKER) {
        await this.services.updateUser({ created_by_id: isUserExists.id }, { deleted_at: new Date() });
      };
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: null,
          message: authMessages.USER_DELETED
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(authMessages.USER_DELETED, null, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('user delete Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* add sub broker or sub agency */
  async addSubBrokerOrSubAgency(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    const emailMessages = req.CommonMessages.email;
    let addApiLogResponse;
    try {
      const { body, ip_address, user } = req;
      /* check email already exists */
      let email = body.email.toLowerCase();
      const isEmailExists = await this.services.getUser({ email, deleted_at: null });
      if (isEmailExists) {
        return res.send(errorResponse(
          authMessages.EMAIL_ALREADY_EXIST,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      /* check ruc already exists */
      const isRucExists = await this.authServices.getUserByRuc(body.ruc);
      if (isRucExists) {
        return res.send(errorResponse(
          authMessages.RUC_ALREADY_EXIST,
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
        log_type: CHILD_LOG_TYPE.ADD_SUB_BROKER_OR_SUB_AGENCY,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* adding the created by id of the creator */
      body.created_by_id = req.user.id;
      /* adding the role id as per the creator role */
      if (req.user.role_id == ROLES.BROKER) {
        body.role_id = ROLES.SUB_BROKER;
      } else if (req.user.role_id == ROLES.AGENCY) {
        body.role_id = ROLES.SUB_AGENCY;
      };
      /* making the status active */
      body.status = USER_STATUS.ACTIVE;
      /* saving the company id of login user */
      body.company_id = req.user.company_id;
      /* generate uuid */
      body.uuid = await getUUID();
      /* generate random password */
      let randomString = Math.random().toString(36).substring(5);
      body.password = randomString;
      /* add user */
      const createdUser = await this.services.createUser(body);
      /* add user access */
      body.user_id = createdUser.id;
      await this.services.createUserAccess(body);
      /* add user detail of the sub createdUser */
      const userDetailPayload = {
        user_id: createdUser.id,
        // authority_level_id: req.user.user_detail && req.user.user_detail.authority_level_id ? req.user.user_detail.authority_level_id : 10
      };
      await this.services.createUserDetail(userDetailPayload);
      /* get the updated createdUser */
      const result = await this.services.getUser({ id: createdUser.id });
      /* sending the welcome email */
      /* TODO: need to implement email templates */
      const msg = {
        to: email,
        from: process.env.SENDGRID_USERNAME,
        subject: emailMessages.WELCOME,
        html: `<h1>These are your credentials: ${randomString}</h1>`
      };
      await sendMail(msg);
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
      logger.error('add Sub Broker Or Sub Agency Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get sub broker or sub agency list */
  async subBrokerOrSubAgencyList(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      /* destructuring the req */
      const { body, user } = req;
      const query = {
        deleted_at: null,
      };
      if (user.role_id == ROLES.ADMIN || user.role_id == ROLES.SUB_ADMIN) {
        query.role_id = ROLES.SUB_BROKER;
        query.created_by_id = body.user_id;
      } else if (user.role_id == ROLES.BROKER) {
        query.role_id = ROLES.SUB_BROKER;
        query.created_by_id = user.id;
      } else if (user.role_id == ROLES.AGENCY) {
        if (body.user_id) {
          query.role_id = ROLES.SUB_BROKER;
          query.created_by_id = body.user_id;
        } else {
          query.role_id = ROLES.SUB_AGENCY;
          query.created_by_id = user.id;
        };
      };
      if (body.status) {
        query.status = body.status == 0 ? [] : body.status;
      };
      /* get the search value from body */
      if (body && body.search && body.search.value != "") {
        query[Op.or] = [
          { id: { [Op.like]: '%' + body.search.value + '%' } },
          { name: { [Op.like]: '%' + body.search.value + '%' } },
          { email: { [Op.like]: '%' + body.search.value + '%' } },
          { phone: { [Op.like]: '%' + body.search.value + '%' } },
          { ruc: { [Op.like]: '%' + body.search.value + '%' } },
          { company_name: { [Op.like]: '%' + body.search.value + '%' } },
        ]
      };
      const result = await this.services.subBrokerOrSubAgencyList(query, body);
      body.start = 0;
      body.length = 0;
      const dataWithoutPagination = await this.services.subBrokerOrSubAgencyList(query, body);
      let recordsTotal = dataWithoutPagination.length;
      let recordsFiltered = dataWithoutPagination.length;
      if (user.role_id == ROLES.ADMIN || user.role_id == ROLES.SUB_ADMIN || ((user.role_id == ROLES.AGENCY || user.role_id == ROLES.SUB_AGENCY) && body.user_id)) {
        const getBroker = await this.services.getUser({ id: body.user_id });
        const brokerDetail = {
          id: getBroker.id,
          uuid: getBroker.uuid,
          ruc: getBroker.ruc,
          last_login: getBroker.last_login,
          created_by_id: getBroker.created_by_id,
          company_name: getBroker?.company?.company_name ?? null,
          email: getBroker.email,
          phone: getBroker.phone,
          status: getBroker.status,
          role_id: getBroker.role_id,
          deleted_at: getBroker.deleted_at,
          company_reg_no: getBroker?.company?.company_reg_no ?? null,
        };
        result.unshift(brokerDetail);
        recordsTotal += 1;
        recordsFiltered += 1;
      }
      return res.send(
        successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('sub Broker Or Sub Agency List Error, ', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get sub broker or sub agency detail by uuid*/
  async getSubBrokerOrSubAgencyByUUID(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    try {
      /* destructuring the req */
      const { params, user } = req;
      const query = {
        // role_id: user.role_id == ROLES.BROKER ? ROLES.SUB_BROKER : ROLES.SUB_AGENCY,
        uuid: params.uuid,
        deleted_at: null,
      };
      /* check user exists or not */
      const isUserExists = await this.services.getUser(query);
      if (!isUserExists) {
        return res.send(errorResponse(
          authMessages.USER_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      return res.send(
        successResponse(CommonMessages.DATA_LOADED_SUCCESS, isUserExists, RESPONSE_CODES.GET, req.headers.tokenization));
    } catch (error) {
      logger.error('get Sub Broker Or Sub Agency By UUID Error, ', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* update sub broker or sub agency detail by uuid*/
  async updateSubBrokerOrSubAgencyByUUID(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      /* destructuring the req */
      const { params, body, ip_address, user } = req;
      const query = {
        uuid: params.uuid,
      };
      /* check user exists or not */
      const isUserExists = await this.services.getUser(query);
      if (!isUserExists) {
        return res.send(errorResponse(
          authMessages.USER_NOT_FOUND,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      /* check email already exists */
      const isEmailExists = await this.services.getUser({ email: body.email });
      if (isEmailExists && isEmailExists.uuid != params.uuid) {
        return res.send(errorResponse(
          authMessages.EMAIL_ALREADY_EXIST,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      /* check ruc already exists */
      const isRucExists = await this.authServices.getUserByRuc(body.ruc);
      if (isRucExists && isRucExists.uuid != params.uuid) {
        return res.send(errorResponse(
          authMessages.RUC_ALREADY_EXIST,
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
        log_type: CHILD_LOG_TYPE.UPDATE_SUB_BROKER_OR_SUB_AGENCY_BY_UUID,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* updating the user */
      await this.authServices.updateUser({ uuid: params.uuid }, body);
      /* update user access */
      await this.services.updateUserAccess({ user_id: isUserExists.id }, body);
      const result = await this.services.getUser(query);
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
        successResponse(authMessages.USER_UPDATED_SUCCESS, result, RESPONSE_CODES.PUT, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('update Sub Broker Or Sub Agency By UUID Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* update user profile */
  async updateUserProfile(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { user, body, ip_address } = req;
      if (body.email) {
        /* check if the email to be updated already exists */
        const isEmailAlreadyExists = await this.services.getUser({ email: body.email });
        if (isEmailAlreadyExists && isEmailAlreadyExists.id != user.id) {
          return res.send(errorResponse(
            authMessages.EMAIL_ALREADY_REGISTERED,
            null,
            RESPONSE_CODES.BAD_REQUEST,
            req.headers.tokenization
          ));
        };
      }
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        // request_id: isUserExists.id,
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.UPDATE_USER_PROFILE,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* updating the user */
      let userCompanyId;
      if (user.role_id != ROLES.SUB_AGENCY && user.role_id != ROLES.SUB_BROKER) {
        body.role_id = user.role_id == ROLES.SUB_ADMIN ? ROLES.SUB_ADMIN : user.role_id;
        /* add update user company and its address */
        const addUpdateCompanyResult = await addUpdateCompanyDetail(body, this.Models);
        userCompanyId = addUpdateCompanyResult && addUpdateCompanyResult.company_id ? addUpdateCompanyResult.company_id : null;
        body.user_id = user.id;
        if (user.user_detail) {
          /* update user detail */
          await this.services.updateUserDetail({ user_id: user.id }, body);
        } else {
          /* create user detail */
          await this.services.createUserDetail(body);
        };
      };
      body.company_id = userCompanyId;
      await this.services.updateUser({ id: user.id }, body);
      /* get latest user data */
      const userData = await this.services.getUser({ id: user.id });
      // const encrypted_data = encryptData(req, userData)
      let token;
      const tokenPayload = {
        email: userData.email,
        id: userData.id,
        uuid: userData.uuid,
        role_id: userData.role_id,
        agency_id: userData.agency_id ? true : false,
        company_name: userData.company && userData.company.company_name ? userData.company.company_name : null,
        name: userData.name,
      };
      token = refreshToken(tokenPayload);
      let data = { data: userData, token: token };
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          request_id: userData.id,
          response: JSON.stringify(data),
          message: authMessages.USER_UPDATED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(successResponse(authMessages.USER_UPDATED_SUCCESS, data, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('update User Profile Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization))
    }
  }
  /* end */

  /* get User Profile */
  async getUserProfile(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { user } = req;
      const query = {
        id: user.id,
      };
      const isUserExists = req.user;
      return res.send(
        successResponse(CommonMessages.DATA_LOADED_SUCCESS, isUserExists, RESPONSE_CODES.POST, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get User Profile Error', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization))
    }
  }
  /* end */

  /* upload files */
  async upload(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    let addApiLogResponse;
    try {
      const { ip_address, user } = req;
      const uploadedFiles = [];

      for (let ele of req.files) {
        let data = fs.readFileSync(ele.path);
        fs.unlinkSync(ele.path);
        const extention = ele.originalname.split('.')
        let params = {
          Key: `${Date.now()}.${extention[extention.length - 1]}`,
          Body: data,
          folderName: typeof req.body.type == 'string'
            ? req.body.type
            : req.body.type.length > 0
              ? req.body.type[0]
              : req.body.type,
        };
        let result = await uploadFileToServer(params);
        ele['location'] = result.Location;
        ele['key'] = result.Key;
      };
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        //request_id: user.id,
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.UPLOAD,
        ip_address: ip_address,
        login_user_id: user.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.files),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      if (req.files) {
        if (req.files.length > 0) {
          req.files.forEach((file) => {
            const upload = {
              path: file.location,
              type: file.mimetype,
              name: file.originalname,
              file_key: file.key,
            };
            uploadedFiles.push(upload);
          });
        }
      };
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: JSON.stringify(uploadedFiles),
          message: CommonMessages.DATA_LOADED_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(
        successResponse(CommonMessages.DATA_LOADED_SUCCESS, uploadedFiles, RESPONSE_CODES.POST, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('upload Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */

  /* get decoded data api */
  async getDecodedData(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const decryptedData = await decryptData(req);
      return res.send(
        successResponse(CommonMessages.DATA_LOADED_SUCCESS, decryptedData, RESPONSE_CODES.POST, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get Decoded Data Error', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /*end */

  /* get api log list */
  async getApilogList(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { body } = req;
      let logQuery = {};
      if (body.request_id && body.request_id.length > 0) {
        // logQuery.request_id = body.request_id;
        logQuery.request_id = { [Op.in]: body.request_id };
      };
      if (body.parent_log_type && body.parent_log_type.length > 0) {
        logQuery.type = { [Op.in]: body.parent_log_type };
      };
      if (body.child_log_type && body.child_log_type.length > 0) {
        logQuery.log_type = { [Op.in]: body.child_log_type };
      };
      if (body && body.search && body.search.value != "") {
        logQuery[Op.or] = [
          { request_id: { [Op.like]: '%' + body.search.value + '%' } },
          { type: { [Op.like]: '%' + body.search.value + '%' } },
          { log_type: { [Op.like]: '%' + body.search.value + '%' } },
          { message: { [Op.like]: '%' + body.search.value + '%' } },
        ]
      };
      const result = await this.services.getApilogList(logQuery, body);
      body.start = DEFAULT_ENUM.FALSE;
      body.length = DEFAULT_ENUM.FALSE;
      /* get quote list based on the query condition for pagination and record filtering */
      const resultWithoutPagination = await this.services.getApilogList(logQuery, body);
      const recordsTotal = resultWithoutPagination.length;
      const recordsFiltered = resultWithoutPagination.length;
      return res.send(
        successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('get Apilog List Error', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */

  /* get api log by uuid */
  async getApilogByUuid(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { params } = req;
      const getApilogByUuid = await this.services.getApilogByUuid({ uuid: params.uuid });
      getApilogByUuid.request_payload = JSON.parse(getApilogByUuid.request_payload);
      getApilogByUuid.response = JSON.parse(getApilogByUuid.response);
      return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, getApilogByUuid, RESPONSE_CODES.GET, req.headers.tokenization));
    } catch (error) {
      logger.error('get Apilog By Uuid Error', error);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */

  /* get api log drop down data */
  async getApilogDropdownData(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      /* get request ids */
      const getRequestIds = await this.services.getRequestIds();
      /* get parent log types */
      const getParentLogTypeList = await this.services.getParentTypeList();
      /* get child log types */
      const getChildLogTypeList = await this.services.getChildTypeList();
      const data = {
        /* Extract unique request IDs*/
        requestIds: getRequestIds.map(item => item.request_id).filter(id => id !== null),
        /* Extract unique parent types*/
        parentLogTypeList: getParentLogTypeList.map(item => item.type).filter(type => type !== null),
        /* Extract unique child types */
        childLogTypeList: getChildLogTypeList.map(item => item.log_type).filter(log_type => log_type !== null),
      };
      return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, data, RESPONSE_CODES.GET, req.headers.tokenization));
    } catch (error) {
      logger.error('get Apilog Dropdown Data Error', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization))
    }
  }
  /* end */

  /* get broker detail */
  async getBrokerDetailByUUID(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      const { user, params } = req;
      const brokerDetail = await this.services.getBrokerByUuid({ uuid: params.uuid });
      return res.send(successResponse(CommonMessages.DATA_LOADED_SUCCESS, brokerDetail, RESPONSE_CODES.GET, req.headers.tokenization));
    } catch (error) {
      console.log(error);
      logger.error('get Broker Detail By UUID Error', error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */


  async importDataFromExcelFile(req, res) {
    try {
      // Step 1: Validate the file
      const file = req.file;
      // const { user } = req;
      // const company_id = req.body.company_id;
      if (!file) {
        return res.json(errorResponse('file Not Found.', null, null, RESPONSE_CODES.BAD_REQUEST));
      }
      /* prepare schema as per xlsx file fields */
      let schema = {
        id: {
          prop: "id",
          type: String,
          // required: true,
        },
        state_id: {
          prop: "state_id",
          type: String,
        },
        name: {
          prop: "name",
          type: String
        }
      };
      let data = null;
      try {
        data = await readXlsxFile(file.path, { schema });
        console.log('data1111', data);
        // return data;
        fs.unlinkSync(file.path);
        return res.send(successResponse('DATA_LOADED_SUCCESS', data, RESPONSE_CODES.POST, req.headers.tokenization));

      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error);
    }
  }
}
