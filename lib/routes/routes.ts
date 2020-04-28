import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import db from '../db/connect';
import uploads from '../uploads/uploads';
import downloads from '../downloads/download';
import displayAd from '../advertise/advertize-query';
import * as cors from 'cors';

import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import register from '../login-register/register';
//import * as login from '../login-register/login';

const options: cors.CorsOptions = {
    allowedHeaders: ["*"],
    credentials: false,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*",
    preflightContinue: true
};

const accessTokenSecret = 'youraccesstokensecret';


class JRoutes {
    router = express.Router();
    constructor() {
        dotenv.config();
        this.app = express();
        //this.router = express.Router();
        this.router.use(cors(options));
        this.config();
        this.routes();
    }

    public app: express.Application;

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
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
            //console.log(process.env.AUTH_KEY, req.body);
            var hash = bcrypt.hashSync(req.body.password, 10);
            console.log(hash);
            bcrypt.compare(req.body.password, hash, (err, res) => {
                console.log(res);
            });

            const user = { username: req.body.username, password: req.body.password };
            const accessToken = jwt.sign(user, process.env.AUTH_KEY);
            res.json({
                userName: req.body.username,
                role: 'manager',
                accessToken
            });
        });

        this.router.post('/register', (req: Request, res: Response) => {
            console.log("register here");
            new register(req, res).register(req, res);
        });
        this.router.post('/user-exists', (req: Request, res: Response) => {
            new register(req, res).userExists(req, res);
        });

        this.router.get('/db', (req: Request, res: Response) => {
            //let reg = new register();
            //new register().register(req, res);
        });

        this.router.get('/users', (req: Request, res: Response) => {
            //res.send('users...');
            db.getUsers().subscribe(data => {
                console.log(res);
                res.json(data)
            }, err => { });
        });

        this.router.post('/uploads', cors(), uploads.upload.single('image'), (req: Request, res: Response) => {
            uploads.uploadAds(req, res);
            //console.log('routing');
        });

        this.router.post('/downloads', cors(), (req: Request, res: Response) => {
            let token = req.headers["authorization"];
            jwt.verify(token, process.env.AUTH_KEY, (err, decoded) => {
                if (err) {
                    console.log('Unauthorized');
                    return res.status(401).json({
                        message: "Unauthorized!"
                    });
                } else {
                    console.log('authorized');
                    downloads.downloads(req, res);
                }
            });
            // console.log(req.headers);
            // downloads.downloads(req, res);
        });

        this.router.post('/display-ad', cors(), (req: Request, res: Response) => {
            //console.log(req);
            displayAd.getUserAd(req, res);
        });

        this.router.get('/test', (req: Request, res: Response) => {
            res.json([{
                message: "test"
            }]);
        });


        this.app.use('/', this.router)

    }

}

export default new JRoutes().app;