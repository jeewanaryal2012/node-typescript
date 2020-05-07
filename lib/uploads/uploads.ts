import * as multer from 'multer'
import * as fs from 'fs';
import db from '../db/connect';
import * as path from 'path';

const PATH = './uploads/tmp';

export default class Uploads {
    storage: any;
    upload: any;
    connection: any;
    constructor() {
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const userEmail = req.headers['email'];
                let profileDir = `./uploads/tmp/${userEmail}`;
                if (!fs.existsSync(profileDir)) {
                    fs.mkdirSync(profileDir);
                }
                cb(null, profileDir);
            },
            filename: (req, file, cb) => {
                //console.log(file.originalname.split('.'));
                const userEmail = req.headers['email'];
                // let profileDir = `./uploads/tmp/${userEmail}`;
                // if (!fs.existsSync(profileDir)) {
                //     fs.mkdirSync(profileDir);
                // }
                const splitted = file.originalname.split('.');
                const fileExtention = splitted[splitted.length - 1];
                let fileName = '';
                splitted.forEach((el, idx) => {
                    if (idx !== splitted.length - 1) {
                        fileName += el;
                    }
                });
                //console.log(fileName, fileExtention, req.headers);
                // let fileName = `${file.originalname}${Math.floor(Math.random() * 1000000)}`;
                //Math.floor(Math.random() * 1000000);
                const finalFileName = `profile-${userEmail}.${fileExtention}`;
                cb(null, finalFileName);
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
        const userEmail = req.headers['email'];
        fs.readdir(path.join(process.env.PWD, './uploads/tmp'), (err, files) => {
            files.forEach((file, index) => {
                if (file === userEmail) {
                    fs.readdir(path.join(process.env.PWD, './uploads/tmp/' + file), (err, f) => {
                        //res.sendFile(process.env.PWD + '/uploads/tmp/' + file + '/' + f[0]);
                        console.log(f);
                        let max = f.length - 1, min = 1;
                        let ran = Math.floor(Math.random() * (max - min + 1)) + min;
                        //const fName = f[0] === '.DS_Store' ? f[1] : f[0];
                        const fName = f[ran];
                        res.json({
                            profilePicture: 'http://localhost:4040' + '/uploads/tmp/' + file + '/' + fName
                        });
                    });
                }
            });
        });
    }
}

//export default new Uploads();