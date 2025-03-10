import multer from 'multer';
import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import quoteController from "./quote.controller";
const upload = multer({ dest: 'uploadFile/' });
export default class quote {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.quoteInstance = new quoteController();
    }
    async routes() {
        await this.quoteInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* broker list  */
        this.router.get('/quote/broker-list', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY]), (req, res) => {
            this.quoteInstance.quoteBrokerList(req, res);
        })
        /* end */

        /* get quote detail */
        this.router.get('/quote/:uuid', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.getQuoteDetail(req, res);
        })
        /* end */

        /* dropdown data */
        this.router.get('/dropdown-data', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.dropdownData(req, res);
        })
        /* end */

        /* get products */
        this.router.get('/products', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.getProducts(req, res);
        })
        /* end */

        /* get coverages */
        this.router.get('/coverages/:product_id/:insurance_type_id', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.getCoverages(req, res);
        })
        /* end */

        /* get quote list */
        this.router.post('/quote/list/:id?', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.getQuoteList(req, res);
        })
        /* end */

        /* create quote at step 2 */
        this.router.post('/quote/v1/add-company-detail', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.createQuote(req, res);
        })
        /* end */

        /* create single transport good */
        this.router.post('/quote/single-transport-goods', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.createSingleTransportGoods(req, res);
        })
        /* end */

        /* add single shipment detail */
        this.router.post('/quote/single-shipment-detail', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.addSingleShipmentDetail(req, res);
        })
        /* end */

        /* delete quote document */
        this.router.post('/quote/delete-document', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.deleteQuoteDocument(req, res);
        })
        /* end */

        /* create coverages for single flow */
        this.router.post('/quote/single-coverages', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.createSingleCoverages(req, res);
        })
        /* end */

        /* delete transport good detail for flow one */
        this.router.post('/quote/delete-good', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.deleteTransportGoodDetail(req, res);
        })
        /* end */

        /* quote calculation for single insurance type */
        this.router.post('/quote/get-single-calculation', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.getSingleQuoteCalculation(req, res);
        })
        /* end */

        /* quote calculation  */
        this.router.post('/quote/add-update-calculation', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.addUpdateQuoteCalculation(req, res);
        })
        /* end */

        /* get quote pdf  */
        this.router.get('/quote/pdf/:quote_id', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.getQuotePdf(req, res);
        })
        /* end */

        /* create annual transport good  */
        this.router.post('/quote/annual-transport-goods', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.createAnnualTransportGoods(req, res);
        });
        /* end */

        /* create update annual shipment detail  */
        this.router.post('/quote/annual-shipment-detail', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.addUpdateAnnualShipmentDetail(req, res);
        });
        /* end */

        /* create update annual quote risks  */
        this.router.post('/quote/annual-risks', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.addUpdateAnnualQuoteRisks(req, res);
        });
        /* end */

        /* create update annual quote claims  */
        this.router.post('/quote/annual-claims', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.addUpdateAnnualQuoteClaims(req, res);
        });
        /* end */

        /* save annual quote claim sheet */
        this.router.post('/quote/annual-claim-sheet/:quote_id', upload.single('file'), await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.saveAnnualQuoteClaimSheet(req, res);
        });
        /* end */

        /* get calculation for annual insurance type */
        this.router.post('/quote/get-annual-calculation', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.getAnnualQuoteCalculation(req, res);
        });
        /* end */

        /* add quote message sent from the quote moderation popup in the last tab */
        this.router.post('/quote/message', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY]), (req, res) => {
            this.quoteInstance.addMessage(req, res);
        });
        /* end */

        /* get quote message list sent from the quote moderation popup in the last tab */
        this.router.get('/quote/messages/:quote_id', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY]), (req, res) => {
            this.quoteInstance.getMessages(req, res);
        });
        /* end */

        /* create coverages for flow 2 */
        this.router.post('/quote/annual-coverages', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN, userAccess.AGENCY, userAccess.SUB_AGENCY, userAccess.BROKER, userAccess.SUB_BROKER]), (req, res) => {
            this.quoteInstance.createAnnualCoverages(req, res);
        })
        /* end */

        /* approve reject quote from the moderation popup */
        this.router.post('/quote/approve-reject', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.quoteInstance.approveReject(req, res);
        })
        /* end */

        /* update quote status */
        this.router.post('/quote/status', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.quoteInstance.updateQuoteStatus(req, res);
        })
        /* end */

        /* create duplicate quote */
        this.router.post('/quote/duplicate', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.quoteInstance.duplicateQuote(req, res);
        })
        /* end */

        /* get quote details for moderation popup */
        this.router.post('/quote/detail-for-moderation-popup', await this.authorization.authorize([userAccess.ADMIN, userAccess.SUB_ADMIN]), (req, res) => {
            this.quoteInstance.getQuoteDetailForModeration(req, res);
        })
        /* end */
    }
}

