import * as multer from 'multer'
import * as fs from 'fs';

const PATH = './uploads';

class Uploads {
    storage: any;
    upload: any;
    constructor() {
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, PATH);
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            }
        });
        this.upload = multer({
            storage: this.storage
        });
    }

    uploadAds(req, res) {
        //res.json([{ test: 'ok123' }]);
        if (!req.file) {
            console.log("No file is available!");
            return res.send({
                success: false
            });

        } else {
            console.log(req.file);
            console.log('File is available!');

            var img = fs.readFileSync(`./uploads/${req.file.originalname}`);
            res.writeHead(200, { 'Content-Type': 'image/jpg' });
            res.end(img, 'binary');

            // return res.send({
            //   success: true,
            //   firstName: req.body.firstName,
            //   lastName: req.body.lastName,
            //   userName: req.body.userName
            // });
        }
    }
}

export default new Uploads();