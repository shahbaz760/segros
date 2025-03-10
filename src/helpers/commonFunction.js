const { v4: uuidv4 } = require('uuid');
import { BlobServiceClient, logger } from "@azure/storage-blob";
import { AES, enc } from 'crypto-ts';
import request from 'request';
import { API_LOG_MESSAGES, CHILD_LOG_TYPE, CURRENCY_EXCHANGE_RATE, CURRENCY_ID, DEFAULT_ENUM, PARENT_LOG_TYPE, PRODUCT_ID, RESPONSE_CODES, ROLES, USER_STATUS } from '../../config/constants';
import { privateKey } from '../../config/encrypt_key';
import { verifyClaimsToken } from "./jwt";
const axios = require('axios')
import { getAccessToken } from "../services/insuranceCompany/proposal";
const PDFDocument = require('pdf-lib').PDFDocument;
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER_NAME
);
// import { getDB } from '../../src/helpers/db';
import DB from '../../src/helpers/db';
// const dbInstance = new DB();
const db = new DB();

/* get user roles */
export const getAccessRoles = async (db) => {
  try {
    const userAccess = {};
    const userRoles = await db.models.Roles.findAll({ raw: true });
    for (const ele of userRoles) {
      if (ele.name == 'Admin') {
        userAccess.ADMIN = ele.id;
      };
      if (ele.name == 'SubAdmin') {
        userAccess.SUB_ADMIN = ele.id;
      };
      if (ele.name == 'Broker') {
        userAccess.BROKER = ele.id;
      };
      if (ele.name == 'SubBroker') {
        userAccess.SUB_BROKER = ele.id;
      };
      if (ele.name == 'Agency') {
        userAccess.AGENCY = ele.id;
      };
      if (ele.name == 'SubAgency') {
        userAccess.SUB_AGENCY = ele.id;
      };
      if (ele.name == 'Customer') {
        userAccess.CUSTOMER = ele.id;
      };
    }
    return userAccess;
  } catch (error) {
    logger.error('get Access Roles Error', error);
  }
};
/* end */

/* get uuid */
export const getUUID = async () => {
  try {
    const uuid = uuidv4();
    return uuid;
  } catch (error) {
    logger.error('get UUID Error', error);
  }
};
/* end */

/* get address info by zipcode */
export const getAddressInfo = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) reject(error);
      if (response.statusCode != RESPONSE_CODES.GET) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(JSON.parse(body));
    });
  });
};
/* end */

/* check the user account status */
export const checkUserAuthorization = (req, user) => {
  const authMessages = req.CommonMessages.auth
  /* if account has been deleted */
  if (user.deleted_at != null) {
    throw new Error(authMessages.ACCOUNT_DELETED);
  };
  /* if account is inactive */
  if (user.status == USER_STATUS.INACTIVE) {
    throw new Error(authMessages.ACCOUNT_DEACTIVATED);
  };
  /* if account is pending */
  if (user.status == USER_STATUS.PENDING) {
    throw new Error(authMessages.ACCOUNT_PENDING)
  }

};
/* end */

/* upload file to server */
export const uploadFileToServer = async (params) => {
  try {
    const data = `${params.folderName}/${params.Key}`
    const formattedDocKey = data.replace(/[ %]/g, '-');
    const blockBlobClient = containerClient.getBlockBlobClient(formattedDocKey);
    await blockBlobClient.uploadData(params.Body);
    const result = {
      Location: `${containerClient.url}/${formattedDocKey}`,
      Key: formattedDocKey
    }
    return result;
  } catch (error) {
    console.log('error :>> ', error);
    logger.error('upload File To Server Error', error);
  }
};
/* end */

/* check claim Partners Authorization */
export const claimPartnersAuthorization = async (req, db) => {
  try {
    const claimsMessages = req.CommonMessages.claims
    if (!req.headers.authorization) {
      throw new Error(claimsMessages.AUTHORIZATION_TOKEN_REQUIRED);
    }
    const decodedToken = await verifyClaimsToken(req.headers.authorization, process.env.CLAIM_PARTNERS_SECRET_KEY);
    if (decodedToken == "jwt expired" || decodedToken == "invalid jwt" || decodedToken == "invalid signature") {
      throw new Error(claimsMessages.AUTHORIZATION_TOKEN_INVALID);
    }
    return decodedToken;
  } catch (error) {
    throw error;
  }
};
/* end */

