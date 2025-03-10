import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import clientController from "./client.controller";
export default class client {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.clientInstance = new clientController();
    }
    async routes() {
        await this.clientInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* get customer detail by uuid */
        this.router.get('/client/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.clientInstance.getCustomerDetails(req, res);
        })
        /* end */

        /* get customer list */
        this.router.post('/client/list', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.clientInstance.clientList(req, res);
        })
        /* end */

        /* add customer */
        this.router.post('/client/add-customer', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.clientInstance.addCustomer(req, res);
        })
        /* end */

        /* update customer */
        this.router.put('/client/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.clientInstance.updateCustomer(req, res);
        })
        /* end */
    }
}