import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import adminController from "./admin.controller";
export default class admin {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.authInstance = new adminController();
    }
    async routes() {
        await this.authInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

    }
}

