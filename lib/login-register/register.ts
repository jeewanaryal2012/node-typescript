import db from '../db/connect';
import * as bcrypt from 'bcryptjs';
import { Observable } from 'rxjs';
import { Request, Response } from "express";
import { v4 as uuid } from 'uuid';

export default class Register {
    req: Request;
    res: Response;
    connection: any;

    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.connection = db.getConnection();
    }

    register(req, res) {
        console.log(req.body);

        //let connection = db.getConnection();
        let uniqueId = uuid().split('-')
        let uId = uuid();
        let splitted = uId.split('-');
        let truncated = splitted[splitted.length - 1];
        let uuidCalculated = `${Date.now()}${truncated}`;
        console.log(uuidCalculated);
        var users = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "gender": req.body.gender,
            "phone": req.body.phone,
            "password": bcrypt.hashSync(req.body.password, 10),
            "isMember": 0,
            "lastLogin": Date.now(),
            "uuid": uuidCalculated
        };
        this.connection.query('SELECT COUNT(*) AS cnt FROM users WHERE email = ?', this.req.body.email, (error, results, fields) => {
            console.log(results[0].cnt);
            if (results[0].cnt === 0) {
                this.connection.query('INSERT INTO users SET ?', users, (error, results, fields) => {
                    if (error) {
                    } else {
                        this.updateUserProfile(users);
                        res.json({
                            registered: true,
                            message: "Successfuly registered"
                        });
                    }
                    //database.end();
                });
            } else {
                res.json({
                    message: "User already exixts"
                });
            }
        });
    }

    userExists(req, res) {
        this.connection.query('SELECT COUNT(*) AS cnt FROM users WHERE email = ?', req.body.email, (error, results, fields) => {
            if (results[0].cnt === 0) {
                res.json({
                    userExists: false
                });
            } else {
                res.json({
                    userExists: true
                })
            }
        });
    }

    updateUserProfile(users) {
        let up = {
            profilePicture: '',
            email: users.email
        }
        this.connection.query('INSERT INTO userProfile SET ?', up, function (error, results, fields) {

        });
    }
}

//export default new Register();