/* get user ids of the sub users of user */
export const getSubUserIds = async (models, userId) => {
  try {
    const query = { created_by_id: userId };
    const assignedUsersList = await models.Users.findAll({
      attributes: ['id'],
      where: query,
      row: true,
    });
    if (assignedUsersList) {
      return await assignedUsersList.map(({ id }) => id);
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    logger.error('get Sub User Ids Error', error);
  }
}
/* end */

/* get agency brokers */
export const getAgencyBrokers = async (models, userId) => {
  try {
    const query = { agency_id: userId };
    const result = await models.Companies.findAll({
      attributes: ['id'],
      where: query,
      row: true,
    });
    return await result.map(({ id }) => id);
  } catch (error) {
    console.log(error);
    logger.error('get Agency Brokers Error', error);
  }
}
/* end */

export const convertToNumber = async (data) => {
  if (data && typeof data == 'string') {
    let value = data.split('$');
    value = data.includes('$') ? value[1] : value[0];
    value = value.replace(/[#.' ]/g, '');
    value = parseFloat(value.replace(',', '.'));
    return value;
  } else return data;
}
// Decryption function
export const decryptData = (req) => {
  if (req.headers && req.headers.tokenization == 'false') {
    return req.body;
  }
  let encryptedData = req.body.data
  try {
    const decrypted = AES.decrypt(encryptedData, privateKey)
    return JSON.parse(decrypted.toString(enc.Utf8));
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null; // or handle the error appropriately
  }
};

/* encrypt function */
export const encryptData = (tokenization, obj) => {
  try {
    if (tokenization == 'false') {
      return obj;
    }
    const data = JSON.stringify(obj);
    const encrypted = AES.encrypt(data, privateKey)
    return encrypted;
  } catch (error) {
    console.error("Error encrypting data:", error);
    return null; // or handle the error appropriately
  }
};
/*end */

/* delete file from server */
export const deleteFileFromServer = async (filePath) => {
  try {
    /* split the path of the file and get the file key */
    const fileKey = filePath.split(`${containerClient.url}/`)[1];
    const result = await containerClient.deleteBlob(fileKey);
    if (result._response.status !== 202) {
      throw new Error(`Error deleting ${fileKey}`);
    };
  } catch (error) {
    console.log('error while deleting file from server:>> ', error);
  }
};
/* end */

/* get file from server */
export const getFileFromServer = async (filePath) => {
  try {
    /* split the path of the file and get the file key */
    const fileKey = filePath.split(`${containerClient.url}/`)[1];
    const result = await containerClient.getBlobClient(fileKey).exists();
    return result;
  } catch (error) {
    // console.log('error while getting file from server:>> ', error);
  }
};
/* end */

/* check user limit exceeds or not */
export const checkUserQuoteLimit = async (quoteDetail, category) => {
  try {
    let result = DEFAULT_ENUM.FALSE;
    /* get total limit of the quote */
    let totalLimit = quoteDetail.transport_good && quoteDetail.transport_good.total_limit ? quoteDetail.transport_good.total_limit : 0;
    // if (quoteDetail.transport_good && quoteDetail.transport_good.currency && quoteDetail.transport_good.currency == CURRENCY_ID.USD$) {
    //   totalLimit = totalLimit * currencyExchangeRate;
    // };
    /* for import export */
    if (totalLimit > category.imp_exp_limit) {
      result = DEFAULT_ENUM.TRUE;
    };
    return result;
  } catch (error) {
    console.log('error while check User Quote limit :>> ', error);
    logger.error('check User Quote Limit Error', error);
  }
};
/* end */

/* get 6 decimal places of a number */
export const get6Decimal = (number) => {
  try {
    return parseInt(number * 1000000) / 1000000;
  } catch (error) {
    console.log('error getting 6 decimal places of a number limit :>> ', error);
    logger.error('get 6 Decimal Error', error);
  }
};
/* end */

/* get 6 decimal places of a number */
export const get2Decimal = (number) => {
  try {
    return parseInt(number * 100) / 100;
  } catch (error) {
    console.log('error getting 6 decimal places of a number limit :>> ', error);
    logger.error('get 2 Decimal Error', error);
  }
};
/* end */

/* get 3 decimal places of a number */
export const get3Decimal = (number) => {
  try {
    return parseInt(number * 1000) / 1000;
  } catch (error) {
    console.log('error getting 3 decimal places of a number limit :>> ', error);
    logger.error('get 3 Decimal Error', error);
  }
};
/* end */

/* add update user company and its address */
export const addUpdateCompanyDetail = async (payload, models) => {
  try {
    let companyId;
    /* check company with given ruc already exists */
    const isCompanyExists = await models.Companies.findOne({ where: { ruc: payload.ruc }, attributes: ['id'] });
    //console.log('isCompanyExists1111', isCompanyExists);
    /* company exists then update company */
    if (isCompanyExists) {
      /* update company */
      await models.Companies.update(payload, { where: { ruc: payload.ruc } });
      /* get company id */
      companyId = isCompanyExists.id;
      const isCompanyRoles = await models.CompanyRoles.findOne({ where: { company_id: isCompanyExists.id }, attributes: ['id'] });
      if (!isCompanyRoles) {
        const companyRolePayload = {
          role_id: payload.role_id,
          company_id: companyId
        }
        await models.CompanyRoles.create(companyRolePayload);
      }
      /* if company does not exists then create company */
    } else {
      /* generate uuid for company */
      payload.uuid = await getUUID();
      /* create user company */
      const createCompany = await models.Companies.create(payload);
      companyId = createCompany.id;
      /* create company roles */
      const companyRolePayload = {
        role_id: payload.role_id,
        company_id: companyId
      }

      await models.CompanyRoles.create(companyRolePayload);
    };
    /* check company address with company id already exists */
    const isCompanyAddressExists = await models.CompanyAddresses.findOne({ where: { company_id: companyId }, attributes: ['id'] });
    if (isCompanyAddressExists) {
      /* update company address */
      await models.CompanyAddresses.update(payload, { where: { company_id: companyId } });
    } else {
      /* add company id in the company address payload */
      payload.company_id = companyId;
      await models.CompanyAddresses.create(payload);
    };
    /* check company banks with company id already exists */
    const isUserCompanyBankExists = await models.CompanyBanks.findOne({ where: { company_id: companyId }, attributes: ['id'] });
    if (isUserCompanyBankExists) {
      /* update company bank */
      await models.CompanyBanks.update(payload, { where: { company_id: companyId } });
    } else {
      /* add company id in the company address payload */
      payload.company_id = companyId;
      await models.CompanyBanks.create(payload);
    }
    /* check company settings with company id already exists */
    const isUserCompanySettingsExist = await models.CompanySettings.findOne({ where: { company_id: companyId }, attributes: ['id'] });
    /* stringify the company settings */
    if (payload.moderation_notification_emails) {
      payload.moderation_notification_emails =
        payload.moderation_notification_emails
          ? JSON.stringify(payload.moderation_notification_emails)
          : null;
    }
    if (payload.billing_endorsement_notification_emails) {
      payload.billing_endorsement_notification_emails =
        payload.billing_endorsement_notification_emails
          ? JSON.stringify(payload.billing_endorsement_notification_emails)
          : null;
    }
    if (payload.sporadic_notification_emails) {
      payload.sporadic_notification_emails =
        payload.sporadic_notification_emails
          ? JSON.stringify(payload.sporadic_notification_emails)
          : null;
    }

    if (isUserCompanySettingsExist) {
      /* update company settings */
      await models.CompanySettings.update(payload, { where: { company_id: companyId } });
    } else {
      /* add company id in the company settings payload */
      payload.company_id = companyId;
      await models.CompanySettings.create(payload);
    }
    console.log('company_id12121212', companyId);
    return { company_id: companyId };
  } catch (error) {
    console.log('error add Update Company :>> ', error);
    logger.error('add Update Company Detail Error', error);
  }
};
/* end */

/* convert amount to brazil currency */
export const convertToBrazilCurrency = (amount, currency) => {
  amount = parseFloat(amount);
  amount = amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: currency,
  });
  return amount;
};
/* end */

/* get month name */
export const getMonthName = (last_month) => {
  let month = {
    1: 'ENERO',
    2: 'FEBRERO',
    3: 'MARZO',
    4: 'ABRIL',
    5: 'PUEDE',
    6: 'JUNIO',
    7: 'JULIO',
    8: 'AGOSTO',
    9: 'SEPTIEMBRE',
    10: 'OCTUBRE',
    11: 'NOVIEMBRE',
    0: 'DICIEMBRE',
    12: 'DICIEMBRE',
  };
  return month[last_month];
};
/* end */

/* credit score */
export const creditScore = (detail, models) => {
  try {
    return new Promise(async (resolve, reject) => {
      const options = {
        method: 'GET',
        url: `${process.env.CREDIT_SCORE_URL}${detail.ruc}`,
        headers: { authorization: `Bearer ${process.env.CREDIT_SCORE_TOKEN}` },
      };
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: detail.ruc,
        type: detail.from_quote == DEFAULT_ENUM.TRUE ? PARENT_LOG_TYPE.QUOTE : PARENT_LOG_TYPE.USER,
        log_type: CHILD_LOG_TYPE.GET_CREDIT_SCORE,
        ip_address: detail.ip_address,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(options.url),
      };
      const addApiLogResponse = await saveApilogs(addApilogPayload, models);
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
          updateApiLogPayload.payload = { response: body, message: result && !result.error ? API_LOG_MESSAGES.SUCCESS : API_LOG_MESSAGES.FAILED };
          await updateApilogs(updateApiLogPayload, models.ApiLogs);
          resolve(result);
        }
      });
    })
  } catch (error) {
    console.log('error', error);
    logger.error('credit Score Error', error);
  }
}
/* end */

