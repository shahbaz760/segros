import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import schemaValidator from "../helpers/schemaValidator";
import claimsController from "./claims.controller";
import { claimPartnerValidator } from './claims.validator';
export default class Claims {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.claimsInstance = new claimsController();
    }
    async routes() {
        await this.claimsInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* claims list */
        this.router.post('/claims/list/:proposal_id?', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.claimsInstance.getClaimsList(req, res);
        });
        /* end */

        /* get claim partners */
        this.router.get('/claim-partner/list', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.claimsInstance.getClaimPartner(req, res);
        });
        /* end */

        /* add update claim partners */
        this.router.post('/claim-partner/add-update', await this.authorization.authorize([userAccess.ADMIN]), schemaValidator(claimPartnerValidator), (req, res) => {
            this.claimsInstance.addUpdateClaimPartner(req, res);
        });
        /* end */

        /* get claim partners access token */
        this.router.post('/claim-partner/get-access-token', schemaValidator(claimPartnerValidator), (req, res) => {
            this.claimsInstance.getClaimPartnerAccessToken(req, res);
        });
        /* end */

        /* get policy details */
        this.router.post('/claim-partner/get-policy-details', (req, res) => {
            this.claimsInstance.getPolicyDetails(req, res);
        });
        /* end */

        /* create claim webhook used by third party*/
        this.router.post('/claim-partner/add-claim', (req, res) => {
            this.claimsInstance.createClaims(req, res);
        });
        /* end */
    }
}