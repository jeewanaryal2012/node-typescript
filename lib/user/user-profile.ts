import db from '../db/connect';
import * as bcrypt from 'bcryptjs';
import { Observable } from 'rxjs';
import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

export default class UserProfile {
    req: Request;
    res: Response;
    connection: any;

    constructor() {
        // this.req = req;
        // this.res = res;
        this.connection = db.getConnection();
    }

    getUserProfile(email) {
        const observable = new Observable(subscriber => {
            //this.connect().subscribe(res => {
            this.connection.query('SELECT * FROM userProfile WHERE email = ?', email, (err, rows) => {
                if (err) throw err;

                console.log('Data received from Db:');
                console.log(rows);
                subscriber.next(rows);
            });
            //}, err => { });
        });
        return observable;
    }
}