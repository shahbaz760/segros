import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import subAdminController from "./subAdmin.controller";
export default class SubAdmin {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.subAdminInstance = new subAdminController();
    }
    async routes() {
        await this.subAdminInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* renew policy for sub admin */
        this.router.post('/subadmin/renew-policy', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.subAdminInstance.renewPolicy(req, res);
        });
        /* end */

        /* get policy ids */
        this.router.get('/subadmin/policy-ids', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.subAdminInstance.getPolicyIds(req, res);
        })
        /* end */

        /* add sub admin */
        this.router.post('/subadmin/add', await this.authorization.authorize([userAccess.ADMIN]), (req, res) => {
            this.subAdminInstance.addSubAdmin(req, res);
        });
        /* end */

        /* update sub admin */
        this.router.put('/subadmin/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.subAdminInstance.updateSubAdmin(req, res);
        });
        /* end */

        /* get sub admin by uuid*/
        this.router.get('/subadmin/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.subAdminInstance.getSubAdminById(req, res);
        });
        /* end */

        /* get all sub admin list */
        this.router.post('/subadmin/list', await this.authorization.authorize([userAccess.ADMIN]), (req, res) => {
            this.subAdminInstance.getAllSubAdmin(req, res);
        });
        /* end */

        /* quote assign to sub admin */
        this.router.post('/subadmin/quote-assign-to-subadmin', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.subAdminInstance.quoteAssignToSubAdmin(req, res);
        });
        /* end */

        /* get all higher authority subAdmins list */
        this.router.post('/subadmin/:quote_id', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.subAdminInstance.getHigherAuthoritySubAdmins(req, res);
        });
        /* end */
    }
}

