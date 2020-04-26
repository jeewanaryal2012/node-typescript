import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import db from '../db/connect';
import uploads from '../uploads/uploads';
import downloads from '../downloads/download';
import * as cors from 'cors';

const options: cors.CorsOptions = {
    allowedHeaders: ["*"],
    credentials: false,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*",
    preflightContinue: false
};


class JRoutes {
    router = express.Router();
    constructor() {
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
        this.router.get('/login', (req: Request, res: Response) => {
            const data = req.body;
            // query a database and save data
            res.status(200).send('test is ... from routes');
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
            downloads.downloads(req, res);
        });


        this.app.use('/', this.router)

    }

}

export default new JRoutes().app;