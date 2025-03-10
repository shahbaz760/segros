import { Op } from 'sequelize';
import { CHILD_LOG_TYPE, COMPANY_STATUS, PARENT_LOG_TYPE, RESPONSE_CODES, ROLES, USER_STATUS } from "../../config/constants";
import { errorResponse, successResponse, successResponseWithPagination } from "../../config/responseHandlers";
import { getUUID, saveApilogs, updateApilogs } from "../helpers/commonFunction";
import logger from '../helpers/logger';
import Services from "./company.services";
export default class Company {
    async init(db) {
        this.services = new Services();
        this.Models = db.models;
        await this.services.init(db);
    }
    /* get company users based on the company id */
    async getCompanyUsers(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body, user } = req;
            const query = {
                company_id: body.company_id,
                role_id: [ROLES.BROKER, ROLES.SUB_BROKER],
                deleted_at: null
            };
            if (body.status) {
                if (body.status == USER_STATUS.ACTIVE) {
                    query.status = [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE];
                } else {
                    query.status = body.status;
                }
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
            const result = await this.services.getCompanyUsersList(query, body);
            body.start = 0;
            body.length = 0;
            const dataWithoutPagination = await this.services.getCompanyUsersList(query, body);
            let recordsTotal = dataWithoutPagination.length;
            let recordsFiltered = dataWithoutPagination.length;
            return res.send(successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('get Company Users Error', error);
            return res
                .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* get company list */
    async companyList(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body, user } = req;
            let query = {
                deleted_at: null,
                status: [COMPANY_STATUS.ACTIVE, COMPANY_STATUS.INACTIVE]
            };
            if (body.agency_id) {
                query.agency_id = body.agency_id;
            }
            /* if agency is logged in */
            if (user.role_id == ROLES.AGENCY) {
                query.agency_id = user.id;
            }
            /* if sub agency is logged in */
            if (user.role_id == ROLES.SUB_AGENCY) {
                query.agency_id = user.created_by_id;
            };
            /* get the search value from body */
            if (body && body.search && body.search.value != "") {
                query[Op.or] = [
                    { id: { [Op.like]: '%' + body.search.value + '%' } },
                    { company_email: { [Op.like]: '%' + body.search.value + '%' } },
                    { ruc: { [Op.like]: '%' + body.search.value + '%' } },
                    { company_name: { [Op.like]: '%' + body.search.value + '%' } },
                ]
            };
            const getCompaniesList = await this.services.getCompaniesList(query, body);
            body.start = 0;
            body.length = 0;
            const resultWithoutPagination = await this.services.getCompaniesList(query, body);
            const recordsTotal = resultWithoutPagination.length;
            const recordsFiltered = resultWithoutPagination.length;;
            return res.send(successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, getCompaniesList, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization));
        } catch (error) {
            logger.error('company List Error, ', error);
            console.log(error);
            return res
                .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* update company details by uuid */
    async updateCompany(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const CompanyMessages = req.CommonMessages.company;
        const AuthMessages = req.CommonMessages.auth;
        let addApiLogResponse;
        try {
            const { params, body, ip_address, user } = req;
            /* check company exists or not */
            const isCompanyExists = await this.services.getCompanyByUUID({ uuid: params.uuid });
            if (!isCompanyExists) {
                return res.send(errorResponse(
                    CompanyMessages.COMPANY_NOT_FOUND,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ));
            };
            const isCompanyRucExist = await this.services.getCompanyRuc({ ruc: body.ruc });
            if (isCompanyRucExist && isCompanyRucExist.uuid != isCompanyExists.uuid) {
                return res.send(errorResponse(
                    AuthMessages.RUC_ALREADY_REGISTERED,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ));
            };
            /* generate uuid for api logs */
            const apilog_uuid = await getUUID();
            /* create api log payload  */
            const addApilogPayload = {
                request_id: isCompanyExists.id,
                type: PARENT_LOG_TYPE.COMPANY,
                log_type: CHILD_LOG_TYPE.UPDATE_COMPANY,
                ip_address: ip_address,
                login_user_id: user.id,
                uuid: apilog_uuid,
                request_payload: JSON.stringify(body),
            };
            addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
            req.body.role_id = ROLES.BROKER;
            /* stringify the company settings */
            body.moderation_notification_emails =
                body.moderation_notification_emails
                    ? JSON.stringify(body.moderation_notification_emails)
                    : null;
            body.billing_endorsement_notification_emails =
                body.billing_endorsement_notification_emails
                    ? JSON.stringify(body.billing_endorsement_notification_emails)
                    : null;
            body.sporadic_notification_emails =
                body.sporadic_notification_emails
                    ? JSON.stringify(body.sporadic_notification_emails)
                    : null;
            /* updating the company details*/
            await this.services.updateCompany(body, { uuid: params.uuid });
            /* update company address */
            await this.services.updateCompanyAddress(body, { company_id: isCompanyExists.id });
            /* update company bank details */
            await this.services.updateCompanyBankDetails(body, { company_id: isCompanyExists.id });
            /* update company setting */
            await this.services.updateCompanySetting(body, { company_id: isCompanyExists.id });
            const result = await this.services.getCompanyDetails({ uuid: params.uuid });
            /* Update the API logs with the result and success message */
            const updateApiLogPayload = {
                payload: {
                    response: JSON.stringify(result),
                    message: CompanyMessages.COMPANY_UPDATED_SUCCESS
                },
                query: { id: addApiLogResponse.id }
            };
            await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
            return res
                .send(successResponse(CompanyMessages.COMPANY_UPDATED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
        } catch (error) {
            logger.error('update Company Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    };
    /* end */

    /* get company by uuid */
    async getCompanyByUUID(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const CompanyMessages = req.CommonMessages.company;
        try {
            const { uuid } = req.params;
            const companyDetails = await this.services.getCompanyDetails({
                uuid: uuid,
                deleted_at: null
            });
            if (!companyDetails) {
                return res.send(errorResponse(
                    CompanyMessages.COMPANY_NOT_FOUND,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ));
            }
            return res.send(
                successResponse(CommonMessages.DATA_LOADED_SUCCESS, companyDetails, RESPONSE_CODES.GET, req.headers.tokenization)
            );
        } catch (error) {
            logger.error('get Company By UUID Error, ', error);
            console.log(error);
            return res.send(
                errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    };
    /* end */

    /* active-inactive company  */
    async companyActiveInactive(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const CompanyMessages = req.CommonMessages.company;
        let addApiLogResponse;
        try {
            const { params, body, ip_address, user } = req;
            /* check company exists or not */
            const isCompanyExists = await this.services.getCompanyDetails({
                uuid: params.uuid,
            });
            if (!isCompanyExists) {
                return res.send(errorResponse(
                    CompanyMessages.COMPANY_NOT_FOUND,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ));
            };
            /* generate uuid for api logs */
            const apilog_uuid = await getUUID();
            /* create api log payload  */
            const addApilogPayload = {
                request_id: isCompanyExists.id,
                type: PARENT_LOG_TYPE.COMPANY,
                log_type: CHILD_LOG_TYPE.COMPANY_ACTIVE_INACTIVE,
                ip_address: ip_address,
                login_user_id: user.id,
                uuid: apilog_uuid,
                request_payload: JSON.stringify(body),
            };
            addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
            /* updating the company */
            await this.services.updateCompany(body, { id: isCompanyExists.id });
            /* if company is to be active or inactive then need to make the associated users activated or deactivated as well */
            await this.services.updateUser({ company_id: isCompanyExists.id }, body);
            const responseMessage = body.status == COMPANY_STATUS.ACTIVE ?
                CompanyMessages.COMPANY_ACTIVATED :
                CompanyMessages.COMPANY_DEACTIVATED;
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
            logger.error('company Active Inactive Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
            console.log(error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    };
    /* end */

    /* delete company  */
    async companyDelete(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const companyMessages = req.CommonMessages.company;
        let addApiLogResponse;
        try {
            const { params, body, ip_address, user } = req;
            /* check company exists or not */
            const isCompanyExists = await this.services.getCompanyDetails({
                uuid: params.uuid,
                deleted_at: null
            });
            if (!isCompanyExists) {
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
                request_id: isCompanyExists.id,
                type: PARENT_LOG_TYPE.COMPANY,
                log_type: CHILD_LOG_TYPE.COMPANY_DELETE,
                ip_address: ip_address,
                login_user_id: user.id,
                uuid: apilog_uuid,
                request_payload: JSON.stringify(body),
            };
            addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
            /* updating the company */
            await this.services.updateCompany({ deleted_at: new Date() }, { id: isCompanyExists.id });
            /* if company is to be deleted then need to make the associated users deleted as well */
            await this.services.updateUser({ company_id: isCompanyExists.id }, { deleted_at: new Date() });
            /* Update the API logs with the result and success message */
            const updateApiLogPayload = {
                payload: {
                    response: null,
                    message: companyMessages.COMPANY_DELETED
                },
                query: { id: addApiLogResponse.id }
            };
            await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
            return res.send(
                successResponse(companyMessages.COMPANY_DELETED, null, RESPONSE_CODES.POST, req.headers.tokenization)
            );
        } catch (error) {
            logger.error('company Delete Error, ', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
            console.log(error);
            return res
                .send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    };
    /* end */
}