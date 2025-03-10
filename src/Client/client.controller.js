import { Op } from 'sequelize';
import { CHILD_LOG_TYPE, DEFAULT_ENUM, PARENT_LOG_TYPE, RESPONSE_CODES, ROLES } from "../../config/constants";
import { errorResponse, successResponse, successResponseWithPagination } from "../../config/responseHandlers";
import { getAssociatedUsers, getUUID, saveApilogs, updateApilogs } from '../helpers/commonFunction';
import logger from '../helpers/logger';
import Services from "./client.services";
export default class Client {
    async init(db) {
        this.services = new Services();
        this.Models = db.models;
        await this.services.init(db);
    }
    /* get client list */
    async clientList(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body, user } = req;
            const query = {
                deleted_at: null,
            };
            /* get the search value from body */
            if (body && body.search && body.search.value != "") {
                query[Op.or] = [
                    { id: { [Op.like]: '%' + body.search.value + '%' } },
                    { company_name: { [Op.like]: '%' + body.search.value + '%' } },
                    { ruc: { [Op.like]: '%' + body.search.value + '%' } }
                ]
            };
            let userIds = [];
            /* get the sub users of all roles except admin and sub admin */
            if (user.role_id != ROLES.ADMIN && user.role_id != ROLES.SUB_ADMIN) {
                userIds = await getAssociatedUsers(this.Models, user);
                const quoteCompanyIds = await this.services.getQuoteCompanyIds({ user_id: userIds });
                const companyIds = await quoteCompanyIds.map(obj => obj.company_id);
                query.id = companyIds;
            };
            /* get client list */
            const clientList = await this.services.getClientList(query, body);
            body.start = DEFAULT_ENUM.FALSE;
            body.length = DEFAULT_ENUM.FALSE;
            const resultWithoutPagination = await this.services.getClientList(query, body);
            const recordsTotal = resultWithoutPagination.length;
            const recordsFiltered = resultWithoutPagination.length;
            return res.send(successResponseWithPagination(CommonMessages.DATA_LOADED_SUCCESS, clientList, RESPONSE_CODES.POST, recordsTotal, recordsFiltered, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('client List Error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* add customer */
    async addCustomer(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const authMessages = req.CommonMessages.auth;
        let addApiLogResponse;
        try {
            const { body, ip_address, user } = req;
            const {
                ruc,
                company_name,
                company_email,
                company_phone,
                neighborhood,
                address,
                complement,
                address_number,
                zipcode,
                city,
                state,
                is_customer_blacklisted
            } = body;
            /* check if email is exist or not */
            const isEmailExists = await this.services.getUserByEmail({ company_email: company_email });
            if (isEmailExists) {
                return res.send(errorResponse(
                    authMessages.USER_EMAIL_ALREADY_EXIST,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ));
            };
            /* generate uuid for api logs */
            const apilog_uuid = await getUUID();
            /* create api log payload  */
            const addApilogPayload = {
                //request_id: isEmailExists.id,
                type: PARENT_LOG_TYPE.USER,
                log_type: CHILD_LOG_TYPE.ADD_CUSTOMER,
                ip_address: ip_address,
                login_user_id: user.id,
                uuid: apilog_uuid,
                request_payload: JSON.stringify(body),
            };
            addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
            /* generate uuid for user */
            const uuid = await getUUID();
            /* check user email already exists */
            const companyPayload = {
                uuid,
                role_id: ROLES.CUSTOMER,
                ruc,
                company_name,
                company_email,
                company_phone,
                is_customer: DEFAULT_ENUM.TRUE,
                is_customer_blacklisted
            };
            /* add customer */
            const createCustomer = await this.services.addCustomer(companyPayload);
            const companyRolePayload = {
                role_id: ROLES.CUSTOMER,
                company_id: createCustomer.id
            };
            /* add customer role payload*/
            await this.services.addCompanyRoles(companyRolePayload);
            /* add customer address */
            const companyAddressPayload = {
                company_id: createCustomer.id,
                address,
                complement,
                neighborhood,
                address_number,
                zipcode,
                city,
                state,
            };
            /*add customer address */
            await this.services.addCustomerAddress(companyAddressPayload);
            /*  get customer details */
            const result = await this.services.getCompanyDetails(createCustomer.id);
            /* Update the API logs with the result and success message */
            const updateApiLogPayload = {
                payload: {
                    request_id: result.id,
                    response: JSON.stringify(result),
                    message: CommonMessages.DATA_LOADED_SUCCESS
                },
                query: { id: addApiLogResponse.id }
            };
            await updateApilogs(updateApiLogPayload, this.Models.ApiLogs);
            return res
                .send(
                    successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
                );
        } catch (error) {
            console.log(error);
            logger.error('add Customer Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* update customer details */
    async updateCustomer(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        const authMessages = req.CommonMessages.auth;
        let addApiLogResponse;
        try {
            const { params, body, ip_address, user } = req;
            /* get company existence */
            const isCompanyDetail = await this.services.getCompanyDetails({ uuid: params.uuid });
            if (!isCompanyDetail) {
                return res.send(errorResponse(
                    authMessages.USER_NOT_FOUND,
                    null,
                    RESPONSE_CODES.BAD_REQUEST,
                    req.headers.tokenization
                ));
            };
            /* check if the email to be updated already exists */
            const isEmailAlreadyExists = await this.services.getCompanyDetails({ company_email: body.company_email });
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
                // request_id: isCompanyDetail.id,
                type: PARENT_LOG_TYPE.USER,
                log_type: CHILD_LOG_TYPE.UPDATE_CUSTOMER,
                ip_address: ip_address,
                login_user_id: user.id,
                uuid: apilog_uuid,
                request_payload: JSON.stringify(body),
            };
            addApiLogResponse = await saveApilogs(addApilogPayload, this.Models);
            /* update customer */
            await this.services.updateCompany(body, { uuid: params.uuid });
            /* update customer address details */
            await this.services.updateCompanyAddress(body, { company_id: isCompanyDetail.id });
            /* get customer details */
            const result = await this.services.getCompanyDetails({ uuid: params.uuid });
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
            return res.send(successResponse(authMessages.USER_UPDATED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization));
        } catch (error) {
            console.log(error);
            logger.error('update Customer Error', error, addApiLogResponse?.id || null, this.Models.ApiLogs);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

    /* get customer details by uuid */
    async getCustomerDetails(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { params } = req;
            /* get customer details */
            const result = await this.services.getCompanyDetails({ uuid: params.uuid });
            return res.send(
                successResponse(CommonMessages.DATA_LOADED_SUCCESS, result, RESPONSE_CODES.POST, req.headers.tokenization)
            );
        } catch (error) {
            console.log(error);
            logger.error('get Customer Details Error', error);
            return res.send(errorResponse(CommonMessages.ERROR, null, RESPONSE_CODES.SERVER_ERROR, req.headers.tokenization));
        }
    }
    /* end */

}