require("dotenv").config();
import bcrypt from "bcrypt";
import Saml2js from "saml2js";
import { CHILD_LOG_TYPE, COMPANY_STATUS, DEFAULT_ENUM, PARENT_LOG_TYPE, RESPONSE_CODES, ROLES, USER_STATUS } from "../../config/constants";
import { errorResponse, successResponse } from "../../config/responseHandlers";
import { addUpdateCompanyDetail, checkUserAuthorization, creditScore, getUUID, saveApilogs, updateApilogs, getCompanyRUC, getAccessTokenForOFAC } from "../helpers/commonFunction";
import { refreshToken, verifyToken } from '../helpers/jwt';
import logger from '../helpers/logger';
import { sendMail } from "../services/sendGrid";
import Services from "./auth.services";
const { secretKey } = require("../../config/keys");
//const { stringify } = require('flatted');
export default class Auth {
  async init(db) {
    this.services = new Services();
    this.Models = db.models;
    await this.services.init(db);
  }
  /* signup */
  async signup(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    let addSamlLogResponse;
    try {
      console.log('req', req);
      const { ip_address } = req;
      if (!req.isAuthenticated()) {
        //logger.error('saml Error, ', addSamlLogResponse?.id || null, this.Models.ApiLogs);
        return res.redirect('/login-failed');
      }
      //  if (req.isAuthenticated()) {
      const xmlResponse = req.body.SAMLResponse;
      const parser = new Saml2js(xmlResponse);
      req.samlUserObject = parser.toObject();
      // req.samlUserObject = xmlResponse;
      /* get microsoft group data */
      const microsoftUserData = await this.getMicrosoftUserData(req.samlUserObject, ip_address, req, res);
      /* creating logs */
      const apilog_uuid = await getUUID();
      const addMicrosoftlogPayload = {
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.SAML_USER_OBJECT,
        ip_address: ip_address,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body.SAMLResponse),
      };
      addSamlLogResponse = await saveApilogs(addMicrosoftlogPayload, this.Models);
      if (microsoftUserData && microsoftUserData.status == 0) {
        return res.send(errorResponse(CommonMessages.UNAUTHORIZED_USER, null, RESPONSE_CODES.UNAUTHORIZED, req.headers.tokenization));
      }
      // } else {
      //   logger.error('saml Error, ', addSamlLogResponse?.id || null, this.Models.ApiLogs);
      //   //logger.error('saml Error');
      //   /* Handle authentication failure or unauthorized access */
      //   return res.redirect('/login-failed');
      // }
      /* creating user payload */
      const userPayload = {
        name: microsoftUserData.name,
        email: microsoftUserData.email,
        role_id: microsoftUserData.role_id,
        company_id: microsoftUserData.company_id,
        authority_level_id: microsoftUserData.authority_level_id
      }
      const addUserDetails = await this.createUserAccount(userPayload)
      const updateMicrosoftLogPayload = {
        payload: {
          request_id: addUserDetails.user_id,
          response: JSON.stringify(req.samlUserObject),
          message: "Success",
        },
        query: { id: addSamlLogResponse.id },
      };
      await updateApilogs(updateMicrosoftLogPayload, this.Models.ApiLogs);
      return res.redirect(`${process.env.FRONTEND_BASE_URL}oauth/${addUserDetails.token}`)
    } catch (error) {
      const errorLogPayload = {
        payload: {
          response: JSON.stringify(error),
          message: 'Failed',
        },
        query: { id: addSamlLogResponse?.id || null },
      };
      addSamlLogResponse = await updateApilogs(errorLogPayload, this.Models.ApiLogs);
      logger.error('signup Error, ', error, addSamlLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */


  /* signup */
  async signupV2(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    let addSamlLogResponse;
    try {
      //console.log('req', req);
      const { ip_address } = req;
      // if (!req.isAuthenticated()) {
      //   //logger.error('saml Error, ', addSamlLogResponse?.id || null, this.Models.ApiLogs);
      //   return res.redirect('/login-failed');
      // }
      //if (req.isAuthenticated()) {
      const xmlResponse = req.body.SAMLResponse;
      // const parser = new Saml2js(xmlResponse);
      // req.samlUserObject = parser.toObject();
      req.samlUserObject = xmlResponse;
      const microsoftUserData = await this.getMicrosoftUserData(req.samlUserObject, ip_address, req, res);
      /* creating logs */
      const apilog_uuid = await getUUID();
      const addMicrosoftlogPayload = {
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.SAML_USER_OBJECT,
        ip_address: ip_address,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body.SAMLResponse),
      };
      addSamlLogResponse = await saveApilogs(addMicrosoftlogPayload, this.Models);
      if (microsoftUserData && microsoftUserData.status == 0) {
        return res.send(errorResponse(CommonMessages.UNAUTHORIZED_USER, null, RESPONSE_CODES.UNAUTHORIZED, req.headers.tokenization));
      }
      // } else {
      //   logger.error('saml Error, ', addSamlLogResponse?.id || null, this.Models.ApiLogs);
      //   //logger.error('saml Error');
      //   /* Handle authentication failure or unauthorized access */
      //   return res.redirect('/login-failed');
      // }
      /* creating user payload */
      const userPayload = {
        name: microsoftUserData.name,
        email: microsoftUserData.email,
        role_id: microsoftUserData.role_id,
        company_id: microsoftUserData.company_id,
        authority_level_id: microsoftUserData.authority_level_id
      }
      const addUserDetails = await this.createUserAccount(userPayload)
      const updateMicrosoftLogPayload = {
        payload: {
          request_id: addUserDetails.user_id,
          response: JSON.stringify(req.samlUserObject),
          message: "Success",
        },
        query: { id: addSamlLogResponse.id },
      };
      await updateApilogs(updateMicrosoftLogPayload, this.Models.ApiLogs);
      return res.redirect(`${process.env.FRONTEND_BASE_URL}oauth/${addUserDetails.token}`)
    } catch (error) {
      const errorLogPayload = {
        payload: {
          response: JSON.stringify(error),
          message: 'Failed',
        },
        query: { id: addSamlLogResponse?.id || null },
      };
      addSamlLogResponse = await updateApilogs(errorLogPayload, this.Models.ApiLogs);
      logger.error('signup Error, ', error, addSamlLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* function for get the microsoft user data */
  async getMicrosoftUserData(samlResponse, ip_address, req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    try {
      let role_id;
      let company_id;
      let microsoftGroupData;
      microsoftGroupData = await this.services.getMicrosoftGroupId({ microsoft_group_id: samlResponse.httpSchemasMicrosoftComWs200806IdentityClaimsGroups });
      if (microsoftGroupData && microsoftGroupData.type == 1) {
        console.log('This is a Sub Admin');
        role_id = ROLES.SUB_ADMIN;
        company_id = 1;
      } else if (microsoftGroupData && microsoftGroupData.type == 2) {
        console.log('This is a Broker');
        role_id = ROLES.BROKER;
        // company_id = 2;
        const payload = {
          ip_address: ip_address,
          microsoft_group_id: samlResponse.httpSchemasMicrosoftComWs200806IdentityClaimsGroups
        }
        // const getAccessTokenForOfac = await getAccessTokenForOFAC({ ip_address }, this.Models);
        //let companyRUC;
        let companyRUC = await getCompanyRUC(payload,/* getAccessTokenForOfac,*/ this.Models);
        //console.log('companyRUC121212', companyRUC);
        if (companyRUC && companyRUC.data) {
          const companyPayload = {
            company_name: samlResponse.httpSchemasXmlsoapOrgWs200505IdentityClaimsUserCompanynameUserCompanyname,
            ruc: companyRUC.data.description,
            microsoft_group_id: companyRUC.data.id,
            uuid: await getUUID(),
            role_id: role_id
          };
          const addUpdateCompanyResult = await addUpdateCompanyDetail(companyPayload, this.Models);
          company_id = addUpdateCompanyResult && addUpdateCompanyResult.company_id ? addUpdateCompanyResult.company_id : 2;
        } else {
          return errorResponse(CommonMessages.COMPANY_CREATION_FAILED, null, RESPONSE_CODES.BAD_REQUEST);
        }
      } else {
        // logger.error(('saml user, ', req.samlUserObject, this.Models.ApiLogs));
        logger.error(
          `microsoft_group_id is not found. Environment: ${process.env.IS_PROD == DEFAULT_ENUM.TRUE ? "PRODUCTION" : "STAGING"}`,
          {
            stack: JSON.stringify(samlResponse) || null,
            requestObject: JSON.stringify(samlResponse) || null,
            apiLogModel: this.Models.ApiLogs,
          }
        );
        return errorResponse(CommonMessages.UNAUTHORIZED_USER, null, RESPONSE_CODES.UNAUTHORIZED);
      }
      const user = {
        email: samlResponse.httpSchemasXmlsoapOrgWs200505IdentityClaimsEmailaddress.toLowerCase(),
        name: samlResponse.httpSchemasMicrosoftComIdentityClaimsDisplayname,
        status: USER_STATUS.ACTIVE,
        role_id: role_id,
        company_id: company_id,
        authority_level_id: microsoftGroupData && microsoftGroupData.id ? microsoftGroupData.id : null
      }
      // req.body = user;
      return user
      /* end */
    } catch (error) {
      console.log(error);
    }
  }
  /* end */

  /* function for create user account */
  async createUserAccount(payload) {
    try {
      /* generate uuid for user */
      const uuid = await getUUID();
      /* generate random password */
      const randomString = Math.random().toString(36).substring(5);
      payload.password = randomString;
      payload.status = USER_STATUS.ACTIVE;
      const isEmailExists = await this.services.getUserByEmail(payload.email);
      if (!isEmailExists) {
        payload.uuid = uuid
        const addUser = await this.services.createUser(payload);
        payload.id = addUser.id;
      } else {
        payload.id = isEmailExists.id
        payload.uuid = isEmailExists.uuid
        const userPayload = {
          role_id: payload.role_id,
          company_id: payload.company_id,
          name: payload.name,
          authority_level_id: payload.authority_level_id
        };
        await this.services.updateUser({ id: isEmailExists.id }, userPayload)
      }
      delete payload.password;
      const token = refreshToken(payload);
      const data = { token, user_id: payload.id }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  /* end */

  /* user dashboard login function */
  async userDashboardLogin(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    try {
      let { token } = req.params
      const decoded = await verifyToken(token, secretKey);
      if (decoded == 'invalid jwt') {
        return res.send(errorResponse(CommonMessages.UNAUTHORIZED_USER, null, RESPONSE_CODES.UNAUTHORIZED));
      }
      const isUserExist = await this.services.getUser({ uuid: decoded.uuid });
      if (!isUserExist) {
        return res.send(errorResponse(authMessages.INVALID_TOKEN, null, RESPONSE_CODES.BAD_REQUEST));
      }
      await this.services.updateUser({ id: isUserExist.id }, { last_login: new Date() })
      const tokenPayload = {
        email: isUserExist.email,
        id: isUserExist.id,
        uuid: isUserExist.uuid,
        role_id: isUserExist.role_id,
        name: isUserExist.name,
      };
      token = refreshToken(tokenPayload);
      const return_data = {
        data: isUserExist,
        token: token
      }
      return res.send(successResponse(authMessages.USER_LOGIN_SUCCESS, return_data, RESPONSE_CODES.POST, req.headers.tokenization));
    } catch (error) {
      logger.error('user Dashboard Login Error, ', error);
      console.log(error);
      return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */

  /* signup */
  async signupOld(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { ip_address } = req;
      const {
        name,
        email,
        ruc,
        rg,
        phone,
        terms_condition,
        /* from add broker request */
        created_by_id,
        responsible_id,
        agency_id,
        company_id,
        user_ruc
      } = req.body;
      /* from add broker request */
      const userRuc = company_id ? ruc : user_ruc;
      /* check user email already exists */
      const isEmailExists = await this.services.getUserByEmail(email);
      if (isEmailExists) {
        return res.send(errorResponse(
          authMessages.USER_EMAIL_ALREADY_EXIST,
          null,
          RESPONSE_CODES.BAD_REQUEST,
          req.headers.tokenization
        ));
      };
      if (userRuc) {
        /* check user ruc already exists */
        const isRucExists = await this.services.getUserByRuc(userRuc);
        if (isRucExists) {
          return res.send(errorResponse(
            authMessages.RUC_ALREADY_EXIST,
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
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.SIGNUP,
        ip_address: ip_address,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      req.body.role_id = ROLES.BROKER;
      let companyId;
      companyId = company_id;
      if (!company_id) {
        /* add update user company and its address */
        const addUpdateCompanyResult = await addUpdateCompanyDetail(req.body, this.Models);
        companyId = addUpdateCompanyResult && addUpdateCompanyResult.company_id ? addUpdateCompanyResult.company_id : null;
      }
      /* generate uuid for user */
      const uuid = await getUUID();
      /* generate random password */
      const randomString = Math.random().toString(36).substring(5);
      /*  user payload */
      const userPayload = {
        uuid,
        //company_id: addUpdateCompanyResult && addUpdateCompanyResult.company_id ? addUpdateCompanyResult.company_id : null,
        company_id: companyId,
        role_id: ROLES.BROKER,
        ruc: userRuc,
        name,
        email,
        password: randomString,
        phone,
        agency_id,
        created_by_id: req.user && req.user.id ? req.user.id : null,
        status: req.user && (req.user.role_id == ROLES.ADMIN || req.user.role_id == ROLES.SUB_ADMIN) ? USER_STATUS.ACTIVE : USER_STATUS.PENDING
      };
      const user = await this.services.createUser(userPayload);
      /*  user detail payload */
      const userDetailPayload = {
        user_id: user.id,
        rg,
        terms_condition,
        responsible_id
      };
      await this.services.createUserDetail(userDetailPayload);
      /* send email for the password reset */
      const mailPayload = {
        user_name: user.name,
        user_email: user.email,
        user_password: userPayload.password
      };
      const msg = {
        to: email,
        from: process.env.SENDGRID_USERNAME,
        templateId: process.env.SIGNUP_TEMPLATE_ID,
        dynamic_template_data: mailPayload,
      };
      sendMail(msg);
      const result = await this.services.getUserById(user.id);
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          request_id: result.id,
          response: JSON.stringify(result),
          message: authMessages.USER_SIGNUP_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(
        successResponse(authMessages.USER_SIGNUP_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('signup Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* login */
  async login(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    try {
      const { email, password } = req.body;
      const user = await this.services.getUser({ email });
      if (!user) {
        return res.send(errorResponse(
          authMessages.USER_NOT_FOUND,
          null,
          RESPONSE_CODES.UNAUTHORIZED,
          req.headers.tokenization
        ));
      };
      /* check user account authorization */
      try {
        checkUserAuthorization(req, user);
      } catch (error) {
        return res.json({ message: error.message, code: RESPONSE_CODES.UNAUTHORIZED, status: DEFAULT_ENUM.FALSE });
      };
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return res.send(errorResponse(
          authMessages.WRONG_PASSWORD,
          null,
          RESPONSE_CODES.UNAUTHORIZED,
          req.headers.tokenization
        ));
      };
      let token;
      const tokenPayload = {
        email: user.email,
        id: user.id,
        uuid: user.uuid,
        role_id: user.role_id,
        agency_id: user.agency_id ? true : false,
        company_name: user.company && user.company.company_name ? user.company.company_name : null,
        company_ruc: user.company && user.company.ruc ? user.company.ruc : null,
        name: user.name,
      };
      token = refreshToken(tokenPayload);
      //user.dataValues.token = token;
      delete user.password
      //  const encrypted_data = await encryptData(req, user);
      let result = { data: user, token: token };
      await this.services.updateUser({ id: user.id }, { last_login: new Date() });
      return res.send(
        successResponse(authMessages.USER_LOGIN_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('login Error, ', error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */

  /* forgot password */
  async forgotPassword(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { userToken, ip_address } = req;
      const { email, url } = req.body;
      /* get user detail */
      const user = await this.services.getUser({ email });
      /* if user does not exists */
      if (!user) {
        return res.send(errorResponse(
          authMessages.USER_NOT_FOUND,
          null,
          RESPONSE_CODES.UNAUTHORIZED,
          req.headers.tokenization
        ));
      };
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: user.id,
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.FORGOT_PASSWORD,
        ip_address: ip_address,
        // login_user_id: userToken.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* check user account authorization */
      try {
        checkUserAuthorization(req, user);
      } catch (error) {
        return res.json({ message: error.message, code: RESPONSE_CODES.UNAUTHORIZED, status: DEFAULT_ENUM.FALSE });
      };
      let token = refreshToken({
        email: user.email,
        user_id: user.id,
      });
      /* creating recovery link */
      let fullUrl = url + token
      const mailPayload = {
        user_name: user.name,
        recovery_link: fullUrl
      };
      const msg = {
        to: email,
        from: process.env.SENDGRID_USERNAME,
        templateId: process.env.FOTGOT_PASSWORD_TEMPLATE_ID,
        dynamic_template_data: mailPayload,
      };
      await sendMail(msg);
      /* Update the API logs with the result and success message */
      const updateApiLogPayload = {
        payload: {
          response: null,
          message: authMessages.EMAIL_SENT_SUCCESS
        },
        query: { id: addApiLogResponse.id }
      };
      await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
      return res.send(
        successResponse(authMessages.EMAIL_SENT_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization)
      );
    } catch (error) {
      logger.error('forgot Password Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  }
  /* end */

  /* reset password */
  async resetPassword(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const emailMessages = req.CommonMessages.email;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    try {
      const { ip_address } = req;
      const { password, token } = req.body;
      const userToken = await verifyToken(token);
      const query = {
        email: userToken.email ? userToken.email : null,
      };
      /* get user detail */
      const user = await this.services.getUser(query);
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: user.id,
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.RESET_PASSWORD,
        ip_address: ip_address,
        login_user_id: userToken.id,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
      /* check user account authorization */
      try {
        checkUserAuthorization(req, user);
      } catch (error) {
        return res.json({ message: error.message, code: RESPONSE_CODES.UNAUTHORIZED, status: DEFAULT_ENUM.FALSE });
      };
      /* if user exists */
      if (user) {
        const payload = {
          password
        }
        await this.services.updateUser(query, payload);
        /* Update the API logs with the result and success message */
        const updateApiLogPayload = {
          payload: {
            response: null,
            message: authMessages.PASSWORD_UPDATE_SUCCESS
          },
          query: { id: addApiLogResponse.id }
        };
        await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
        return res.send(
          successResponse(authMessages.PASSWORD_UPDATE_SUCCESS, null, RESPONSE_CODES.POST, req.headers.tokenization)
        );
      } else {
        /* Update the API logs with the result and success message */
        const updateApiLogPayload = {
          payload: {
            response: null,
            message: authMessages.SEND_VALID_TOKEN
          },
          query: { id: addApiLogResponse.id }
        };
        await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
        return res.send(
          errorResponse(authMessages.SEND_VALID_TOKEN, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
      }
    } catch (error) {
      logger.error('reset Password Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res.send(
        errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* get ruc company data */
  async getRucCompany(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const QuoteMessages = req.CommonMessages.quote;
    try {
      let companyData = {};
      const { ruc, role_id, from_quote } = req.body;
      companyData = await this.services.getUserCompany({ ruc });
      if ((companyData &&
        role_id == ROLES.BROKER &&
        companyData.company_roles &&
        !companyData.company_roles.find(role => role.role_id == ROLES.BROKER)) ||
        (companyData &&
          role_id == ROLES.AGENCY &&
          !companyData.company_roles.find(role => role.role_id == ROLES.AGENCY))) {
        return res
          .send(errorResponse(QuoteMessages.RUC_ALREADY_ASSOCIATED, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
      };
      if (companyData && companyData.status == COMPANY_STATUS.INACTIVE) {
        return res
          .send(errorResponse(CommonMessages.COMPANY_IS_INACTIVE, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
      }
      if (!companyData) {
        /* Using third party api for credit score */
        const creditScorePayload = {
          ruc,
          ip_address: req.ip_address,
          from_quote
        }
        const creditScoreResponse = await creditScore(creditScorePayload, this.Models);
        if (creditScoreResponse && creditScoreResponse.data && !creditScoreResponse.data.error && creditScoreResponse.data.main && creditScoreResponse.data.addit) {
          const extractedAddress = creditScoreResponse.data.addit[0] && creditScoreResponse.data.addit[0].direccionCompleta ? creditScoreResponse.data.addit[0].direccionCompleta.split(" / ") : null
          companyData = {
            is_ruc_exists: DEFAULT_ENUM.FALSE,
            ruc: creditScoreResponse.data.main[0] && creditScoreResponse.data.main[0].numeroRuc ? creditScoreResponse.data.main[0].numeroRuc : null,
            company_name: creditScoreResponse.data.main[0] && creditScoreResponse.data.main[0].razonSocial ? creditScoreResponse.data.main[0].razonSocial : null,
            state: extractedAddress && extractedAddress[0] ? extractedAddress[0] : null,
            city: extractedAddress && extractedAddress[1] ? extractedAddress[1] : null,
            district: extractedAddress && extractedAddress[2] ? extractedAddress[2] : null,
            address: extractedAddress && extractedAddress[3] ? extractedAddress[3] : null,
          };
        }
      } else {
        companyData = {
          is_ruc_exists: DEFAULT_ENUM.TRUE,
          ruc: companyData && companyData.ruc ? companyData.ruc : null,
          company_name: companyData && companyData.company_name ? companyData.company_name : null,
          company_phone: companyData && companyData.company_phone ? companyData.company_phone : null,
          state: companyData && companyData.company_address && companyData.company_address.state ? companyData.company_address.state : null,
          city: companyData && companyData.company_address && companyData.company_address.city ? companyData.company_address.city : null,
          district: companyData && companyData.company_address && companyData.company_address.neighborhood ? companyData.company_address.neighborhood : null,
          address: companyData && companyData.company_address && companyData.company_address.address ? companyData.company_address.address : null,
          address_number: companyData && companyData.company_address && companyData.company_address.address_number ? companyData.company_address.address_number : null,
          complement: companyData && companyData.company_address && companyData.company_address.complement ? companyData.company_address.complement : null,
          neighborhood: companyData && companyData.company_address && companyData.company_address.neighborhood ? companyData.company_address.neighborhood : null,
          zipcode: companyData && companyData.company_address && companyData.company_address.zipcode ? companyData.company_address.zipcode : null,
          city: companyData && companyData.company_address && companyData.company_address.city ? companyData.company_address.city : null,
          bank_number: companyData && companyData.company_bank && companyData.company_bank.bank_number ? companyData.company_bank.bank_number : null,
          bank_agency_number: companyData && companyData.company_bank && companyData.company_bank.bank_agency_number ? companyData.company_bank.bank_agency_number : null,
          bank_account_code: companyData && companyData.company_bank && companyData.company_bank.bank_account_code ? companyData.company_bank.bank_account_code : null,
          bank_account_number: companyData && companyData.company_bank && companyData.company_bank.bank_account_number ? companyData.company_bank.bank_account_number : null,
        };
      }
      return res
        .send(
          successResponse(CommonMessages.DATA_LOADED_SUCCESS, companyData, RESPONSE_CODES.POST, req.headers.tokenization)
        );
    } catch (error) {
      logger.error('get Ruc Company Error, ', error);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */

  /* signup */
  async signupV1(req, res) {
    const CommonMessages = req.CommonMessages.commonMessages;
    const authMessages = req.CommonMessages.auth;
    let addApiLogResponse;
    let addSamlLogResponse;
    try {
      //  console.log('req', req);
      const { ip_address } = req;
      let role_id;
      let company_id;
      let microsoftGroupData;
      //if (req.isAuthenticated()) {
      const xmlResponse = req.body.SAMLResponse;
      //   const parser = new Saml2js(xmlResponse);
      //   req.samlUserObject = parser.toObject();
      req.samlUserObject = xmlResponse;
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addMicrosoftlogPayload = {
        type: PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.SAML_USER_OBJECT,
        ip_address: ip_address,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(req.body.SAMLResponse)
      };
      addSamlLogResponse = await saveApilogs(addMicrosoftlogPayload, this.Models);
      microsoftGroupData = await this.services.getMicrosoftGroupId({ microsoft_group_id: req.samlUserObject.httpSchemasMicrosoftComIdentityClaimsObjectidentifier });
      console.log('microsoftGroupData12121', microsoftGroupData);
      if (microsoftGroupData && microsoftGroupData.type == 1) {
        console.log('This is a Sub Admin');
        role_id = ROLES.SUB_ADMIN;
        company_id = 1;
      } else if (microsoftGroupData && microsoftGroupData.type == 2) {
        console.log('This is a Broker');
        role_id = ROLES.BROKER;
      } else {
        // logger.error(('saml user, ', req.samlUserObject, req.samlUserObject || null, this.Models.ApiLogs))
        //logger.error('signup Error, ', error, addSamlLogResponse?.id || null, this.Models.ApiLogs);
        logger.error(
          `microsoftGroupData is null or not found. Environment: ${process.env.IS_PROD == DEFAULT_ENUM.TRUE ? "PRODUCTION" : "STAGING"}`,
          {
            stack: JSON.stringify(req.samlUserObject) || null,
            requestObject: req.samlUserObject || null,
            apiLogModel: this.Models.ApiLogs,
          }
        );
        return res
          .send(errorResponse(CommonMessages.UNAUTHORIZED_USER, null, RESPONSE_CODES.UNAUTHORIZED, req.headers.tokenization));
      }
      const user = {
        email: req.samlUserObject.httpSchemasXmlsoapOrgWs200505IdentityClaimsEmailaddress.toLowerCase(),
        name: req.samlUserObject.httpSchemasMicrosoftComIdentityClaimsDisplayname,
        status: USER_STATUS.ACTIVE,
        role_id: role_id,
      }
      req.body = user;
      //} else {
      //   logger.error('saml Error, ', addSamlLogResponse?.id || null, this.Models.ApiLogs);
      //logger.error('saml Error');
      //   /* Handle authentication failure or unauthorized access */
      //   return res.redirect('/login-failed');
      //  }
      const {
        name,
        email,
      } = req.body;
      //req.body.role_id = ROLES.BROKER;
      /* generate uuid for user */
      const uuid = await getUUID();
      /* generate random password */
      const randomString = Math.random().toString(36).substring(5);
      if (role_id == ROLES.BROKER) {
        const payload = {
          ip_address: ip_address,
          microsoft_group_id: req.samlUserObject.httpSchemasMicrosoftComIdentityClaimsObjectidentifier
        }
        // const getAccessTokenForOfac = await getAccessTokenForOFAC({ ip_address }, this.Models);
        let companyRUC;
        let updateApiLogPayload;
        companyRUC = await getCompanyRUC(payload,/* getAccessTokenForOfac,*/ this.Models);
        //console.log('companyRUC121212', companyRUC);
        if (companyRUC && companyRUC.data) {
          const companyPayload = {
            company_name: req.samlUserObject.httpSchemasXmlsoapOrgWs200505IdentityClaimsUserCompanynameUserCompanyname,
            ruc: companyRUC.data.description,
            microsoft_group_id: companyRUC.data.id,
            uuid: await getUUID(),
            role_id: role_id
          };
          const addUpdateCompanyResult = await addUpdateCompanyDetail(companyPayload, this.Models);
          console.log('addUpdateCompanyResult', addUpdateCompanyResult);
          company_id = addUpdateCompanyResult && addUpdateCompanyResult.company_id ? addUpdateCompanyResult.company_id : 2;
          updateApiLogPayload = {
            payload: {
              response: null,
              message: CommonMessages.COMPANY_CREATION_SUCCESS
            },
            query: { id: addSamlLogResponse.id }
          };
        } else {
          /* Update the API logs with the result and success message */
          updateApiLogPayload = {
            payload: {
              response: null,
              message: CommonMessages.COMPANY_CREATION_FAILED
            },
            query: { id: addSamlLogResponse.id }
          };
          response = errorResponse(CommonMessages.COMPANY_CREATION_FAILED, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization);
        }
      }
      /*  user payload */
      const userPayload = {
        uuid,
        role_id: role_id,
        name,
        email,
        password: randomString,
        status: USER_STATUS.ACTIVE,
        company_id: company_id,
        authority_level_id: microsoftGroupData && microsoftGroupData.microsoft_group_id ? microsoftGroupData.id : 1
      };
      console.log('userPayload12121212122', userPayload);
      /* check email is exist in db or not */
      const isEmailExists = await this.services.getUserByEmail(email);
      console.log('isEmailExists33333', isEmailExists);
      if (!isEmailExists) {
        req.body.uuid = userPayload.uuid
        const addUser = await this.services.createUser(userPayload);
        req.body.id = addUser.id
      } else {
        req.body.id = isEmailExists.id
        req.body.uuid = isEmailExists.uuid
        const userPayload = {
          role_id: req.body.role_id,
          company_id: company_id,
          name: req.body.name,
          authority_level_id: microsoftGroupData && microsoftGroupData.microsoft_group_id ? microsoftGroupData.id : 1

        };
        console.log('userPayload444444444', userPayload);
        await this.services.updateUser({ id: isEmailExists.id }, userPayload)
      }
      const token = refreshToken(req.body);
      /* Update the API logs with the result and success message */
      const updateMicrosoftLogPayload = {
        payload: {
          request_id: req.body.id,
          response: JSON.stringify(req.samlUserObject),
          //message: authMessages.USER_SIGNUP_SUCCESS
          message: 'Success'
        },
        query: { id: addSamlLogResponse.id }
      };
      await updateApilogs(updateMicrosoftLogPayload, this.Models.ApiLogs);
      return res.redirect(`${process.env.FRONTEND_BASE_URL}oauth/${token}`)
    } catch (error) {
      const errorLogPayload = {
        payload: {
          response: JSON.stringify(error),
          message: 'Failed',
        },
        query: { id: addSamlLogResponse?.id || null },
      };
      addSamlLogResponse = await updateApilogs(errorLogPayload, this.Models.ApiLogs);
      logger.error('signup Error, ', error, addSamlLogResponse?.id || null, this.Models.ApiLogs);
      console.log(error);
      return res
        .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
    }
  };
  /* end */
}