/* check valid RUC for OFAC api */
export const checkValidRuc = async (details, models) => {
  try {
    const getAccessTokenForOfac = await getAccessTokenForOFAC(details, models);
    const ofacPayload = {
      tipoCliente: 'J',
      tipoId: '02',
      cedula: details.ruc,
      primerNombre: details.company_name,
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      idUsuario: '1791268458001',
      codigoPlataforma: 'ALBATROZ',
      correoUsuario: 'vinicius.jorge@albatrozmga.com'
    }
    const OFACApiResponse = await verifyOFACRuc(ofacPayload, getAccessTokenForOfac, models, details.ip_address);
    return OFACApiResponse;
  } catch (error) {
    console.log('check Valid Ruc Error', error);
    logger.error('check Valid Ruc Error', error)
  }
}
/* end */

/* get access token for OFAC api to verify the RUC */
export const getAccessTokenForOFAC = async (detail, models) => {
  const body = {
    username: process.env.OFAC_API_USERNAME,
    password: process.env.OFAC_API_PASSWORD
  }
  try {
    return new Promise(async (resolve, reject) => {
      const options = {
        method: 'GET',
        url: `${process.env.INSURANCE_COMPANY_BASE_URL}generatoken`,
        body: JSON.stringify(body),
      };

      request(options, async (error, response, body) => {
        if (error) {
          logger.error('get Access Token Error', error);
          reject(error);
        }
        try {
          body = body.includes('<!DOCTYPE') ? resolve(null) : body;
          resolve(JSON.parse(body));
        } catch (error) {
          logger.error('get Access Token Error', error);
          return null;
        };
      });
    })
  } catch (error) {
    console.log('error', error);
    logger.error('get Access Token Error', error);
  }
}
/* end */

