import db from '../db/connect';
import { Observable } from 'rxjs';

class AdvertiseQuery {
    constructor() { }

    getUserAd(req, res) {
        const observable = new Observable(subscriber => {
            db.connect().subscribe(res => {
                db.getConnection().query('SELECT * FROM authors', (err, rows) => {
                    if (err) throw err;

                    console.log('Data received from Db:');
                    console.log(rows);
                    subscriber.next(rows);
                });
            }, err => { });
        }).subscribe(d => {
            res.json(d);
        }, e => { });

        //return observable;
    }
}

export default new AdvertiseQuery();