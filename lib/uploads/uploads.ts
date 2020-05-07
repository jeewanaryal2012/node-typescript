import * as multer from 'multer'
import * as fs from 'fs';
import db from '../db/connect';
import * as path from 'path';
import * as findRemoveSync from 'find-remove';

const PATH = './uploads/tmp';

export default class Uploads {
    storage: any;
    upload: any;
    connection: any;
    finalFileName: any;
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
                let dateNow = Date.now();
                //console.log(fileName, fileExtention, req.headers);
                // let fileName = `${file.originalname}${Math.floor(Math.random() * 1000000)}`;
                //Math.floor(Math.random() * 1000000);
                this.finalFileName = `profile-${userEmail}-${dateNow}.${fileExtention}`;
                cb(null, this.finalFileName);
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
        console.log(this.finalFileName);
        const userEmail = req.headers['email'];
        fs.readdir(path.join(process.env.PWD, './uploads/tmp'), (err, files) => {
            files.forEach((file, index) => {
                if (file === userEmail) {
                    fs.readdir(path.join(process.env.PWD, './uploads/tmp/' + file), (err, f) => {
                        // console.log('----');
                        //console.log(f);
                        // https://www.npmjs.com/package/find-remove
                        //findRemoveSync(process.env.PWD + '/uploads/tmp/' + file, { files: ['1.jpeg'], ignore: 'haumiblau.bak' });
                        //findRemoveSync(process.env.PWD + '/uploads/tmp/' + file, { extensions: ['.jpeg'], ignore: 'profile-kate@gmail.com-1588867951596.jpeg' })
                        const sortedFiles = this.sortUtil(f);
                        const recentUpload = sortedFiles[sortedFiles.length - 1];
                        console.log('recent: ', recentUpload);
                        //findRemoveSync(process.env.PWD + '/uploads/tmp/' + file, { dir: "*", files: "*.*", ignore: this.recentUpload() });
                        let max = f.length - 1, min = 1;
                        let ran = Math.floor(Math.random() * (max - min + 1)) + min;
                        const fName = f[f.length - 2];
                        const profilePicture = 'http://localhost:4040' + '/uploads/tmp/' + file + '/' + recentUpload;
                        res.json({
                            profilePicture: profilePicture
                        });
                        findRemoveSync(process.env.PWD + '/uploads/tmp/' + file, { dir: "*", files: "*.*", ignore: recentUpload });
                        this.connection.query(`UPDATE userProfile SET profilePicture = ? WHERE email = ?`, [profilePicture, userEmail], (error, results, fields) => { });
                    });
                }
            });
        });
    }

    sortUtil(f) {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        const sorted = f.sort(collator.compare);
        console.log(f);
        console.log(sorted);
        return sorted;
        //return 'profile-kate@gmail.com-1588869488724.jpeg';
    }
}

//export default new Uploads();