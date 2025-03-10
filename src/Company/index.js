import multer from 'multer';
import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import companyController from "./company.controller";
const upload = multer({ dest: 'uploadFile/' });
export default class Company {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.companyInstance = new companyController();
    }
    async routes() {
        await this.companyInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* get company users */
        this.router.post('/get-company-users', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.SUB_AGENCY, userAccess.AGENCY]), (req, res) => {
            this.companyInstance.getCompanyUsers(req, res);
        })
        /* end */

        /* get company list */
        this.router.post('/company-list', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.SUB_AGENCY, userAccess.AGENCY]), (req, res) => {
            this.companyInstance.companyList(req, res);
        });
        /* end */

        /* update company details */
        this.router.put('/company/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY]), (req, res) => {
            this.companyInstance.updateCompany(req, res);
        });
        /* end */

        /* get company by uuid */
        this.router.get('/company/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY]), (req, res) => {
            this.companyInstance.getCompanyByUUID(req, res);
        });
        /* end */

        /* active-inactive company */
        this.router.post('/company/active-inactive/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY]), (req, res) => {
            this.companyInstance.companyActiveInactive(req, res);
        });
        /* end */

        /* delete agency */
        this.router.delete('/company/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.companyInstance.companyDelete(req, res);
        });
        /* end */
    }
}