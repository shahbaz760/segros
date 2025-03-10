import authController from "./auth.controller"
import schemaValidator from "../helpers/schemaValidator"
import Authorization from "../helpers/authorization";
import { getAccessRoles } from '../helpers/commonFunction';
import { loginValidator } from './auth.validator';
import passport from '../services/passport';

export default class auth {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.authInstance = new authController();
    }
    async routes() {
        await this.authInstance.init(this.db);
        await this.authorization.init(this.db);
        let userAccess = await getAccessRoles(this.db);

        /* signup */
        this.router.post('/auth/signup', passport.authenticate('saml', {
            failureRedirect: "/login-failed",
            failureFlash: true,
        }), (req, res) => {
            this.authInstance.signup(req, res);
        });
        /* end */

        /** Broker login to dashboard api */
        this.router.post('/auth/v1/signup', (req, res) => {
            this.authInstance.signupV2(req, res);
        })

        /* sub-admin login */
        this.router.get('/v1/auth/login', passport.authenticate('saml', {
            failureRedirect: '/',
            failureFlash: true,
        }));

        /** Broker login to dashboard api */
        this.router.post('/auth/user-dashboard-login/:token', (req, res) => {
            this.authInstance.userDashboardLogin(req, res);
        })

        /* signup */
        this.router.post('/auth/signup1', (req, res) => {
            this.authInstance.signup(req, res);
        });
        /* end */

        /* login */
        this.router.post('/auth/login', schemaValidator(loginValidator), (req, res) => {
            this.authInstance.login(req, res);
        });
        /* end */

        /* forgot password */
        this.router.post('/auth/forgot-password', (req, res) => {
            this.authInstance.forgotPassword(req, res);
        });
        /* end */

        /* reset password */
        this.router.post('/auth/reset-password', (req, res) => {
            this.authInstance.resetPassword(req, res);
        });
        /* end */

        /* get ruc company data */
        this.router.post('/auth/get-ruc-company', (req, res) => {
            this.authInstance.getRucCompany(req, res);
        });
        /* end */
    }
}

