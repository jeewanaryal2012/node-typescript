import * as multer from 'multer'
import * as fs from 'fs';
import db from '../db/connect';

const PATH = './uploads/tmp';

export default class Uploads {
    storage: any;
    upload: any;
    connection: any;
    constructor() {
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, PATH);
            },
            filename: (req, file, cb) => {
                console.log(file.originalname.split('.'));
                const splitted = file.originalname.split('.');
                const fileExtention = splitted[splitted.length - 1];
                let fileName = '';
                splitted.forEach((el, idx) => {
                    if (idx !== splitted.length - 1) {
                        fileName += el;
                    }
                });
                console.log(fileName);
                // let fileName = `${file.originalname}${Math.floor(Math.random() * 1000000)}`;
                // cb(null, fileName);
            }
        });
        this.upload = multer({
            storage: this.storage
        });
        this.connection = db.getConnection();
    }

    uploadAds(req, res) {
        //res.json([{ test: 'ok123' }]);
        if (!req.file) {
            console.log("No file is available!");
            return res.send({
                success: false
            });

        } else {
            //console.log(req);
            console.log('File is available!');

            var img = fs.readFileSync(`./uploads/${req.file.originalname}`);
            res.writeHead(200, { 'Content-Type': req.file.mimetype });
            res.end(img, 'binary');

            // return res.send({
            //   success: true,
            //   firstName: req.body.firstName,
            //   lastName: req.body.lastName,
            //   userName: req.body.userName
            // });
        }
    }

    uploadProfilePicture(req, res) {
        let email = req.body.email;
        this.connection.query('SELECT * FROM users WHERE email = ?',
            [email], (error, results, fields) => {
                let profileDir = `./uploads/tmp/${results[0].uuid}`;
                if (!fs.existsSync(profileDir)) {
                    fs.mkdirSync(profileDir);
                }
            });
    }
}

//export default new Uploads();