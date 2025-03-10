import { Op } from 'sequelize';
import { DEFAULT_ENUM, PROPOSAL_PAYMENT_STATUS, RESPONSE_CODES, ROLES, TRANSACTION_PAYMENT_TYPE } from "../../config/constants";
import { errorResponse, successResponseWithPagination } from "../../config/responseHandlers";
import { getAssociatedUsers } from '../helpers/commonFunction';
import logger from '../helpers/logger';
import Services from "./financial.services";
export default class Financial {
    async init(db) {
        this.services = new Services();
        this.Models = db.models;
        await this.services.init(db);
    }
    /* get financial list based on proposals */
    async financialList(req, res) {
        const CommonMessages = req.CommonMessages.commonMessages;
        try {
            const { body, user } = req;
            if (user.role_id == ROLES.SUB_AGENCY || user.role_id == ROLES.SUB_BROKER) {
                if (user.user_access.payments == DEFAULT_ENUM.FALSE) {
                    return res.send(errorResponse(CommonMessages.UNAUTHORIZED_USER, null, RESPONSE_CODES.BAD_REQUEST, req.headers.tokenization));
                }
            };
            const query = {
                payment_type: body.payment_type ? body.payment_type : [
                    TRANSACTION_PAYMENT_TYPE.CHARGE,
                    // TRANSACTION_PAYMENT_TYPE.ADJUSTABLE,
                    // TRANSACTION_PAYMENT_TYPE.AVERBAVEL,
                    // TRANSACTION_PAYMENT_TYPE.AVULSA,
                    // TRANSACTION_PAYMENT_TYPE.BILLING_OR_CHARGE,
                    // TRANSACTION_PAYMENT_TYPE.CANCELLED,
                    // TRANSACTION_PAYMENT_TYPE.NO_CHARGE,
                ],
            };
            /* if client then getting its financial list */
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
                    { astr_poliza: { [Op.like]: '%' + body.search.value + '%' } },
                    { quote_company_name: { [Op.like]: '%' + body.search.value + '%' } },
                    { policy_type: { [Op.like]: '%' + body.search.value + '%' } }

                ]
            };
            /* get financial list */
            const financialList = await this.services.getFinancialList(query, body);
            body.start = 0;
            body.length = 0;
            /* get financial list for pagination */
            const resultWithoutPagination = await this.services.getFinancialList(query, body);
            const recordsTotal = resultWithoutPagination.length;
            const recordsFiltered = resultWithoutPagination.length;
            return res.send(successResponseWithPagination(
                CommonMessages.DATA_LOADED_SUCCESS,
                financialList,
                RESPONSE_CODES.POST,
                recordsTotal,
                recordsFiltered,
                req.headers.tokenization
            ));
        } catch (error) {
            console.log(error);
            logger.error('financial List Error', error)
            return res.send(errorResponse(
                CommonMessages.ERROR,
                null,
                RESPONSE_CODES.SERVER_ERROR,
                req.headers.tokenization
            ));
        }
    }
    /* end */
}