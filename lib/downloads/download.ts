import { Observable } from 'rxjs';
import listings from './listings';
import * as path from 'path';

import * as fs from 'fs';

class Download {
    constructor() { }

    downloads(req, res) {

        // listings.listing('');
        // res.json([{ test: 'listing' }]);
        this.getFiles().subscribe(data => {
            res.sendFile(data);
        }, err => { })
    }

    getFiles() {
        const observable = new Observable(subscriber => {
            let fileName = '';

            fs.readdir(path.join(__dirname, '../../uploads'), function (err, files) {
                files.forEach(function (file) {
                    let max = files.length - 1, min = 1;
                    let ran = Math.floor(Math.random() * (max - min + 1)) + min;
                    fileName = files[ran];

                });
                subscriber.next(path.join(__dirname, '../../uploads') + '/' + fileName);
            });
        });
        return observable;
    }
}

export default new Download();