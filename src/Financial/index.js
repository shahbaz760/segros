import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import financialController from "./financial.controller";
export default class financial {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.financialInstance = new financialController();
    }
    async routes() {
        await this.financialInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* get financial list */
        this.router.post('/financial/list', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.financialInstance.financialList(req, res);
        })
        /* end */
    }

}