import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import transactionController from "./transaction.controller";
export default class report {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.transactionInstance = new transactionController();
    }
    async routes() {
        await this.transactionInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* get agency list */
        this.router.get('/report/filters-data', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.transactionInstance.filtersData(req, res);
        })
        /* end */

        /* get production report */
        this.router.post('/report/production-report', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.transactionInstance.productionReport(req, res);
        })
        /* end */

        /* graph report data */
        this.router.post('/report/graph-report', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.transactionInstance.reportGraphData(req, res);
        })
        /* end */

        /* claim report data */
        this.router.post('/report/claims-report', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.transactionInstance.claimsReport(req, res);
        })
        /* end */

        /* claims graph report data */
        this.router.post('/report/claims-report-graph', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.transactionInstance.claimsReportGraph(req, res);
        })
        /* end */

        /*claims product graph report data */
        this.router.post('/report/claim-report-graph2', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.transactionInstance.claimsReportGraph2(req, res);
        })
        /* end */
    }

}