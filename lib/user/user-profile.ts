import db from '../db/connect';
import * as bcrypt from 'bcryptjs';
import { Observable } from 'rxjs';
import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import Uploads from '../uploads/uploads';

export default class UserProfile {
    req: Request;
    res: Response;
    connection: any;
    uploads = new Uploads();

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

    uploadProfilePicture(req, res) {
        this.uploads.uploadProfilePicture(req, res);
    }

    getAllUserProfile(req, res) {
        console.log(req.body.email);
        const currentUser = req.body.email;
        const observable = new Observable(subscriber => {
            // const query = `SELECT firstName, lastName, users.email, gender, isMember, lastLogin, profilePicture FROM users
            //                 INNER JOIN userProfile WHERE users.email = userProfile.email
            // `;
            const query = `SELECT u.firstName, u.lastName, u.email, u.gender, u.isMember, u.lastLogin, u.uuid, up.profilePicture, fl.uuidA, fl.uuidB, fl.status
                            FROM users u
                            INNER JOIN userProfile up USING (email)
                            INNER JOIN friendList fl ON fl.email = 'jeewan@gmail.com';`;

            this.connection.query(query, (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    console.log(rows.length);
                    let filtered = rows.filter((item, index) => {
                        return item.email !== currentUser;
                    });

                    const filteredArr = filtered.reduce((acc, current) => {
                        const x = acc.find(item => item.email === current.email);
                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            return acc;
                        }
                    }, []);

                    subscriber.next(filteredArr);
                }
            });
        });
        return observable;
    }
}