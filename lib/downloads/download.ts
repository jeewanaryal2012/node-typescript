import { Observable } from 'rxjs';
import listings from './listings';
import * as path from 'path';

import * as fs from 'fs';

class Download {
    constructor() { }

    downloads(req, res) {
        let filepath = path.join(__dirname, '../../uploads') + '/' + 'images.jpeg';
        res.sendFile(filepath);
        // listings.listing('');
        // res.json([{ test: 'listing' }]);
    }
}

export default new Download();