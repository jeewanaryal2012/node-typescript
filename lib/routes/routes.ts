import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import db from '../db/connect';
import uploads from '../uploads/uploads';
import downloads from '../downloads/download';
import displayAd from '../advertise/advertize-query';
import * as cors from 'cors';
import interceptor from '../interceptor/interceptor';

import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import register from '../login-register/register';
import login from '../login-register/login';
//import * as login from '../login-register/login';

const options: cors.CorsOptions = {
    allowedHeaders: ["*"],
    credentials: false,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*",
    preflightContinue: true
};

const accessTokenSecret = 'youraccesstokensecret';
const LoggerMiddleware = (req, res, next) => {
    //console.log(`Logged  ${req.url}  ${req.method} -- ${new Date()}`)
    next();
}


class JRoutes {
    router = express.Router();
    constructor() {
        dotenv.config();
        this.app = express();
        //interceptor.intercept(this.app);
        //this.app.use(LoggerMiddleware);
        this.app.use(cors(options));

        //this.router = express.Router();
        this.router.use(cors(options));
        this.config();
        this.routes();
    }

    public app: express.Application;

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use('/uploads', express.static(process.env.PWD + '/uploads'));
    }

    private routes(): void {
        this.router.get('/', (req: Request, res: Response) => {
            res.status(200).send({
                message: 'Hello World!'
            })
        });

        this.router.post('/', (req: Request, res: Response) => {
            const data = req.body;
            // query a database and save data
            res.status(200).send(data);
        });
        this.router.post('/login', (req: Request, res: Response) => {
            new login().login(req, res);
        });

        this.router.post('/register', (req: Request, res: Response) => {
            new register(req, res).register(req, res);
        });
        this.router.post('/user-exists', (req: Request, res: Response) => {
            new register(req, res).userExists(req, res);
        });

        this.router.get('/db', (req: Request, res: Response) => {
            //let reg = new register();
            //new register().register(req, res);
            res.json({
                message: 'login expired'
            });
        });

        this.router.get('/users', (req: Request, res: Response) => {
            //res.send('users...');
            db.getUsers().subscribe(data => {
                res.json(data)
            }, err => { });
        });

        this.router.post('/uploads', cors(), uploads.upload.single('image'), (req: Request, res: Response) => {
            uploads.uploadAds(req, res);
        });

        this.router.post('/downloads', cors(), (req: Request, res: Response) => {
            let token = req.headers["authorization"];
            jwt.verify(token, process.env.AUTH_KEY, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        message: "Unauthorized!"
                    });
                } else {
                    downloads.downloads(req, res);
                }
            });
        });

        this.router.post('/display-ad', cors(), (req: Request, res: Response) => {
            displayAd.getUserAd(req, res);
        });

        this.router.get('/test', this.isAuth, (req: Request, res: Response) => {
            res.send({
                message: 'OK authorized'
            });
        });
        this.router.get('/uploads', (req: Request, res: Response) => {
            res.send({
                message: 'OK'
            });
        });



        this.app.use('/', this.router)

    }

    isAuth(req, res, next) {
        jwt.verify(req.headers['authorization'], process.env.AUTH_KEY, (err, verifiedJwt) => {
            console.log(err, verifiedJwt);
            if (err) {
                res.send({
                    message: 'unauthorized'
                });
            } else {
                next();
            }
        });
    }

}

export default new JRoutes().app;