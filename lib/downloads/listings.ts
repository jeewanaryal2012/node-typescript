import * as fs from 'fs';
import * as path from 'path';

const DOWNLOAD_DIR = path.dirname(process.mainModule.filename);

class Listings {
    constructor() { }

    listing(path) {
        /*
        console.log('listing');
        let files = fs.readdirSync(DOWNLOAD_DIR + path);
        let filesWithStats = [];
        if (files.length > 1) {
            let sorted = files.sort((a, b) => {
                let s1 = fs.statSync(DOWNLOAD_DIR + path + a);
                let s2 = fs.statSync(DOWNLOAD_DIR + path + b);
                let ret = s1.ctime < s2.ctime ? -1 : 1;
                return ret;
            });
            sorted.forEach(file => {
                filesWithStats.push({
                    filename: file,
                    date: new Date(fs.statSync(DOWNLOAD_DIR + path + file).ctime),
                    path: path + file
                });
            });
        } else {
            files.forEach(file => {
                filesWithStats.push({
                    filename: file,
                    date: new Date(fs.statSync(DOWNLOAD_DIR + path + file).ctime),
                    path: path + file
                });
            });
        }
        */
    }
}

export default new Listings();