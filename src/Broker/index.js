import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import brokerController from "./broker.controller";

export default class broker {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.authInstance = new brokerController();
    }
    async routes() {
        await this.authInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* add broker */
        this.router.post('/broker/add', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.authInstance.addBroker(req, res);
        });
        /* end */

        /* get broker by uuid */
        this.router.get('/broker/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY]), (req, res) => {
            this.authInstance.getBrokerByUUID(req, res);
        });
        /* end */

        /* get broker list */
        this.router.post('/broker/list', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY]), (req, res) => {
            this.authInstance.getBrokerList(req, res);
        });
        /* end */

        /* update broker */
        this.router.put('/broker/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY]), (req, res) => {
            this.authInstance.updateBroker(req, res);
        });
        /* end */

        /* approve broker */
        this.router.post('/broker/approve-reject/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.authInstance.brokerApproveReject(req, res);
        });
        /* end */

        /* check user existence */
        this.router.post('/broker/check-existance', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.authInstance.checkBrokerExistence(req, res);
        });
        /* end */
    }
}

