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

const options: cors.CorsOptions = {
    allowedHeaders: ["*"],
    credentials: true,
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
            console.log(process.env.AUTH_KEY);
            const accessToken = jwt.sign({ username: 'jeewanaryal', role: 'manager' }, process.env.AUTH_KEY);
            res.json({
                username: 'jeewanaryal',
                role: 'manager',
                accessToken
            });
        });

        this.router.get('/db', (req: Request, res: Response) => {
            db.connect().subscribe(res => {
                console.log(res);
            }, err => { });
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

        });


        this.app.use('/', this.router)

    }

}

export default new JRoutes().app;