/* third party api for verify the OFAC ruc */
const verifyOFACRuc = async (detail, token, models, ip_address) => {
  let addApiLogResponse;
  try {
    return new Promise(async (resolve, reject) => {
      const options = {
        method: 'POST',
        // url:'https://busservicioscert.segurosdelpichincha.com:5370/rest/jwt/listasofacext',
        url: `${process.env.INSURANCE_COMPANY_BASE_URL}listasofacext`,
        headers: { authorization: `Bearer ${token}` },
        body: JSON.stringify(detail),
      };
      /* generate uuid for api logs */
      const apilog_uuid = await getUUID();
      /* create api log payload  */
      const addApilogPayload = {
        request_id: detail.cedula, /* ruc which comes form (cedula) field in the detail */
        log_type: CHILD_LOG_TYPE.VERIFY_OFAC_RUC_API,
        ip_address: ip_address,
        uuid: apilog_uuid,
        request_payload: JSON.stringify(options),
      };
      addApiLogResponse = await saveApilogs(addApilogPayload, models);
      request(options, async (error, response, body) => {
        /* update api log payload */
        const updateApiLogPayload = {
          query: { id: addApiLogResponse.id },
        };
        if (error) {
          updateApiLogPayload.payload = { response: JSON.stringify(error), message: API_LOG_MESSAGES.FAILED };
          await updateApilogs(updateApiLogPayload, models.ApiLogs);
          resolve({});
          return;
        }
        try {
          updateApiLogPayload.payload = { response: JSON.stringify(body), message: API_LOG_MESSAGES.SUCCESS };
          await updateApilogs(updateApiLogPayload, models.ApiLogs);
          body = body.includes('<!DOCTYPE') ? resolve({}) : body;
          resolve(JSON.parse(body));
        } catch (error) {
          updateApiLogPayload.payload = { message: API_LOG_MESSAGES.FAILED };
          await updateApilogs(updateApiLogPayload, models.ApiLogs);
          resolve({});
          // return;
        }
      })
    })
  } catch (error) {
    console.log('error', error);
    logger.error('verify OFAC Ruc Error', error);
  }
}
/* end */

