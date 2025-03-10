import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import agencyController from "./agency.controller";

export default class Agency {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.agencyInstance = new agencyController();
    }
    async routes() {
        await this.agencyInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);
        /* add agency */
        this.router.post('/agency/add', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.agencyInstance.addAgency(req, res);
        });
        /* end */

        /* update agency */
        this.router.put('/agency/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.agencyInstance.updateAgency(req, res);
        });
        /* end */

        /* get agency by id*/
        this.router.get('/agency/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.agencyInstance.getAgencyById(req, res);
        });
        /* end */

        /* agency list */
        this.router.post('/agency/list', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.agencyInstance.getAgencyList(req, res);
        });
        /* end */
    }
}

