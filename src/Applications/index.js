import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import schemaValidator from "../helpers/schemaValidator";
import applicationController from "./application.controller";
export default class Application {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.applicationInstance = new applicationController();
    }
    async routes() {
        await this.applicationInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* get cities list */
        this.router.post('/application/dropdown-data', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.applicationInstance.getDropdownData(req, res);
        });
        /* end */

        /* create application */
        this.router.post('/application/createApplication', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.applicationInstance.createApplication(req, res);
        });
        /* end */

        /* get application list */
        this.router.post('/application/list', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.applicationInstance.getApplicationList(req, res);
        });
        /* end */

        /* get application by uuid */
        this.router.get('/application/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.applicationInstance.getApplicationByUuid(req, res);
        });
        /* end */

        /* update application status */
        this.router.post('/application/status/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.applicationInstance.cancelApplicationStatus(req, res);
        });
        /* end */

        /* get application certificate */
        this.router.get('/application/pdf/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.applicationInstance.getApplicationCertificate(req, res);
        });
        /* end */
    }
}
/* end */