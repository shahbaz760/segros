import bodyParser from 'body-parser';
import cors from 'cors';
import { AES, enc } from 'crypto-ts';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import { privateKey } from '../config/encrypt_key';
import es from '../constants/message/es';
import pt from '../constants/message/pt';
import DB from '../src/helpers/db';
import session from 'express-session';
import passport from '../src/services/passport';
import authMiddleWare from '../src/helpers/middlewares';
import Routes from '../src/index';
import { initializeSocketIO } from '../src/services/socket.io';
export default class Server {
    constructor() {
        this.app = null;
        this.db = null;
        this.server = null;
        this.io = null;
    }

    async initServer() {
        try {
            this.app = express();
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: true }));
            this.app.use(morgan("tiny"));
            this.app.use(cors({
                exposedHeaders: [
                    'date', 'content-type', 'content-length', 'connection',
                    'server', 'x-powered-by', 'access-content-allow-origin',
                    'authorization', 'x-final-url',
                ],
                allowedHeaders: ['content-type', 'accept', 'authorization', 'tokenization'],
                origin: '*',
                // methods: ["GET", "POST"]
            }));
            this.app.use(session({
                secret: 'b5b744f73bed0df67687f686a11cbfd7c876405d09b87cda603b6e5d54e55f22',
                resave: false,
                saveUninitialized: true,
                cookie: { secure: true }
            }))
            // Initialize Passport and restore authentication state, if any, from the session
            this.app.use(passport.initialize());
            this.app.use(passport.session());
            this.app.use(helmet());

            this.db = new DB();
            await this.db.init();

            await this.healthCheckRoute();
            await this.healthyDB();
            await this.configureRoutes(this.db);

            this.app.use(authMiddleWare);
            /* socket initialization */
            /* Create HTTP server and attach Socket.IO */
            this.server = http.createServer(this.app);
            this.io = initializeSocketIO(this.server); // Initialize Socket.IO
            return { app: this.app, server: this.server, io: this.io };
            /* end */
        } catch (err) {
            throw err;
        }
    }

    async healthCheckRoute() {
        this.app.get("/", (req, res) => {
            res.json({
                status: "Healthy",
                msg: "Server is up and running.",
            });
        });
    }

    async healthyDB() {
        try {
            if (await this.db.checkConnection()) {
                this.app.get('/health', (req, res) => {
                    res.json({
                        msg: "DB Connection Successful.",
                    });
                });
            } else {
                throw new Error('Error while connecting to DB.');
            }
        } catch (err) {
            throw err;
        }
    }

    async configureRoutes(db) {
        const router = express.Router();
        const routes = new Routes(router, db);
        await routes.routesRegistration();
        this.app.use((req, res, next) => {
            const CommonMessages = req.headers["accept-language"] === "es" ? es : pt;
            const languageCode = req.headers["accept-language"] === "es" ? 'es' : 'pt';
            /* attaching the ip address of the client */
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            req.ip_address = ip;
            req.CommonMessages = CommonMessages[languageCode];
            /* encode or decode request */
            if (req.headers.tokenization == 'true' && req.body && req.body.data) {
                const decryptedBodyData = AES.decrypt(req.body.data, privateKey);
                req.body = JSON.parse(decryptedBodyData.toString(enc.Utf8));
                // if (req.headers.authorization) {
                //     console.log('req.headers.authorization1111111', req.headers.authorization);
                //     const decryptedHeaderToken = AES.decrypt(req.headers.authorization, privateKey);
                //     console.log('decryptedHeaderToken22222222', decryptedHeaderToken);
                //     req.body = JSON.parse(decryptedHeaderToken.toString(enc.Utf8));
                // }
            }
            next();
        }, router);
    }
}

