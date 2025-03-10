import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import dashboardController from "./dashboard.controller";
export default class dashboard {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.dashboardInstance = new dashboardController();
    }

    async routes() {
        await this.dashboardInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* get dashboard data */
        this.router.post('/dashboard/data', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.dashboardInstance.dashboardData(req, res);
        })
        /* end */

        /* get sub admin dashboard data */
        this.router.post('/dashboard/sub-admin-dashboard', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.dashboardInstance.subAdminDashboardData(req, res);
        })
        /* end */

        /* get company data */
        this.router.post('/dashboard/company-dashboard', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY]), (req, res) => {
            this.dashboardInstance.companyDashboardData(req, res);
        })
        /* end */
    }
}
