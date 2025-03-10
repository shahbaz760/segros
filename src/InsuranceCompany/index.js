import multer from 'multer';
import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import insuranceCompanyController from "./insuranceCompany.controller";
const upload = multer({ dest: 'uploadFile/' });
export default class InsuranceCompany {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.insuranceCompanyInstance = new insuranceCompanyController();
    }
    async routes() {
        await this.insuranceCompanyInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* proposal approval from insurance company*/
        this.router.post('/insurance-company/proposal', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.insuranceCompanyInstance.proposalApprovalFromInsuranceCompany(req, res);
        })
        /* end */

        /* get access token */
        this.router.get('/insurance-company/get-access-token', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.insuranceCompanyInstance.getAccessToken(req, res);
        });
        /* end */
    }
}