/* get the company ruc */
export const getCompanyRUC = async (detail, models, ip_address) => {
  let addApiLogResponse;
  // let updateApiLogPayload;
  try {
    const options = {
      method: 'GET',
      url: `https://seguridadcert.segurosdelpichincha.com/v1/seg/Usuario/usergroup?userId=${detail.microsoft_group_id}`,
      // url: `${process.env.INSURANCE_COMPANY_BASE_URL}emite`,
      //data: body,
      headers: {
        // authorization: token,
        'Content-Type': 'application/json', // Set content type
        'Cookie': 'cookiesession1=678A8C43D76AD9103A796BED912A7E68'
      },
    };
    /* generate uuid for api logs */
    const apilog_uuid = await getUUID();
    /* create api log payload  */
    const addApilogPayload = {
      request_id: detail.microsoft_group_id,
      type: PARENT_LOG_TYPE.COMPANY,
      log_type: CHILD_LOG_TYPE.GET_BROKER_COMPANY,
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
    // console.log('response.data121211', response.data);
    return response.data;
  } catch (error) {
    console.log('error', error);
    const updateApiLogPayload = {
      query: { id: addApiLogResponse.id || null },
      payload: { response: JSON.stringify(error), message: API_LOG_MESSAGES.FAILED }
    };
    await updateApilogs(updateApiLogPayload, models.ApiLogs);
    logger.error('verify Company Ruc Error', error);
  }
}
/* end */



/* get the associated ids based on the roles */
export const getAssociatedUsers = async (Models, user) => {
  try {
    let userIds = [];
    if (user.role_id === ROLES.BROKER) {
      userIds.push(user.id);
    } else if (user.role_id === ROLES.SUB_BROKER) {
      userIds.push(user.created_by_id);
    } else if (user.role_id === ROLES.AGENCY) {
      /* get all brokers of the agency of the currently logged in sub agency */
      const agencyBrokers = await getAgencyBrokers(Models, user.id);
      userIds.push(agencyBrokers);
    } else if (user.role_id == ROLES.SUB_AGENCY) {
      /* get all brokers of the agency of the currently logged in sub agency */
      const agencyBrokers = await getAgencyBrokers(Models, user.created_by_id);
      userIds.push(agencyBrokers);
    }
    return userIds;
  } catch (error) {
    console.log('get Associated Users Error', error);
    logger.error('get Associated Users Error', error);
  }
}
/* end */

/* get the real amount if it is in USD */
// export const getReal$Amount = async (models, total_limit) => {
//   try {
//     const getCurrencyExchangeRate = await models.CurrencyExchangeRates.findOne({ where: { id: 1 } });
//     const exchangeRate = getCurrencyExchangeRate && getCurrencyExchangeRate.rate ? getCurrencyExchangeRate.rate : CURRENCY_EXCHANGE_RATE.STANDARD;
//     const totalLimit = total_limit * exchangeRate;
//     return totalLimit;
//   } catch (error) {
//     console.log('get Real $ Amount Error', error);
//     logger.error('get Real $ Amount Error', error);
//   }
// }
/* end */

/* save api logs */
export const saveApilogs = async (detail, models) => {
  try {
    const result = await models.ApiLogs.create(detail);
    return result;
  } catch (error) {
    console.log(error);
    logger.error('save Apilogs Error', error);
  }
}
/* end */

/* update api logs */
export const updateApilogs = async (detail, apiLogModel) => {
  try {
    const result = await apiLogModel.update(detail.payload, { where: detail.query });
    return result;
  } catch (error) {
    logger.error('update Apilogs Error', error);
  }
}
/* end */

/* payload for insurance company*/
export const insuranceCompanyPayload = async (quoteDetail, result, ip_address, models) => {
  try {
    // console.log('quoteDetail', quoteDetail);
    console.log('result333333', result);
    const policyPayloadToInsuranceCompany = {
      ip_address: ip_address,
      proposal_no: quoteDetail.proposal_no,
      //gross_written_premium: grossWrittenPremium,
      // insurance_rate: insurance_rate,
      // total_Premium: total_Premium,
      // total_insurance_cost: total_insurance_cost,
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
      // policy_start_date: new Date(policy_start_date).toISOString().split('.')[0],
      // policy_end_date: new Date(policy_end_date).toISOString().split('.')[0],
      tax_emmssion: result.tax_emmssion ? result.tax_emmssion : 0,
      CSSC: result.tax_ssc ? get2Decimal(result.tax_ssc) : 0,
      CSCVS: result.tax_scvs ? get2Decimal(result.tax_scvs) : 0,
      IVA: result.tax_iva ? get2Decimal(result.tax_iva) : 0,
      //astr_detalle: astr_detalle
    };
    return policyPayloadToInsuranceCompany;
  } catch (error) {
    console.log(error);
    logger.error('insurance Company Payload', error);
  }
}
/* end */












