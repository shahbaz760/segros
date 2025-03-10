import multer from 'multer';
import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import proposalController from "./proposal.controller";
const upload = multer({ dest: 'uploadFile/' });
export default class proposal {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.proposalInstance = new proposalController();
    }
    async routes() {
        await this.proposalInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* invoice/billing */
        this.router.post('/proposal/invoices-list', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.proposalInstance.billingList(req, res);
        })
        /* end */

        /* update proposal status*/
        this.router.post('/proposal/update-status', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.proposalInstance.updateProposalStatus(req, res);
        })
        /* end */

        /* create proposal for quote */
        this.router.post('/proposal/create', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.proposalInstance.createProposalsV1(req, res);
        })
        /* end */

        /* get quote list to create proposal*/
        this.router.get('/proposal/quote-list/', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.proposalInstance.getQuoteList(req, res);
        })
        /* end */

        /* get proposal list */
        this.router.post('/proposal/list/:policy_id?', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.proposalInstance.getProposalList(req, res);
        })
        /* end */

        /* get broker list to create proposal*/
        this.router.get('/proposal/broker-list', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.proposalInstance.getBrokerList(req, res);
        })
        /* end */

        /* get quote detail to create proposal*/
        this.router.post('/proposal/:quote_id', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.proposalInstance.getQuoteDetail(req, res);
        })
        /* end */

        /* get policy number from insurance company through api */
        this.router.get('/proposal/policy-number/:proposal_no', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.proposalInstance.getPolicyNumberThroughApi(req, res);
        })
        /* end */

        /* get quote list to create proposal*/
        this.router.get('/proposal/dropdown-data', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.proposalInstance.getDropdownData(req, res);
        })
        /* end */


    }
}