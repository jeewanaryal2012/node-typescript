import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
//import * as cors from 'cors';

var cors = require('cors');
class App {

    constructor() {
        this.app = express();
        this.app.use(cors());
        this.config();
        this.routes();
    }

    public app: express.Application;

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        const router = express.Router();

        router.get('/', (req: Request, res: Response) => {
            res.status(200).send({
                message: 'Hello World!'
            })
        });

        router.post('/', (req: Request, res: Response) => {
            const data = req.body;
            // query a database and save data
            res.status(200).send(data);
        });
        router.get('/test', (req: Request, res: Response) => {
            const data = req.body;
            // query a database and save data
            res.status(200).send('test is ...');
        });

        this.app.use('/', router)

    }

}

export default new App().app;