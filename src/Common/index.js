import multer from 'multer';
import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import commonController from "./common.controller";
const upload = multer({ dest: 'uploadFile/' });
export default class Common {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.commonInstance = new commonController();
    }
    async routes() {
        await this.commonInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* broker category list */
        this.router.get('/broker-category-list', (req, res) => {
            this.commonInstance.getBrokerCategoryList(req, res);
        });
        /* end */

        /* get responsible list */
        this.router.get('/responsible-list', (req, res) => {
            this.commonInstance.getResponsibleList(req, res);
        });
        /* end */

        /* get all banks */
        this.router.get('/get-all-banks', (req, res) => {
            this.commonInstance.getAllBanks(req, res);
        });
        /* end */

        /* get address */
        this.router.get('/get-address/:zip_code', (req, res) => {
            this.commonInstance.getAddressOfBroker(req, res);
        });
        /* end */

        /* active-inactive agency */
        this.router.post('/user/active-inactive/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.BROKER, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY]), (req, res) => {
            this.commonInstance.userActiveInactive(req, res);
        });
        /* end */

        /* delete agency */
        this.router.delete('/user/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.commonInstance.userDelete(req, res);
        });
        /* end */

        /* add sub broker or sub agency */
        this.router.post('/add-sub-broker-or-sub-agency', await this.authorization.authorize([userAccess.BROKER, userAccess.SUB_ADMIN, userAccess.AGENCY]), (req, res) => {
            this.commonInstance.addSubBrokerOrSubAgency(req, res);
        });
        /* end */

        /* sub broker or sub agency list */
        this.router.post('/sub-broker-or-sub-agency-list', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.BROKER, userAccess.AGENCY, userAccess.SUB_AGENCY]), (req, res) => {
            this.commonInstance.subBrokerOrSubAgencyList(req, res);
        });
        /* end */

        /* get broker or sub agency detail by uuid */
        this.router.get('/sub-broker-or-sub-agency/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.BROKER, userAccess.AGENCY, userAccess.SUB_AGENCY]), (req, res) => {
            this.commonInstance.getSubBrokerOrSubAgencyByUUID(req, res);
        });
        /* end */

        /* update broker or sub agency list by uuid */
        this.router.put('/sub-broker-or-sub-agency/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.BROKER, userAccess.AGENCY]), (req, res) => {
            this.commonInstance.updateSubBrokerOrSubAgencyByUUID(req, res);
        });
        /* end */

        /* update user profile */
        this.router.put('/user/update-profile', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER, userAccess.CUSTOMER]), (req, res) => {
            this.commonInstance.updateUserProfile(req, res);
        })
        /* end */

        /* get user profile */
        this.router.get('/user/get-profile', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER, userAccess.CUSTOMER]), (req, res) => {
            this.commonInstance.getUserProfile(req, res);
        })
        /* end */

        /* upload files */
        this.router.post('/upload', upload.array('files'), await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER, userAccess.CUSTOMER]), (req, res) => {
            this.commonInstance.upload(req, res);
        })
        /* end */

        /* get decode data */
        this.router.get('/data-decode', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER, userAccess.CUSTOMER]), (req, res) => {
            this.commonInstance.getDecodedData(req, res);
        })
        /* end */

        /* api log dropdown data */
        this.router.get('/apilog-dropdowns-list', await this.authorization.authorize([userAccess.ADMIN]), (req, res) => {
            this.commonInstance.getApilogDropdownData(req, res);
        })
        /* end */

        /* get api log list */
        this.router.post('/apilog-list', await this.authorization.authorize([userAccess.ADMIN]), (req, res) => {
            this.commonInstance.getApilogList(req, res);
        })
        /* end */

        /* get api log list by uuid */
        this.router.get('/apilog-list/:uuid', await this.authorization.authorize([userAccess.ADMIN]), (req, res) => {
            this.commonInstance.getApilogByUuid(req, res);
        })
        /* end */

        /* get api log list by uuid */
        this.router.get('/broker/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.commonInstance.getBrokerDetailByUUID(req, res);
        })
        /* end */

        /* get api log list by uuid */
        this.router.post('/importData', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), upload.single('file'), (req, res) => {
            this.commonInstance.importDataFromExcelFile(req, res);
        })
        /* end */

    }
}

